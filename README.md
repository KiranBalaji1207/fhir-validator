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

- The resource has a recognized FHIR R4 `resourceType`
- Required fields (cardinality `1..*` or `1..1`) are present
- Fields that can repeat are arrays, and fields that can't aren't
- Primitive values match their FHIR type (e.g. `dateTime` format, `boolean`
  is a real JSON boolean, `positiveInt` is a positive integer, etc.)
- Nested structures (BackboneElements, complex types like `HumanName`,
  `CodeableConcept`, `Reference`, etc.) recursively

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
CarePlan, Composition, Bundle). Any other valid R4 resource type is still
checked against the base `Resource`/`DomainResource` rules (id, meta, text,
extensions, etc.), with a note that resource-specific fields weren't checked.

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
js/xmlToJson.js       FHIR XML -> JSON conversion
js/validator.js      Core structural validation engine
js/samples.js        Sample resources for the "Try a sample" buttons
js/app.js            UI wiring
```
