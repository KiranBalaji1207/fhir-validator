# FHIR Structural Validator (R4)

A fully client-side FHIR R4 validator. Paste or drop a JSON or XML resource,
click **Validate**, and get structural feedback - shape, required fields,
cardinality, and primitive data types.

**No external API calls, ever.** Everything - XML/JSON parsing, schema
lookups, and validation - runs in your browser using plain JavaScript and the
schema files bundled in `js/`. Nothing you paste is sent anywhere, which also
means it's safe to validate real patient data offline.

## What it checks (and what it doesn't)

This is a **structural** validator, not a full profile/terminology validator
like the official HL7 Java validator. It checks:

- The resource has a recognized FHIR R4 `resourceType` (typos, wrong casing,
  and non-existent resource types are flagged as errors)
- Required fields (cardinality `1..*` or `1..1`) are present
- Fields that can repeat are arrays, and fields that can't aren't
- Every field name that appears is actually a valid FHIR R4 field at that
  point in the resource - **for resources with a curated schema** (see the
  list below), any field name that isn't real FHIR (typo, wrong nesting,
  made-up field) is flagged as an **error**
- Primitive values match their FHIR type (e.g. `dateTime` format, `boolean`
  is a real JSON boolean, `positiveInt` is a positive integer, etc.)
- Nested structures (BackboneElements, complex types like `HumanName`,
  `CodeableConcept`, `Reference`, etc.) recursively, with the same
  unknown-field checking

It does **not** check:

- Terminology bindings (e.g. whether a `code` is actually valid in its
  value set)
- Custom or third-party profiles/StructureDefinitions
- Invariants (e.g. FHIRPath constraints like `.-1`)
- Cross-resource/reference integrity ("does Patient/123 actually exist")

Detailed, field-by-field schemas are built in for a curated set of commonly
used resources (Patient, Observation, Condition, Encounter, Practitioner,
PractitionerRole, Organization, Location, MedicationRequest, Medication,
AllergyIntolerance, Immunization, Procedure, DiagnosticReport, ServiceRequest,
CarePlan, Composition, Bundle). For these, unrecognized fields are **errors**
regardless of the Strict mode toggle - the schema is complete enough to be
confident about it.

Any other valid R4 resource type is still checked against the base
`Resource`/`DomainResource` rules (id, meta, text, extensions, etc.). By
default, unknown fields there are reported as **info** rather than errors,
since this validator doesn't have that resource's full field list and a real
field could easily look "unknown" just because it isn't modeled yet.

**Strict mode** (toggle in the top-left of the input panel) flips those info
notices to errors too, for people who'd rather catch everything and manually
rule out false positives than risk missing something. Issues raised only
because of strict mode are marked **unverified** so they're easy to tell
apart from the certain ones.

## Running it locally

No build step - it's plain HTML/CSS/JS. Just open `index.html` in a browser,
or serve the folder with any static file server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying to GitHub Pages

1. Create a new GitHub repository (or use an existing one).
2. Copy all the files in this folder (`index.html`, `style.css`, `js/`) into
   the repository root - or into a `docs/` folder if you prefer.
3. Commit and push:
   ```bash
   git init
   git add .
   git commit -m "Add FHIR structural validator"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
4. On GitHub: **Settings -> Pages**. Under "Build and deployment", set
   **Source** to "Deploy from a branch", pick the `main` branch, and the `/`
   (root) folder (or `/docs` if that's where you put the files).
5. Save. GitHub will give you a URL like
   `https://<your-username>.github.io/<your-repo>/` within a minute or two.

That's it - no server, no API keys, no build pipeline.

## Implementation Guide (profile) checking

