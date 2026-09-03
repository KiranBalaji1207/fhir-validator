/**
 * Structural (simplified) definitions of common FHIR R4 complex datatypes.
 * Only the pieces needed for structural validation (presence, cardinality,
 * data type) are modeled - not full terminology bindings.
 *
 * Schema element shape:
 *   { name, min, max, type }              simple typed element
 *   { name, min, max, type: 'BackboneElement', elements: [...] }  nested
 *   { name, min, max, choice: [{suffix, type}, ...] }             value[x]
 *
 * `type` is either a key in PRIMITIVE_TYPES or a key in COMPLEX_TYPES.
 * `max` is 1 or '*'.
 */
const COMPLEX_TYPES = {
  Period: {
    elements: [
      { name: 'start', min: 0, max: 1, type: 'dateTime' },
      { name: 'end', min: 0, max: 1, type: 'dateTime' }
    ]
  },
  Coding: {
    elements: [
      { name: 'system', min: 0, max: 1, type: 'uri' },
      { name: 'version', min: 0, max: 1, type: 'string' },
      { name: 'code', min: 0, max: 1, type: 'code' },
      { name: 'display', min: 0, max: 1, type: 'string' },
      { name: 'userSelected', min: 0, max: 1, type: 'boolean' }
    ]
  },
  CodeableConcept: {
    elements: [
      { name: 'coding', min: 0, max: '*', type: 'Coding' },
      { name: 'text', min: 0, max: 1, type: 'string' }
    ]
  },
  Identifier: {
    elements: [
      { name: 'use', min: 0, max: 1, type: 'code' },
      { name: 'type', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'system', min: 0, max: 1, type: 'uri' },
      { name: 'value', min: 0, max: 1, type: 'string' },
      { name: 'period', min: 0, max: 1, type: 'Period' },
      { name: 'assigner', min: 0, max: 1, type: 'Reference' }
    ]
  },
  Reference: {
    elements: [
      { name: 'reference', min: 0, max: 1, type: 'string' },
      { name: 'type', min: 0, max: 1, type: 'uri' },
      { name: 'identifier', min: 0, max: 1, type: 'Identifier' },
      { name: 'display', min: 0, max: 1, type: 'string' }
    ]
  },
  HumanName: {
    elements: [
      { name: 'use', min: 0, max: 1, type: 'code' },
      { name: 'text', min: 0, max: 1, type: 'string' },
      { name: 'family', min: 0, max: 1, type: 'string' },
      { name: 'given', min: 0, max: '*', type: 'string' },
      { name: 'prefix', min: 0, max: '*', type: 'string' },
      { name: 'suffix', min: 0, max: '*', type: 'string' },
      { name: 'period', min: 0, max: 1, type: 'Period' }
    ]
  },
  ContactPoint: {
    elements: [
      { name: 'system', min: 0, max: 1, type: 'code' },
      { name: 'value', min: 0, max: 1, type: 'string' },
      { name: 'use', min: 0, max: 1, type: 'code' },
      { name: 'rank', min: 0, max: 1, type: 'positiveInt' },
      { name: 'period', min: 0, max: 1, type: 'Period' }
    ]
  },
  Address: {
    elements: [
      { name: 'use', min: 0, max: 1, type: 'code' },
      { name: 'type', min: 0, max: 1, type: 'code' },
      { name: 'text', min: 0, max: 1, type: 'string' },
      { name: 'line', min: 0, max: '*', type: 'string' },
      { name: 'city', min: 0, max: 1, type: 'string' },
      { name: 'district', min: 0, max: 1, type: 'string' },
      { name: 'state', min: 0, max: 1, type: 'string' },
      { name: 'postalCode', min: 0, max: 1, type: 'string' },
      { name: 'country', min: 0, max: 1, type: 'string' },
      { name: 'period', min: 0, max: 1, type: 'Period' }
    ]
  },
  Quantity: {
    elements: [
      { name: 'value', min: 0, max: 1, type: 'decimal' },
      { name: 'comparator', min: 0, max: 1, type: 'code' },
      { name: 'unit', min: 0, max: 1, type: 'string' },
      { name: 'system', min: 0, max: 1, type: 'uri' },
      { name: 'code', min: 0, max: 1, type: 'code' }
    ]
  },
  Range: {
    elements: [
      { name: 'low', min: 0, max: 1, type: 'Quantity' },
      { name: 'high', min: 0, max: 1, type: 'Quantity' }
    ]
  },
  Ratio: {
    elements: [
      { name: 'numerator', min: 0, max: 1, type: 'Quantity' },
      { name: 'denominator', min: 0, max: 1, type: 'Quantity' }
    ]
  },
  Annotation: {
    elements: [
      { name: 'authorReference', min: 0, max: 1, type: 'Reference' },
      { name: 'authorString', min: 0, max: 1, type: 'string' },
      { name: 'time', min: 0, max: 1, type: 'dateTime' },
      { name: 'text', min: 1, max: 1, type: 'markdown' }
    ]
  },
  Attachment: {
    elements: [
      { name: 'contentType', min: 0, max: 1, type: 'code' },
      { name: 'language', min: 0, max: 1, type: 'code' },
      { name: 'data', min: 0, max: 1, type: 'base64Binary' },
      { name: 'url', min: 0, max: 1, type: 'url' },
      { name: 'size', min: 0, max: 1, type: 'unsignedInt' },
      { name: 'hash', min: 0, max: 1, type: 'base64Binary' },
      { name: 'title', min: 0, max: 1, type: 'string' },
      { name: 'creation', min: 0, max: 1, type: 'dateTime' }
    ]
  },
  Money: {
    elements: [
      { name: 'value', min: 0, max: 1, type: 'decimal' },
      { name: 'currency', min: 0, max: 1, type: 'code' }
    ]
  },
  Narrative: {
    elements: [
      { name: 'status', min: 1, max: 1, type: 'code' },
      { name: 'div', min: 1, max: 1, type: 'xhtml' }
    ]
  },
  Meta: {
    elements: [
      { name: 'versionId', min: 0, max: 1, type: 'id' },
      { name: 'lastUpdated', min: 0, max: 1, type: 'instant' },
      { name: 'source', min: 0, max: 1, type: 'uri' },
      { name: 'profile', min: 0, max: '*', type: 'canonical' },
      { name: 'security', min: 0, max: '*', type: 'Coding' },
      { name: 'tag', min: 0, max: '*', type: 'Coding' }
    ]
  },
  Dosage: {
    elements: [
      { name: 'sequence', min: 0, max: 1, type: 'integer' },
      { name: 'text', min: 0, max: 1, type: 'string' },
      { name: 'route', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'method', min: 0, max: 1, type: 'CodeableConcept' }
    ]
  },
  Timing: {
    elements: [
      { name: 'event', min: 0, max: '*', type: 'dateTime' },
      { name: 'code', min: 0, max: 1, type: 'CodeableConcept' }
    ],
    openEnded: true
  },
  SampledData: {
    elements: [
      { name: 'origin', min: 1, max: 1, type: 'Quantity' },
      { name: 'period', min: 1, max: 1, type: 'decimal' },
      { name: 'dimensions', min: 1, max: 1, type: 'positiveInt' }
    ],
    openEnded: true
  },
  // Extension is open-ended; only `url` is structurally mandated here.
  Extension: {
    elements: [
      { name: 'url', min: 1, max: 1, type: 'uri' }
    ],
    openEnded: true
  }
};

if (typeof module !== 'undefined') {
  module.exports = { COMPLEX_TYPES };
} else if (typeof window !== 'undefined') {
  window.COMPLEX_TYPES = COMPLEX_TYPES;
}
