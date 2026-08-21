# FHIR Validator (static, GitHub Pages-ready)

A free, no-backend, browser-based FHIR resource validator. It runs entirely as static
HTML/CSS/JS, so it can be hosted for free on **GitHub Pages** with no server, database,
or build step.

**Live features**
- Paste, type, or upload a FHIR JSON resource.
- **Offline checks** (always work, no internet needed once the page is loaded):
  - JSON syntax validation with clear error messages.
  - Base FHIR structural sanity checks (`resourceType`, `id` format, `meta.profile` shape,
    `Coding`/`Reference`/`Period`/date-time formats, etc.).
  - Baseline required-element checks for common resource types (Group, Coverage,
    ExplanationOfBenefit, ServiceRequest, Observation, Encounter, Consent, Bundle, Claim…).
  - Hand-built rule packs for **US Core**, **Da Vinci PDex**, **Da Vinci PDex Plan-Net**,
    and **CARIN Blue Button (CARIN BB)** covering the most common real-world mistakes
    (missing identifiers/must-support fields, mismatched opt-out extension URLs, missing
    EOB adjudication, etc.).
- **Online check**: sends the resource to the public official HL7 validator service
  (`https://validator.fhir.org`) for full profile/terminology/invariant validation, with a
  graceful fallback (copy-to-clipboard + direct link) if the browser blocks the
  cross-origin request or you're offline.

> ⚠️ **Important limitation**: because GitHub Pages only serves static files (no server-side
> code), this tool cannot bundle the full Java-based HL7 FHIR validator (that requires a JVM).
> The offline checks here are hand-built structural/cardinality rules — useful for catching
> common mistakes instantly and for offline use, but they are **not** a full replacement for
> official validation. Use the "Send to official HL7 validator" button (or the CLI
> `validator_cli.jar` / `validator.fhir.org`) whenever you need authoritative, complete
> validation (terminology bindings, slicing, invariants, IG package loading).

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
   depends on `validator.fhir.org` being reachable and CORS-permissive from your page.
2. **Run your own instance** of
   [`org.hl7.fhir.validator-wrapper`](https://github.com/hapifhir/org.hl7.fhir.validator-wrapper)
   (Docker image available) on a small server or container app, and point this page's
   `ONLINE_VALIDATE_URL` at it — gives you full control, your own IGs, and no CORS surprises.
3. **Desktop/CLI validator** — download `validator_cli.jar` from the
   [HL7 FHIR Validator page](https://www.hl7.org/fhir/validator/) and run it locally,
   e.g. `java -jar validator_cli.jar resource.json -ig hl7.fhir.us.core#6.1.0`.
