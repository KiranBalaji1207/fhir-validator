/*
 * app.js — UI wiring for the static FHIR Validator page.
 */

(() => {
  const $ = (id) => document.getElementById(id);

  const resourceInput = $("resourceInput");
  const fileInput = $("fileInput");
  const loadSampleBtn = $("loadSampleBtn");
  const clearBtn = $("clearBtn");
  const fhirVersion = $("fhirVersion");
  const igPreset = $("igPreset");
  const profileUrl = $("profileUrl");
  const validateOfflineBtn = $("validateOfflineBtn");
  const validateOnlineBtn = $("validateOnlineBtn");
  const resultsBody = $("resultsBody");
  const summaryBadges = $("summaryBadges");

  loadSampleBtn.addEventListener("click", () => {
    resourceInput.value = JSON.stringify(SAMPLE_RESOURCE, null, 2);
  });

  clearBtn.addEventListener("click", () => {
    resourceInput.value = "";
    resultsBody.innerHTML = `<div class="empty-state"><p>👋 Paste or upload a FHIR resource, then click one of the validate buttons.</p></div>`;
    summaryBadges.innerHTML = "";
  });

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { resourceInput.value = reader.result; };
    reader.readAsText(file);
  });

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderSummary(issues) {
    const counts = { error: 0, warning: 0, information: 0, success: 0 };
    issues.forEach(i => { counts[i.severity] = (counts[i.severity] || 0) + 1; });
    const parts = [];
    if (counts.error) parts.push(`<span class="badge err">✕ ${counts.error} error${counts.error !== 1 ? "s" : ""}</span>`);
    if (counts.warning) parts.push(`<span class="badge warn">⚠ ${counts.warning} warning${counts.warning !== 1 ? "s" : ""}</span>`);
    if (counts.information) parts.push(`<span class="badge info">ℹ ${counts.information} note${counts.information !== 1 ? "s" : ""}</span>`);
    if (!counts.error) parts.push(`<span class="badge ok">✓ looks structurally valid</span>`);
    summaryBadges.innerHTML = parts.join("");
  }

  function groupLabel(source) {
    if (source === "syntax") return "JSON syntax";
    if (source === "offline") return "Structural &amp; cardinality checks";
    if (source && source.startsWith("ig:")) return escapeHtml(source.slice(3)) + " checks";
    if (source === "online") return "Official HL7 validator (validator.fhir.org)";
    return "Checks";
  }

  function renderIssues(title, issues) {
    if (!issues.length) return "";
    const rows = issues.map(i => `
      <div class="issue ${i.severity}">
        <span class="source-tag">${escapeHtml(i.severity)}</span>${escapeHtml(i.message)}
        ${i.path ? `<span class="path">${escapeHtml(i.path)}</span>` : ""}
      </div>
    `).join("");
    return `<div class="result-group"><h3>${title}</h3>${rows}</div>`;
  }

  function renderOfflineResults(result) {
    if (result.parseError) {
      summaryBadges.innerHTML = `<span class="badge err">✕ invalid JSON</span>`;
      resultsBody.innerHTML = renderIssues("JSON syntax", result.issues);
      return;
    }
    renderSummary(result.issues);

    // group by source
    const groups = {};
    result.issues.forEach(i => {
      const key = i.source || "offline";
      groups[key] = groups[key] || [];
      groups[key].push(i);
    });

    let html = "";
    const order = Object.keys(groups).sort((a, b) => {
      const rank = (s) => (s === "syntax" ? 0 : s === "offline" ? 1 : s.startsWith("ig:") ? 2 : 3);
      return rank(a) - rank(b);
    });
    order.forEach(key => { html += renderIssues(groupLabel(key), groups[key]); });

    resultsBody.innerHTML = html || `<div class="empty-state"><p>No issues found.</p></div>`;
  }

  validateOfflineBtn.addEventListener("click", () => {
    const text = resourceInput.value.trim();
    if (!text) { alert("Please paste or upload a FHIR resource first."); return; }
    const profiles = profileUrl.value.split(",").map(s => s.trim()).filter(Boolean);
    const result = OfflineValidator.validate(text, {
      igKey: igPreset.value || null,
      profileUrls: profiles,
      fhirVersion: fhirVersion.value
    });
    renderOfflineResults(result);
  });

  // ---- Online validation (best-effort call to the public HL7 validator-wrapper service) ----
  //
  // validator.fhir.org is powered by the "validator-wrapper" project
  // (https://github.com/hapifhir/org.hl7.fhir.validator-wrapper). Its /validate endpoint
  // expects a JSON request body shaped like:
  //   { "cliContext": { "sv": "...", "ig": [...], "profiles": [...] },
  //     "filesToValidate": [ { "fileName": "...", "fileContent": "...", "fileType": "json" } ] }
  // (confirmed directly from the project's own http-client-tests fixtures/preset-requests),
  // and returns:
  //   { "outcomes": [ { "issues": [ { "line", "col", "message", "type", "level" } ] } ] }
  // Earlier attempts that sent the raw resource directly (HTTP 415) or used top-level
  // filename/fileContent fields instead of a filesToValidate array (HTTP 400 "No files for
  // validation provided in request") were based on incorrect guesses about this shape.

  const ONLINE_VALIDATE_URL = "https://validator.fhir.org/validate";

  async function callOnlineValidator(text, profiles, version) {
    const requestBody = {
      cliContext: {
        sv: version || "4.0.1",
        ig: [],
        profiles: profiles || [],
        locale: "en"
      },
      filesToValidate: [
        { fileName: "resource.json", fileContent: text, fileType: "json" }
      ]
    };

    const response = await fetch(ONLINE_VALIDATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const raw = await response.text();
    let parsedBody;
    try { parsedBody = JSON.parse(raw); } catch (e) { parsedBody = null; }

    if (!response.ok) {
      const detail = (parsedBody && (parsedBody.message || parsedBody.error)) || raw.slice(0, 300) || `HTTP ${response.status}`;
      throw new Error(`Validator service responded with HTTP ${response.status}: ${detail}`);
    }

    return parsedBody;
  }

  // Response shape confirmed from validator-wrapper's own test assertions:
  //   response.body.outcomes[0].issues -> [{ line, col, message, type, level }]
  // `level` is the severity (e.g. INFORMATION, WARNING, ERROR, FATAL).
  // We defensively also support a couple of alternate shapes in case the public
  // service's contract shifts again in the future.
  function normalizeOnlineResponse(body) {
    if (!body) {
      return [{ severity: "information", message: "The validator responded, but the response body was empty or not valid JSON.", path: "", source: "online" }];
    }

    const sevMap = { fatal: "error", error: "error", warn: "warning", warning: "warning", info: "information", information: "information", informational: "information" };

    // Shape 1 (confirmed): { outcomes: [ { issues: [...] } ] }
    if (Array.isArray(body.outcomes)) {
      const allIssues = [];
      body.outcomes.forEach(outcome => {
        (outcome.issues || []).forEach(iss => {
          const rawSeverity = (iss.level || iss.severity || "information").toString().toLowerCase();
          const loc = iss.line !== undefined ? `line ${iss.line}${iss.col !== undefined ? `, col ${iss.col}` : ""}` : (iss.location || "");
          allIssues.push({
            severity: sevMap[rawSeverity] || "information",
            message: iss.message || iss.display || "Unspecified issue",
            path: loc,
            source: "online"
          });
        });
      });
      if (!allIssues.length) {
        return [{ severity: "success", message: "The official validator found no issues with this resource.", path: "", source: "online" }];
      }
      return allIssues;
    }

    // Shape 2 (fallback): { messages: [...] }
    if (Array.isArray(body.messages)) {
      if (!body.messages.length) {
        return [{ severity: "success", message: "The official validator found no issues with this resource.", path: "", source: "online" }];
      }
      return body.messages.map(m => {
        const rawSeverity = (m.level || m.severity || "information").toString().toLowerCase();
        const loc = m.location || (m.line !== undefined ? `line ${m.line}${m.col !== undefined ? `, col ${m.col}` : ""}` : "");
        return {
          severity: sevMap[rawSeverity] || "information",
          message: m.message || m.display || m.text || "Unspecified issue",
          path: loc || "",
          source: "online"
        };
      });
    }

    // Shape 3 (fallback): plain FHIR OperationOutcome { resourceType: "OperationOutcome", issue: [...] }
    if (Array.isArray(body.issue)) {
      return body.issue.map(i => ({
        severity: sevMap[(i.severity || "information").toLowerCase()] || "information",
        message: (i.details && i.details.text) || i.diagnostics || i.code || "Unspecified issue",
        path: (i.expression && i.expression.join(", ")) || (i.location && i.location.join(", ")) || "",
        source: "online"
      }));
    }

    return [{ severity: "information", message: "The validator responded, but not in a format this page recognizes. Raw response has been logged to the browser console.", path: "", source: "online" }];
  }

  validateOnlineBtn.addEventListener("click", async () => {
    const text = resourceInput.value.trim();
    if (!text) { alert("Please paste or upload a FHIR resource first."); return; }

    try { JSON.parse(text); } catch (e) {
      renderOfflineResults({ parseError: e.message, issues: [{ severity: "error", message: `Invalid JSON: ${e.message}`, path: "", source: "syntax" }] });
      return;
    }

    const profiles = profileUrl.value.split(",").map(s => s.trim()).filter(Boolean);
    resultsBody.innerHTML = `<div class="online-note"><span class="spinner"></span>Sending resource to validator.fhir.org for official validation…</div>`;
    summaryBadges.innerHTML = "";

    try {
      const body = await callOnlineValidator(text, profiles, fhirVersion.value);
      console.log("validator.fhir.org raw response:", body);
      const issues = normalizeOnlineResponse(body);
      renderSummary(issues);
      resultsBody.innerHTML = renderIssues("Official HL7 validator (validator.fhir.org)", issues) ||
        `<div class="empty-state"><p>Validator returned no issues.</p></div>`;
    } catch (err) {
      resultsBody.innerHTML = `
        <div class="online-note">
          <strong>Couldn't get a usable response from the online validator.</strong><br/>
          This can happen if your browser blocks the cross-origin (CORS) request, you're offline, or the
          public service's API has changed since this page was built.<br/><br/>
          <strong>Fallback options:</strong>
          <ol>
            <li>Use the <strong>offline checks</strong> button above (always works, no internet required after page load).</li>
            <li>Open the official validator directly and paste your JSON there:
              <button id="openOfficialBtn" class="btn secondary small" style="margin-top:8px;">Open validator.fhir.org ↗</button>
              <button id="copyJsonBtn" class="btn ghost small" style="margin-top:8px;">Copy JSON to clipboard</button>
            </li>
          </ol>
          <span class="path">Technical detail: ${escapeHtml(err.message)}</span>
        </div>`;
      $("openOfficialBtn").addEventListener("click", () => window.open("https://validator.fhir.org/", "_blank"));
      $("copyJsonBtn").addEventListener("click", () => {
        navigator.clipboard.writeText(text).then(() => {
          $("copyJsonBtn").textContent = "Copied ✓";
          setTimeout(() => { $("copyJsonBtn").textContent = "Copy JSON to clipboard"; }, 1500);
        });
      });
    }
  });

})();
