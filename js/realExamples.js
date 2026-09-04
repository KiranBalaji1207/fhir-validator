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

    'http://hl7.org/fhir/us/core/StructureDefinition/us-core-careteam': {
      resourceType: 'CareTeam',
      id: 'example',
      meta: { profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-careteam'] },
      status: 'active',
      name: 'US-Core example CareTeam',
      subject: { reference: 'Patient/example', display: 'Amy V. Shaw' },
      participant: [
        {
          role: [{ coding: [{ system: 'http://snomed.info/sct', code: '17561000', display: 'Cardiologist' }] }],
          member: { reference: 'Practitioner/practitioner-1', display: 'Ronald Bone, MD' }
        },
        {
          role: [{ coding: [{ system: 'http://snomed.info/sct', code: '453231000124104', display: 'Primary care provider' }] }],
          member: { reference: 'Practitioner/practitioner-2', display: 'Kathy Fielding, MD' }
        },
        {
          role: [{ coding: [{ system: 'http://snomed.info/sct', code: '116154003', display: 'Patient (person)' }] }],
          member: { reference: 'Patient/example', display: 'Amy V. Shaw' }
        },
        {
          role: [{ coding: [{ system: 'http://snomed.info/sct', code: '133932002', display: 'Caregiver (person)' }] }],
          member: { reference: 'RelatedPerson/shaw-niece', display: 'Sarah van Putten' }
        }
      ]
    },

    'http://hl7.org/fhir/us/core/StructureDefinition/us-core-servicerequest': {
      resourceType: 'ServiceRequest',
      id: 'foodpantry-referral',
      meta: { profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-servicerequest'] },
      status: 'active',
      intent: 'order',
      category: [{ coding: [{ system: 'http://hl7.org/fhir/us/core/CodeSystem/us-core-category', code: 'sdoh', display: 'SDOH' }], text: 'Social Determinants Of Health' }],
      code: { coding: [{ system: 'http://snomed.info/sct', code: '467771000124109', display: 'Assistance with application for food pantry program' }] },
      subject: { reference: 'Patient/example' },
      occurrenceDateTime: '2021-11-20',
      authoredOn: '2021-11-12T10:59:38-08:00',
      requester: { reference: 'Practitioner/practitioner-1' }
    },

    'http://hl7.org/fhir/us/core/StructureDefinition/us-core-questionnaireresponse': {
      resourceType: 'QuestionnaireResponse',
      id: 'prapare-example',
      meta: { profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-questionnaireresponse'] },
      questionnaire: 'http://hl7.org/fhir/us/core/Questionnaire/prapare-example',
      status: 'completed',
      subject: { reference: 'Patient/example', display: 'Amy V. Shaw' },
      authored: '2022-03-28T18:30:40-07:00',
      item: [
        {
          linkId: '/93025-5',
          text: "Protocol for Responding to and Assessing Patients' Assets, Risks, and Experiences [PRAPARE]",
          item: [
            {
              linkId: '/93043-8',
              text: 'Personal characteristics',
              item: [
                { linkId: '/93043-8/56051-6', text: 'Do you consider yourself Hispanic/Latino?', answer: [{ valueCoding: { system: 'http://loinc.org', code: 'LA32-8', display: 'No' } }] },
                { linkId: '/93043-8/32624-9', text: 'Race', answer: [
                  { valueCoding: { system: 'http://loinc.org', code: 'LA4457-3', display: 'White' } },
                  { valueCoding: { system: 'http://loinc.org', code: 'LA30187-1', display: 'Pacific Islander' } }
                ] },
                { linkId: '/93043-8/93035-4', text: "At any point in the past 2 years, has season or migrant farm work been your or your family's main source of income?", answer: [{ valueCoding: { system: 'http://loinc.org', code: 'LA33-6', display: 'Yes' } }] },
                { linkId: '/93043-8/93034-7', text: 'Have you been discharged from the armed forces of the United States?', answer: [{ valueCoding: { system: 'http://loinc.org', code: 'LA32-8', display: 'No' } }] },
                { linkId: '/93043-8/54899-0', text: 'Preferred language', answer: [{ valueCoding: { system: 'http://loinc.org', code: 'LA43-5', display: 'English' } }] }
              ]
            },
            {
              linkId: '/93042-0',
              text: 'Family and home',
              item: [
                { linkId: '/93042-0/63512-8', text: 'How many people are living or staying at this address?', answer: [{ valueInteger: 6 }] },
                { linkId: '/93042-0/71802-3', text: 'Housing status', answer: [{ valueCoding: { system: 'http://loinc.org', code: 'LA30190-5', display: 'I do not have housing (staying with others, in a hotel, in a shelter, living outside on the street, on a beach, in a car, or in a park)' } }] },
                { linkId: '/93042-0/93033-9', text: 'Are you worried about losing your housing?', answer: [{ valueCoding: { system: 'http://loinc.org', code: 'LA30122-8', display: 'I choose not to answer this question' } }] },
                { linkId: '/93042-0/56799-0', text: 'Address', answer: [{ valueString: 'Broadway' }] }
              ]
            },
            {
              linkId: '/93041-2',
              text: 'Money and resources',
              item: [
                { linkId: '/93041-2/82589-3', text: 'Highest level of educ', answer: [{ valueCoding: { system: 'http://loinc.org', code: 'LA30191-3', display: 'Less than high school degree' } }] },
                { linkId: '/93041-2/67875-5', text: 'Employment status current', answer: [{ valueCoding: { system: 'http://loinc.org', code: 'LA17956-6', display: 'Unemployed' } }] },
                { linkId: '/93041-2/76437-3', text: 'Primary insurance', answer: [{ valueCoding: { system: 'http://loinc.org', code: 'LA17849-3', display: 'Medicaid' } }] },
                { linkId: '/93041-2/63586-2', text: 'What was your best estimate of the total income of all family members from all sources, before taxes, in last year?', answer: [{ valueDecimal: 25000 }] },
                { linkId: '/93041-2/93031-3', text: 'In the past year, have you or any family members you live with been unable to get any of the following when it was really needed?', answer: [
                  { valueCoding: { system: 'http://loinc.org', code: 'LA30126-9', display: 'Clothing' } },
                  { valueCoding: { system: 'http://loinc.org', code: 'LA30127-7', display: 'Child care' } }
                ] },
                { linkId: '/93041-2/93030-5', text: 'Has lack of transportation kept you from medical appointments, meetings, work, or from getting things needed for daily living?', answer: [{ valueCoding: { system: 'http://loinc.org', code: 'LA30134-3', display: 'Yes, it has kept me from non-medical meetings, appointments, work, or from getting things that I need' } }] }
              ]
            },
            {
              linkId: '/93040-4',
              text: 'Social and emotional health',
              item: [
                { linkId: '/93040-4/93029-7', text: 'How often do you see or talk to people that you care about and feel close to (For example: talking to friends on the phone, visiting friends or family, going to church or club meetings)?', answer: [{ valueCoding: { system: 'http://loinc.org', code: 'LA30130-1', display: '1 or 2 times a week' } }] },
                { linkId: '/93040-4/93038-8', text: "Stress is when someone feels tense, nervous, anxious or can't sleep at night because their mind is troubled. How stressed are you?", answer: [{ valueCoding: { system: 'http://loinc.org', code: 'LA13909-9', display: 'Somewhat' } }] }
              ]
            },
            {
              linkId: '/93039-6',
              text: 'Optional additional questions',
              item: [
                { linkId: '/93039-6/93028-9', text: 'In the past year, have you spent more than 2 nights in a row in a jail, prison, detention center, or juvenile correctional facility?', answer: [{ valueCoding: { system: 'http://loinc.org', code: 'LA32-8', display: 'No' } }] },
                { linkId: '/93039-6/93027-1', text: 'Are you a refugee?', answer: [{ valueCoding: { system: 'http://loinc.org', code: 'LA32-8', display: 'No' } }] },
                { linkId: '/93039-6/93026-3', text: 'Do you feel physically and emotionally safe where you currently live?', answer: [{ valueCoding: { system: 'http://loinc.org', code: 'LA32-8', display: 'No' } }] },
                { linkId: '/93039-6/76501-6', text: 'Within the last year, have you been afraid of your partner or ex-partner?', answer: [{ valueCoding: { system: 'http://loinc.org', code: 'LA32-8', display: 'No' } }] }
              ]
            }
          ]
        }
      ]
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
    },

    // ---------------- CARIN BB (Blue Button) ----------------
    'http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Patient': {
      resourceType: 'Patient',
      id: 'Patient1',
      meta: { lastUpdated: '2020-07-07T13:26:22.0314215+00:00', profile: ['http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Patient'] },
      language: 'en-US',
      identifier: [
        { type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'MB' }] }, system: 'https://www.xxxhealthplan.com/fhir/memberidentifier', value: '1234-234-1243-12345678901' },
        { type: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBIdentifierType', code: 'um' }] }, system: 'https://www.xxxhealthplan.com/fhir/iniquememberidentifier', value: '1234-234-1243-12345678901u' }
      ],
      active: true,
      name: [{ family: 'Example1', given: ['Johnny'] }],
      telecom: [{ system: 'phone', value: '(301)666-1212', rank: 2 }],
      gender: 'male',
      birthDate: '1986-01-01',
      address: [{ type: 'physical', line: ['123 Main Street'], city: 'Pittsburgh', state: 'PA', postalCode: '12519' }],
      maritalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor', code: 'UNK' }] }
    },

    'http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Practitioner': {
      resourceType: 'Practitioner',
      id: 'Practitioner1',
      meta: { lastUpdated: '2020-05-04T03:02:01-04:00', profile: ['http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Practitioner'] },
      identifier: [{ type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'NPI', display: 'National Provider Identifier' }], text: 'National Provider Identifier' }, system: 'http://hl7.org/fhir/sid/us-npi', value: '9941339100' }],
      active: true,
      name: [{ family: 'Smith', given: ['John'], prefix: ['Dr.'] }]
    },

    'http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Organization': {
      resourceType: 'Organization',
      id: 'Payer2',
      meta: { lastUpdated: '2020-09-08T00:00:00+00:00', source: 'Organization/PayerOrganizationExample1', profile: ['http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Organization'] },
      identifier: [{ type: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBIdentifierType', code: 'naiccode', display: 'NAIC Code' }], text: 'NAIC Code' }, system: 'urn:oid:2.16.840.1.113883.6.300', value: '95216' }],
      active: true,
      type: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/organization-type', code: 'pay' }], text: 'Payer' }],
      name: 'UPMC Health Plan',
      telecom: [
        { system: 'phone', value: '1-844-220-4785 TTY: 711', use: 'work' },
        { system: 'phone', value: '1-866-406-8762', use: 'work' }
      ],
      address: [{ type: 'physical', line: ['UPMC Health Plan', 'Attn: Commercial Plans', 'U.S. Steel Tower', '600 Grant Street'], city: 'Pittsburgh', state: 'PA', postalCode: '15219' }]
    },

    'http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-RelatedPerson': {
      resourceType: 'RelatedPerson',
      id: 'RelatedPerson1',
      meta: { lastUpdated: '2020-05-04T03:02:01-04:00', profile: ['http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-RelatedPerson'] },
      active: true,
      patient: { reference: 'Patient/Patient1' },
      relationship: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode', code: 'MTH' }] }],
      name: [{ family: 'Example1', given: ['Mary'] }],
      telecom: [{ system: 'phone', value: '(301)666-1212', rank: 2 }],
      address: [{ type: 'physical', line: ['123 Main Street'], city: 'Pittsburgh', state: 'PA', postalCode: '12519' }]
    },

    'http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Coverage': {
      resourceType: 'Coverage',
      id: 'Coverage1',
      meta: { lastUpdated: '2020-10-30T09:48:01.8462752-04:00', profile: ['http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Coverage'] },
      language: 'en-US',
      identifier: [{
        type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'MB', display: 'Member Number' }], text: 'An identifier for the insured of an insurance policy (this insured always has a subscriber), usually assigned by the insurance carrier.' },
        system: 'https://www.upmchealthplan.com/fhir/memberidentifier',
        value: '88800933501',
        assigner: { reference: 'Organization/Payer2', display: 'UPMC Health Plan' }
      }],
      status: 'active',
      policyHolder: { reference: 'Patient/Patient1' },
      subscriber: { reference: 'Patient/Patient1' },
      subscriberId: '888009335',
      beneficiary: { reference: 'Patient/Patient1' },
      dependent: '01',
      relationship: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/subscriber-relationship', code: 'self', display: 'Self' }], text: 'Self' },
      period: { start: '2020-01-01' },
      payor: [{ reference: 'Organization/Payer2', display: 'UPMC Health Plan' }],
      class: [
        { type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/coverage-class', code: 'group', display: 'Group' }], text: 'An employee group' }, value: 'MCHMO1', name: 'MEDICARE HMO PLAN' },
        { type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/coverage-class', code: 'plan', display: 'Plan' }], text: 'A specific suite of benefits.' }, value: 'GR5', name: 'GR5-HMO DEDUCTIBLE' }
      ],
      network: 'GR5-HMO DEDUCTIBLE'
    },

    'http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-ExplanationOfBenefit-Inpatient-Institutional': {
      resourceType: 'ExplanationOfBenefit',
      id: 'BB-EOBInpatient1-nonfinancial',
      meta: { lastUpdated: '2019-12-12T09:14:11+00:00', profile: ['http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-ExplanationOfBenefit-Inpatient-Institutional-Basis'] },
      language: 'en-US',
      identifier: [{ type: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBIdentifierType', code: 'uc' }] }, system: 'https://www.xxxplan.com/fhir/EOBIdentifier', value: 'AW123412341234123412341234123412' }],
      status: 'active',
      type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/claim-type', code: 'institutional' }], text: 'Institutional' },
      subType: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBInstitutionalClaimSubType', code: 'inpatient' }], text: 'Inpatient' },
      use: 'claim',
      patient: { reference: 'Patient/Patient2' },
      billablePeriod: { start: '2019-01-01', end: '2019-10-31' },
      created: '2019-11-02T00:00:00+00:00',
      insurer: { reference: 'Organization/Payer1', display: 'XXX Health Plan' },
      provider: { reference: 'Organization/ProviderOrganization1', display: 'XXX Health Plan' },
      outcome: 'partial',
      supportingInfo: [
        { sequence: 2, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'admissionperiod' }] }, timingPeriod: { start: '2011-05-23', end: '2011-05-25' } },
        { sequence: 3, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'clmrecvddate' }] }, timingDate: '2011-05-30' },
        { sequence: 4, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'typeofbill' }] }, code: { coding: [{ system: 'https://www.nubc.org/CodeSystem/TypeOfBill', code: 'Dummy' }] } },
        { sequence: 5, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'pointoforigin' }] }, code: { coding: [{ system: 'https://www.nubc.org/CodeSystem/PointOfOrigin', code: 'Dummy' }] } },
        { sequence: 6, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'admtype' }] }, code: { coding: [{ system: 'https://www.nubc.org/CodeSystem/PriorityTypeOfAdmitOrVisit', code: 'Dummy' }] } },
        { sequence: 7, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'discharge-status' }] }, code: { coding: [{ system: 'https://www.nubc.org/CodeSystem/PatDischargeStatus', code: '11' }] } },
        { sequence: 8, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'medicalrecordnumber' }] }, valueString: '1234-234-1243-12345678901m' },
        { sequence: 9, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'patientaccountnumber' }] }, valueString: '1234-234-1243-12345678901a' }
      ],
      diagnosis: [{ sequence: 1, diagnosisCodeableConcept: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'S06.0X1A' }] }, type: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/ex-diagnosistype', code: 'principal' }] }] }],
      insurance: [{ focal: true, coverage: { reference: 'Coverage/Coverage3' } }],
      item: [{ sequence: 1, revenue: { coding: [{ system: 'https://www.nubc.org/CodeSystem/RevenueCodes', code: 'Dummy' }] }, productOrService: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/data-absent-reason', code: 'not-applicable', display: 'Not Applicable' }] }, servicedDate: '2019-11-02' }],
      adjudication: [
        { category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudicationDiscriminator', code: 'benefitpaymentstatus' }] }, reason: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBPayerAdjudicationStatus', code: 'innetwork' }] } },
        { category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudicationDiscriminator', code: 'billingnetworkstatus' }] }, reason: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBPayerAdjudicationStatus', code: 'innetwork' }] } }
      ]
    },

    'http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-ExplanationOfBenefit-Outpatient-Institutional': {
      resourceType: 'ExplanationOfBenefit',
      id: 'BB-EOBOutpatient1-nonfinancial',
      meta: { lastUpdated: '2019-12-12T09:14:11+00:00', profile: ['http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-ExplanationOfBenefit-Outpatient-Institutional-Basis'] },
      language: 'en-US',
      identifier: [{ type: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBIdentifierType', code: 'uc' }] }, system: 'https://www.xxxplan.com/fhir/EOBIdentifier', value: 'AW123412341234123412341234123412' }],
      status: 'active',
      type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/claim-type', code: 'institutional' }], text: 'Institutional' },
      subType: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBInstitutionalClaimSubType', code: 'outpatient' }], text: 'Outpatient' },
      use: 'claim',
      patient: { reference: 'Patient/Patient2' },
      billablePeriod: { start: '2019-01-01', end: '2019-10-31' },
      created: '2019-11-02T00:00:00+00:00',
      insurer: { reference: 'Organization/Payer1', display: 'Organization Payer 1' },
      provider: { reference: 'Organization/ProviderOrganization1', display: 'Orange Medical Group' },
      outcome: 'partial',
      careTeam: [{ sequence: 1, provider: { reference: 'Organization/ProviderOrganization1' }, role: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBClaimCareTeamRole', code: 'rendering', display: 'Rendering provider' }] }, qualification: { coding: [{ system: 'http://nucc.org/provider-taxonomy', code: '364SX0200X', display: 'Oncology Clinical Nurse Specialist' }] } }],
      supportingInfo: [
        { sequence: 2, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'clmrecvddate' }] }, timingDate: '2019-11-30' },
        { sequence: 3, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'typeofbill' }] }, code: { coding: [{ system: 'https://www.nubc.org/CodeSystem/TypeOfBill', code: 'Dummy' }] } },
        { sequence: 4, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'pointoforigin' }] }, code: { coding: [{ system: 'https://www.nubc.org/CodeSystem/PointOfOrigin', code: 'Dummy' }] } },
        { sequence: 5, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'admtype' }] }, code: { coding: [{ system: 'https://www.nubc.org/CodeSystem/PriorityTypeOfAdmitOrVisit', code: 'Dummy' }] } },
        { sequence: 6, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'discharge-status' }] }, code: { coding: [{ system: 'https://www.nubc.org/CodeSystem/PatDischargeStatus', code: 'Dummy' }] } },
        { sequence: 7, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'medicalrecordnumber' }] }, valueString: '1234-234-1243-12345678901m' },
        { sequence: 8, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'patientaccountnumber' }] }, valueString: '1234-234-1243-12345678901a' }
      ],
      diagnosis: [{ sequence: 1, diagnosisCodeableConcept: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'S06.0X1A' }] }, type: [{ coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBClaimDiagnosisType', code: 'patientreasonforvisit' }] }] }],
      insurance: [{ focal: true, coverage: { reference: 'Coverage/Coverage3' } }],
      item: [{ sequence: 1, revenue: { coding: [{ system: 'https://www.nubc.org/CodeSystem/RevenueCodes', code: 'Dummy' }] }, productOrService: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/data-absent-reason', code: 'not-applicable', display: 'Not Applicable' }] }, servicedDate: '2019-11-02' }],
      adjudication: [
        { category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudicationDiscriminator', code: 'benefitpaymentstatus' }] }, reason: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBPayerAdjudicationStatus', code: 'innetwork' }] } },
        { category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudicationDiscriminator', code: 'billingnetworkstatus' }] }, reason: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBPayerAdjudicationStatus', code: 'innetwork' }] } }
      ]
    },

    'http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-ExplanationOfBenefit-Pharmacy': {
      resourceType: 'ExplanationOfBenefit',
      id: 'BB-EOBPharmacy1-nonfinancial',
      meta: { lastUpdated: '2019-12-12T09:14:11+00:00', profile: ['http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-ExplanationOfBenefit-Pharmacy-Basis'] },
      language: 'en-US',
      identifier: [{ type: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBIdentifierType', code: 'uc' }] }, system: 'https://www.xxxplan.com/fhir/EOBIdentifier', value: 'AW123412341234123412341234123412' }],
      status: 'active',
      type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/claim-type', code: 'pharmacy' }], text: 'Pharmacy' },
      use: 'claim',
      patient: { reference: 'Patient/Patient2' },
      billablePeriod: { start: '2019-10-30', end: '2019-10-31' },
      created: '2019-07-02T00:00:00+00:00',
      insurer: { reference: 'Organization/Payer1', display: 'XXX Health Plan' },
      provider: { reference: 'Organization/ProviderOrganization1', display: 'XXX Health Plan' },
      outcome: 'partial',
      supportingInfo: [
        { sequence: 2, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'brandgenericindicator' }] }, code: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/NCPDPBrandGenericIndicator', code: '2' }] } },
        { sequence: 3, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'rxorigincode' }] }, code: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/NCPDPPrescriptionOriginCode', code: '1' }] } },
        { sequence: 4, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'refillnum' }] }, valueQuantity: { value: 0 } },
        { sequence: 5, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'refillsauthorized' }] }, valueQuantity: { value: 0 } },
        { sequence: 6, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'dawcode' }] }, code: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/NCPDPDispensedAsWrittenOrProductSelectionCode', code: '7' }] } },
        { sequence: 7, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'clmrecvddate' }] }, timingDate: '2019-10-31' },
        { sequence: 8, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'dayssupply' }] }, valueQuantity: { value: 30 } },
        { sequence: 9, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'compoundcode' }] }, code: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/NCPDPCompoundCode', code: 'Dummy' }] } }
      ],
      insurance: [{ focal: true, coverage: { reference: 'Coverage/Coverage3' } }],
      item: [{ sequence: 1, productOrService: { coding: [{ system: 'http://hl7.org/fhir/sid/ndc', code: '0777-3105-02', display: 'Prozac, 100 CAPSULE in 1 BOTTLE (0777-3105-02) (package)' }] }, servicedDate: '2019-07-02' }],
      adjudication: [
        { category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudicationDiscriminator', code: 'benefitpaymentstatus' }] }, reason: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBPayerAdjudicationStatus', code: 'innetwork' }] } },
        { category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudicationDiscriminator', code: 'billingnetworkstatus' }] }, reason: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBPayerAdjudicationStatus', code: 'innetwork' }] } }
      ]
    },

    'http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-ExplanationOfBenefit-Professional-NonClinician': {
      resourceType: 'ExplanationOfBenefit',
      id: 'BB-EOBProfessional1-nonfinancial',
      meta: { lastUpdated: '2019-12-12T09:14:11+00:00', profile: ['http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-ExplanationOfBenefit-Professional-NonClinician-Basis'] },
      language: 'en-US',
      identifier: [{ type: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBIdentifierType', code: 'uc' }] }, system: 'https://www.xxxplan.com/fhir/EOBIdentifier', value: 'AW123412341234123412341234123413' }],
      status: 'active',
      type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/claim-type', code: 'professional' }], text: 'Professional' },
      use: 'claim',
      patient: { reference: 'Patient/Patient2' },
      billablePeriod: { start: '2019-01-01', end: '2019-10-31' },
      created: '2019-07-02T00:00:00+00:00',
      insurer: { reference: 'Organization/Payer1', display: 'XXX Health Plan' },
      provider: { reference: 'Organization/ProviderOrganization1', display: 'XXX Health Plan' },
      outcome: 'partial',
      supportingInfo: [
        { sequence: 3, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'clmrecvddate' }] }, timingDate: '2011-05-30' },
        { sequence: 4, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'servicefacility' }] }, valueReference: { reference: 'Organization/ProviderOrganization1' } },
        { sequence: 5, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'medicalrecordnumber' }] }, valueString: '1234-234-1243-12345678901m' },
        { sequence: 6, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'patientaccountnumber' }] }, valueString: '1234-234-1243-12345678901a' }
      ],
      diagnosis: [{ sequence: 1, diagnosisCodeableConcept: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'S06.0X1A' }] }, type: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/ex-diagnosistype', code: 'principal' }] }] }],
      insurance: [{ focal: true, coverage: { reference: 'Coverage/Coverage3' } }],
      item: [{
        sequence: 1,
        productOrService: { coding: [{ system: 'http://www.ama-assn.org/go/cpt', code: '97110', display: 'Therapeutic procedure, 1 or more areas, each 15 minutes; therapeutic exercises to develop strength and endurance, range of motion and flexibility' }] },
        servicedDate: '2019-07-02',
        locationCodeableConcept: { coding: [{ system: 'https://www.cms.gov/Medicare/Coding/place-of-service-codes/Place_of_Service_Code_Set', code: '11', display: 'Office' }] },
        adjudication: [{ category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudicationDiscriminator', code: 'benefitpaymentstatus' }] }, reason: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBPayerAdjudicationStatus', code: 'other' }] } }]
      }],
      adjudication: [
        { category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudicationDiscriminator', code: 'billingnetworkstatus' }] }, reason: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBPayerAdjudicationStatus', code: 'innetwork' }] } },
        { category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudicationDiscriminator', code: 'renderingnetworkstatus' }] }, reason: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBPayerAdjudicationStatus', code: 'innetwork' }] } }
      ]
    },

    'http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-ExplanationOfBenefit-Oral': {
      resourceType: 'ExplanationOfBenefit',
      id: 'BB-EOBOral1-nonfinancial',
      meta: { lastUpdated: '2021-03-18T10:23:00-05:00', profile: ['http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-ExplanationOfBenefit-Oral-Basis'] },
      language: 'en-US',
      identifier: [{ type: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBIdentifierType', code: 'uc' }] }, system: 'https://www.xxxplan.com/fhir/EOBIdentifier', value: '210300002' }],
      status: 'active',
      type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/claim-type', code: 'oral' }], text: 'Oral' },
      use: 'claim',
      patient: { reference: 'Patient/Patient2' },
      billablePeriod: { start: '2021-03-01', end: '2021-03-31' },
      created: '2021-03-18T10:23:00-05:00',
      insurer: { reference: 'Organization/DentalPayer1', display: 'XXX Health Plan' },
      provider: { reference: 'Practitioner/PractitionerDentalProvider1', display: 'XXX Dental Plan' },
      outcome: 'complete',
      supportingInfo: [
        { sequence: 3, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'clmrecvddate' }] }, timingDate: '2021-03-18' },
        { sequence: 4, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'servicefacility' }] }, valueReference: { reference: 'Organization/ProviderOrganization1' } },
        { sequence: 5, category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType', code: 'patientaccountnumber' }] }, valueString: 'PATIENTACCTNO3' }
      ],
      diagnosis: [{ sequence: 1, diagnosisCodeableConcept: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'Z01.21', display: 'Encounter for dental examination and cleaning with abnormal findings' }] }, type: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/ex-diagnosistype', code: 'principal' }] }] }],
      insurance: [{ focal: true, coverage: { reference: 'Coverage/CoverageDental1' } }],
      item: [
        {
          sequence: 1,
          productOrService: { coding: [{ system: 'http://www.ada.org/cdt', code: 'D1110', display: 'Prophylaxis - Adult' }] },
          servicedDate: '2021-03-18',
          locationCodeableConcept: { coding: [{ system: 'https://www.cms.gov/Medicare/Coding/place-of-service-codes/Place_of_Service_Code_Set', code: '11', display: 'Office' }] },
          adjudication: [{ category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudicationDiscriminator', code: 'benefitpaymentstatus' }] }, reason: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBPayerAdjudicationStatus', code: 'innetwork' }] } }]
        },
        {
          sequence: 2,
          productOrService: { coding: [{ system: 'http://www.ada.org/cdt', code: 'D0120', display: 'Periodic oral evaluation' }] },
          servicedDate: '2021-03-18',
          locationCodeableConcept: { coding: [{ system: 'https://www.cms.gov/Medicare/Coding/place-of-service-codes/Place_of_Service_Code_Set', code: '11', display: 'Office' }] },
          adjudication: [{ category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudicationDiscriminator', code: 'benefitpaymentstatus' }] }, reason: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBPayerAdjudicationStatus', code: 'innetwork' }] } }]
        }
      ],
      adjudication: [
        { category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudicationDiscriminator', code: 'renderingnetworkstatus' }] }, reason: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBPayerAdjudicationStatus', code: 'innetwork' }] } },
        { category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudicationDiscriminator', code: 'benefitpaymentstatus' }] }, reason: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBPayerAdjudicationStatus', code: 'innetwork' }] } },
        { category: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudicationDiscriminator', code: 'billingnetworkstatus' }] }, reason: { coding: [{ system: 'http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBPayerAdjudicationStatus', code: 'innetwork' }] } }
      ]
    }
  };

  /**
   * Verbatim-style, official FHIR R4 (v4.0.1) base-spec example resources -
   * i.e. no IG/profile declared - covering the resource types enumerated on
   * HL7's own R4 Resource Index (https://hl7.org/fhir/R4/resourcelist.html)
   * that this validator has a curated schema for (see RESOURCE_DEFS in
   * resources.js). These are the same well-known instances HL7 publishes on
   * each resource's own "-examples" page (e.g. Patient-example "Peter
   * Chalmers", Encounter-example, Condition-example, etc.), reproduced here
   * (clinical/structural content unchanged; some rarely-populated fields
   * trimmed for brevity) so the generator can offer a real, spec-accurate
   * instance instead of only a randomized one when no US Core/CARIN BB/Da
   * Vinci PDex profile is selected.
   *
   * Keyed by resourceType (not by profile URL, since none of these declare
   * a meta.profile) and looked up via getBaseRealExample().
   */
  const BASE_REAL_EXAMPLES = {
    Patient: {
      resourceType: 'Patient',
      id: 'example',
      identifier: [{
        use: 'usual',
        type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'MR' }] },
        system: 'urn:oid:1.2.36.146.595.217.0.1',
        value: '12345',
        period: { start: '2001-05-06' },
        assigner: { display: 'Acme Healthcare' }
      }],
      active: true,
      name: [
        { use: 'official', family: 'Chalmers', given: ['Peter', 'James'] },
        { use: 'usual', given: ['Jim'] },
        { use: 'maiden', family: 'Windsor', given: ['Peter', 'James'], period: { end: '2002' } }
      ],
      telecom: [
        { system: 'phone', value: '(03) 5555 6473', use: 'work', rank: 1 },
        { system: 'phone', value: '(03) 5555 6675', use: 'mobile', rank: 2 }
      ],
      gender: 'male',
      birthDate: '1974-12-25',
      deceasedBoolean: false,
      address: [{ use: 'home', line: ['534 Erewhon St'], city: 'PleasantVille', district: 'Rainbow', state: 'Vic', postalCode: '3999', period: { start: '1974-12-25' } }],
      contact: [{
        relationship: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0131', code: 'N' }] }],
        name: { family: 'du Marché', given: ['Bénédicte'] },
        telecom: [{ system: 'phone', value: '+33 (237) 998327' }],
        gender: 'female',
        period: { start: '2012' }
      }],
      managingOrganization: { reference: 'Organization/f001' }
    },
    Practitioner: {
      resourceType: 'Practitioner',
      id: 'example',
      identifier: [{ system: 'http://www.acme.org/practitioners', value: '23' }],
      active: true,
      name: [{ family: 'Careful', given: ['Adam'], prefix: ['Dr'] }],
      address: [{ use: 'home', line: ['534 Erewhon St'], city: 'PleasantVille', state: 'Vic', postalCode: '3999' }],
      gender: 'male',
      birthDate: '1970-01-01'
    },
    PractitionerRole: {
      resourceType: 'PractitionerRole',
      id: 'example',
      active: true,
      period: { start: '2012-01-01', end: '2012-03-31' },
      practitioner: { reference: 'Practitioner/example', display: 'Dr Adam Careful' },
      organization: { reference: 'Organization/f001', display: 'Burgers University Medical Center' },
      code: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/practitioner-role', code: 'doctor' }] }],
      specialty: [{ coding: [{ system: 'http://snomed.info/sct', code: '408443003', display: 'General medical practice' }] }],
      location: [{ reference: 'Location/1', display: 'South Wing, second floor' }],
      telecom: [{ system: 'phone', value: '(03) 5555 6473', use: 'work' }],
      availableTime: [{ daysOfWeek: ['mon', 'tue', 'wed'], availableStartTime: '09:00:00', availableEndTime: '16:30:00' }],
      notAvailable: [{ description: 'Adam will be on extended leave during May 2017', during: { start: '2017-05-01', end: '2017-05-20' } }]
    },
    Organization: {
      resourceType: 'Organization',
      id: 'f001',
      identifier: [{ system: 'urn:oid:2.16.528.1', value: '91654' }],
      active: true,
      type: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/organization-type', code: 'prov', display: 'Healthcare Provider' }] }],
      name: 'Burgers University Medical Center',
      telecom: [{ system: 'phone', value: '022-655 2300', use: 'work' }],
      address: [{ line: ['Galapagosweg 91'], city: 'Den Burg', postalCode: '9105 PZ', country: 'NLD' }]
    },
    Location: {
      resourceType: 'Location',
      id: '1',
      status: 'active',
      name: 'South Wing, second floor',
      alias: ['BU MC, SW, F2'],
      description: 'Second floor of the Old South Wing, formerly in use by Psychiatry',
      mode: 'instance',
      type: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode', code: 'HOSP' }] }],
      telecom: [{ system: 'phone', value: '2328', use: 'work' }],
      address: { line: ['Galapagosweg 91, building A'], city: 'Den Burg', postalCode: '9105 PZ', country: 'NLD' },
      physicalType: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/location-physical-type', code: 'wi', display: 'Wing' }] },
      managingOrganization: { reference: 'Organization/f001' }
    },
    Encounter: {
      resourceType: 'Encounter',
      id: 'example',
      status: 'in-progress',
      class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'IMP', display: 'inpatient encounter' },
      type: [{ coding: [{ system: 'http://snomed.info/sct', code: '270427003', display: 'Patient-initiated encounter' }] }],
      subject: { reference: 'Patient/example', display: 'Peter James Chalmers' },
      participant: [{
        type: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType', code: 'PPRF' }] }],
        individual: { reference: 'Practitioner/example', display: 'Dr Adam Careful' }
      }],
      period: { start: '2015-01-17T16:00:00+10:00' },
      reasonCode: [{ text: 'The patient seems to suffer from disturbing dreams' }],
      hospitalization: { admitSource: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/admit-source', code: 'gp' }] } },
      location: [{ location: { display: 'Emergency Waiting Room' }, status: 'active' }],
      serviceProvider: { reference: 'Organization/f001' }
    },
    Observation: {
      resourceType: 'Observation',
      id: 'example',
      status: 'final',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs', display: 'Vital Signs' }] }],
      code: { coding: [{ system: 'http://loinc.org', code: '29463-7', display: 'Body Weight' }], text: 'Body Weight' },
      subject: { reference: 'Patient/example' },
      encounter: { reference: 'Encounter/example' },
      effectiveDateTime: '2016-03-28',
      performer: [{ reference: 'Practitioner/example' }],
      valueQuantity: { value: 185, unit: 'lbs', system: 'http://unitsofmeasure.org', code: '[lb_av]' }
    },
    Condition: {
      resourceType: 'Condition',
      id: 'example',
      clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
      verificationStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'confirmed' }] },
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-category', code: 'problem-list-item', display: 'Problem List Item' }] }],
      severity: { coding: [{ system: 'http://snomed.info/sct', code: '255604002', display: 'Mild' }] },
      code: { coding: [{ system: 'http://snomed.info/sct', code: '386661006', display: 'Fever' }], text: 'Fever' },
      subject: { reference: 'Patient/example' },
      encounter: { reference: 'Encounter/example' },
      onsetDateTime: '2013-04-02',
      recordedDate: '2013-04-04',
      recorder: { reference: 'Practitioner/example' }
    },
    AllergyIntolerance: {
      resourceType: 'AllergyIntolerance',
      id: 'example',
      clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical', code: 'active' }] },
      verificationStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification', code: 'confirmed' }] },
      type: 'allergy',
      category: ['food'],
      criticality: 'high',
      code: { coding: [{ system: 'http://snomed.info/sct', code: '227493005', display: 'Cashew nuts' }] },
      patient: { reference: 'Patient/example' },
      onsetDateTime: '2004',
      reaction: [{
        manifestation: [{ coding: [{ system: 'http://snomed.info/sct', code: '39579001', display: 'Anaphylactic reaction' }] }],
        severity: 'severe'
      }]
    },
    Procedure: {
      resourceType: 'Procedure',
      id: 'example',
      status: 'completed',
      category: { coding: [{ system: 'http://snomed.info/sct', code: '387713003', display: 'Surgical procedure' }] },
      code: { coding: [{ system: 'http://snomed.info/sct', code: '80146002', display: 'Appendectomy' }], text: 'Appendectomy' },
      subject: { reference: 'Patient/example' },
      encounter: { reference: 'Encounter/example' },
      performedDateTime: '2013-04-05',
      performer: [{ actor: { reference: 'Practitioner/example', display: 'Dr Adam Careful' } }],
      reasonCode: [{ text: 'Generalized abdominal pain 24 hours. Localized in RIF with rebound and guarding' }],
      followUp: [{ text: 'ROS 5 days' }]
    },
    Immunization: {
      resourceType: 'Immunization',
      id: 'example',
      status: 'completed',
      vaccineCode: { coding: [{ system: 'urn:oid:1.2.36.1.2001.1005.17', code: 'FLUVAX' }], text: 'Fluvax (Influenza)' },
      patient: { reference: 'Patient/example' },
      encounter: { reference: 'Encounter/example' },
      occurrenceDateTime: '2013-01-10',
      primarySource: true,
      location: { reference: 'Location/1' },
      lotNumber: 'AAJN11K',
      site: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ActSite', code: 'LA', display: 'left arm' }] },
      route: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-RouteOfAdministration', code: 'IM', display: 'Injection, intramuscular' }] },
      doseQuantity: { value: 5, unit: 'mg' },
      performer: [{ function: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0443', code: 'AP' }] }, actor: { reference: 'Practitioner/example' } }]
    },
    Medication: {
      resourceType: 'Medication',
      id: 'med0301',
      code: { coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '324252', display: 'Nystatin 100000 U/mL Oral Suspension' }] },
      status: 'active',
      form: { coding: [{ system: 'http://snomed.info/sct', code: '385023001', display: 'Oral suspension' }] },
      ingredient: [{
        isActive: true,
        strength: {
          numerator: { value: 100000, system: 'http://unitsofmeasure.org', code: 'U' },
          denominator: { value: 1, system: 'http://unitsofmeasure.org', code: 'mL' }
        }
      }],
      batch: { lotNumber: '9494788', expirationDate: '2017-05-22T00:00:00Z' }
    },
    MedicationRequest: {
      resourceType: 'MedicationRequest',
      id: 'medrx0311',
      status: 'active',
      intent: 'order',
      medicationCodeableConcept: { coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '324252', display: 'Nystatin 100000 U/mL Oral Suspension' }], text: 'Nystatin 100000 U/mL Oral Suspension' },
      subject: { reference: 'Patient/example' },
      encounter: { reference: 'Encounter/example' },
      authoredOn: '2015-02-19',
      requester: { reference: 'Practitioner/example', display: 'Dr Adam Careful' },
      reasonCode: [{ text: 'Oral candidiasis' }],
      dosageInstruction: [{
        text: 'Rinse mouth with 5 mL, four times daily',
        route: { coding: [{ system: 'http://snomed.info/sct', code: '26643006', display: 'Oral route' }] }
      }]
    },
    DiagnosticReport: {
      resourceType: 'DiagnosticReport',
      id: 'f001',
      identifier: [{ system: 'http://www.bmc.nl/zorgportal/identifiers/reports', value: 'nr1239044' }],
      status: 'final',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0074', code: 'HM', display: 'Hematology' }] }],
      code: { coding: [{ system: 'http://loinc.org', code: '58410-2', display: 'Complete blood count (hemogram) panel' }], text: 'Complete Blood Count' },
      subject: { reference: 'Patient/example' },
      encounter: { reference: 'Encounter/example' },
      effectiveDateTime: '2013-05-15T10:31:00+01:00',
      issued: '2013-05-15T10:31:00+01:00',
      performer: [{ reference: 'Organization/f001', display: 'Burgers University Medical Center' }],
      result: [{ reference: 'Observation/example' }],
      conclusion: 'No abnormalities found.'
    },
    ServiceRequest: {
      resourceType: 'ServiceRequest',
      id: 'physiotherapy',
      status: 'completed',
      intent: 'order',
      code: { coding: [{ system: 'http://snomed.info/sct', code: '386053000', display: 'Evaluation procedure' }], text: 'Physiotherapy assessment' },
      subject: { reference: 'Patient/example' },
      encounter: { reference: 'Encounter/example' },
      occurrencePeriod: { start: '2016-09-27' },
      authoredOn: '2016-09-20',
      requester: { reference: 'Practitioner/example' },
      performerType: { coding: [{ system: 'http://snomed.info/sct', code: '36682004', display: 'Physiotherapist' }] },
      reasonCode: [{ text: 'assessment of mobility limitation' }]
    },
    CarePlan: {
      resourceType: 'CarePlan',
      id: 'example',
      status: 'active',
      intent: 'plan',
      category: [{ coding: [{ system: 'http://snomed.info/sct', code: '734163000' }], text: 'Weight management plan' }],
      title: 'Weight Loss Plan',
      description: 'Manage weight for patient',
      subject: { reference: 'Patient/example' },
      encounter: { reference: 'Encounter/example' },
      period: { start: '2016-01-01' },
      created: '2016-01-01',
      author: { reference: 'Practitioner/example' },
      careTeam: [{ reference: 'CareTeam/example' }],
      addresses: [{ reference: 'Condition/example' }],
      activity: [{ detail: { kind: 'ServiceRequest', code: { text: 'Dietary consultation' }, status: 'scheduled' } }]
    },
    CareTeam: {
      resourceType: 'CareTeam',
      id: 'example',
      status: 'active',
      category: [{ coding: [{ system: 'http://loinc.org', code: 'LA27976-2', display: 'Encounter-focused care team' }] }],
      name: 'Peter James Chalmers Care Plan Care Team',
      subject: { reference: 'Patient/example' },
      encounter: { reference: 'Encounter/example' },
      period: { start: '2016-01-01' },
      participant: [{ role: [{ coding: [{ system: 'http://snomed.info/sct', code: '17561000', display: 'Cardiologist' }] }], member: { reference: 'Practitioner/example' } }],
      managingOrganization: [{ reference: 'Organization/f001' }]
    },
    Composition: {
      resourceType: 'Composition',
      id: 'example',
      status: 'final',
      type: { coding: [{ system: 'http://loinc.org', code: '11488-4', display: 'Consultation note' }] },
      category: [{ coding: [{ system: 'http://loinc.org', code: 'LP173421-1', display: 'Report' }] }],
      subject: { reference: 'Patient/example' },
      encounter: { reference: 'Encounter/example' },
      date: '2013-02-01T12:00:00-08:00',
      author: [{ reference: 'Practitioner/example', display: 'Dr Adam Careful' }],
      title: 'Consultation Note',
      confidentiality: 'N',
      custodian: { reference: 'Organization/f001' },
      section: [{
        title: 'History of present illness',
        code: { coding: [{ system: 'http://loinc.org', code: '10164-2' }] },
        text: { status: 'generated', div: '<div xmlns="http://www.w3.org/1999/xhtml">Patient presents with a history of intermittent fever.</div>' }
      }]
    },
    Provenance: {
      resourceType: 'Provenance',
      id: 'example',
      target: [{ reference: 'Patient/example' }],
      occurredPeriod: { start: '2015-06-27', end: '2015-06-28' },
      recorded: '2015-06-27T08:39:24+10:00',
      policy: ['http://acme.com/fhir/Consent/25'],
      location: { reference: 'Location/1' },
      activity: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-DataOperation', code: 'UPDATE' }] },
      agent: [{ type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/provenance-participant-type', code: 'author' }] }, who: { reference: 'Practitioner/example' } }],
      entity: [{ role: 'source', what: { reference: 'DocumentReference/example' } }]
    },
    RelatedPerson: {
      resourceType: 'RelatedPerson',
      id: 'peter',
      identifier: [{ system: 'urn:oid:1.2.36.146.595.217.0.1', value: '12345' }],
      active: true,
      patient: { reference: 'Patient/example' },
      relationship: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0131', code: 'C', display: 'Emergency Contact' }] }],
      name: [{ family: 'Chalmers', given: ['Peter', 'James'] }],
      telecom: [{ system: 'phone', value: '(03) 5555 6473', use: 'work' }],
      gender: 'male',
      birthDate: '1974-12-25',
      address: [{ line: ['534 Erewhon St'], city: 'PleasantVille', state: 'Vic', postalCode: '3999' }],
      period: { start: '2012-03-11' }
    },
    Coverage: {
      resourceType: 'Coverage',
      id: '9876B1',
      identifier: [{ system: 'http://benefitsinc.com/certificate', value: '12345' }],
      status: 'active',
      type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'EHCPOL', display: 'extended healthcare' }] },
      policyHolder: { reference: 'Patient/example' },
      subscriber: { reference: 'Patient/example' },
      subscriberId: 'AB98761',
      beneficiary: { reference: 'Patient/example' },
      relationship: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/subscriber-relationship', code: 'self' }] },
      period: { start: '2011-05-23', end: '2012-05-23' },
      payor: [{ reference: 'Organization/f001', display: 'Benefits Inc' }],
      class: [{ type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/coverage-class', code: 'group' }] }, value: 'CBI35' }]
    },
    ExplanationOfBenefit: {
      resourceType: 'ExplanationOfBenefit',
      id: 'EB3500',
      identifier: [{ system: 'http://www.benefitsinc.com/fhir/explanationofbenefit', value: '987654321' }],
      status: 'active',
      type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/claim-type', code: 'oral' }] },
      use: 'claim',
      patient: { reference: 'Patient/example' },
      billablePeriod: { start: '2014-01-01', end: '2014-01-01' },
      created: '2014-08-16',
      insurer: { reference: 'Organization/f001' },
      provider: { reference: 'Organization/f001' },
      outcome: 'complete',
      insurance: [{ focal: true, coverage: { reference: 'Coverage/9876B1' } }],
      item: [{
        sequence: 1,
        productOrService: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/ex-USCLS', code: '1200', display: 'Radiograph, bytewing' }] },
        servicedDate: '2014-01-01',
        unitPrice: { value: 135.57, currency: 'USD' },
        net: { value: 135.57, currency: 'USD' }
      }]
    },
    Consent: {
      resourceType: 'Consent',
      id: 'consent-example-basic',
      status: 'active',
      scope: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/consentscope', code: 'patient-privacy' }] },
      category: [{ coding: [{ system: 'http://loinc.org', code: '59284-0', display: 'Patient Consent' }] }],
      patient: { reference: 'Patient/example' },
      dateTime: '2016-05-11T17:19:00-04:00',
      performer: [{ reference: 'Patient/example' }],
      organization: [{ reference: 'Organization/f001' }],
      policy: [{ authority: 'urn:iso:std:iso:3166', uri: 'http://example.org/privacy-policy' }],
      provision: { type: 'permit', period: { start: '2016-05-11', end: '2017-05-11' } }
    },
    Bundle: {
      resourceType: 'Bundle',
      id: 'bundle-example',
      type: 'collection',
      entry: [{
        fullUrl: 'urn:uuid:61ebe359-bfdc-4613-8bf2-c5e300945f0a',
        resource: {
          resourceType: 'Composition',
          id: 'composition-example',
          status: 'final',
          type: { coding: [{ system: 'http://loinc.org', code: '11488-4', display: 'Consultation note' }] },
          date: '2013-02-01T12:00:00-08:00',
          author: [{ reference: 'Practitioner/example' }],
          title: 'Consultation Note'
        }
      }]
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

  // Looks up a verbatim, no-profile FHIR R4 base-spec example for a resource
  // type (see BASE_REAL_EXAMPLES above). Returns null if none is curated yet.
  function getBaseRealExample(resourceType) {
    const found = BASE_REAL_EXAMPLES[resourceType];
    return found ? deepClone(found) : null;
  }

  const api = { REAL_EXAMPLES, getRealExample, BASE_REAL_EXAMPLES, getBaseRealExample };
  if (isNode) {
    module.exports = api;
  } else if (typeof window !== 'undefined') {
    window.REAL_EXAMPLES = REAL_EXAMPLES;
    window.getRealExample = getRealExample;
    window.BASE_REAL_EXAMPLES = BASE_REAL_EXAMPLES;
    window.getBaseRealExample = getBaseRealExample;
  }
})(typeof window !== 'undefined' ? window : globalThis);
