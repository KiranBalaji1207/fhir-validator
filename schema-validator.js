/*
 * schema-validator.js
 *
 * REAL, spec-based FHIR structural validation using the official FHIR JSON Schema
 * (published by HL7 at https://hl7.org/fhir/R4/downloads.html, "JSON Schema" link)
 * and the Ajv JSON Schema validation engine.
 *
 * Why this file exists / how it differs from validator-offline.js:
 * -------------------------------------------------------------------------
 * validator-offline.js contains hand-written heuristic checks (does this look like a
 * date, is there an identifier array, etc). Those are useful sanity checks, but they are
 * NOT the FHIR specification — they can miss real violations and flag things that are
 * actually fine. This file instead validates against the ACTUAL machine-readable FHIR
 * schema that HL7 publishes, using a real JSON Schema engine (Ajv), so the result is
 * genuine base-FHIR structural/cardinality/datatype conformance — much closer to what
 * the official Java validator checks (though it still does not evaluate terminology
 * bindings, slicing, or FHIRPath invariants — see README for the full list of gaps).
 *
 * Design goal: work with ZERO calls to any third-party server at runtime, so it is
 * immune to corporate firewalls/proxies that block outbound API calls. To do this:
 *   1. The Ajv validation engine is loaded from a <script> tag in index.html. By default
 *      that points at a public CDN (a plain GET for a small JS library — far less likely
 *      to be blocked than a custom API POST — but still a network call). For a fully
 *      airtight, zero-network setup, download the same file and reference it locally —
 *      see README.md "Fully offline / firewall-proof setup".
 *   2. The actual FHIR schema (schema/fhir.schema.json) is expected to be a SAME-ORIGIN
 *      file you add to this repo yourself (see README.md for the exact download link and
 *      steps). Because it's fetched with a relative path from your own GitHub Pages
 *      domain, this call never leaves your own site — it cannot be blocked by a firewall
 *      rule targeting third-party domains.
 *   3. If the schema file hasn't been added yet, this module fails gracefully and tells
 *      the user exactly what to do — it never silently pretends to validate.
 */

const SchemaValidator = (() => {
  let schemaDoc = null;
  let ajvInstance = null;
  let loadPromise = null;
  let loadError = null;

  function getAjvCtor() {
    // The CDN bundle (ajv7.bundle.min.js) exposes a global named `ajv7`.
    // Some alternate builds expose `Ajv` or `ajv` — check a few possibilities defensively.
    return window.ajv7 || window.Ajv7 || window.Ajv || window.ajv || null;
  }

  async function load() {
    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
      const AjvCtor = getAjvCtor();
      if (!AjvCtor) {
        throw new Error(
          "The Ajv JSON Schema engine did not load. If you're on a restricted network, the CDN " +
          "script tag in index.html may be blocked — see README.md for how to self-host it instead."
        );
      }

      let response;
      try {
        response = await fetch("schema/fhir.schema.json", { cache: "force-cache" });
      } catch (e) {
        throw new Error(
          "Could not fetch schema/fhir.schema.json (network error). This file must be added to " +
          "your own repo — see README.md \"Enable real FHIR schema validation\" for the exact steps."
        );
      }

      if (!response.ok) {
        throw new Error(
          `schema/fhir.schema.json was not found (HTTP ${response.status}). You need to download the ` +
          "official FHIR JSON Schema and add it to this repo at schema/fhir.schema.json — see " +
          "README.md \"Enable real FHIR schema validation\" for the exact download link and steps."
        );
      }

      const text = await response.text();
      try {
        schemaDoc = JSON.parse(text);
      } catch (e) {
        throw new Error("schema/fhir.schema.json exists but is not valid JSON. Please re-download it.");
      }

      const ajv = new AjvCtor({
        allErrors: true,
        strict: false,       // the FHIR schema uses some non-standard annotations (e.g. "discriminator")
        validateFormats: false // FHIR's own datatype regexes are stricter/more specific than generic formats
      });

      // Register the schema document once; individual resource types are validated by
      // compiling a small wrapper schema that $refs into it, which is far faster than
      // evaluating the giant top-level oneOf-of-150-resource-types on every call.
      ajv.addSchema(schemaDoc, "fhir-schema");

      ajvInstance = ajv;
      return true;
    })();

    try {
      await loadPromise;
      loadError = null;
    } catch (e) {
      loadError = e;
      throw e;
    }
    return loadPromise;
  }

  function severityFromAjvError() {
    // Ajv doesn't have severities — every schema violation is a hard structural error.
    return "error";
  }

  function formatAjvErrors(errors, resourceType) {
    if (!errors || !errors.length) return [];
    return errors.map(err => {
      const path = (resourceType + (err.instancePath || "").replace(/\//g, ".")) || resourceType;
      let message = err.message || "Schema validation error";
      if (err.keyword === "additionalProperties" && err.params && err.params.additionalProperty) {
        message = `Unexpected/unknown property "${err.params.additionalProperty}" — this field does not exist on this FHIR element per the base schema.`;
      } else if (err.keyword === "required" && err.params && err.params.missingProperty) {
        message = `Missing required property "${err.params.missingProperty}".`;
      } else if (err.keyword === "enum" && err.params && err.params.allowedValues) {
        message = `Value is not one of the allowed codes: ${err.params.allowedValues.join(", ")}.`;
      } else if (err.keyword === "type") {
        message = `Expected type "${err.params.type}" but got a different type.`;
      } else if (err.keyword === "oneOf") {
        message = `Value did not match exactly one of the expected schema variants (this is common for choice[x] elements or polymorphic references — check the field name/type carefully).`;
      }
      return {
        severity: severityFromAjvError(err),
        message,
        path,
        source: "schema"
      };
    });
  }

  /**
   * Validate a parsed FHIR resource object against the official base FHIR JSON Schema.
   * Returns { available: boolean, issues: [...], error: string|null }
   */
  async function validate(resource) {
    try {
      await load();
    } catch (e) {
      return { available: false, issues: [], error: e.message };
    }

    if (!resource || !resource.resourceType) {
      return { available: true, issues: [], error: null };
    }

    const resourceType = resource.resourceType;
    const baseId = schemaDoc.$id || "fhir-schema-root";
    const refTarget = `#/definitions/${resourceType}`;

    let validateFn;
    try {
      // getSchema caches compiled validators by key; use a stable per-type key.
      const key = `${baseId}${refTarget}`;
      validateFn = ajvInstance.getSchema(key);
      if (!validateFn) {
        ajvInstance.addSchema({ $ref: `fhir-schema${refTarget}` }, key);
        validateFn = ajvInstance.getSchema(key);
      }
    } catch (e) {
      return {
        available: true,
        issues: [],
        error: `Couldn't find a schema definition for resource type "${resourceType}" in the loaded FHIR schema (it may be an unsupported/unknown type, or the schema file is for a different FHIR version than expected).`
      };
    }

    if (!validateFn) {
      return {
        available: true,
        issues: [],
        error: `No schema definition found for resource type "${resourceType}" in schema/fhir.schema.json.`
      };
    }

    const valid = validateFn(resource);
    const issues = valid ? [] : formatAjvErrors(validateFn.errors, resourceType);

    return { available: true, issues, error: null };
  }

  return { validate };
})();
