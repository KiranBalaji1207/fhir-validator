/**
 * Structural definitions for the FHIR R4 base Resource / DomainResource
 * elements, plus a curated set of commonly used resource types.
 *
 * This is NOT a full copy of the official FHIR StructureDefinitions -
 * it captures cardinality, required fields, and data types only, which
 * is what's needed for structural validation (as opposed to full
 * profile / terminology validation).
 *
 * Unlisted resource types still get validated against BASE_RESOURCE_ELEMENTS
 * and BASE_DOMAIN_ELEMENTS (see validator.js), with a note that deeper,
 * resource-specific structural rules aren't available for them yet.
 */

const BASE_RESOURCE_ELEMENTS = [
  { name: 'id', min: 0, max: 1, type: 'id' },
  { name: 'meta', min: 0, max: 1, type: 'Meta' },
  { name: 'implicitRules', min: 0, max: 1, type: 'uri' },
  { name: 'language', min: 0, max: 1, type: 'code' }
];

const BASE_DOMAIN_ELEMENTS = [
  { name: 'text', min: 0, max: 1, type: 'Narrative' },
  { name: 'contained', min: 0, max: '*', type: 'Resource' },
  { name: 'extension', min: 0, max: '*', type: 'Extension' },
  { name: 'modifierExtension', min: 0, max: '*', type: 'Extension' }
];

