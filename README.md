# FHIR Validator (static, GitHub Pages-ready)

> **Update history**:
> - v1: offline checks were only JSON syntax + hand-written heuristic rules — not real FHIR validation.
> - v2: added real validation against the official FHIR JSON Schema via Ajv, loaded from a public CDN.
> - v3 (this version): Ajv is now **bundled locally** in this repo (`js/vendor/ajv7.bundle.min.js`)
>   instead of loaded from a CDN — so the offline check makes **zero calls to any third-party
>   server**, immune to corporate firewalls that were blocking both the CDN script and the
>   online validator's API call. This version also fixes a real bug found via direct testing
>   against the actual Ajv engine: a schema lookup key containing a colon (`:`) was being
>   misinterpreted as a URI scheme by Ajv's reference resolver, silently breaking `$ref`
>   resolution into the FHIR schema's `definitions`.

**Live features**
- Paste, type, or upload a FHIR JSON resource.
- **Offline checks** — make **zero calls to any third-party server** once the one-time schema
  setup below is done, so they work on any network, including restrictive corporate firewalls:
  - JSON syntax validation with clear error messages.
  - ✅ **Real validation against the official FHIR base JSON Schema** (structure, required
    elements, cardinality, data types, enumerated codes) using a locally-bundled Ajv engine —
    genuine spec conformance, not a heuristic guess. Requires a one-time setup step (see
    below) since the official schema file is too large to auto-bundle into this repo for you.
  - Heuristic sanity checks (non-normative): JSON shape checks for `resourceType`/`id`
    format/`meta.profile`, `Coding`/`Reference`/`Period`/date-time patterns, and baseline
    required-element checks for a handful of common resource types.
  - Hand-built rule packs for **US Core**, **Da Vinci PDex**, **Da Vinci PDex Plan-Net**,
    and **CARIN Blue Button (CARIN BB)** flagging common real-world mistakes — these are
    still heuristics, not full profile validation.
- **Online check**: sends the resource to the public official HL7 validator service
  (`https://validator.fhir.org`, backed by the `validator-wrapper` project) for full
  profile/terminology/invariant validation, with a graceful fallback (copy-to-clipboard +
  direct link) if the request is blocked. **Note**: this makes a custom cross-origin API call
  to a third-party domain and is the check most likely to be blocked by restrictive corporate
  firewalls/proxies — if that's your situation, rely on the offline schema-based check
  instead, which needs no such call.

## Enable real FHIR schema validation (one-time setup, ~2 minutes)

The official FHIR JSON Schema is a large, official HL7 artifact (multiple MB) — too big to
embed directly in this repo automatically, and I can't fetch it into your repo for you from
a sandboxed environment with no live internet access. You add it once yourself — a
completely standard file download — after that it lives in your own repo (same-origin), so
the browser never makes a cross-domain call to load it.

1. Go to the official downloads page: **https://www.hl7.org/fhir/R4/downloads.html**
2. Use Ctrl+F / Cmd+F and search the page for **"JSON Schema"** — it's listed as its own
   separate download link (distinct from the XML Schema, ValueSets, etc.), and downloads
   as a `.zip` file.
3. Unzip it. Inside you'll find **many** files (one per resource type, like
   `patient.schema.json`, `observation.schema.json`, etc.) **plus one combined file**
   literally named **`fhir.schema.json`** — that's the only one you need.
4. In your GitHub repo, create a folder named `schema` and upload just that one file into
   it, so the final path is exactly: **`schema/fhir.schema.json`**
   (Add file → Upload files → type `schema/` in the path box before dragging the file in,
   or create the folder by uploading directly into it).
5. Commit. Reload the live site, click **"Run structural + profile checks (offline)"** —
   you should see a new section: *"✅ Official FHIR base schema (real, spec-based validation)"*.

**How to verify the file is in the right place**: open
`https://<your-username>.github.io/<repo-name>/schema/fhir.schema.json` directly in your
browser. You should see a large wall of raw JSON text, not a 404 page.

If you skip this step, the tool still works — it just clearly tells you the schema file is
missing and shows these same instructions, instead of silently pretending to validate.

### Why Ajv is bundled locally instead of loaded from a CDN

An earlier version of this tool loaded the Ajv JSON Schema engine from a public CDN
(`cdn.jsdelivr.net`). On restrictive corporate networks, that CDN request could be blocked
by the same firewall/proxy rules that block the online validator's API call — which made
the "offline" check not actually fully offline in practice. This version instead bundles
Ajv directly into the repo at `js/vendor/ajv7.bundle.min.js`, referenced with a relative
`<script>` tag in `index.html` — so **every single asset the offline path needs (HTML, CSS,
JS, the validation engine, and the FHIR schema you add) is served from your own GitHub
Pages domain**. No runtime call ever leaves your site for the offline check.

