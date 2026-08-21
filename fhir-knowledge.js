/*
 * fhir-knowledge.js
 * Static reference data used by the offline validator:
 *  - Known FHIR R4/R4B/R5/STU3 resource type names (for "unknown resourceType" checks)
 *  - Per-resource-type baseline required elements (base FHIR spec cardinality, 0..1 vs 1..1 etc.)
 *  - Lightweight, hand-curated IG rule packs for US Core / Da Vinci PDex / PDex Plan-Net / CARIN BB
 *
 * NOTE: These rule packs are intentionally NOT exhaustive. They cover the most common
 * "gotchas" implementers hit (missing identifiers, missing must-support fields, wrong
 * extension URLs, missing category/type codes, etc). For full, authoritative validation
 * (terminology bindings, invariants, slicing) always cross-check with the official
 * HL7 validator (validator.fhir.org) or the FHIR Implementation Guide itself.
 */

const FHIR_RESOURCE_TYPES = [
  "Account","ActivityDefinition","AdministrableProductDefinition","AdverseEvent","AllergyIntolerance",
  "Appointment","AppointmentResponse","AuditEvent","Basic","Binary","BiologicallyDerivedProduct",
  "BodyStructure","Bundle","CapabilityStatement","CarePlan","CareTeam","CatalogEntry","ChargeItem",
  "ChargeItemDefinition","Citation","Claim","ClaimResponse","ClinicalImpression","ClinicalUseDefinition",
  "CodeSystem","Communication","CommunicationRequest","CompartmentDefinition","Composition",
  "ConceptMap","Condition","ConditionDefinition","Consent","Contract","Coverage",
  "CoverageEligibilityRequest","CoverageEligibilityResponse","DetectedIssue","Device","DeviceDefinition",
  "DeviceMetric","DeviceRequest","DeviceUseStatement","DiagnosticReport","DocumentManifest",
  "DocumentReference","Encounter","Endpoint","EnrollmentRequest","EnrollmentResponse","EpisodeOfCare",
  "EventDefinition","Evidence","EvidenceReport","EvidenceVariable","ExampleScenario",
  "ExplanationOfBenefit","FamilyMemberHistory","Flag","Goal","GraphDefinition","Group",
  "GuidanceResponse","HealthcareService","ImagingStudy","Immunization","ImmunizationEvaluation",
  "ImmunizationRecommendation","ImplementationGuide","Ingredient","InsurancePlan","Invoice","Library",
  "Linkage","List","Location","ManufacturedItemDefinition","Measure","MeasureReport","Media",
  "Medication","MedicationAdministration","MedicationDispense","MedicationKnowledge",
  "MedicationRequest","MedicationStatement","MedicinalProductDefinition","MessageDefinition",
  "MessageHeader","MolecularSequence","NamingSystem","NutritionOrder","NutritionProduct",
  "Observation","ObservationDefinition","OperationDefinition","OperationOutcome","Organization",
  "OrganizationAffiliation","PackagedProductDefinition","Parameters","Patient","PaymentNotice",
  "PaymentReconciliation","Person","PlanDefinition","Practitioner","PractitionerRole","Procedure",
  "Provenance","Questionnaire","QuestionnaireResponse","RegulatedAuthorization","RelatedPerson",
  "RequestGroup","ResearchDefinition","ResearchElementDefinition","ResearchStudy","ResearchSubject",
  "RiskAssessment","Schedule","SearchParameter","ServiceRequest","Slot","Specimen",
  "SpecimenDefinition","StructureDefinition","StructureMap","Subscription","SubscriptionStatus",
  "SubscriptionTopic","Substance","SubstanceDefinition","SupplyDelivery","SupplyRequest","Task",
  "TerminologyCapabilities","TestReport","TestScript","ValueSet","VerificationResult",
  "VisionPrescription"
];

