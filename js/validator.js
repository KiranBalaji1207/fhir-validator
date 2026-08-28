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

  function isPlainObject(v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
  }

  function pushIssue(issues, severity, path, message) {
    issues.push({ severity, path: path || '(root)', message });
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
  function validateResourceObject(obj, basePath) {
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
        `"${resourceType}" is a valid FHIR R4 resource type, but this validator only has base Resource/DomainResource structural rules for it (no curated field-by-field schema yet). Only generic checks were run.`);
    }

    validateFieldsTop(obj, elements, path, issues);

    return issues;
  }

  // Top-level / BackboneElement-aware field validator (handles el.elements for BackboneElement).
  function validateFieldsTop(obj, elements, path, issues, openEnded) {
    for (const key of Object.keys(obj)) {
      if (key === 'resourceType') continue;
      if (key.startsWith('_')) continue;
      const match = findElementForKey(elements, key);
      if (!match) {
        if (!openEnded) {
          pushIssue(issues, 'warning', `${path}.${key}`,
            `Field "${key}" isn't part of this validator's known structure here. It may still be valid - just not checked by this tool.`);
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
          validateFieldsTop(item, el.elements || [], itemPath, issues);
          return;
        }
        if (resolvedType === 'Resource') {
          if (!isPlainObject(item)) {
            pushIssue(issues, 'error', itemPath, 'Expected a nested FHIR resource (JSON object).');
            return;
          }
          const nested = validateResourceObject(item, itemPath);
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
          validateFieldsTop(item, complex.elements, itemPath, issues, complex.openEnded);
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

  function validateResource(obj) {
    const issues = validateResourceObject(obj, obj && obj.resourceType ? obj.resourceType : '(root)');
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
