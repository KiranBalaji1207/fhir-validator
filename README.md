# FHIR Validator (static, GitHub Pages-ready)

> **Update history**: An earlier version of this tool's "offline checks" only did JSON
> syntax validation plus hand-written heuristic rules (e.g. "does this look like a date").
> That is **not** genuine FHIR validation — it can miss real spec violations. This version
> adds a **real, spec-based check against the official FHIR JSON Schema**, run entirely in
> the browser with the Ajv JSON Schema engine. See "Enable real FHIR schema validation"
> below — it requires one small one-time setup step (adding the official schema file to
> your repo) because it's too large to bundle automatically.

A free, no-backend, browser-based FHIR resource validator. It runs entirely as static
HTML/CSS/JS, so it can be hosted for free on **GitHub Pages** with no server, database,
or build step.

**Live features**
- Paste, type, or upload a FHIR JSON resource.
- **Offline checks** (work with zero calls to any third-party server, once set up — see
  below — so they're immune to corporate firewalls/proxies blocking outbound API calls):
  - JSON syntax validation with clear error messages.
  - ✅ **Real validation against the official FHIR base JSON Schema** (structure, required
    elements, cardinality, data types, enumerated codes) using the Ajv JSON Schema engine —
    genuine spec conformance, not a heuristic guess. Requires a one-time setup step (see
    below) since the schema file is too large to auto-bundle.
  - Heuristic sanity checks (non-normative): JSON shape checks for `resourceType`/`id`
    format/`meta.profile`, `Coding`/`Reference`/`Period`/date-time patterns, and baseline
    required-element checks for a handful of common resource types.
  - Hand-built rule packs for **US Core**, **Da Vinci PDex**, **Da Vinci PDex Plan-Net**,
    and **CARIN Blue Button (CARIN BB)** flagging common real-world mistakes (missing
    identifiers/must-support fields, mismatched opt-out extension URLs, missing EOB
    adjudication, etc.) — these are still heuristics, not full profile validation.
- **Online check**: sends the resource to the public official HL7 validator service
  (`https://validator.fhir.org`, backed by the `validator-wrapper` project) for full
  profile/terminology/invariant validation, with a graceful fallback (copy-to-clipboard +
  direct link) if the browser/network blocks the request. **Note**: this makes a custom
  API call to a third-party domain and is the check most likely to be blocked by
  restrictive corporate firewalls/proxies — if that's your situation, rely on the offline
  schema-based check instead, which needs no such call.

## Enable real FHIR schema validation (one-time setup, ~2 minutes)

The official FHIR JSON Schema is a large, official HL7 artifact (several MB) — too big to
embed directly in this repo automatically, and I can't fetch it into this repo for you from
a sandboxed environment. Instead, you add it once yourself, as a completely standard file
download — after that, it lives in your own repo (same-origin), so the browser never makes
a cross-domain call to load it, which is what makes this immune to firewalls that block
outbound API calls.

1. Go to the official downloads page: **https://www.hl7.org/fhir/R4/downloads.html**
2. Under "FHIR Definitions", find the **"JSON Schema"** link and download it (it's a `.zip`).
   *(Needs "JSON Schema draft-06 or more recent" per HL7's own note — this repo already
   loads a draft-06/07-compatible engine, see below.)*
3. Unzip it. Inside you'll find a file named **`fhir.schema.json`**.
4. In your GitHub repo, create a folder named `schema` and upload `fhir.schema.json` into
   it (Add file → Upload files → drag it into a path like `schema/fhir.schema.json`).
5. Commit. That's it — reload the live site and click **"Run structural + profile checks
   (offline)"**; you should now see a new results section: *"✅ Official FHIR base schema
   (real, spec-based validation)"*.

If you skip this step, the tool still works — it just clearly tells you the schema file
is missing and shows you these same instructions instead of silently pretending to
validate against the real spec.

### Fully offline / firewall-proof setup (optional, for very restrictive networks)

By default, the JSON Schema validation *engine* (a JS library called Ajv) is loaded from a
public CDN (`cdn.jsdelivr.net`) via a `<script>` tag in `index.html` — a simple GET request
for a small library, much less likely to be blocked than a custom API call, but still a
network request to a third-party domain. If your network blocks even that:

1. Download the file directly from your browser:
   `https://cdn.jsdelivr.net/npm/ajv@8/dist/ajv7.bundle.min.js`
2. Save it into this repo at `js/vendor/ajv7.bundle.min.js`.
3. In `index.html`, change:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/ajv@8/dist/ajv7.bundle.min.js"></script>
   ```
   to:
   ```html
   <script src="js/vendor/ajv7.bundle.min.js"></script>
   ```
4. Commit. Now every single asset the page needs — HTML, CSS, JS, the validation engine,
   and the FHIR schema itself — is served from your own GitHub Pages domain. No runtime
   call ever leaves your site (aside from the optional "online check" button, which is a
   separate, clearly-labeled feature you can simply avoid using on a restricted network).

> **A note on testing**: this schema-validation integration was built and logic-tested with
> a mocked validation engine (since this environment has no live internet access to test
> against the real Ajv library or the real multi-MB FHIR schema file end-to-end). The
> control flow (loading, error handling, missing-file messaging, issue formatting) has been
> verified, but please test it against your own resources once deployed, and let me know if
> anything looks off (e.g. the real schema uses a `$id` or structure the code doesn't quite
> expect) so it can be adjusted.

> ⚠️ **Important limitation**: because GitHub Pages only serves static files (no server-side
> code), this tool cannot bundle the full Java-based HL7 FHIR validator (that requires a JVM).
> Once you complete the one-time schema setup below, the offline check performs **real base
> FHIR JSON Schema validation** (structure, cardinality, data types, required elements) — a
> genuine, spec-based check, not a heuristic guess. However, it still does **not** replace
> the official validator for: terminology binding checks (is this code actually in that
> ValueSet?), FHIRPath invariants (cross-field business rules), profile-specific slicing, or
> loading arbitrary Implementation Guide packages. Use the "Send to official HL7 validator"
> button (or the CLI `validator_cli.jar` / `validator.fhir.org`) whenever you need that full
> level of authoritative validation and have network access to reach it.
>
> **About the online check's request format**: `validator.fhir.org`'s `/validate` endpoint
> expects a JSON *request wrapper* (`{ cliContext, filename, fileContent, fileType,
> sessionId }`), not the raw FHIR resource posted directly — and it returns a custom
> `ValidationOutcome` JSON shape (a `messages` array), not a plain FHIR `OperationOutcome`.
> `js/app.js` builds this wrapper and normalizes both response shapes. This is a public,
> community-run service, so its exact request/response contract can change over time —
> if the online button ever starts failing again, the graceful fallback (copy JSON +
> direct link to validator.fhir.org) always keeps the tool usable.

## File structure

```
fhir-validator/
├── index.html            ← main page
├── css/style.css          ← styling
├── js/fhir-knowledge.js   ← resource type list + IG rule packs + sample resource
├── js/validator-offline.js← the offline validation engine
├── js/app.js              ← UI wiring + online validator integration
├── .nojekyll              ← tells GitHub Pages not to run Jekyll processing
└── README.md              ← this file
```

## How to host this on GitHub Pages

1. **Create a repository** on GitHub (Settings → your profile → *New repository*). You can
   name it anything, e.g. `fhir-validator`. (If you want it at the root of
   `https://<username>.github.io`, name the repo exactly `<username>.github.io` instead.)
2. **Add these files** to the repository — either:
   - Drag-and-drop upload via the GitHub web UI ("Add file" → "Upload files"), or
   - Using Git from your machine:
     ```bash
     git init
     git add .
     git commit -m "Initial commit: static FHIR validator"
     git branch -M main
     git remote add origin https://github.com/<your-username>/<repo-name>.git
     git push -u origin main
     ```
3. **Enable GitHub Pages**:
   - Go to your repository's **Settings → Pages**.
   - Under **Source**, choose **Deploy from a branch**.
   - Select branch **main** and folder **/ (root)**.
   - Click **Save**.
4. **Wait ~1-3 minutes.** GitHub will show you the live URL, typically:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```
5. **Future updates**: just `git add . && git commit -m "update" && git push` — GitHub
   Pages redeploys automatically on every push to `main`.

That's it — no build tooling, no `npm install`, no server to manage.

## Customizing

- **Add more IG rule packs**: open `js/fhir-knowledge.js` and add a new entry to the
  `IG_RULES` object, following the existing pattern (a `label` and an array of `rules`
  functions that each receive the parsed resource and return an array of
  `{ severity, path, message }` findings). Then add a matching `<option>` in the
  `#igPreset` `<select>` in `index.html`.
- **Add more base-resource required-element checks**: extend `BASE_REQUIRED_ELEMENTS` in
  `js/fhir-knowledge.js`.
- **Change the online validator endpoint**: edit `ONLINE_VALIDATE_URL` in `js/app.js` if
  you'd rather point at your own hosted instance of the
  [HL7 FHIR validator-wrapper](https://github.com/hapifhir/org.hl7.fhir.validator-wrapper)
  (e.g. running in Docker), which avoids any CORS uncertainty from calling the public
  instance and lets you preload your own IG packages.

## Why not just embed the real HL7 validator?

The official, fully-compliant FHIR validator (`validator_cli.jar`) is a Java application —
it needs a JVM to run, along with downloaded IG packages and (optionally) a terminology
server. None of that can run inside a static page hosted on GitHub Pages. Your options if
you need the full validator available as a *hosted service* rather than a link-out:

1. **Call the public service** (what this tool does by default) — free, zero setup, but
   depends on `validator.fhir.org` being reachable, CORS-permissive, and API-compatible
   with what this page sends.
2. **Run your own instance** of
   [`org.hl7.fhir.validator-wrapper`](https://github.com/hapifhir/org.hl7.fhir.validator-wrapper)
   (Docker image available) on a small server or container app, and point this page's
   `ONLINE_VALIDATE_URL` at it — gives you full control, your own IGs, and no CORS surprises.
3. **Desktop/CLI validator** — download `validator_cli.jar` from the
   [HL7 FHIR Validator page](https://www.hl7.org/fhir/validator/) and run it locally,
   e.g. `java -jar validator_cli.jar resource.json -ig hl7.fhir.us.core#6.1.0`.