const RESOURCE_DEFS = {
  Patient: {
    elements: [
      { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
      { name: 'active', min: 0, max: 1, type: 'boolean' },
      { name: 'name', min: 0, max: '*', type: 'HumanName' },
      { name: 'telecom', min: 0, max: '*', type: 'ContactPoint' },
      { name: 'gender', min: 0, max: 1, type: 'code' },
      { name: 'birthDate', min: 0, max: 1, type: 'date' },
      { name: 'deceased', min: 0, max: 1, choice: [
        { suffix: 'Boolean', type: 'boolean' }, { suffix: 'DateTime', type: 'dateTime' }
      ] },
      { name: 'address', min: 0, max: '*', type: 'Address' },
      { name: 'maritalStatus', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'multipleBirth', min: 0, max: 1, choice: [
        { suffix: 'Boolean', type: 'boolean' }, { suffix: 'Integer', type: 'integer' }
      ] },
      { name: 'photo', min: 0, max: '*', type: 'Attachment' },
      { name: 'contact', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'relationship', min: 0, max: '*', type: 'CodeableConcept' },
        { name: 'name', min: 0, max: 1, type: 'HumanName' },
        { name: 'telecom', min: 0, max: '*', type: 'ContactPoint' },
        { name: 'address', min: 0, max: 1, type: 'Address' },
        { name: 'gender', min: 0, max: 1, type: 'code' },
        { name: 'organization', min: 0, max: 1, type: 'Reference' },
        { name: 'period', min: 0, max: 1, type: 'Period' }
      ] },
      { name: 'communication', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'language', min: 1, max: 1, type: 'CodeableConcept' },
        { name: 'preferred', min: 0, max: 1, type: 'boolean' }
      ] },
      { name: 'generalPractitioner', min: 0, max: '*', type: 'Reference' },
      { name: 'managingOrganization', min: 0, max: 1, type: 'Reference' },
      { name: 'link', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'other', min: 1, max: 1, type: 'Reference' },
        { name: 'type', min: 1, max: 1, type: 'code' }
      ] }
    ]
  },

  Practitioner: {
    elements: [
      { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
      { name: 'active', min: 0, max: 1, type: 'boolean' },
      { name: 'name', min: 0, max: '*', type: 'HumanName' },
      { name: 'telecom', min: 0, max: '*', type: 'ContactPoint' },
      { name: 'address', min: 0, max: '*', type: 'Address' },
      { name: 'gender', min: 0, max: 1, type: 'code' },
      { name: 'birthDate', min: 0, max: 1, type: 'date' },
      { name: 'photo', min: 0, max: '*', type: 'Attachment' },
      { name: 'qualification', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
        { name: 'code', min: 1, max: 1, type: 'CodeableConcept' },
        { name: 'period', min: 0, max: 1, type: 'Period' },
        { name: 'issuer', min: 0, max: 1, type: 'Reference' }
      ] },
      { name: 'communication', min: 0, max: '*', type: 'CodeableConcept' }
    ]
  },

  PractitionerRole: {
    elements: [
      { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
      { name: 'active', min: 0, max: 1, type: 'boolean' },
      { name: 'period', min: 0, max: 1, type: 'Period' },
      { name: 'practitioner', min: 0, max: 1, type: 'Reference' },
      { name: 'organization', min: 0, max: 1, type: 'Reference' },
      { name: 'code', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'specialty', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'location', min: 0, max: '*', type: 'Reference' },
      { name: 'healthcareService', min: 0, max: '*', type: 'Reference' },
      { name: 'telecom', min: 0, max: '*', type: 'ContactPoint' },
      { name: 'availableTime', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'daysOfWeek', min: 0, max: '*', type: 'code' },
        { name: 'allDay', min: 0, max: 1, type: 'boolean' },
        { name: 'availableStartTime', min: 0, max: 1, type: 'time' },
        { name: 'availableEndTime', min: 0, max: 1, type: 'time' }
      ] },
      { name: 'endpoint', min: 0, max: '*', type: 'Reference' }
    ]
  },

  Organization: {
    elements: [
      { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
      { name: 'active', min: 0, max: 1, type: 'boolean' },
      { name: 'type', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'name', min: 0, max: 1, type: 'string' },
      { name: 'alias', min: 0, max: '*', type: 'string' },
      { name: 'telecom', min: 0, max: '*', type: 'ContactPoint' },
      { name: 'address', min: 0, max: '*', type: 'Address' },
      { name: 'partOf', min: 0, max: 1, type: 'Reference' },
      { name: 'contact', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'purpose', min: 0, max: 1, type: 'CodeableConcept' },
        { name: 'name', min: 0, max: 1, type: 'HumanName' },
        { name: 'telecom', min: 0, max: '*', type: 'ContactPoint' },
        { name: 'address', min: 0, max: 1, type: 'Address' }
      ] },
      { name: 'endpoint', min: 0, max: '*', type: 'Reference' }
    ]
  },

  Location: {
    elements: [
      { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
      { name: 'status', min: 0, max: 1, type: 'code' },
      { name: 'operationalStatus', min: 0, max: 1, type: 'Coding' },
      { name: 'name', min: 0, max: 1, type: 'string' },
      { name: 'alias', min: 0, max: '*', type: 'string' },
      { name: 'description', min: 0, max: 1, type: 'string' },
      { name: 'mode', min: 0, max: 1, type: 'code' },
      { name: 'type', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'telecom', min: 0, max: '*', type: 'ContactPoint' },
      { name: 'address', min: 0, max: 1, type: 'Address' },
      { name: 'physicalType', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'managingOrganization', min: 0, max: 1, type: 'Reference' },
      { name: 'partOf', min: 0, max: 1, type: 'Reference' }
    ]
  },

  Encounter: {
    elements: [
      { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
      { name: 'status', min: 1, max: 1, type: 'code' },
      { name: 'statusHistory', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'status', min: 1, max: 1, type: 'code' },
        { name: 'period', min: 1, max: 1, type: 'Period' }
      ] },
      { name: 'class', min: 1, max: 1, type: 'Coding' },
      { name: 'classHistory', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'class', min: 1, max: 1, type: 'Coding' },
        { name: 'period', min: 1, max: 1, type: 'Period' }
      ] },
      { name: 'type', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'serviceType', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'priority', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'subject', min: 0, max: 1, type: 'Reference' },
      { name: 'episodeOfCare', min: 0, max: '*', type: 'Reference' },
      { name: 'basedOn', min: 0, max: '*', type: 'Reference' },
      { name: 'participant', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'type', min: 0, max: '*', type: 'CodeableConcept' },
        { name: 'period', min: 0, max: 1, type: 'Period' },
        { name: 'individual', min: 0, max: 1, type: 'Reference' }
      ] },
      { name: 'appointment', min: 0, max: '*', type: 'Reference' },
      { name: 'period', min: 0, max: 1, type: 'Period' },
      { name: 'length', min: 0, max: 1, type: 'Quantity' },
      { name: 'reasonCode', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'reasonReference', min: 0, max: '*', type: 'Reference' },
      { name: 'diagnosis', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'condition', min: 1, max: 1, type: 'Reference' },
        { name: 'use', min: 0, max: 1, type: 'CodeableConcept' },
        { name: 'rank', min: 0, max: 1, type: 'positiveInt' }
      ] },
      { name: 'account', min: 0, max: '*', type: 'Reference' },
      { name: 'hospitalization', min: 0, max: 1, type: 'BackboneElement', elements: [
        { name: 'preAdmissionIdentifier', min: 0, max: 1, type: 'Identifier' },
        { name: 'origin', min: 0, max: 1, type: 'Reference' },
        { name: 'admitSource', min: 0, max: 1, type: 'CodeableConcept' },
        { name: 'destination', min: 0, max: 1, type: 'Reference' },
        { name: 'dischargeDisposition', min: 0, max: 1, type: 'CodeableConcept' }
      ] },
      { name: 'location', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'location', min: 1, max: 1, type: 'Reference' },
        { name: 'status', min: 0, max: 1, type: 'code' },
        { name: 'physicalType', min: 0, max: 1, type: 'CodeableConcept' },
        { name: 'period', min: 0, max: 1, type: 'Period' }
      ] },
      { name: 'serviceProvider', min: 0, max: 1, type: 'Reference' },
      { name: 'partOf', min: 0, max: 1, type: 'Reference' }
    ]
  },

  Observation: {
    elements: [
      { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
      { name: 'basedOn', min: 0, max: '*', type: 'Reference' },
      { name: 'partOf', min: 0, max: '*', type: 'Reference' },
      { name: 'status', min: 1, max: 1, type: 'code' },
      { name: 'category', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'code', min: 1, max: 1, type: 'CodeableConcept' },
      { name: 'subject', min: 0, max: 1, type: 'Reference' },
      { name: 'focus', min: 0, max: '*', type: 'Reference' },
      { name: 'encounter', min: 0, max: 1, type: 'Reference' },
      { name: 'effective', min: 0, max: 1, choice: [
        { suffix: 'DateTime', type: 'dateTime' }, { suffix: 'Period', type: 'Period' },
        { suffix: 'Timing', type: 'Timing' }, { suffix: 'Instant', type: 'instant' }
      ] },
      { name: 'issued', min: 0, max: 1, type: 'instant' },
      { name: 'performer', min: 0, max: '*', type: 'Reference' },
      { name: 'value', min: 0, max: 1, choice: [
        { suffix: 'Quantity', type: 'Quantity' }, { suffix: 'CodeableConcept', type: 'CodeableConcept' },
        { suffix: 'String', type: 'string' }, { suffix: 'Boolean', type: 'boolean' },
        { suffix: 'Integer', type: 'integer' }, { suffix: 'Range', type: 'Range' },
        { suffix: 'Ratio', type: 'Ratio' }, { suffix: 'SampledData', type: 'SampledData' },
        { suffix: 'Time', type: 'time' }, { suffix: 'DateTime', type: 'dateTime' },
        { suffix: 'Period', type: 'Period' }
      ] },
      { name: 'dataAbsentReason', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'interpretation', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'note', min: 0, max: '*', type: 'Annotation' },
      { name: 'bodySite', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'method', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'specimen', min: 0, max: 1, type: 'Reference' },
      { name: 'device', min: 0, max: 1, type: 'Reference' },
      { name: 'referenceRange', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'low', min: 0, max: 1, type: 'Quantity' },
        { name: 'high', min: 0, max: 1, type: 'Quantity' },
        { name: 'type', min: 0, max: 1, type: 'CodeableConcept' },
        { name: 'appliesTo', min: 0, max: '*', type: 'CodeableConcept' },
        { name: 'age', min: 0, max: 1, type: 'Range' },
        { name: 'text', min: 0, max: 1, type: 'string' }
      ] },
      { name: 'hasMember', min: 0, max: '*', type: 'Reference' },
      { name: 'derivedFrom', min: 0, max: '*', type: 'Reference' },
      { name: 'component', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'code', min: 1, max: 1, type: 'CodeableConcept' },
        { name: 'value', min: 0, max: 1, choice: [
          { suffix: 'Quantity', type: 'Quantity' }, { suffix: 'CodeableConcept', type: 'CodeableConcept' },
          { suffix: 'String', type: 'string' }, { suffix: 'Boolean', type: 'boolean' },
          { suffix: 'Integer', type: 'integer' }, { suffix: 'Range', type: 'Range' },
          { suffix: 'Ratio', type: 'Ratio' }, { suffix: 'SampledData', type: 'SampledData' },
          { suffix: 'Time', type: 'time' }, { suffix: 'DateTime', type: 'dateTime' },
          { suffix: 'Period', type: 'Period' }
        ] },
        { name: 'dataAbsentReason', min: 0, max: 1, type: 'CodeableConcept' },
        { name: 'interpretation', min: 0, max: '*', type: 'CodeableConcept' },
        { name: 'referenceRange', min: 0, max: '*', type: 'BackboneElement', elements: [] }
      ] }
    ]
  },

  Condition: {
    elements: [
      { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
      { name: 'clinicalStatus', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'verificationStatus', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'category', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'severity', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'code', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'bodySite', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'subject', min: 1, max: 1, type: 'Reference' },
      { name: 'encounter', min: 0, max: 1, type: 'Reference' },
      { name: 'onset', min: 0, max: 1, choice: [
        { suffix: 'DateTime', type: 'dateTime' }, { suffix: 'Age', type: 'Quantity' },
        { suffix: 'Period', type: 'Period' }, { suffix: 'Range', type: 'Range' }, { suffix: 'String', type: 'string' }
      ] },
      { name: 'abatement', min: 0, max: 1, choice: [
        { suffix: 'DateTime', type: 'dateTime' }, { suffix: 'Age', type: 'Quantity' },
        { suffix: 'Period', type: 'Period' }, { suffix: 'Range', type: 'Range' },
        { suffix: 'String', type: 'string' }, { suffix: 'Boolean', type: 'boolean' }
      ] },
      { name: 'recordedDate', min: 0, max: 1, type: 'dateTime' },
      { name: 'recorder', min: 0, max: 1, type: 'Reference' },
      { name: 'asserter', min: 0, max: 1, type: 'Reference' },
      { name: 'stage', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'summary', min: 0, max: 1, type: 'CodeableConcept' },
        { name: 'assessment', min: 0, max: '*', type: 'Reference' },
        { name: 'type', min: 0, max: 1, type: 'CodeableConcept' }
      ] },
      { name: 'evidence', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'code', min: 0, max: '*', type: 'CodeableConcept' },
        { name: 'detail', min: 0, max: '*', type: 'Reference' }
      ] },
      { name: 'note', min: 0, max: '*', type: 'Annotation' }
    ]
  },

  AllergyIntolerance: {
    elements: [
      { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
      { name: 'clinicalStatus', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'verificationStatus', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'type', min: 0, max: 1, type: 'code' },
      { name: 'category', min: 0, max: '*', type: 'code' },
      { name: 'criticality', min: 0, max: 1, type: 'code' },
      { name: 'code', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'patient', min: 1, max: 1, type: 'Reference' },
      { name: 'encounter', min: 0, max: 1, type: 'Reference' },
      { name: 'onset', min: 0, max: 1, choice: [
        { suffix: 'DateTime', type: 'dateTime' }, { suffix: 'Age', type: 'Quantity' },
        { suffix: 'Period', type: 'Period' }, { suffix: 'Range', type: 'Range' }, { suffix: 'String', type: 'string' }
      ] },
      { name: 'recordedDate', min: 0, max: 1, type: 'dateTime' },
      { name: 'recorder', min: 0, max: 1, type: 'Reference' },
      { name: 'asserter', min: 0, max: 1, type: 'Reference' },
      { name: 'lastOccurrence', min: 0, max: 1, type: 'dateTime' },
      { name: 'note', min: 0, max: '*', type: 'Annotation' },
      { name: 'reaction', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'substance', min: 0, max: 1, type: 'CodeableConcept' },
        { name: 'manifestation', min: 1, max: '*', type: 'CodeableConcept' },
        { name: 'description', min: 0, max: 1, type: 'string' },
        { name: 'onset', min: 0, max: 1, type: 'dateTime' },
        { name: 'severity', min: 0, max: 1, type: 'code' },
        { name: 'exposureRoute', min: 0, max: 1, type: 'CodeableConcept' },
        { name: 'note', min: 0, max: '*', type: 'Annotation' }
      ] }
    ]
  },

  Procedure: {
    elements: [
      { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
      { name: 'instantiatesCanonical', min: 0, max: '*', type: 'canonical' },
      { name: 'instantiatesUri', min: 0, max: '*', type: 'uri' },
      { name: 'basedOn', min: 0, max: '*', type: 'Reference' },
      { name: 'partOf', min: 0, max: '*', type: 'Reference' },
      { name: 'status', min: 1, max: 1, type: 'code' },
      { name: 'statusReason', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'category', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'code', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'subject', min: 1, max: 1, type: 'Reference' },
      { name: 'encounter', min: 0, max: 1, type: 'Reference' },
      { name: 'performed', min: 0, max: 1, choice: [
        { suffix: 'DateTime', type: 'dateTime' }, { suffix: 'Period', type: 'Period' },
        { suffix: 'String', type: 'string' }, { suffix: 'Age', type: 'Quantity' }, { suffix: 'Range', type: 'Range' }
      ] },
      { name: 'recorder', min: 0, max: 1, type: 'Reference' },
      { name: 'asserter', min: 0, max: 1, type: 'Reference' },
      { name: 'performer', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'function', min: 0, max: 1, type: 'CodeableConcept' },
        { name: 'actor', min: 1, max: 1, type: 'Reference' },
        { name: 'onBehalfOf', min: 0, max: 1, type: 'Reference' }
      ] },
      { name: 'location', min: 0, max: 1, type: 'Reference' },
      { name: 'reasonCode', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'reasonReference', min: 0, max: '*', type: 'Reference' },
      { name: 'bodySite', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'outcome', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'report', min: 0, max: '*', type: 'Reference' },
      { name: 'complication', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'complicationDetail', min: 0, max: '*', type: 'Reference' },
      { name: 'followUp', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'note', min: 0, max: '*', type: 'Annotation' },
      { name: 'focalDevice', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'action', min: 0, max: 1, type: 'CodeableConcept' },
        { name: 'manipulated', min: 1, max: 1, type: 'Reference' }
      ] },
      { name: 'usedReference', min: 0, max: '*', type: 'Reference' },
      { name: 'usedCode', min: 0, max: '*', type: 'CodeableConcept' }
    ]
  },

  Immunization: {
    elements: [
      { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
      { name: 'status', min: 1, max: 1, type: 'code' },
      { name: 'statusReason', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'vaccineCode', min: 1, max: 1, type: 'CodeableConcept' },
      { name: 'patient', min: 1, max: 1, type: 'Reference' },
      { name: 'encounter', min: 0, max: 1, type: 'Reference' },
      { name: 'occurrence', min: 1, max: 1, choice: [
        { suffix: 'DateTime', type: 'dateTime' }, { suffix: 'String', type: 'string' }
      ] },
      { name: 'recorded', min: 0, max: 1, type: 'dateTime' },
      { name: 'primarySource', min: 0, max: 1, type: 'boolean' },
      { name: 'reportOrigin', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'location', min: 0, max: 1, type: 'Reference' },
      { name: 'manufacturer', min: 0, max: 1, type: 'Reference' },
      { name: 'lotNumber', min: 0, max: 1, type: 'string' },
      { name: 'expirationDate', min: 0, max: 1, type: 'date' },
      { name: 'site', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'route', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'doseQuantity', min: 0, max: 1, type: 'Quantity' },
      { name: 'performer', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'function', min: 0, max: 1, type: 'CodeableConcept' },
        { name: 'actor', min: 1, max: 1, type: 'Reference' }
      ] },
      { name: 'note', min: 0, max: '*', type: 'Annotation' },
      { name: 'reasonCode', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'reasonReference', min: 0, max: '*', type: 'Reference' },
      { name: 'isSubpotent', min: 0, max: 1, type: 'boolean' },
      { name: 'subpotentReason', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'protocolApplied', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'series', min: 0, max: 1, type: 'string' },
        { name: 'authority', min: 0, max: 1, type: 'Reference' },
        { name: 'targetDisease', min: 0, max: '*', type: 'CodeableConcept' },
        { name: 'doseNumberPositiveInt', min: 0, max: 1, type: 'positiveInt' },
        { name: 'doseNumberString', min: 0, max: 1, type: 'string' },
        { name: 'seriesDosesPositiveInt', min: 0, max: 1, type: 'positiveInt' },
        { name: 'seriesDosesString', min: 0, max: 1, type: 'string' }
      ] }
    ]
  },

  Medication: {
    elements: [
      { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
      { name: 'code', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'status', min: 0, max: 1, type: 'code' },
      { name: 'manufacturer', min: 0, max: 1, type: 'Reference' },
      { name: 'form', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'amount', min: 0, max: 1, type: 'Ratio' },
      { name: 'ingredient', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'isActive', min: 0, max: 1, type: 'boolean' },
        { name: 'strength', min: 0, max: 1, type: 'Ratio' }
      ] },
      { name: 'batch', min: 0, max: 1, type: 'BackboneElement', elements: [
        { name: 'lotNumber', min: 0, max: 1, type: 'string' },
        { name: 'expirationDate', min: 0, max: 1, type: 'dateTime' }
      ] }
    ]
  },

  MedicationRequest: {
    elements: [
      { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
      { name: 'status', min: 1, max: 1, type: 'code' },
      { name: 'statusReason', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'intent', min: 1, max: 1, type: 'code' },
      { name: 'category', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'priority', min: 0, max: 1, type: 'code' },
      { name: 'doNotPerform', min: 0, max: 1, type: 'boolean' },
      { name: 'medication', min: 1, max: 1, choice: [
        { suffix: 'CodeableConcept', type: 'CodeableConcept' }, { suffix: 'Reference', type: 'Reference' }
      ] },
      { name: 'subject', min: 1, max: 1, type: 'Reference' },
      { name: 'encounter', min: 0, max: 1, type: 'Reference' },
      { name: 'authoredOn', min: 0, max: 1, type: 'dateTime' },
      { name: 'requester', min: 0, max: 1, type: 'Reference' },
      { name: 'performer', min: 0, max: 1, type: 'Reference' },
      { name: 'recorder', min: 0, max: 1, type: 'Reference' },
      { name: 'reasonCode', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'reasonReference', min: 0, max: '*', type: 'Reference' },
      { name: 'note', min: 0, max: '*', type: 'Annotation' },
      { name: 'dosageInstruction', min: 0, max: '*', type: 'Dosage' },
      { name: 'dispenseRequest', min: 0, max: 1, type: 'BackboneElement', elements: [
        { name: 'numberOfRepeatsAllowed', min: 0, max: 1, type: 'unsignedInt' },
        { name: 'quantity', min: 0, max: 1, type: 'Quantity' },
        { name: 'expectedSupplyDuration', min: 0, max: 1, type: 'Quantity' }
      ] },
      { name: 'substitution', min: 0, max: 1, type: 'BackboneElement', elements: [
        { name: 'allowedBoolean', min: 0, max: 1, type: 'boolean' },
        { name: 'allowedCodeableConcept', min: 0, max: 1, type: 'CodeableConcept' },
        { name: 'reason', min: 0, max: 1, type: 'CodeableConcept' }
      ] }
    ]
  },

  DiagnosticReport: {
    elements: [
      { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
      { name: 'basedOn', min: 0, max: '*', type: 'Reference' },
      { name: 'status', min: 1, max: 1, type: 'code' },
      { name: 'category', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'code', min: 1, max: 1, type: 'CodeableConcept' },
      { name: 'subject', min: 0, max: 1, type: 'Reference' },
      { name: 'encounter', min: 0, max: 1, type: 'Reference' },
      { name: 'effective', min: 0, max: 1, choice: [
        { suffix: 'DateTime', type: 'dateTime' }, { suffix: 'Period', type: 'Period' }
      ] },
      { name: 'issued', min: 0, max: 1, type: 'instant' },
      { name: 'performer', min: 0, max: '*', type: 'Reference' },
      { name: 'resultsInterpreter', min: 0, max: '*', type: 'Reference' },
      { name: 'specimen', min: 0, max: '*', type: 'Reference' },
      { name: 'result', min: 0, max: '*', type: 'Reference' },
      { name: 'imagingStudy', min: 0, max: '*', type: 'Reference' },
      { name: 'media', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'comment', min: 0, max: 1, type: 'string' },
        { name: 'link', min: 1, max: 1, type: 'Reference' }
      ] },
      { name: 'conclusion', min: 0, max: 1, type: 'string' },
      { name: 'conclusionCode', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'presentedForm', min: 0, max: '*', type: 'Attachment' }
    ]
  },

  ServiceRequest: {
    elements: [
      { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
      { name: 'instantiatesCanonical', min: 0, max: '*', type: 'canonical' },
      { name: 'instantiatesUri', min: 0, max: '*', type: 'uri' },
      { name: 'basedOn', min: 0, max: '*', type: 'Reference' },
      { name: 'replaces', min: 0, max: '*', type: 'Reference' },
      { name: 'requisition', min: 0, max: 1, type: 'Identifier' },
      { name: 'status', min: 1, max: 1, type: 'code' },
      { name: 'intent', min: 1, max: 1, type: 'code' },
      { name: 'category', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'priority', min: 0, max: 1, type: 'code' },
      { name: 'doNotPerform', min: 0, max: 1, type: 'boolean' },
      { name: 'code', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'subject', min: 1, max: 1, type: 'Reference' },
      { name: 'encounter', min: 0, max: 1, type: 'Reference' },
      { name: 'occurrence', min: 0, max: 1, choice: [
        { suffix: 'DateTime', type: 'dateTime' }, { suffix: 'Period', type: 'Period' }, { suffix: 'Timing', type: 'Timing' }
      ] },
      { name: 'authoredOn', min: 0, max: 1, type: 'dateTime' },
      { name: 'requester', min: 0, max: 1, type: 'Reference' },
      { name: 'performerType', min: 0, max: 1, type: 'CodeableConcept' },
      { name: 'performer', min: 0, max: '*', type: 'Reference' },
      { name: 'reasonCode', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'reasonReference', min: 0, max: '*', type: 'Reference' },
      { name: 'note', min: 0, max: '*', type: 'Annotation' },
      { name: 'patientInstruction', min: 0, max: 1, type: 'string' }
    ]
  },

  CarePlan: {
    elements: [
      { name: 'identifier', min: 0, max: '*', type: 'Identifier' },
      { name: 'instantiatesCanonical', min: 0, max: '*', type: 'canonical' },
      { name: 'instantiatesUri', min: 0, max: '*', type: 'uri' },
      { name: 'basedOn', min: 0, max: '*', type: 'Reference' },
      { name: 'replaces', min: 0, max: '*', type: 'Reference' },
      { name: 'partOf', min: 0, max: '*', type: 'Reference' },
      { name: 'status', min: 1, max: 1, type: 'code' },
      { name: 'intent', min: 1, max: 1, type: 'code' },
      { name: 'category', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'title', min: 0, max: 1, type: 'string' },
      { name: 'description', min: 0, max: 1, type: 'string' },
      { name: 'subject', min: 1, max: 1, type: 'Reference' },
      { name: 'encounter', min: 0, max: 1, type: 'Reference' },
      { name: 'period', min: 0, max: 1, type: 'Period' },
      { name: 'created', min: 0, max: 1, type: 'dateTime' },
      { name: 'author', min: 0, max: 1, type: 'Reference' },
      { name: 'contributor', min: 0, max: '*', type: 'Reference' },
      { name: 'careTeam', min: 0, max: '*', type: 'Reference' },
      { name: 'addresses', min: 0, max: '*', type: 'Reference' },
      { name: 'supportingInfo', min: 0, max: '*', type: 'Reference' },
      { name: 'goal', min: 0, max: '*', type: 'Reference' },
      { name: 'note', min: 0, max: '*', type: 'Annotation' }
    ]
  },

  Composition: {
    elements: [
      { name: 'identifier', min: 0, max: 1, type: 'Identifier' },
      { name: 'status', min: 1, max: 1, type: 'code' },
      { name: 'type', min: 1, max: 1, type: 'CodeableConcept' },
      { name: 'category', min: 0, max: '*', type: 'CodeableConcept' },
      { name: 'subject', min: 0, max: 1, type: 'Reference' },
      { name: 'encounter', min: 0, max: 1, type: 'Reference' },
      { name: 'date', min: 1, max: 1, type: 'dateTime' },
      { name: 'author', min: 1, max: '*', type: 'Reference' },
      { name: 'title', min: 1, max: 1, type: 'string' },
      { name: 'confidentiality', min: 0, max: 1, type: 'code' },
      { name: 'attester', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'mode', min: 1, max: 1, type: 'code' },
        { name: 'time', min: 0, max: 1, type: 'dateTime' },
        { name: 'party', min: 0, max: 1, type: 'Reference' }
      ] },
      { name: 'custodian', min: 0, max: 1, type: 'Reference' },
      { name: 'event', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'code', min: 0, max: '*', type: 'CodeableConcept' },
        { name: 'period', min: 0, max: 1, type: 'Period' },
        { name: 'detail', min: 0, max: '*', type: 'Reference' }
      ] },
      { name: 'section', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'title', min: 0, max: 1, type: 'string' },
        { name: 'code', min: 0, max: 1, type: 'CodeableConcept' },
        { name: 'author', min: 0, max: '*', type: 'Reference' },
        { name: 'focus', min: 0, max: 1, type: 'Reference' },
        { name: 'text', min: 0, max: 1, type: 'Narrative' },
        { name: 'mode', min: 0, max: 1, type: 'code' },
        { name: 'orderedBy', min: 0, max: 1, type: 'CodeableConcept' },
        { name: 'entry', min: 0, max: '*', type: 'Reference' },
        { name: 'emptyReason', min: 0, max: 1, type: 'CodeableConcept' }
      ] }
    ]
  },

  // Bundle is a plain Resource (not a DomainResource) with its own top-level shape.
  Bundle: {
    isDomainResource: false,
    elements: [
      { name: 'identifier', min: 0, max: 1, type: 'Identifier' },
      { name: 'type', min: 1, max: 1, type: 'code' },
      { name: 'timestamp', min: 0, max: 1, type: 'instant' },
      { name: 'total', min: 0, max: 1, type: 'unsignedInt' },
      { name: 'link', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'relation', min: 1, max: 1, type: 'string' },
        { name: 'url', min: 1, max: 1, type: 'uri' }
      ] },
      { name: 'entry', min: 0, max: '*', type: 'BackboneElement', elements: [
        { name: 'link', min: 0, max: '*', type: 'BackboneElement', elements: [] },
        { name: 'fullUrl', min: 0, max: 1, type: 'uri' },
        { name: 'resource', min: 0, max: 1, type: 'Resource' },
        { name: 'search', min: 0, max: 1, type: 'BackboneElement', elements: [
          { name: 'mode', min: 0, max: 1, type: 'code' },
          { name: 'score', min: 0, max: 1, type: 'decimal' }
        ] },
        { name: 'request', min: 0, max: 1, type: 'BackboneElement', elements: [
          { name: 'method', min: 1, max: 1, type: 'code' },
          { name: 'url', min: 1, max: 1, type: 'uri' },
          { name: 'ifNoneMatch', min: 0, max: 1, type: 'string' },
          { name: 'ifModifiedSince', min: 0, max: 1, type: 'instant' },
          { name: 'ifMatch', min: 0, max: 1, type: 'string' },
          { name: 'ifNoneExist', min: 0, max: 1, type: 'string' }
        ] },
        { name: 'response', min: 0, max: 1, type: 'BackboneElement', elements: [
          { name: 'status', min: 1, max: 1, type: 'string' },
          { name: 'location', min: 0, max: 1, type: 'uri' },
          { name: 'etag', min: 0, max: 1, type: 'string' },
          { name: 'lastModified', min: 0, max: 1, type: 'instant' }
        ] }
      ] },
      { name: 'signature', min: 0, max: 1, type: 'BackboneElement', elements: [] }
    ]
  }
};