// Baseline (base-spec) required elements per resource type. This is intentionally a
// small, high-value subset — not a full re-implementation of the FHIR schema.
const BASE_REQUIRED_ELEMENTS = {
  Patient: [],
  Practitioner: [],
  PractitionerRole: [],
  Organization: [{ path: "name", note: "Organization.name is 0..1 in base FHIR but almost always expected; many IGs (incl. Plan-Net) make it required." }],
  OrganizationAffiliation: [],
  Location: [{ path: "status", cardinality: "0..1" }],
  Group: [
    { path: "type", required: true, note: "Group.type is 1..1 (person | animal | practitioner | device | medication | substance)." },
    { path: "actual", required: true, note: "Group.actual is 1..1 boolean." }
  ],
  Coverage: [
    { path: "status", required: true },
    { path: "beneficiary", required: true },
    { path: "payor", required: true, note: "Coverage.payor is 1..* — at least one payor reference is required." }
  ],
  ExplanationOfBenefit: [
    { path: "status", required: true },
    { path: "type", required: true },
    { path: "use", required: true },
    { path: "patient", required: true },
    { path: "created", required: true },
    { path: "insurer", required: true },
    { path: "provider", required: true },
    { path: "outcome", required: true },
    { path: "insurance", required: true, note: "ExplanationOfBenefit.insurance is 1..* in R4." }
  ],
  ServiceRequest: [
    { path: "status", required: true },
    { path: "intent", required: true },
    { path: "subject", required: true }
  ],
  Observation: [
    { path: "status", required: true },
    { path: "code", required: true }
  ],
  Condition: [
    { path: "subject", required: true }
  ],
  Encounter: [
    { path: "status", required: true },
    { path: "class", required: true }
  ],
  Consent: [
    { path: "status", required: true },
    { path: "scope", required: true },
    { path: "category", required: true }
  ],
  Specimen: [],
  Bundle: [
    { path: "type", required: true }
  ],
  Claim: [
    { path: "status", required: true },
    { path: "type", required: true },
    { path: "use", required: true },
    { path: "patient", required: true },
    { path: "created", required: true },
    { path: "provider", required: true },
    { path: "priority", required: true }
  ]
};

