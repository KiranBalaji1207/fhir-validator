/**
 * IG profile overlays: US Core, CARIN BB (Blue Button), and Da Vinci PDex.
 *
 * These are NOT full copies of the IGs' StructureDefinitions - they capture the
 * cardinality tightenings, fixed values, and required category/codes that this
 * validator can check with confidence from a single resource instance. Anything
 * that needs terminology server lookups, cross-resource checks, or full slice
 * discrimination (most value set bindings, most fixed codings inside slices) is
 * out of scope and is called out in each profile's `notes`.
 *
 * A profile entry:
 *   {
 *     label, ig, baseResourceType,
 *     requiredOverrides: [{ path, min, choice? }]   // tightened cardinality (path is a
 *                                                     // top-level field name; choice:true
 *                                                     // means check for any key starting
 *                                                     // with that name, e.g. "effective")
 *     fixedValues: [{ path, value, severity? }]      // simple top-level fixed/pattern value
 *     requiredCoding: [{ path, system, code, arrayOfCodeableConcept? }]
 *                                                     // at least one coding in this field
 *                                                     // (or, for Observation.code, the field
 *                                                     // itself) must match system+code
 *     notes: string
 *   }
 */

function buildCarinBBEobProfiles() {
  const eobRequired = [
    { path: 'identifier', min: 1 }, { path: 'billablePeriod', min: 1 }
  ];
  const eobFixed = [
    { path: 'use', value: 'claim' }
  ];
  const eobNotes = 'Checks the header-level requirements shared by all C4BB EOB profiles (identifier, status, type, use, patient, billablePeriod, created, insurer, provider, outcome, insurance, item). Claim-type-specific rules (e.g. revenue/DRG codes for institutional claims, NDC codes for pharmacy) aren\'t checked.';
  const names = {
    'C4BB-ExplanationOfBenefit-Inpatient-Institutional': 'CARIN BB EOB (Inpatient Institutional)',
    'C4BB-ExplanationOfBenefit-Outpatient-Institutional': 'CARIN BB EOB (Outpatient Institutional)',
    'C4BB-ExplanationOfBenefit-Pharmacy': 'CARIN BB EOB (Pharmacy)',
    'C4BB-ExplanationOfBenefit-Professional-NonClinician': 'CARIN BB EOB (Professional/NonClinician)',
    'C4BB-ExplanationOfBenefit-Oral': 'CARIN BB EOB (Oral)'
  };
  const out = {};
  for (const id of Object.keys(names)) {
    out[`http://hl7.org/fhir/us/carin-bb/StructureDefinition/${id}`] = {
      label: names[id], ig: 'CARIN BB', baseResourceType: 'ExplanationOfBenefit',
      requiredOverrides: eobRequired, fixedValues: eobFixed, notes: eobNotes
    };
  }
  return out;
}

