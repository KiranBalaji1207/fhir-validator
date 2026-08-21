/*
 * schema-validator.js
 *
 * REAL, spec-based FHIR structural validation using the official FHIR JSON Schema
 * (published by HL7 at https://hl7.org/fhir/R4/downloads.html, "JSON Schema" link)
 * and the Ajv JSON Schema validation engine (bundled locally at js/vendor/ajv7.bundle.min.js
 * — no third-party CDN call at runtime).
 *
 * Design goal: work with ZERO calls to any third-party server at runtime, so it is
 * immune to corporate firewalls/proxies that block outbound API calls:
 *   1. Ajv is loaded from js/vendor/ajv7.bundle.min.js — a same-origin file in this repo.
 *   2. The FHIR schema (schema/fhir.schema.json) must be added to this repo by you (it's
 *      a large official HL7 artifact — see README "Enable real FHIR schema validation").
 *      It's fetched with a relative path from your own GitHub Pages domain, so this call
 *      never leaves your own site.
 *   3. If the schema file hasn't been added yet, this module fails gracefully and tells
 *      the user exactly what to do — it never silently pretends to validate.
 */

const SchemaValidator = (() => {
  let schemaDoc = null;
  let ajvInstance = null;
  let loadPromise = null;

  function getAjvCtor() {
    return window.Ajv7 || window.ajv7 || window.Ajv || window.ajv || null;
  }

  async function load() {
    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
      const AjvCtor = getAjvCtor();
      if (!AjvCtor) {
        throw new Error(
          "The Ajv JSON Schema engine (js/vendor/ajv7.bundle.min.js) did not load. Make sure that " +
          "file exists in your repo at exactly that path and that index.html references it."
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
        strict: false,
        validateFormats: false
      });

      ajv.addSchema(schemaDoc, "fhir-schema");
      ajvInstance = ajv;
      return true;
    })();

    return loadPromise;
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
        message = `Value did not match exactly one of the expected schema variants (common for choice[x] elements or polymorphic references — check the field name/type carefully).`;
      }
      return { severity: "error", message, path, source: "schema" };
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
    const refTarget = `#/definitions/${resourceType}`;
    // NOTE: this key must NOT contain a colon — Ajv's URI resolver interprets a colon as
    // a URI scheme separator (e.g. "check:Patient" looks like scheme "check" + opaque part
    // "Patient"), which silently breaks relative $ref resolution against "fhir-schema".
    // Confirmed via direct testing against the real Ajv engine before shipping this fix.
    const key = `check-schema-${resourceType}`;

    let validateFn;
    try {
      validateFn = ajvInstance.getSchema(key);
      if (!validateFn) {
        ajvInstance.addSchema({ $ref: `fhir-schema${refTarget}` }, key);
        validateFn = ajvInstance.getSchema(key);
      }
    } catch (e) {
      return {
        available: true,
        issues: [],
        error: `Couldn't find a schema definition for resource type "${resourceType}" in the loaded FHIR schema (it may be an unsupported/unknown type, or the schema file is for a different FHIR version than expected). Technical detail: ${e.message}`
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