> **A note on testing**: this schema-validation integration was built and tested end-to-end
> against the *real* Ajv engine (bundled from the actual `ajv` npm package) using a
> realistic mock FHIR schema fragment that reproduces the real file's structure — including
> its `$schema: "draft-06"` declaration and root-level `discriminator` keyword — since this
> environment has no live internet access to download the actual multi-MB official schema
> file. That testing caught and fixed two real bugs before shipping: (1) Ajv's default
> bundle doesn't recognize the draft-06 meta-schema that the official FHIR schema declares
> — fixed by bundling the draft-06 meta-schema alongside Ajv; (2) an internal schema lookup
> key containing a colon was being misinterpreted as a URI scheme by Ajv's `$ref` resolver,
> silently breaking resolution — fixed by removing the colon from the key format. Please
> still test against your own resources once you've added the real schema file, and let me
> know if anything looks off.

## File structure

```
fhir-validator/
├── index.html               ← main page
├── css/style.css             ← styling
├── js/fhir-knowledge.js      ← resource type list + IG rule packs + sample resource
├── js/validator-offline.js   ← heuristic sanity-check engine
├── js/schema-validator.js    ← real FHIR-JSON-Schema validation engine (via Ajv)
├── js/vendor/ajv7.bundle.min.js ← locally-bundled Ajv JSON Schema engine (no CDN)
├── js/app.js                 ← UI wiring + online validator integration
├── schema/fhir.schema.json   ← YOU add this (see setup steps above) — not included
├── .nojekyll                 ← tells GitHub Pages not to run Jekyll processing
└── README.md                 ← this file
```

## How to host this on GitHub Pages

1. **Create a repository** on GitHub. You can name it anything, e.g. `fhir-validator`.
   (If you want it at the root of `https://<username>.github.io`, name the repo exactly
   `<username>.github.io` instead.)
2. **Add these files** to the repository (drag-and-drop upload via "Add file → Upload
   files", or `git push` from your machine).
3. **Enable GitHub Pages**: Settings → Pages → Source: **Deploy from a branch** → Branch:
   **main**, folder **/ (root)** → Save.
4. Wait ~1-3 minutes — GitHub shows the live URL:
   `https://<your-username>.github.io/<repo-name>/`
5. **Future updates**: just commit/push again — GitHub Pages redeploys automatically.

## Customizing

- **Add more IG rule packs**: edit `IG_RULES` in `js/fhir-knowledge.js`, then add a matching
  `<option>` in the `#igPreset` `<select>` in `index.html`.
- **Add more heuristic required-element checks**: extend `BASE_REQUIRED_ELEMENTS` in
  `js/fhir-knowledge.js`.
- **Change the online validator endpoint**: edit `ONLINE_VALIDATE_URL` in `js/app.js` if
  you'd rather point at your own hosted instance of
  [`org.hl7.fhir.validator-wrapper`](https://github.com/hapifhir/org.hl7.fhir.validator-wrapper).

## Why not just embed the real HL7 validator?

The official, fully-compliant FHIR validator (`validator_cli.jar`) is a Java application —
it needs a JVM to run, plus downloaded IG packages and (optionally) a terminology server.
None of that can run inside a static page hosted on GitHub Pages. Even with the real base
schema validation added in this version, the following still require the full Java
validator or the online check:
- **Terminology bindings** — is this code actually a member of the ValueSet it's bound to?
- **FHIRPath invariants** — cross-field business rules (e.g. "if X then Y must be present").
- **Profile-specific slicing** — validating against a specific IG's StructureDefinition
  constraints (must-support flags, fixed values, slice discriminators) beyond the hand-built
  heuristic rule packs included here.
- **Loading arbitrary Implementation Guide packages** on demand.

Your options for that level of validation:
1. **Call the public service** (the "online check" button) — free, zero setup, but depends
   on `validator.fhir.org` being reachable and not blocked by your network.
2. **Run your own instance** of `org.hl7.fhir.validator-wrapper` (Docker image available)
   and point `ONLINE_VALIDATE_URL` at it.
3. **Desktop/CLI validator** — download `validator_cli.jar` from
   [hl7.org/fhir/validator](https://www.hl7.org/fhir/validator/) and run it locally, e.g.
   `java -jar validator_cli.jar resource.json -ig hl7.fhir.us.core#6.1.0`.
