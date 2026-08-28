const FHIR_SAMPLES = {
  'patient-json': {
    format: 'json',
    text: `{
  "resourceType": "Patient",
  "id": "example",
  "active": true,
  "name": [
    { "use": "official", "family": "Smith", "given": ["John", "Jacob"] }
  ],
  "telecom": [
    { "system": "phone", "value": "555-1234", "use": "home" }
  ],
  "gender": "male",
  "birthDate": "1974-12-25",
  "address": [
    { "use": "home", "line": ["534 Erewhon St"], "city": "PleasantVille", "state": "Vic", "postalCode": "3999" }
  ]
}`
  },
  'patient-xml': {
    format: 'xml',
    text: `<?xml version="1.0" encoding="UTF-8"?>
<Patient xmlns="http://hl7.org/fhir">
  <id value="example"/>
  <active value="true"/>
  <name>
    <use value="official"/>
    <family value="Smith"/>
    <given value="John"/>
    <given value="Jacob"/>
  </name>
  <gender value="male"/>
  <birthDate value="1974-12-25"/>
</Patient>`
  },
  'observation-broken': {
    format: 'json',
    text: `{
  "resourceType": "Observation",
  "status": "final",
  "subject": { "reference": "Patient/example" },
  "value": "not-a-choice-suffix-so-this-is-flagged",
  "valueQuantity": { "value": "98.6", "unit": "degF" },
  "category": { "text": "vital-signs" },
  "issued": "2024-02-30T10:00:00"
}`
  }
};

if (typeof module !== 'undefined') module.exports = { FHIR_SAMPLES };