const PROFILE_DEFS = {
  // ---------------- US Core ----------------
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient': {
    label: 'US Core Patient', ig: 'US Core', baseResourceType: 'Patient',
    requiredOverrides: [{ path: 'identifier', min: 1 }, { path: 'name', min: 1 }],
    notes: 'Race, ethnicity, birth sex, and similar US Core extensions are Must Support, not required on every instance, so their absence isn\'t flagged.'
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner': {
    label: 'US Core Practitioner', ig: 'US Core', baseResourceType: 'Practitioner',
    requiredOverrides: [{ path: 'name', min: 1 }]
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-organization': {
    label: 'US Core Organization', ig: 'US Core', baseResourceType: 'Organization',
    requiredOverrides: [{ path: 'identifier', min: 1 }, { path: 'name', min: 1 }]
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-location': {
    label: 'US Core Location', ig: 'US Core', baseResourceType: 'Location',
    requiredOverrides: [{ path: 'name', min: 1 }, { path: 'status', min: 1 }]
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-encounter': {
    label: 'US Core Encounter', ig: 'US Core', baseResourceType: 'Encounter',
    requiredOverrides: [{ path: 'type', min: 1 }, { path: 'subject', min: 1 }],
    notes: 'status, class, and subject are already required by base FHIR; US Core additionally requires at least one type.'
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-condition-problems-health-concerns': {
    label: 'US Core Condition (Problems/Health Concerns)', ig: 'US Core', baseResourceType: 'Condition',
    requiredOverrides: [{ path: 'clinicalStatus', min: 1 }, { path: 'category', min: 1 }, { path: 'code', min: 1 }, { path: 'subject', min: 1 }],
    requiredCoding: [{ path: 'category', system: 'http://hl7.org/fhir/us/core/CodeSystem/us-core-category', code: 'problem-list-item', arrayOfCodeableConcept: true }],
    notes: 'Only checks for the problem-list-item category coding; other US Core Condition category/value-set nuances aren\'t checked.'
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-condition-encounter-diagnosis': {
    label: 'US Core Condition (Encounter Diagnosis)', ig: 'US Core', baseResourceType: 'Condition',
    requiredOverrides: [{ path: 'category', min: 1 }, { path: 'code', min: 1 }, { path: 'subject', min: 1 }],
    requiredCoding: [{ path: 'category', system: 'http://hl7.org/fhir/us/core/CodeSystem/us-core-category', code: 'encounter-diagnosis', arrayOfCodeableConcept: true }]
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-allergyintolerance': {
    label: 'US Core AllergyIntolerance', ig: 'US Core', baseResourceType: 'AllergyIntolerance',
    requiredOverrides: [{ path: 'clinicalStatus', min: 1 }, { path: 'patient', min: 1 }],
    notes: 'US Core requires AllergyIntolerance.code OR reaction.substance - that either/or isn\'t checked, only that the resource has clinicalStatus and patient.'
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-procedure': {
    label: 'US Core Procedure', ig: 'US Core', baseResourceType: 'Procedure',
    requiredOverrides: [{ path: 'code', min: 1 }, { path: 'subject', min: 1 }]
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-immunization': {
    label: 'US Core Immunization', ig: 'US Core', baseResourceType: 'Immunization',
    notes: 'Base FHIR already requires status, vaccineCode, patient, and occurrence[x]; US Core doesn\'t tighten cardinality further, only adds Must Support expectations this validator doesn\'t check.'
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest': {
    label: 'US Core MedicationRequest', ig: 'US Core', baseResourceType: 'MedicationRequest',
    notes: 'Base FHIR already requires status, intent, medication[x], and subject; US Core doesn\'t tighten cardinality further here.'
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab': {
    label: 'US Core Laboratory Result Observation', ig: 'US Core', baseResourceType: 'Observation',
    requiredOverrides: [{ path: 'category', min: 1 }, { path: 'subject', min: 1 }, { path: 'effective', min: 1, choice: true }],
    requiredCoding: [{ path: 'category', system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'laboratory', arrayOfCodeableConcept: true }],
    notes: 'Requires either a value[x] or a dataAbsentReason - that either/or isn\'t checked.'
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-vital-signs': {
    label: 'US Core Vital Signs', ig: 'US Core', baseResourceType: 'Observation',
    requiredOverrides: [{ path: 'category', min: 1 }, { path: 'subject', min: 1 }, { path: 'effective', min: 1, choice: true }],
    requiredCoding: [{ path: 'category', system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs', arrayOfCodeableConcept: true }]
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-smokingstatus': {
    label: 'US Core Smoking Status Observation', ig: 'US Core', baseResourceType: 'Observation',
    requiredOverrides: [{ path: 'subject', min: 1 }, { path: 'effective', min: 1, choice: true }],
    requiredCoding: [{ path: 'code', system: 'http://loinc.org', code: '72166-2', arrayOfCodeableConcept: false }]
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-diagnosticreport-lab': {
    label: 'US Core DiagnosticReport (Laboratory)', ig: 'US Core', baseResourceType: 'DiagnosticReport',
    requiredOverrides: [{ path: 'category', min: 1 }, { path: 'subject', min: 1 }],
    requiredCoding: [{ path: 'category', system: 'http://terminology.hl7.org/CodeSystem/v2-0074', code: 'LAB', arrayOfCodeableConcept: true }]
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-diagnosticreport-note': {
    label: 'US Core DiagnosticReport (Report and Note)', ig: 'US Core', baseResourceType: 'DiagnosticReport',
    requiredOverrides: [{ path: 'category', min: 1 }, { path: 'subject', min: 1 }]
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-servicerequest': {
    label: 'US Core ServiceRequest', ig: 'US Core', baseResourceType: 'ServiceRequest',
    requiredOverrides: [{ path: 'code', min: 1 }]
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-careplan': {
    label: 'US Core CarePlan', ig: 'US Core', baseResourceType: 'CarePlan',
    requiredOverrides: [{ path: 'text', min: 1 }, { path: 'category', min: 1 }],
    requiredCoding: [{ path: 'category', system: 'http://hl7.org/fhir/us/core/CodeSystem/careplan-category', code: 'assess-plan', arrayOfCodeableConcept: true }],
    notes: 'A human-readable narrative (CarePlan.text) is required by this profile, in addition to the assess-plan category.'
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-provenance': {
    label: 'US Core Provenance', ig: 'US Core', baseResourceType: 'Provenance',
    notes: 'Base FHIR already requires target, recorded, and agent.who; this validator doesn\'t check the additional Must Support agent.type expectations.'
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-careteam': {
    label: 'US Core CareTeam', ig: 'US Core', baseResourceType: 'CareTeam',
    requiredOverrides: [{ path: 'status', min: 1 }, { path: 'subject', min: 1 }, { path: 'participant', min: 1 }],
    notes: 'US Core tightens status and subject to required and requires at least one participant; per-participant role/member Must Support expectations aren\'t checked.'
  },
  'http://hl7.org/fhir/us/core/StructureDefinition/us-core-questionnaireresponse': {
    label: 'US Core QuestionnaireResponse', ig: 'US Core', baseResourceType: 'QuestionnaireResponse',
    requiredOverrides: [{ path: 'subject', min: 1 }, { path: 'authored', min: 1 }],
    notes: 'US Core tightens subject and authored to required; the item/answer structure isn\'t deeply validated beyond base FHIR shape.'
  },

  // ---------------- CARIN BB (Blue Button) ----------------
  'http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Patient': {
    label: 'CARIN BB Patient', ig: 'CARIN BB', baseResourceType: 'Patient',
    requiredOverrides: [{ path: 'identifier', min: 1 }, { path: 'name', min: 1 }],
    notes: 'Built on US Core Patient; member-ID identifier slicing isn\'t checked.'
  },
  'http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Practitioner': {
    label: 'CARIN BB Practitioner', ig: 'CARIN BB', baseResourceType: 'Practitioner',
    requiredOverrides: [{ path: 'name', min: 1 }]
  },
  'http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Organization': {
    label: 'CARIN BB Organization', ig: 'CARIN BB', baseResourceType: 'Organization',
    requiredOverrides: [{ path: 'identifier', min: 1 }, { path: 'name', min: 1 }]
  },
  'http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-RelatedPerson': {
    label: 'CARIN BB RelatedPerson', ig: 'CARIN BB', baseResourceType: 'RelatedPerson',
    requiredOverrides: [{ path: 'name', min: 1 }]
  },
  'http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Coverage': {
    label: 'CARIN BB Coverage', ig: 'CARIN BB', baseResourceType: 'Coverage',
    notes: 'Base FHIR already requires status, beneficiary, and payor; group/plan class slicing and the CARIN BB relationship value set aren\'t checked.'
  },

  // ---------------- Da Vinci PDex ----------------
  'http://hl7.org/fhir/us/davinci-pdex/StructureDefinition/pdex-priorauthorization': {
    label: 'Da Vinci PDex Prior Authorization (EOB)', ig: 'Da Vinci PDex', baseResourceType: 'ExplanationOfBenefit',
    requiredOverrides: [{ path: 'identifier', min: 1 }],
    notes: 'Built on the CARIN BB ExplanationOfBenefit requirements; typically ExplanationOfBenefit.use = "preauthorization" but that fixed value isn\'t enforced here since the IG treats it as guidance rather than a formal constraint.'
  },
  'http://hl7.org/fhir/us/davinci-hrex/StructureDefinition/hrex-coverage': {
    label: 'Da Vinci HRex/PDex Coverage', ig: 'Da Vinci PDex', baseResourceType: 'Coverage',
    notes: 'Referenced by Da Vinci PDex (e.g. member match); base FHIR already requires status, beneficiary, and payor.'
  },
  'http://hl7.org/fhir/us/davinci-pdex/StructureDefinition/pdex-provenance': {
    label: 'Da Vinci PDex Provenance', ig: 'Da Vinci PDex', baseResourceType: 'Provenance',
    notes: 'Built on US Core Provenance; the PDex-specific PayerSourceFormat extension isn\'t checked.'
  },
  'http://hl7.org/fhir/us/davinci-pdex/StructureDefinition/provider-parameters-multi-member-match-bundle-in': {
    label: 'Da Vinci PDex Provider Member Match Request', ig: 'Da Vinci PDex', baseResourceType: 'Parameters',
    requiredOverrides: [{ path: 'parameter', min: 1 }],
    notes: 'Expects one or more "MemberBundle" parameters, each with MemberPatient, CoverageToMatch, and Consent parts (CoverageToLink is optional). The internal part/name/resource structure isn\'t deeply validated - only that at least one top-level parameter is present.'
  },
  'http://hl7.org/fhir/us/davinci-pdex/StructureDefinition/pdex-parameters-multi-member-match-bundle-in': {
    label: 'Da Vinci PDex Bulk Member Match Request (Payer)', ig: 'Da Vinci PDex', baseResourceType: 'Parameters',
    requiredOverrides: [{ path: 'parameter', min: 1 }],
    notes: 'Same MemberBundle/MemberPatient/CoverageToMatch/Consent(/CoverageToLink) structure as the provider-initiated request, used for payer-to-payer bulk member match.'
  }
};

// The five CARIN BB claim-type EOB profiles share the same header-level requirements
// (from the abstract C4BB-ExplanationOfBenefit base profile); only the intended claim
// context differs, which this validator doesn't check.
Object.assign(PROFILE_DEFS, buildCarinBBEobProfiles());

// US Core profiles are reused directly by Da Vinci PDex for the "clinical" side of a
// member's health history (Condition, Observation, etc. travel under US Core URLs,
// not separate PDex ones) - no extra entries needed; they're already covered above.

function stripVersion(url) {
  const idx = url.indexOf('|');
  return idx === -1 ? url : url.slice(0, idx);
}

function lookupProfile(url) {
  return PROFILE_DEFS[stripVersion(url)] || null;
}

if (typeof module !== 'undefined') {
  module.exports = { PROFILE_DEFS, lookupProfile, stripVersion };
} else if (typeof window !== 'undefined') {
  window.PROFILE_DEFS = PROFILE_DEFS;
  window.lookupProfile = lookupProfile;
  window.stripVersion = stripVersion;
}