// Lightweight IG rule packs. Each rule is a function(resource) => array of {severity, message, path}
const IG_RULES = {

  "us-core": {
    label: "US Core",
    applies: (r) => true,
    rules: [
      (r) => {
        const out = [];
        if (r.resourceType === "Patient") {
          if (!r.identifier || !r.identifier.length) out.push({ severity: "error", path: "Patient.identifier", message: "US Core Patient requires at least one identifier (must-support)." });
          if (!r.name || !r.name.length) out.push({ severity: "error", path: "Patient.name", message: "US Core Patient requires at least one name." });
          if (!r.gender) out.push({ severity: "error", path: "Patient.gender", message: "US Core Patient requires gender." });
        }
        if (r.resourceType === "ServiceRequest") {
          const hasUsCoreProfile = (r.meta && r.meta.profile || []).some(p => p.includes("us-core-servicerequest"));
          if (!r.category || !r.category.length) out.push({ severity: "warning", path: "ServiceRequest.category", message: "US Core ServiceRequest expects at least one category (e.g. sdoh)." });
          if (hasUsCoreProfile && !r.code) out.push({ severity: "warning", path: "ServiceRequest.code", message: "US Core ServiceRequest should carry a code." });
        }
        if (r.resourceType === "Specimen") {
          if (!r.type) out.push({ severity: "warning", path: "Specimen.type", message: "US Core Specimen expects a type (must-support)." });
        }
        return out;
      }
    ]
  },

  "pdex": {
    label: "Da Vinci PDex",
    applies: (r) => true,
    rules: [
      (r) => {
        const out = [];
        if (r.resourceType === "Group") {
          // Payer Member/Opt-Out Group pattern seen in Da Vinci PDex opt-out flows
          if (r.type !== "person") out.push({ severity: "warning", path: "Group.type", message: "PDex opt-out Group resources typically fix Group.type = 'person'." });
          if (r.actual !== true) out.push({ severity: "warning", path: "Group.actual", message: "PDex opt-out Group resources typically fix Group.actual = true." });
        }
        if (r.resourceType === "Coverage" || r.resourceType === "ExplanationOfBenefit") {
          const profiles = (r.meta && r.meta.profile) || [];
          if (!profiles.some(p => p.includes("davinci-pdex"))) {
            out.push({ severity: "information", path: "meta.profile", message: "No davinci-pdex profile found in meta.profile — add it if this resource is meant to conform to a PDex profile." });
          }
        }
        // Generic opt-out-details extension URL check (common copy/paste error)
        const walk = (node, path) => {
          if (Array.isArray(node)) { node.forEach((n, i) => walk(n, `${path}[${i}]`)); return; }
          if (node && typeof node === "object") {
            if (node.url && /opt.?out/i.test(node.url) && node.url !== "http://hl7.org/fhir/us/davinci-pdex/StructureDefinition/opt-out-details") {
              out.push({ severity: "warning", path, message: `Extension URL "${node.url}" looks like an opt-out extension but doesn't match the canonical PDex URL (http://hl7.org/fhir/us/davinci-pdex/StructureDefinition/opt-out-details). Double-check for typos.` });
            }
            Object.keys(node).forEach(k => walk(node[k], path ? `${path}.${k}` : k));
          }
        };
        walk(r, r.resourceType);
        return out;
      }
    ]
  },

  "pdex-plan-net": {
    label: "Da Vinci PDex Plan-Net",
    applies: (r) => true,
    rules: [
      (r) => {
        const out = [];
        if (r.resourceType === "Organization") {
          if (!r.name) out.push({ severity: "error", path: "Organization.name", message: "Plan-Net Organization requires a name." });
          if (!r.active === undefined) out.push({ severity: "information", path: "Organization.active", message: "Plan-Net recommends setting Organization.active explicitly." });
        }
        if (r.resourceType === "PractitionerRole") {
          if (!r.practitioner) out.push({ severity: "warning", path: "PractitionerRole.practitioner", message: "Plan-Net PractitionerRole expects a practitioner reference (must-support)." });
          if (!r.organization) out.push({ severity: "warning", path: "PractitionerRole.organization", message: "Plan-Net PractitionerRole expects an organization reference (must-support)." });
          if (!r.location || !r.location.length) out.push({ severity: "information", path: "PractitionerRole.location", message: "Plan-Net PractitionerRole typically references at least one location." });
          if (!r.healthcareService || !r.healthcareService.length) out.push({ severity: "information", path: "PractitionerRole.healthcareService", message: "Consider populating healthcareService if this role offers specific services." });
        }
        if (r.resourceType === "OrganizationAffiliation") {
          if (!r.organization) out.push({ severity: "warning", path: "OrganizationAffiliation.organization", message: "OrganizationAffiliation.organization (the network/plan) is expected (must-support)." });
          if (!r.participatingOrganization) out.push({ severity: "warning", path: "OrganizationAffiliation.participatingOrganization", message: "OrganizationAffiliation.participatingOrganization is expected (must-support)." });
        }
        if (r.resourceType === "Location") {
          if (!r.address) out.push({ severity: "warning", path: "Location.address", message: "Plan-Net Location expects an address (must-support)." });
          if (!r.position) out.push({ severity: "information", path: "Location.position", message: "Consider adding Location.position (lat/long) for network directory search." });
        }
        return out;
      }
    ]
  },

  "carin-bb": {
    label: "CARIN Blue Button (CARIN BB)",
    applies: (r) => true,
    rules: [
      (r) => {
        const out = [];
        if (r.resourceType === "ExplanationOfBenefit") {
          if (!r.type) out.push({ severity: "error", path: "ExplanationOfBenefit.type", message: "CARIN BB EOB requires .type (identifies Institutional/Professional/Pharmacy/Oral/Vision)." });
          const profiles = (r.meta && r.meta.profile) || [];
          const isNonFinancial = profiles.some(p => /nonclinical|non-financial|c4bb-explanationofbenefit-nonclinical/i.test(p));
          if (!r.insurance || !r.insurance.length) out.push({ severity: "warning", path: "ExplanationOfBenefit.insurance", message: "CARIN BB EOB expects at least one insurance entry with a coverage reference." });
          if (!isNonFinancial && (!r.item || !r.item.some(it => it.adjudication && it.adjudication.length))) {
            out.push({ severity: "information", path: "ExplanationOfBenefit.item.adjudication", message: "Financial CARIN BB EOBs typically include adjudication amounts on line items. If this is meant to be a Non-Financial EOB, ignore this note." });
          }
          if (!r.provider) out.push({ severity: "warning", path: "ExplanationOfBenefit.provider", message: "CARIN BB EOB expects a provider reference (must-support)." });
        }
        return out;
      }
    ]
  }
};

const SAMPLE_RESOURCE = {
  resourceType: "Patient",
  id: "example-patient-01",
  meta: {
    profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient|6.1.0"]
  },
  identifier: [
    {
      use: "usual",
      type: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/v2-0203", code: "MR" }] },
      system: "http://example.org/mrn",
      value: "MRN-00123"
    }
  ],
  name: [{ use: "official", family: "Doe", given: ["Jane"] }],
  gender: "female",
  birthDate: "1988-04-12",
  address: [{ line: ["123 Main St"], city: "San Jose", state: "CA", postalCode: "95112", country: "US" }]
};