Beyond base FHIR R4, this validator also checks a resource against **US Core**,
**CARIN BB (Blue Button)**, and **Da Vinci PDex** profiles - automatically, by
reading `meta.profile` on the resource (there's no dropdown to pick a profile;
if the resource declares one this validator recognizes, it's checked).

Covered profiles:

- **US Core**: Patient, Practitioner, Organization, Location, Encounter,
  Condition (Problems/Health Concerns and Encounter Diagnosis), AllergyIntolerance,
  Procedure, Immunization, MedicationRequest, Observation (Laboratory Result,
  Vital Signs, Smoking Status), DiagnosticReport (Lab and Note), ServiceRequest,
  CarePlan, Provenance.
- **CARIN BB**: Patient, Practitioner, Organization, RelatedPerson, Coverage,
  and all five ExplanationOfBenefit claim-type profiles (Inpatient Institutional,
  Outpatient Institutional, Pharmacy, Professional/NonClinician, Oral).
- **Da Vinci PDex**: the Prior Authorization ExplanationOfBenefit profile, the
  HRex/PDex Coverage profile, and PDex Provenance. PDex's clinical data (Condition,
  Observation, etc.) travels under the same US Core profile URLs above, so those
  are already covered - there's no separate PDex-specific profile for them.

**What "checked" means here**, since these IGs are much more than cardinality
rules: this validator checks (a) cardinality tightened beyond base FHIR (e.g. a
field base FHIR allows to be absent that the profile requires), (b) a handful of
fixed values and required category/codes it can verify with confidence (e.g. US
Core Vital Signs requiring a `vital-signs` category coding), and (c) that
`meta.profile` and `resourceType` actually agree. It does **not** check
terminology bindings (most value sets need a terminology server), slice-level
discrimination, Must Support (which means "capable of," not "present on every
instance," so it's deliberately not treated as required), or invariants. Each
matched profile's result includes an info note spelling out what wasn't checked
for it specifically. If `meta.profile` references a URL this validator doesn't
recognize, it says so rather than silently skipping it.

None of this replaces the official HL7 validator or the ONC Inferno test kit for
actual certification testing - it's meant to catch obvious structural mistakes
early, client-side, before reaching for those heavier tools.

## Generating sample resources

The "Generate a sample" row above the editor builds a random, structurally-valid
FHIR resource straight from the same schema the validator checks against - handy
for quickly seeing what a given resource type or profile "should" look like, or
for testing the validator itself.

- **Resource type**: any of the curated types above.
- **Profile**: optionally target a specific US Core / CARIN BB / Da Vinci PDex
  profile - the generated resource will include that profile's required fields,
  fixed values, and required category codings, plus `meta.profile`.
- **Include an intentional error**: deliberately breaks the generated resource
  one of three ways (removes a required field, changes a value to the wrong
  data type, or adds a field that isn't part of the FHIR spec) and tells you
  what it broke, so you can see the validator catch it.

The names, addresses, and codes used are clearly-fake placeholders for testing
purposes - they're not real terminology and shouldn't be treated as clinically
meaningful or complete (e.g. a generated Condition's SNOMED code is one of a
small illustrative set, not a real diagnosis lookup).

## Extending the schema

All the structural rules live in three small files, no external data
downloads required:

- `js/datatypes.js` - FHIR primitive types (string, dateTime, code, etc.)
- `js/complexTypes.js` - common complex datatypes (HumanName, CodeableConcept,
  Identifier, Reference, Period, Quantity, etc.)
- `js/resources.js` - per-resource-type field definitions (cardinality,
  required fields, types)

To add structural rules for another resource type, add an entry to
`RESOURCE_DEFS` in `js/resources.js` following the same pattern as the
existing resources - no other files need to change.

## Files

```
index.html          Page markup
style.css            Styling
js/datatypes.js      Primitive type validation
js/complexTypes.js   Complex datatype schemas
js/resources.js      Per-resource structural schemas
js/profiles.js       US Core / CARIN BB / Da Vinci PDex profile overlays
js/xmlToJson.js       FHIR XML -> JSON conversion
js/validator.js      Core structural validation engine
js/generator.js      Random sample-resource generator
js/samples.js        Sample resources for the "Try a sample" buttons
js/app.js            UI wiring
```