// Known FHIR R4 resource type names (used to flag typos in resourceType,
// and to know when "no detailed schema available" is expected vs. a mistake).
const KNOWN_RESOURCE_TYPES = new Set([
  'Patient','Practitioner','PractitionerRole','Organization','Location','Encounter',
  'Observation','Condition','AllergyIntolerance','Procedure','Immunization',
  'Medication','MedicationRequest','MedicationAdministration','MedicationDispense',
  'MedicationStatement','DiagnosticReport','ServiceRequest','CarePlan','CareTeam',
  'Composition','Bundle','Goal','Specimen','ImagingStudy','DocumentReference',
  'Appointment','AppointmentResponse','Schedule','Slot','Coverage','Claim',
  'ExplanationOfBenefit','Device','DeviceRequest','Endpoint','Group','List',
  'Provenance','QuestionnaireResponse','Questionnaire','RelatedPerson','Task',
  'ValueSet','CodeSystem','ConceptMap','StructureDefinition','OperationOutcome',
  'Person','EpisodeOfCare','FamilyMemberHistory','NutritionOrder','Substance',
  'SupplyRequest','SupplyDelivery','Consent','Flag','RiskAssessment','Media',
  'BodyStructure','ImagingSelection','InsurancePlan','HealthcareService',
  'VerificationResult','Invoice','PaymentNotice','PaymentReconciliation',
  'Account','ChargeItem','Contract'
]);

if (typeof module !== 'undefined') {
  module.exports = { BASE_RESOURCE_ELEMENTS, BASE_DOMAIN_ELEMENTS, RESOURCE_DEFS, KNOWN_RESOURCE_TYPES };
} else if (typeof window !== 'undefined') {
  window.BASE_RESOURCE_ELEMENTS = BASE_RESOURCE_ELEMENTS;
  window.BASE_DOMAIN_ELEMENTS = BASE_DOMAIN_ELEMENTS;
  window.RESOURCE_DEFS = RESOURCE_DEFS;
  window.KNOWN_RESOURCE_TYPES = KNOWN_RESOURCE_TYPES;
}
