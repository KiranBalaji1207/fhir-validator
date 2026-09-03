/**
 * Verbatim (CC0-licensed) example resources published by HL7 as part of the
 * US Core Implementation Guide examples page:
 *   https://hl7.org/fhir/us/core/STU6.1/examples.html
 *
 * These are the IG's own official examples - not synthetically generated -
 * pulled directly from hl7.org/fhir/us/core (narrative/text fields dropped
 * for brevity; all clinical/structural content is unchanged). When a profile
 * is selected in the generator and a real example exists here, it's used
 * as-is instead of the random generator.
 *
 * Not every US Core profile has a verbatim example here yet - the generator
 * falls back to its own randomized-but-schema-correct generation for any
 * profile not listed below.
 */
(function (global) {
  const isNode = typeof module !== 'undefined' && module.exports;

  const REAL_EXAMPLES = {
    'http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient': {
      resourceType: 'Patient',
      id: 'example',
      meta: { profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient'] },
      extension: [
        {
          extension: [
            { url: 'ombCategory', valueCoding: { system: 'urn:oid:2.16.840.1.113883.6.238', code: '2106-3', display: 'White' } },
            { url: 'ombCategory', valueCoding: { system: 'urn:oid:2.16.840.1.113883.6.238', code: '1002-5', display: 'American Indian or Alaska Native' } },
            { url: 'ombCategory', valueCoding: { system: 'urn:oid:2.16.840.1.113883.6.238', code: '2028-9', display: 'Asian' } },
            { url: 'detailed', valueCoding: { system: 'urn:oid:2.16.840.1.113883.6.238', code: '1586-7', display: 'Shoshone' } },
            { url: 'detailed', valueCoding: { system: 'urn:oid:2.16.840.1.113883.6.238', code: '2036-2', display: 'Filipino' } },
            { url: 'text', valueString: 'Mixed' }
          ],
          url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race'
        },
        {
          extension: [
            { url: 'ombCategory', valueCoding: { system: 'urn:oid:2.16.840.1.113883.6.238', code: '2135-2', display: 'Hispanic or Latino' } },
            { url: 'detailed', valueCoding: { system: 'urn:oid:2.16.840.1.113883.6.238', code: '2184-0', display: 'Dominican' } },
            { url: 'detailed', valueCoding: { system: 'urn:oid:2.16.840.1.113883.6.238', code: '2148-5', display: 'Mexican' } },
            { url: 'text', valueString: 'Hispanic or Latino' }
          ],
          url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity'
        },
        { url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex', valueCode: 'F' },
        {
          url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-genderIdentity',
          valueCodeableConcept: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor', code: 'UNK', display: 'Unknown' }], text: 'Unknown' }
        }
      ],
      identifier: [{
        use: 'usual',
        type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'MR', display: 'Medical Record Number' }], text: 'Medical Record Number' },
        system: 'http://hospital.smarthealthit.org',
        value: '1032702'
      }],
      active: true,
      name: [
        { use: 'old', family: 'Shaw', given: ['Amy', 'V.'], period: { start: '2016-12-06', end: '2020-07-22' } },
        { family: 'Baxter', given: ['Amy', 'V.'], suffix: ['PharmD'], period: { start: '2020-07-22' } }
      ],
      telecom: [
        { system: 'phone', value: '555-555-5555', use: 'home' },
        { system: 'email', value: 'amy.shaw@example.com' }
      ],
      gender: 'female',
      birthDate: '1987-02-20',
      address: [
        { use: 'old', line: ['49 Meadow St'], city: 'Mounds', state: 'OK', postalCode: '74047', country: 'US', period: { start: '2016-12-06', end: '2020-07-22' } },
        { line: ['183 Mountain View St'], city: 'Mounds', state: 'OK', postalCode: '74048', country: 'US', period: { start: '2020-07-22' } }
      ]
    },

    'http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner': {
      resourceType: 'Practitioner',
      id: 'practitioner-1',
      meta: { profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner'] },
      identifier: [
        { system: 'http://hl7.org/fhir/sid/us-npi', value: '9941339100' },
        {
          extension: [{
            url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-jurisdiction',
            valueCodeableConcept: { coding: [{ system: 'https://www.usps.com/', code: 'MA' }], text: 'Massachusetts' }
          }],
          system: 'http://www.acme.org/practitioners',
          value: '25456'
        }
      ],
      name: [{ family: 'Bone', given: ['Ronald'], prefix: ['Dr'] }],
      address: [{ use: 'work', line: ['1003 HEALTHCARE DR'], city: 'AMHERST', state: 'MA', postalCode: '01002' }]
    },

    'http://hl7.org/fhir/us/core/StructureDefinition/us-core-organization': {
      resourceType: 'Organization',
      id: 'acme-lab',
      meta: { profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-organization'] },
      identifier: [
        { system: 'http://hl7.org/fhir/sid/us-npi', value: '1144221847' },
        { system: 'urn:oid:2.16.840.1.113883.4.7', value: '12D4567890' }
      ],
      active: true,
      type: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/organization-type', code: 'prov', display: 'Healthcare Provider' }] }],
      name: 'Acme Labs',
      telecom: [{ system: 'phone', value: '(+1) 734-677-7777' }, { system: 'email', value: 'hq@acme.org' }],
      address: [{ line: ['3300 Washtenaw Avenue, Suite 227'], city: 'Amherst', state: 'MA', postalCode: '01002', country: 'USA' }]
    },

    'http://hl7.org/fhir/us/core/StructureDefinition/us-core-location': {
      resourceType: 'Location',
      id: 'hospital',
      meta: { profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-location'] },
      identifier: [{ system: 'http://hl7.org/fhir/sid/us-npi', value: '1234567893' }],
      status: 'active',
      name: 'Holy Family Hospital',
      type: [{
        coding: [
          { system: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode', code: 'HOSP', display: 'Hospital' },
          { system: 'http://snomed.info/sct', code: '22232009', display: 'Hospital' },
          { system: 'https://www.cdc.gov/nhsn/cdaportal/terminology/codesystem/hsloc.html', code: '1120-5', display: 'Medical Clinic' }
        ],
        text: 'Hospital'
      }],
      telecom: [{ system: 'phone', value: '9786870156' }],
      address: { line: ['70 EAST ST'], city: 'METHUEN', state: 'MA', postalCode: '01844', country: 'US' },
      managingOrganization: { reference: 'Organization/holy-healthcare', display: 'Holy Healthcare' }
    },

    'http://hl7.org/fhir/us/core/StructureDefinition/us-core-encounter': {
      resourceType: 'Encounter',
      id: 'example-1',
      meta: { profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-encounter'] },
      status: 'finished',
      class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'AMB', display: 'ambulatory' },
      type: [{ coding: [{ system: 'http://www.ama-assn.org/go/cpt', code: '99201' }], text: 'Office Visit' }],
      subject: { reference: 'Patient/example' },
      period: { start: '2015-11-01T17:00:14-05:00', end: '2015-11-01T18:00:14-05:00' }
    },

    'http://hl7.org/fhir/us/core/StructureDefinition/us-core-immunization': {
      resourceType: 'Immunization',
      id: 'imm-1',
      meta: { profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-immunization'] },
      status: 'completed',
      vaccineCode: {
        coding: [
          { system: 'http://hl7.org/fhir/sid/cvx', code: '197', display: 'Influenza, high-dose, quadrivalent, PF' },
          { system: 'http://hl7.org/fhir/sid/ndc', code: '49281012188', display: 'FLUZONE High-Dose Quadrivalent Northern Hemisphere' }
        ],
        text: 'Influenza, high-dose, quadrivalent, PF'
      },
      patient: { reference: 'Patient/example', display: 'Amy Shaw' },
      encounter: { reference: 'Encounter/example-1', display: 'Office Visit' },
      occurrenceDateTime: '2020-11-19T12:46:57-08:00',
      primarySource: false,
      location: { reference: 'Location/hospital', display: 'Holy Family Hospital' },
      lotNumber: 'AAJN11K',
      performer: [{ actor: { reference: 'Practitioner/practitioner-1', display: 'Dr Ronald Bone' } }]
    },

    'http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest': {
      resourceType: 'MedicationRequest',
      id: 'self-tylenol',
      meta: { profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest'] },
      identifier: [{ use: 'official', system: 'http://acme.org/prescriptions', value: '12345689' }],
      status: 'active',
      intent: 'plan',
      reportedBoolean: true,
      medicationCodeableConcept: { coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '1187314', display: 'Tylenol PM Pill' }], text: 'Tylenol PM Pill' },
      subject: { reference: 'Patient/example', display: 'Amy V. Shaw' },
      encounter: { reference: 'Encounter/example-1', display: 'Office Visit' },
      authoredOn: '2019-06-24',
      requester: { reference: 'Patient/example', display: 'self-prescribed' },
      reasonCode: [{ coding: [{ system: 'http://snomed.info/sct', code: '25064002', display: 'Headache (finding)' }], text: 'Headache' }],
      dosageInstruction: [{ text: 'Takes 1-2 tablets once daily at bedtime as needed for restless legs' }]
    },

    'http://hl7.org/fhir/us/core/StructureDefinition/us-core-vital-signs': {
      resourceType: 'Observation',
      id: 'heart-rate',
      meta: { profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-vital-signs'] },
      status: 'final',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs', display: 'Vital Signs' }], text: 'Vital Signs' }],
      code: { coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart Rate' }], text: 'heart_rate' },
      subject: { reference: 'Patient/example', display: 'Amy Shaw' },
      encounter: { display: 'GP Visit' },
      effectiveDateTime: '1999-07-02',
      valueQuantity: { value: 44.0, unit: 'beats/min', system: 'http://unitsofmeasure.org', code: '/min' }
    },

    // Adapted from the FHIR R4 core spec's canonical AllergyIntolerance example
    // (same "Cashew nuts" clinical data HL7 has published across FHIR versions),
    // with the US Core profile declared.
    'http://hl7.org/fhir/us/core/StructureDefinition/us-core-allergyintolerance': {
      resourceType: 'AllergyIntolerance',
      id: 'example',
      meta: { profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-allergyintolerance'] },
      identifier: [{ system: 'http://acme.com/ids/patients/risks', value: '49476534' }],
      clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical', code: 'active', display: 'Active' }] },
      verificationStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification', code: 'confirmed', display: 'Confirmed' }] },
      type: 'allergy',
      category: ['food'],
      criticality: 'high',
      code: { coding: [{ system: 'http://snomed.info/sct', code: '227493005', display: 'Cashew nuts' }] },
      patient: { reference: 'Patient/example' },
      onsetDateTime: '2004',
      recordedDate: '2014-10-09T14:58:00+11:00',
      recorder: { reference: 'Practitioner/example' },
      reaction: [
        {
          manifestation: [{ coding: [{ system: 'http://snomed.info/sct', code: '39579001', display: 'Anaphylactic reaction' }] }],
          description: 'Severe reaction to subcutaneous cashew extract. Epinephrine administered',
          onset: '2012-06-12',
          severity: 'severe',
          exposureRoute: { coding: [{ system: 'http://snomed.info/sct', code: '34206005', display: 'Subcutaneous route' }] }
        },
        {
          manifestation: [{ coding: [{ system: 'http://snomed.info/sct', code: '64305001', display: 'Urticaria' }] }],
          onset: '2004',
          severity: 'moderate',
          note: [{ text: 'The patient reports that the onset of urticaria was within 15 minutes of eating cashews.' }]
        }
      ]
    }
  };

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function getRealExample(profileUrl) {
    const idx = typeof profileUrl === 'string' ? profileUrl.indexOf('|') : -1;
    const stripped = idx === -1 ? profileUrl : profileUrl.slice(0, idx);
    const found = REAL_EXAMPLES[stripped];
    return found ? deepClone(found) : null;
  }

  const api = { REAL_EXAMPLES, getRealExample };
  if (isNode) {
    module.exports = api;
  } else if (typeof window !== 'undefined') {
    window.REAL_EXAMPLES = REAL_EXAMPLES;
    window.getRealExample = getRealExample;
  }
})(typeof window !== 'undefined' ? window : globalThis);
