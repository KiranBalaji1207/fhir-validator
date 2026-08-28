/**
 * Structural FHIR R4 validator.
 * Everything here runs against the local schema objects in resources.js /
 * complexTypes.js / datatypes.js - there is no network call anywhere.
 */

(function (global) {
  const isNode = typeof module !== 'undefined' && module.exports;
  const { PRIMITIVE_TYPES, validatePrimitive } = isNode ? require('./datatypes.js') : global;
  const { COMPLEX_TYPES } = isNode ? require('./complexTypes.js') : global;
  const { BASE_RESOURCE_ELEMENTS, BASE_DOMAIN_ELEMENTS, RESOURCE_DEFS, KNOWN_RESOURCE_TYPES } =
    isNode ? require('./resources.js') : global;
  const { lookupProfile } = isNode ? require('./profiles.js') : global;

  function isPlainObject(v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
  }

  function pushIssue(issues, severity, path, message, unverified) {
    issues.push({ severity, path: path || '(root)', message, unverified: !!unverified });
  }

  // Find the element definition (possibly via a choice suffix) matching a given JSON key.
  function findElementForKey(elements, key) {
    for (const el of elements) {
      if (el.choice) {
        for (const c of el.choice) {
          if (key === el.name + c.suffix) return { el, resolvedType: c.type, isChoice: true };
        }
      } else if (el.name === key) {
        return { el, resolvedType: el.type, isChoice: false };
      }
    }
    return null;
  }

  function getElementsForComplexType(typeName) {
    const def = COMPLEX_TYPES[typeName];
    return def ? { elements: def.elements, openEnded: !!def.openEnded } : null;
  }

  function getElementsForResourceType(resourceType) {
    const def = RESOURCE_DEFS[resourceType];
    const known = KNOWN_RESOURCE_TYPES.has(resourceType);
    let elements = BASE_RESOURCE_ELEMENTS.slice();
    const isDomainResource = !def || def.isDomainResource !== false;
    if (isDomainResource) elements = elements.concat(BASE_DOMAIN_ELEMENTS);
    if (def) elements = elements.concat(def.elements);
    return { elements, known, hasDetailedSchema: !!def };
  }

  /**
   * Validate one FHIR resource object (root or contained). Returns an array of issues.
   */
  function validateResourceObject(obj, basePath, opts) {
    opts = opts || {};
    const strictAll = !!opts.strictAll;
    const issues = [];
    const path = basePath || '';

    if (!isPlainObject(obj)) {
      pushIssue(issues, 'error', path, 'Expected the resource to be a JSON object.');
      return issues;
    }
    if (typeof obj.resourceType !== 'string' || obj.resourceType.length === 0) {
      pushIssue(issues, 'error', path, 'Missing required "resourceType" field.');
      return issues;
    }

    const resourceType = obj.resourceType;
    const { elements, known, hasDetailedSchema } = getElementsForResourceType(resourceType);

    if (!known) {
      pushIssue(issues, 'error', path,
        `"${resourceType}" isn't a recognized FHIR R4 resource type name (check for typos or a non-R4 resource).`);
    } else if (!hasDetailedSchema) {
      pushIssue(issues, 'info', path,
        strictAll
          ? `"${resourceType}" is a valid FHIR R4 resource type, but this validator only has base Resource/DomainResource structural rules for it - not a full field-by-field schema. Strict mode is on, so unmatched fields below are still flagged as errors, but for this resource type treat them as "unverified" rather than certain - double-check against the spec before assuming they're really wrong.`
          : `"${resourceType}" is a valid FHIR R4 resource type, but this validator only has base Resource/DomainResource structural rules for it (no curated field-by-field schema yet). Only generic checks were run.`);
    }

    // Fields not recognized in curated (complete) schemas are real errors.
    // For resource types we only have base Resource/DomainResource rules for, we can't
    // tell known-good fields from typos, so those stay informational - unless strictAll
    // is on, in which case they're still flagged as errors but marked "unverified".
    const strict = hasDetailedSchema || strictAll;
    const schemaComplete = hasDetailedSchema;
    validateFieldsTop(obj, elements, path, issues, false, strict, schemaComplete, opts);

    if (obj.meta && Array.isArray(obj.meta.profile)) {
      for (const profileUrl of obj.meta.profile) {
        if (typeof profileUrl !== 'string') continue;
        const profile = lookupProfile(profileUrl);
        if (!profile) {
          pushIssue(issues, 'info', path,
            `Declares profile "${profileUrl}", which this validator doesn't recognize, so no IG-specific checks were run for it.`);
          continue;
        }
        if (profile.baseResourceType && profile.baseResourceType !== resourceType) {
          pushIssue(issues, 'error', path,
            `Declares profile "${profile.label}" (${profileUrl}), which applies to ${profile.baseResourceType}, not ${resourceType}.`);
          continue;
        }
        checkIgProfile(obj, profile, path, issues);
      }
    }

    return issues;
  }

  function hasCodingMatch(value, system, code, isArrayOfCC) {
    const ccArray = isArrayOfCC ? (Array.isArray(value) ? value : []) : (value ? [value] : []);
    return ccArray.some((cc) => cc && Array.isArray(cc.coding) &&
      cc.coding.some((c) => c && c.system === system && c.code === code));
  }

  function checkIgProfile(obj, profile, path, issues) {
    const tag = `[${profile.ig}] ${profile.label}`;

    if (profile.requiredOverrides) {
      for (const req of profile.requiredOverrides) {
        const present = req.choice
          ? Object.keys(obj).some((k) => k.startsWith(req.path))
          : (obj[req.path] !== undefined && !(Array.isArray(obj[req.path]) && obj[req.path].length === 0));
        if (!present) {
          pushIssue(issues, 'error', `${path}.${req.path}${req.choice ? '[x]' : ''}`,
            `${tag} requires "${req.path}${req.choice ? '[x]' : ''}" to be present (base FHIR allows it to be absent, but this profile does not).`);
        }
      }
    }

    if (profile.fixedValues) {
      for (const fv of profile.fixedValues) {
        const actual = obj[fv.path];
        if (actual !== undefined && actual !== fv.value) {
          pushIssue(issues, 'error', `${path}.${fv.path}`,
            `${tag} expects a fixed value of "${fv.value}" here, found "${actual}".`);
        }
      }
    }

    if (profile.requiredCoding) {
      for (const rc of profile.requiredCoding) {
        const value = obj[rc.path];
        if (value === undefined) continue; // absence is caught by requiredOverrides if applicable
        const matched = hasCodingMatch(value, rc.system, rc.code, rc.arrayOfCodeableConcept);
        if (!matched) {
          pushIssue(issues, 'error', `${path}.${rc.path}`,
            `${tag} requires a coding with system "${rc.system}" and code "${rc.code}" here.`);
        }
      }
    }

    if (profile.notes) {
      pushIssue(issues, 'info', path, `${tag}: ${profile.notes}`);
    }
  }

  // Top-level / BackboneElement-aware field validator (handles el.elements for BackboneElement).
  // `strict`: when true, any field not matched against `elements` is reported as an error.
  // `schemaComplete`: when true, `elements` is known to be a complete field list, so the
  // error is stated plainly. When false (only possible with strict forced on via strictAll
  // for a resource type without a curated schema), the same error is reported but flagged
  // as unverified, since a real, valid field could be missing from this validator's schema.
  function validateFieldsTop(obj, elements, path, issues, openEnded, strict, schemaComplete, opts) {
    schemaComplete = schemaComplete !== false;
    opts = opts || {};
    for (const key of Object.keys(obj)) {
      if (key === 'resourceType') continue;
      if (key.startsWith('_')) continue;
      const match = findElementForKey(elements, key);
      if (!match) {
        if (!openEnded) {
          if (strict && schemaComplete) {
            pushIssue(issues, 'error', `${path}.${key}`,
              `"${key}" is not a valid field here. Check for a typo, wrong casing, or a field that doesn't belong on this resource/type.`);
          } else if (strict && !schemaComplete) {
            pushIssue(issues, 'error', `${path}.${key}`,
              `"${key}" doesn't match this validator's (incomplete) schema for this resource type. Unverified - this may be a real FHIR field that just isn't modeled here yet, so double-check before treating it as a real problem.`,
              true);
          } else {
            pushIssue(issues, 'info', `${path}.${key}`,
              `"${key}" wasn't checked - this resource type doesn't have a detailed field schema in this validator yet, so unrecognized fields aren't flagged as errors here.`);
          }
        }
        continue;
      }
      const { el, resolvedType } = match;
      const value = obj[key];
      const isArrayField = el.max === '*';

      if (isArrayField && !Array.isArray(value)) {
        pushIssue(issues, 'error', `${path}.${key}`, `"${key}" repeats (max ${el.max}) so it must be a JSON array, but a single value was found.`);
        continue;
      }
      if (!isArrayField && Array.isArray(value)) {
        pushIssue(issues, 'error', `${path}.${key}`, `"${key}" allows at most one value, but a JSON array was found.`);
        continue;
      }

      const items = Array.isArray(value) ? value : [value];
      items.forEach((item, idx) => {
        const itemPath = Array.isArray(value) ? `${path}.${key}[${idx}]` : `${path}.${key}`;
        if (item === null) return;
        if (resolvedType === 'BackboneElement') {
          if (!isPlainObject(item)) {
            pushIssue(issues, 'error', itemPath, 'Expected a JSON object here.');
            return;
          }
          // BackboneElement field lists are hand-modeled per resource and treated as
          // complete unless explicitly marked openEnded (e.g. recursive or not-yet-modeled shapes).
          validateFieldsTop(item, el.elements || [], itemPath, issues, !!el.openEnded, true, true, opts);
          return;
        }
        if (resolvedType === 'Resource') {
          if (!isPlainObject(item)) {
            pushIssue(issues, 'error', itemPath, 'Expected a nested FHIR resource (JSON object).');
            return;
          }
          const nested = validateResourceObject(item, itemPath, opts);
          issues.push(...nested);
          return;
        }
        if (PRIMITIVE_TYPES[resolvedType]) {
          const msg = validatePrimitive(resolvedType, item);
          if (msg) pushIssue(issues, 'error', itemPath, msg);
          return;
        }
        const complex = getElementsForComplexType(resolvedType);
        if (complex) {
          if (!isPlainObject(item)) {
            pushIssue(issues, 'error', itemPath, `Expected a JSON object for a ${resolvedType}.`);
            return;
          }
          // The bundled complex-datatype definitions (HumanName, CodeableConcept, etc.)
          // are complete per the FHIR R4 spec, so they're checked strictly too.
          validateFieldsTop(item, complex.elements, itemPath, issues, complex.openEnded, true, true, opts);
          return;
        }
      });
    }

    for (const el of elements) {
      if (el.min && el.min > 0) {
        if (el.choice) {
          const present = el.choice.some((c) => obj[el.name + c.suffix] !== undefined);
          if (!present) {
            pushIssue(issues, 'error', `${path}.${el.name}[x]`,
              `Required field is missing - expected one of: ${el.choice.map((c) => el.name + c.suffix).join(', ')}.`);
          }
        } else if (obj[el.name] === undefined) {
          pushIssue(issues, 'error', `${path}.${el.name}`, `Required field "${el.name}" (min ${el.min}) is missing.`);
        }
      }
    }
  }

  function validateResource(obj, opts) {
    opts = opts || {};
    const issues = validateResourceObject(obj, obj && obj.resourceType ? obj.resourceType : '(root)', opts);
    const summary = {
      errorCount: issues.filter((i) => i.severity === 'error').length,
      warningCount: issues.filter((i) => i.severity === 'warning').length,
      infoCount: issues.filter((i) => i.severity === 'info').length
    };
    return { issues, summary, valid: summary.errorCount === 0 };
  }

  const api = { validateResource };
  if (isNode) module.exports = api;
  else global.FhirValidator = api;
})(typeof window !== 'undefined' ? window : globalThis);
