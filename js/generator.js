/**
 * Generates random, structurally-valid FHIR R4 JSON resources from the same
 * schema the validator checks against (RESOURCE_DEFS / COMPLEX_TYPES /
 * PROFILE_DEFS). Meant for quickly producing test data to try the validator
 * with - the codes/names/addresses used are illustrative placeholders, not
 * real terminology, and shouldn't be treated as clinically meaningful.
 *
 * Everything here runs locally; no network calls.
 */
(function (global) {
  const isNode = typeof module !== 'undefined' && module.exports;
  const { COMPLEX_TYPES } = isNode ? require('./complexTypes.js') : global;
  const { BASE_RESOURCE_ELEMENTS, BASE_DOMAIN_ELEMENTS, RESOURCE_DEFS } = isNode ? require('./resources.js') : global;
  const { PROFILE_DEFS } = isNode ? require('./profiles.js') : global;

  // ---- Illustrative data pools ----
  const FIRST_NAMES = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Priya', 'Wei', 'Fatima', 'Carlos'];
  const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Lopez', 'Wilson', 'Anderson', 'Taylor', 'Moore', 'Patel', 'Chen', 'Khan'];
  const CITIES = ['Springfield', 'Rivertown', 'Fairview', 'Oakdale', 'Maple Grove', 'Lakeview', 'Hillcrest', 'Greenville', 'Riverside', 'Clinton'];
  const STATES = ['CA', 'NY', 'TX', 'FL', 'WA', 'IL', 'OH', 'GA', 'NC', 'MI'];
  const STREETS = ['Main St', 'Oak Ave', 'Maple Dr', 'Elm St', 'Park Blvd', 'Cedar Ln', 'Washington St', 'Lincoln Ave', 'Sunset Blvd', 'River Rd'];
  const ORG_NAMES = ['General Hospital', 'Community Health Clinic', 'Regional Medical Center', 'Family Practice Associates', 'Riverside Medical Center', 'County Health Department', 'Metro Urgent Care', 'Valley Health Partners'];
  const VITAL_SIGNS = [
    { code: '8310-5', display: 'Body temperature', unit: 'degF' },
    { code: '8302-2', display: 'Body height', unit: 'cm' },
    { code: '29463-7', display: 'Body weight', unit: 'kg' },
    { code: '8480-6', display: 'Systolic blood pressure', unit: 'mm[Hg]' },
    { code: '8867-4', display: 'Heart rate', unit: '/min' },
    { code: '9279-1', display: 'Respiratory rate', unit: '/min' }
  ];
  const LAB_OBSERVATIONS = [
    { code: '2345-7', display: 'Glucose [Mass/volume] in Serum or Plasma', unit: 'mg/dL' },
    { code: '2160-0', display: 'Creatinine [Mass/volume] in Serum or Plasma', unit: 'mg/dL' },
    { code: '718-7', display: 'Hemoglobin [Mass/volume] in Blood', unit: 'g/dL' },
    { code: '4548-4', display: 'Hemoglobin A1c/Hemoglobin.total in Blood', unit: '%' }
  ];
  const CONDITION_CODES = [
    { code: '38341003', display: 'Hypertension' },
    { code: '44054006', display: 'Type 2 diabetes mellitus' },
    { code: '195967001', display: 'Asthma' },
    { code: '13645005', display: 'Chronic obstructive lung disease' }
  ];
  const ALLERGEN_CODES = [
    { code: '227037002', display: 'Peanut' },
    { code: '764146007', display: 'Penicillin' },
    { code: '227493005', display: 'Shellfish' }
  ];
  const DRUG_CODES = [
    { code: '313782', display: 'Acetaminophen 325 MG Oral Tablet' },
    { code: '860975', display: 'Metformin 500 MG Oral Tablet' },
    { code: '197361', display: 'Lisinopril 10 MG Oral Tablet' }
  ];
  const PROCEDURE_CODES = [
    { code: '80146002', display: 'Appendectomy' },
    { code: '71388002', display: 'Procedure' },
    { code: '386637004', display: 'Obtain specimen' }
  ];

  // Per-resource-type overrides for the ambiguous "status"-style code fields,
  // keyed by `${resourceType}.${fieldName}`. Falls back to a generic pool below.
  const CODE_HINTS = {
    'Patient.gender': ['male', 'female', 'other', 'unknown'],
    'Patient.link.type': ['replaced-by', 'replaces', 'refer', 'seealso'],
    'Practitioner.gender': ['male', 'female', 'other', 'unknown'],
    'RelatedPerson.gender': ['male', 'female', 'other', 'unknown'],
    'Encounter.status': ['planned', 'arrived', 'in-progress', 'finished'],
    'Encounter.location.status': ['planned', 'active', 'completed'],
    'Observation.status': ['final', 'preliminary', 'registered'],
    'AllergyIntolerance.type': ['allergy', 'intolerance'],
    'AllergyIntolerance.category': ['food', 'medication', 'environment', 'biologic'],
    'AllergyIntolerance.criticality': ['low', 'high', 'unable-to-assess'],
    'AllergyIntolerance.reaction.severity': ['mild', 'moderate', 'severe'],
    'Procedure.status': ['completed', 'in-progress', 'preparation'],
    'Immunization.status': ['completed'],
    'Medication.status': ['active'],
    'MedicationRequest.status': ['active', 'completed', 'on-hold'],
    'MedicationRequest.intent': ['order', 'plan'],
    'MedicationRequest.priority': ['routine', 'urgent'],
    'DiagnosticReport.status': ['final', 'preliminary'],
    'ServiceRequest.status': ['active', 'completed'],
    'ServiceRequest.intent': ['order', 'plan'],
    'CarePlan.status': ['active', 'completed', 'draft'],
    'CarePlan.intent': ['plan', 'order'],
    'Composition.status': ['final', 'preliminary'],
    'Bundle.type': ['collection', 'document', 'searchset'],
    'Location.status': ['active'],
    'Location.mode': ['instance', 'kind'],
    'Coverage.status': ['active'],
    'ExplanationOfBenefit.status': ['active'],
    'ExplanationOfBenefit.use': ['claim'],
    'ExplanationOfBenefit.outcome': ['complete'],
    'Provenance.entity.role': ['source', 'derivation'],
    'Consent.provision.type': ['permit', 'deny'],
    'Consent.provision.data.meaning': ['author', 'subject', 'recipient', 'custodian'],
    'Encounter.class.code': ['AMB', 'EMER', 'IMP', 'ACUTE'],
    'Encounter.classHistory.class.code': ['AMB', 'EMER', 'IMP', 'ACUTE']
  };
  const GENERIC_CODE_FALLBACK = ['unspecified'];
  // Two-segment (parent-field.field) hints for fields whose valid values depend on
  // which parent element they sit in - e.g. "use" means something different (and has
  // a different valid value set) on HumanName vs. Address vs. ContactPoint vs.
  // Identifier. A single shared pool for all of them would (and did) produce values
  // invalid for at least one of them - e.g. "official" is not a valid Address.use.
  const TWO_SEGMENT_HINTS = {
    'address.use': ['home', 'work', 'temp', 'old', 'billing'],
    'address.type': ['postal', 'physical', 'both'],
    'name.use': ['usual', 'official', 'temp', 'nickname', 'old', 'maiden'],
    'telecom.use': ['home', 'work', 'temp', 'old', 'mobile'],
    'identifier.use': ['usual', 'official', 'temp', 'secondary', 'old']
  };
  // Fallback keyed by field name alone (not full path) - only for fields whose value
  // set is the same everywhere that field name appears in this schema (safe to genericize).
  const FIELD_NAME_HINTS = {
    system: ['phone', 'email'],
    comparator: ['<', '<=', '>=', '>'],
    status: ['active', 'final', 'completed'],
    contentType: ['image/jpeg', 'application/pdf', 'text/plain'],
    gender: ['male', 'female', 'other', 'unknown'],
    daysOfWeek: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  };

  function lastTwoSegments(contextKey) {
    const parts = (contextKey || '').split('.');
    return parts.length >= 2 ? parts.slice(-2).join('.') : '';
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function chance(p) { return Math.random() < p; }
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function randomId() { return 'example-' + Math.random().toString(36).slice(2, 8); }

  function randomDate() {
    const y = randInt(1945, 2024);
    const m = pad2(randInt(1, 12));
    const d = pad2(randInt(1, 28));
    return `${y}-${m}-${d}`;
  }
  function randomDateTime() {
    return `${randomDate()}T${pad2(randInt(0, 23))}:${pad2(randInt(0, 59))}:00Z`;
  }
  function randomUuid() {
    const hex = () => Math.floor(Math.random() * 16).toString(16);
    const seg = (n) => Array.from({ length: n }, hex).join('');
    return `${seg(8)}-${seg(4)}-${seg(4)}-${seg(4)}-${seg(12)}`;
  }

  function generatePrimitive(typeName, contextKey) {
    switch (typeName) {
      case 'boolean': return chance(0.5);
      case 'integer': return randInt(1, 50);
      case 'unsignedInt': return randInt(0, 50);
      case 'positiveInt': return randInt(1, 20);
      case 'decimal': return Number((Math.random() * 100).toFixed(1));
      case 'code': return pick(CODE_HINTS[contextKey] || TWO_SEGMENT_HINTS[lastTwoSegments(contextKey)] || FIELD_NAME_HINTS[fieldNameOf(contextKey)] || GENERIC_CODE_FALLBACK);
      case 'id': return randomId();
      case 'uri': case 'url': return 'http://example.org/' + randomId();
      case 'canonical': return 'http://example.org/StructureDefinition/' + randomId();
      case 'oid': return 'urn:oid:1.2.3.4.5.6.7.8';
      case 'uuid': return 'urn:uuid:' + randomUuid();
      case 'base64Binary': return 'U2FtcGxlRGF0YQ==';
      case 'instant': return randomDateTime();
      case 'date': return randomDate();
      case 'dateTime': return chance(0.5) ? randomDate() : randomDateTime();
      case 'time': return `${pad2(randInt(0, 23))}:${pad2(randInt(0, 59))}:00`;
      case 'xhtml': return '<div xmlns="http://www.w3.org/1999/xhtml">Generated example narrative.</div>';
      case 'markdown': return 'Example generated note text.';
      case 'string': default: return stringFor(contextKey);
    }
  }

  function fieldNameOf(contextKey) {
    return contextKey ? contextKey.split('.').pop() : '';
  }

  function stringFor(contextKey) {
    if (!contextKey) return 'Example text';
    const field = contextKey.split('.').pop();
    switch (field) {
      case 'family': return pick(LAST_NAMES);
      case 'given': return pick(FIRST_NAMES);
      case 'city': return pick(CITIES);
      case 'state': return pick(STATES);
      case 'postalCode': return String(randInt(10000, 99999));
      case 'line': return `${randInt(100, 9999)} ${pick(STREETS)}`;
      case 'name': return pick(ORG_NAMES);
      case 'value': return String(randInt(1000, 9999));
      case 'reference': return 'Patient/' + randomId();
      case 'title': return 'Example ' + contextKey.split('.')[0];
      default: return 'Example ' + field;
    }
  }

  // Builds an object from an element list, guaranteeing (when forceNonEmpty) that
  // the result is never `{}` - FHIR's ele-1 invariant requires every element to
  // have a value or children, so an empty object is actually invalid, not just
  // sparse. When forcing, a primitive-typed child is preferred so this can't
  // recurse into another complex type indefinitely.
  function buildFromElements(elements, contextKeyBase, resourceType, depth, forceNonEmpty) {
    const obj = {};
    for (const el of elements) {
      maybeAssign(obj, el, contextKeyBase + '.' + el.name, resourceType, true, depth);
    }
    if (forceNonEmpty && Object.keys(obj).length === 0 && elements.length) {
      const primitiveFirst = elements.filter((el) =>
        !el.choice && el.type !== 'BackboneElement' && el.type !== 'CodeableConcept' && !COMPLEX_TYPES[el.type]);
      const candidates = primitiveFirst.length ? primitiveFirst : elements;
      const chosen = pick(candidates);
      const forced = Object.assign({}, chosen, { min: 1 });
      maybeAssign(obj, forced, contextKeyBase + '.' + chosen.name, resourceType, true, depth);
    }
    return obj;
  }

  function generateComplex(typeName, contextKey, resourceType, depth) {
    if (typeName === 'CodeableConcept') {
      // Give a few well-known fields realistic coded content; otherwise generic text.
      if (/Condition\.code$/.test(contextKey)) return codedConcept(pick(CONDITION_CODES), 'http://snomed.info/sct');
      if (/AllergyIntolerance\.code$/.test(contextKey)) return codedConcept(pick(ALLERGEN_CODES), 'http://snomed.info/sct');
      if (/Procedure\.code$/.test(contextKey)) return codedConcept(pick(PROCEDURE_CODES), 'http://snomed.info/sct');
      if (/Observation\.code$/.test(contextKey)) return codedConcept(pick(LAB_OBSERVATIONS.concat(VITAL_SIGNS)), 'http://loinc.org');
      if (/medication[A-Za-z]*CodeableConcept$/.test(contextKey)) return codedConcept(pick(DRUG_CODES), 'http://www.nlm.nih.gov/research/umls/rxnorm');
      return { text: stringFor(contextKey) };
    }
    const def = COMPLEX_TYPES[typeName];
    if (!def) return {};
    return buildFromElements(def.elements, contextKey, resourceType, depth, true);
  }

  function codedConcept(item, system) {
    return { coding: [{ system, code: item.code, display: item.display }], text: item.display };
  }

  // Decides whether to include an element, generates its value, and assigns it.
  // `depth` caps how many nested complex-type levels deep we'll go for OPTIONAL
  // fields, so naturally recursive types (Reference -> Identifier -> assigner ->
  // Reference -> ...) can't nest indefinitely. Required fields are still generated
  // regardless of depth, to keep the resource structurally valid.
  function maybeAssign(obj, el, contextKey, resourceType, insideComplex, depth) {
    depth = depth || 0;
    const isRequired = el.min && el.min > 0;
    const includeProb = insideComplex ? 0.5 : 0.6;
    if (!isRequired && depth >= 3) return;
    if (!isRequired && !chance(includeProb)) return;
    // Keep generated output readable: skip low-signal generic fields unless required.
    const ALWAYS_SKIP_OPTIONAL = new Set(['modifierExtension', 'extension', 'implicitRules', 'contained', 'language', 'security', 'tag', 'profile']);
    if (!isRequired && ALWAYS_SKIP_OPTIONAL.has(el.name)) return;

    if (el.choice) {
      const c = pick(el.choice);
      const key = el.name + c.suffix;
      obj[key] = generateValueFor(c.type, contextKey + c.suffix, resourceType, depth + 1);
      return;
    }

    const isArray = el.max === '*';
    if (isArray) {
      const n = isRequired ? randInt(1, 2) : 1;
      const arr = [];
      for (let i = 0; i < n; i++) {
        const v = generateValueForElement(el, contextKey, resourceType, depth);
        if (v !== undefined && !isEmptyPlainObject(v)) arr.push(v);
      }
      if (arr.length) obj[el.name] = arr;
    } else {
      const v = generateValueForElement(el, contextKey, resourceType, depth);
      if (v !== undefined && !(isEmptyPlainObject(v) && !isRequired)) obj[el.name] = v;
    }
  }

  function isEmptyPlainObject(v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0;
  }

  function generateValueForElement(el, contextKey, resourceType, depth) {
    if (el.type === 'BackboneElement') {
      return buildFromElements(el.elements || [], contextKey, resourceType, depth + 1, true);
    }
    return generateValueFor(el.type, contextKey, resourceType, depth + 1);
  }

  function generateValueFor(typeName, contextKey, resourceType, depth) {
    if (typeName === 'Resource') return undefined; // contained resources are skipped by default
    const complex = COMPLEX_TYPES[typeName];
    if (complex || typeName === 'CodeableConcept') return generateComplex(typeName, contextKey, resourceType, depth);
    return generatePrimitive(typeName, contextKey);
  }

  function elementsForResource(resourceType) {
    const def = RESOURCE_DEFS[resourceType];
    let elements = BASE_RESOURCE_ELEMENTS.slice();
    const isDomainResource = !def || def.isDomainResource !== false;
    if (isDomainResource) elements = elements.concat(BASE_DOMAIN_ELEMENTS);
    if (def) elements = elements.concat(def.elements);
    return elements;
  }

  function findElement(elements, name) {
    return elements.find((el) => el.name === name) || null;
  }

  /**
   * Generate a random resource. options:
   *   profileUrl: canonical URL from PROFILE_DEFS to conform to (adds meta.profile
   *               and forces the profile's required/fixed/coded requirements)
   *   injectError: if true, deliberately breaks the result in one random way and
   *                returns a description of what was broken
   */
  function generateResource(resourceType, options) {
    options = options || {};
    const elements = elementsForResource(resourceType);
    const obj = { resourceType, id: randomId() };

    for (const el of elements) {
      if (el.name === 'id') continue; // already set
      maybeAssign(obj, el, `${resourceType}.${el.name}`, resourceType, false, 0);
    }

    let profile = null;
    if (options.profileUrl && PROFILE_DEFS && PROFILE_DEFS[options.profileUrl]) {
      profile = PROFILE_DEFS[options.profileUrl];
    }

    if (profile) {
      obj.meta = obj.meta || {};
      obj.meta.profile = [options.profileUrl];

      if (profile.requiredOverrides) {
        for (const req of profile.requiredOverrides) {
          const alreadyPresent = req.choice
            ? Object.keys(obj).some((k) => k.startsWith(req.path))
            : obj[req.path] !== undefined && !(Array.isArray(obj[req.path]) && obj[req.path].length === 0);
          if (alreadyPresent) continue;
          const el = findElement(elements, req.path);
          if (el) {
            const forcedEl = Object.assign({}, el, { min: 1 });
            maybeAssign(obj, forcedEl, `${resourceType}.${req.path}`, resourceType, false, 0);
          }
        }
      }

      if (profile.fixedValues) {
        for (const fv of profile.fixedValues) obj[fv.path] = fv.value;
      }

      if (profile.requiredCoding) {
        for (const rc of profile.requiredCoding) {
          const coding = { system: rc.system, code: rc.code };
          if (rc.arrayOfCodeableConcept) {
            const existing = Array.isArray(obj[rc.path]) ? obj[rc.path] : [];
            const alreadyHasMatch = existing.some((cc) => cc && Array.isArray(cc.coding) &&
              cc.coding.some((c) => c && c.system === rc.system && c.code === rc.code));
            if (!alreadyHasMatch) {
              if (existing.length) {
                // Add the required coding onto the first existing entry rather than a
                // whole separate CodeableConcept, which reads more like real data.
                existing[0].coding = (existing[0].coding || []).concat([coding]);
              } else {
                existing.push({ coding: [coding] });
              }
            }
            obj[rc.path] = existing;
          } else {
            const existingCC = obj[rc.path];
            if (existingCC && typeof existingCC === 'object') {
              existingCC.coding = (existingCC.coding || []).concat([coding]);
            } else {
              obj[rc.path] = { coding: [coding] };
            }
          }
        }
      }
    }

    let injected = null;
    if (options.injectError) {
      injected = injectRandomError(obj, elements, profile);
    }

    return { resource: obj, injectedError: injected };
  }

  function injectRandomError(obj, elements, profile) {
    const strategies = ['remove-required', 'wrong-type', 'unknown-field'];
    const strategy = pick(strategies);

    if (strategy === 'unknown-field') {
      obj.zzzUnrecognizedField = 'This field is not part of the FHIR spec - added to test unknown-field detection.';
      return 'Added an unrecognized field ("zzzUnrecognizedField") that shouldn\'t exist on this resource.';
    }

    const requiredNames = elements.filter((el) => el.min && el.min > 0 && !el.choice).map((el) => el.name)
      .filter((name) => obj[name] !== undefined);
    if (strategy === 'remove-required' && requiredNames.length) {
      const victim = pick(requiredNames);
      delete obj[victim];
      return `Removed the required field "${victim}" to test missing-field detection.`;
    }

    // wrong-type (or fallback if nothing required was present to remove)
    const stringFields = Object.keys(obj).filter((k) => typeof obj[k] === 'string');
    const boolFields = Object.keys(obj).filter((k) => typeof obj[k] === 'boolean');
    if (boolFields.length) {
      const victim = pick(boolFields);
      obj[victim] = 'not-a-boolean';
      return `Changed "${victim}" from a boolean to a string to test data-type checking.`;
    }
    if (stringFields.length) {
      const victim = pick(stringFields);
      obj[victim] = [obj[victim]]; // wrap a single value in an array to break cardinality
      return `Wrapped "${victim}" in an array to test cardinality checking.`;
    }
    obj.zzzUnrecognizedField = 'Fallback injected error.';
    return 'Added an unrecognized field to test unknown-field detection.';
  }

  const api = { generateResource };
  if (isNode) module.exports = api;
  else global.FhirGenerator = api;
})(typeof window !== 'undefined' ? window : globalThis);
