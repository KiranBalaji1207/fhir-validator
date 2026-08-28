/**
 * FHIR R4 primitive datatype rules.
 * Each entry has a regex (per the FHIR R4 spec) and/or a custom test function.
 * All validation happens locally - no network calls.
 */
const PRIMITIVE_TYPES = {
  boolean: {
    jsType: 'boolean',
    test: (v) => typeof v === 'boolean',
    hint: 'true or false (JSON boolean, not a string)'
  },
  integer: {
    jsType: 'number',
    test: (v) => typeof v === 'number' && Number.isInteger(v) && v >= -2147483648 && v <= 2147483647,
    hint: 'a 32-bit signed integer'
  },
  unsignedInt: {
    jsType: 'number',
    test: (v) => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 2147483647,
    hint: 'an integer >= 0'
  },
  positiveInt: {
    jsType: 'number',
    test: (v) => typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 2147483647,
    hint: 'an integer >= 1'
  },
  decimal: {
    jsType: 'number',
    test: (v) => typeof v === 'number' && isFinite(v),
    hint: 'a JSON number'
  },
  string: {
    jsType: 'string',
    test: (v) => typeof v === 'string' && v.length > 0 && v.trim().length > 0,
    hint: 'a non-empty string with no leading/trailing whitespace-only content'
  },
  markdown: {
    jsType: 'string',
    test: (v) => typeof v === 'string' && v.length > 0,
    hint: 'a non-empty string (markdown)'
  },
  code: {
    jsType: 'string',
    regex: /^[^\s]+(\s[^\s]+)*$/,
    hint: 'a string with no leading/trailing/consecutive whitespace'
  },
  id: {
    jsType: 'string',
    regex: /^[A-Za-z0-9\-.]{1,64}$/,
    hint: 'up to 64 chars of letters, digits, "-" and "."'
  },
  uri: {
    jsType: 'string',
    test: (v) => typeof v === 'string' && v.length > 0 && !/\s/.test(v),
    hint: 'a URI with no whitespace'
  },
  url: {
    jsType: 'string',
    test: (v) => typeof v === 'string' && v.length > 0 && !/\s/.test(v),
    hint: 'a URL with no whitespace'
  },
  canonical: {
    jsType: 'string',
    test: (v) => typeof v === 'string' && v.length > 0 && !/\s/.test(v),
    hint: 'a canonical URL, optionally with |version'
  },
  oid: {
    jsType: 'string',
    regex: /^urn:oid:[0-2](\.(0|[1-9][0-9]*))+$/,
    hint: 'urn:oid:<dotted numeric OID>'
  },
  uuid: {
    jsType: 'string',
    regex: /^urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    hint: 'urn:uuid:<uuid>'
  },
  base64Binary: {
    jsType: 'string',
    regex: /^(\s*([0-9a-zA-Z+/=]{4})\s*)*$/,
    hint: 'base64 encoded data'
  },
  instant: {
    jsType: 'string',
    regex: /^-?[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|(\+|-)[0-9]{2}:[0-9]{2})$/,
    hint: 'YYYY-MM-DDThh:mm:ss.sss+zz:zz (timezone required)'
  },
  date: {
    jsType: 'string',
    regex: /^-?[0-9]{4}(-(0[1-9]|1[0-2])(-(0[0-9]|[1-2][0-9]|3[0-1]))?)?$/,
    hint: 'YYYY, YYYY-MM, or YYYY-MM-DD'
  },
  dateTime: {
    jsType: 'string',
    regex: /^-?[0-9]{4}(-(0[1-9]|1[0-2])(-(0[0-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?(Z|(\+|-)[0-9]{2}:[0-9]{2}))?)?)?$/,
    hint: 'YYYY, YYYY-MM, YYYY-MM-DD, or a full timestamp with timezone'
  },
  time: {
    jsType: 'string',
    regex: /^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?$/,
    hint: 'hh:mm:ss'
  },
  xhtml: {
    jsType: 'string',
    test: (v) => typeof v === 'string' && v.trim().length > 0,
    hint: 'non-empty XHTML content'
  }
};

/**
 * Validate a primitive value against a named FHIR primitive type.
 * Returns null if valid, or a human-readable message describing the problem.
 */
function validatePrimitive(typeName, value) {
  const def = PRIMITIVE_TYPES[typeName];
  if (!def) return null; // unknown primitive type - skip rather than false-flag
  if (def.jsType && typeof value !== def.jsType && !(def.jsType === 'string' && typeof value === 'string')) {
    // wrong JS kind entirely (e.g. number expected, string found)
    if (typeof value !== def.jsType) {
      return `expected a ${def.jsType === 'number' ? 'JSON number' : def.jsType} (${def.hint}), found ${typeof value}`;
    }
  }
  if (def.test && !def.test(value)) {
    return `invalid ${typeName}: ${def.hint}`;
  }
  if (def.regex && typeof value === 'string' && !def.regex.test(value)) {
    return `invalid ${typeName}: expected ${def.hint}`;
  }
  return null;
}

if (typeof module !== 'undefined') {
  module.exports = { PRIMITIVE_TYPES, validatePrimitive };
} else if (typeof window !== 'undefined') {
  window.PRIMITIVE_TYPES = PRIMITIVE_TYPES;
  window.validatePrimitive = validatePrimitive;
}
