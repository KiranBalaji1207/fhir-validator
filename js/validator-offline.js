/*
 * validator-offline.js
 * A dependency-free, in-browser FHIR structural/cardinality/sanity checker.
 * Runs entirely client-side — safe for a static GitHub Pages deployment.
 */

const OfflineValidator = (() => {

  const DATE_RE = /^\d{4}(-\d{2}(-\d{2})?)?$/;
  const DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
  const DATETIME_PARTIAL_RE = /^\d{4}(-\d{2}(-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2}))?)?)?$/;
  const INSTANT_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
  const ID_RE = /^[A-Za-z0-9\-\.]{1,64}$/;
  const URI_LOOKS_VALID = /^\S+:\S+$/; // very loose

  function issue(severity, message, path, source) {
    return { severity, message, path: path || "", source: source || "offline" };
  }

  function walk(node, path, cb) {
    if (Array.isArray(node)) {
      node.forEach((n, i) => walk(n, `${path}[${i}]`, cb));
      return;
    }
    if (node && typeof node === "object") {
      cb(node, path);
      Object.keys(node).forEach(k => {
        if (k === "resourceType") return;
        walk(node[k], path ? `${path}.${k}` : k, cb);
      });
    }
  }

  function checkGenericDatatypes(root) {
    const issues = [];
    walk(root, root.resourceType, (node, path) => {
      // Extension checks
      if (Object.prototype.hasOwnProperty.call(node, "url") && (path.includes("extension") || path.includes("modifierExtension"))) {
        if (!node.url) issues.push(issue("error", "Extension is missing a required 'url'.", path));
      }
      // Coding checks
      const keys = Object.keys(node);
      const looksLikeCoding = keys.includes("system") && keys.includes("code") && !keys.includes("resourceType");
      if (looksLikeCoding) {
        if (!node.system) issues.push(issue("warning", "Coding has a 'code' but no 'system' — this is legal but often unintended.", path));
        if (typeof node.code !== "string" || !node.code.length) issues.push(issue("error", "Coding.code should be a non-empty string.", path));
      }
      // Reference checks
      if (Object.prototype.hasOwnProperty.call(node, "reference")) {
        if (typeof node.reference !== "string" || !node.reference.length) {
          issues.push(issue("error", "Reference.reference should be a non-empty string (or use 'identifier'/'display' only for logical references).", path));
        }
      }
      // Period checks
      if (Object.prototype.hasOwnProperty.call(node, "start") && Object.prototype.hasOwnProperty.call(node, "end")) {
        if (node.start && node.end && String(node.start) > String(node.end)) {
          issues.push(issue("error", `Period.start (${node.start}) is after Period.end (${node.end}).`, path));
        }
      }
    });

    // field-name-based date/dateTime/instant heuristic checks
    walk(root, root.resourceType, (node, path) => {
      Object.keys(node).forEach(k => {
        const v = node[k];
        if (typeof v !== "string") return;
        const lower = k.toLowerCase();
        const fullPath = `${path}.${k}`;
        if (lower === "instant" || lower.endsWith("instant")) {
          if (!INSTANT_RE.test(v)) issues.push(issue("error", `"${k}" looks like an instant but "${v}" isn't a fully-specified ISO 8601 datetime with timezone.`, fullPath));
        } else if (lower.endsWith("datetime") || lower === "created" || lower === "authored" || lower === "recordeddate") {
          if (!DATETIME_PARTIAL_RE.test(v)) issues.push(issue("warning", `"${k}" = "${v}" doesn't look like a valid FHIR dateTime (expected YYYY, YYYY-MM, YYYY-MM-DD, or full ISO 8601 datetime).`, fullPath));
        } else if (lower.endsWith("date") && lower !== "update" && !lower.includes("validate")) {
          if (!DATE_RE.test(v) && !DATETIME_PARTIAL_RE.test(v)) issues.push(issue("warning", `"${k}" = "${v}" doesn't look like a valid FHIR date.`, fullPath));
        }
      });
    });

    return issues;
  }

  function checkIds(root) {
    const issues = [];
    if (root.id !== undefined) {
      if (typeof root.id !== "string" || !ID_RE.test(root.id)) {
        issues.push(issue("error", `Resource.id "${root.id}" is invalid — ids must match [A-Za-z0-9\\-\\.]{1,64}.`, "id"));
      }
    }
    return issues;
  }

  function checkMeta(root) {
    const issues = [];
    if (root.meta) {
      if (root.meta.profile) {
        if (!Array.isArray(root.meta.profile)) {
          issues.push(issue("error", "meta.profile should be an array of canonical URLs.", "meta.profile"));
        } else {
          root.meta.profile.forEach((p, i) => {
            if (typeof p !== "string" || !URI_LOOKS_VALID.test(p)) {
              issues.push(issue("warning", `meta.profile[${i}] ("${p}") doesn't look like a canonical URL.`, `meta.profile[${i}]`));
            }
          });
        }
      }
    }
    return issues;
  }

  function checkKnownResourceType(root, knownTypes) {
    const issues = [];
    if (!root.resourceType) {
      issues.push(issue("error", "Missing required field 'resourceType'.", ""));
      return issues;
    }
    if (typeof root.resourceType !== "string" || !knownTypes.includes(root.resourceType)) {
      issues.push(issue("error", `"${root.resourceType}" is not a recognized FHIR resource type (or is a version this tool doesn't know about).`, "resourceType"));
    }
    return issues;
  }

  function checkBaseRequiredElements(root, requiredMap) {
    const issues = [];
    const rules = requiredMap[root.resourceType];
    if (!rules) return issues;
    rules.forEach(rule => {
      if (!rule.required) return;
      const present = Object.prototype.hasOwnProperty.call(root, rule.path) &&
        root[rule.path] !== null &&
        root[rule.path] !== undefined &&
        !(Array.isArray(root[rule.path]) && root[rule.path].length === 0);
      if (!present) {
        issues.push(issue("error", `${root.resourceType}.${rule.path} is required${rule.note ? " — " + rule.note : "."}`, rule.path));
      }
    });
    return issues;
  }

  function checkIgRules(root, igKey, igRulesMap) {
    const issues = [];
    const pack = igRulesMap[igKey];
    if (!pack) return issues;
    pack.rules.forEach(fn => {
      try {
        const found = fn(root) || [];
        found.forEach(f => issues.push(issue(f.severity, f.message, f.path, `ig:${pack.label}`)));
      } catch (e) {
        // never let a rule crash the whole run
        console.error("IG rule error", e);
      }
    });
    return issues;
  }

  function checkDuplicateEntryFullUrls(root) {
    const issues = [];
    if (root.resourceType === "Bundle" && Array.isArray(root.entry)) {
      const seen = new Map();
      root.entry.forEach((e, i) => {
        if (e && e.fullUrl) {
          if (seen.has(e.fullUrl)) {
            issues.push(issue("warning", `Duplicate entry.fullUrl "${e.fullUrl}" (entries [${seen.get(e.fullUrl)}] and [${i}]).`, `entry[${i}].fullUrl`));
          } else {
            seen.set(e.fullUrl, i);
          }
        }
      });
    }
    return issues;
  }

  /**
   * Main entry point.
   * @param {string} rawText - raw JSON text from the textarea
   * @param {object} opts - { igKey, profileUrls, fhirVersion }
   */
  function validate(rawText, opts) {
    opts = opts || {};
    const result = { parseError: null, resource: null, issues: [] };

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      result.parseError = e.message;
      result.issues.push(issue("error", `Invalid JSON: ${e.message}`, "", "syntax"));
      return result;
    }

    if (Array.isArray(parsed) || typeof parsed !== "object" || parsed === null) {
      result.issues.push(issue("error", "Top-level JSON must be a single FHIR resource object (not an array or primitive).", "", "syntax"));
      return result;
    }

    result.resource = parsed;

    result.issues.push(...checkKnownResourceType(parsed, FHIR_RESOURCE_TYPES));
    result.issues.push(...checkIds(parsed));
    result.issues.push(...checkMeta(parsed));
    result.issues.push(...checkGenericDatatypes(parsed));
    result.issues.push(...checkBaseRequiredElements(parsed, BASE_REQUIRED_ELEMENTS));
    result.issues.push(...checkDuplicateEntryFullUrls(parsed));

    if (opts.igKey) {
      result.issues.push(...checkIgRules(parsed, opts.igKey, IG_RULES));
    }

    if (opts.profileUrls && opts.profileUrls.length) {
      const declared = (parsed.meta && parsed.meta.profile) || [];
      opts.profileUrls.forEach(p => {
        const base = p.split("|")[0];
        if (!declared.some(d => d.split("|")[0] === base)) {
          result.issues.push(issue("information", `You specified profile "${p}" to validate against, but it isn't listed in meta.profile. The offline checker only inspects meta.profile-declared profiles plus the IG helper rules above — for true profile conformance (cardinalities/slices from the actual StructureDefinition), use the online check.`, "meta.profile"));
        }
      });
    }

    if (result.issues.filter(i => i.severity === "error").length === 0) {
      result.issues.push(issue("success", "No structural errors found by the offline checker. Remember this does not replace full terminology/profile validation — use the online check for that.", ""));
    }

    return result;
  }

  return { validate };
})();
