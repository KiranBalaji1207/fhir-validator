(function () {
  const inputArea = document.getElementById('input-area');
  const validateBtn = document.getElementById('validate-btn');
  const clearBtn = document.getElementById('clear-btn');
  const resultsBody = document.getElementById('results-body');
  const summaryEl = document.getElementById('summary');
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const formatButtons = Array.from(document.querySelectorAll('.format-toggle__btn'));
  const strictToggle = document.getElementById('strict-toggle');
  const genResourceType = document.getElementById('gen-resource-type');
  const genProfile = document.getElementById('gen-profile');
  const genInjectError = document.getElementById('gen-inject-error');
  const genBtn = document.getElementById('gen-btn');
  const genNote = document.getElementById('gen-note');

  let forcedFormat = 'auto';

  formatButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      formatButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      forcedFormat = btn.dataset.format;
    });
  });

  document.querySelectorAll('[data-sample]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sample = FHIR_SAMPLES[btn.dataset.sample];
      if (!sample) return;
      inputArea.value = sample.text;
      setForcedFormat(sample.format);
      runValidation();
    });
  });

  function setForcedFormat(fmt) {
    forcedFormat = fmt;
    formatButtons.forEach((b) => b.classList.toggle('is-active', b.dataset.format === fmt));
  }

  clearBtn.addEventListener('click', () => {
    inputArea.value = '';
    setForcedFormat('auto');
    renderEmptyState();
    inputArea.focus();
  });

  validateBtn.addEventListener('click', runValidation);

  // Keyboard shortcut: Cmd/Ctrl+Enter to validate from the textarea.
  inputArea.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      runValidation();
    }
  });

  // ---- File drop / browse ----
  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('is-dragover'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('is-dragover');
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  });
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) loadFile(file);
  });

  function loadFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      inputArea.value = reader.result;
      if (/\.xml$/i.test(file.name)) setForcedFormat('xml');
      else if (/\.json$/i.test(file.name)) setForcedFormat('json');
      else setForcedFormat('auto');
      runValidation();
    };
    reader.readAsText(file);
  }

  // ---- Core validation flow ----
  function detectFormat(text) {
    if (forcedFormat !== 'auto') return forcedFormat;
    const trimmed = text.trim();
    if (trimmed.startsWith('<')) return 'xml';
    return 'json';
  }

  function runValidation() {
    const raw = inputArea.value;
    if (!raw.trim()) {
      renderEmptyState();
      return;
    }
    const format = detectFormat(raw);
    let resourceObj;
    try {
      resourceObj = format === 'xml' ? FhirXml.parseFhirXml(raw) : JSON.parse(raw);
    } catch (err) {
      renderParseError(format, err);
      return;
    }

    if (Array.isArray(resourceObj)) {
      renderParseError(format, new Error('The input parsed to a JSON array, not a single FHIR resource object.'));
      return;
    }

    const result = FhirValidator.validateResource(resourceObj, { strictAll: strictToggle.checked });
    renderResult(result);
  }

  strictToggle.addEventListener('change', () => {
    if (inputArea.value.trim()) runValidation();
  });

  // ---- Generator ----
  function populateResourceTypes() {
    const types = Object.keys(RESOURCE_DEFS).sort();
    genResourceType.innerHTML = types.map((t) => `<option value="${t}">${t}</option>`).join('');
    genResourceType.value = 'Patient';
  }

  function populateProfilesFor(resourceType) {
    const matches = Object.entries(PROFILE_DEFS).filter(([, p]) => p.baseResourceType === resourceType);
    const options = ['<option value="">Base FHIR R4 (no profile)</option>']
      .concat(matches.map(([url, p]) => `<option value="${escapeHtml(url)}">${escapeHtml(p.label)} (${escapeHtml(p.ig)})</option>`));
    genProfile.innerHTML = options.join('');
  }

  populateResourceTypes();
  populateProfilesFor(genResourceType.value);

  genResourceType.addEventListener('change', () => populateProfilesFor(genResourceType.value));

  genBtn.addEventListener('click', () => {
    const type = genResourceType.value;
    const profileUrl = genProfile.value || null;
    const injectError = genInjectError.checked;

    const { resource, injectedError } = FhirGenerator.generateResource(type, { profileUrl, injectError });

    setForcedFormat('json');
    inputArea.value = JSON.stringify(resource, null, 2);

    if (injectedError) {
      genNote.hidden = false;
      genNote.textContent = 'Intentional error: ' + injectedError;
    } else {
      genNote.hidden = true;
      genNote.textContent = '';
    }

    runValidation();
  });

  // ---- Rendering ----
  function renderEmptyState() {
    summaryEl.innerHTML = '';
    resultsBody.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true"><path d="M24 6l16 8v12c0 10-7 16-16 20-9-4-16-10-16-20V14z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M17 24l5 5 10-11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <p>Paste or drop a resource, then run <strong>Validate</strong>.</p>
        <p class="empty-state__sub">Structural checks only: resource shape, required fields, cardinality, and primitive data types &mdash; no terminology or profile lookups, and no network calls.</p>
      </div>`;
  }

  function renderParseError(format, err) {
    summaryEl.innerHTML = '';
    resultsBody.innerHTML = `
      <div class="result-banner result-banner--invalid">
        Couldn't parse this as ${format.toUpperCase()}: ${escapeHtml(err.message)}
      </div>`;
  }

  function renderResult(result) {
    const { issues, summary, valid } = result;

    summaryEl.innerHTML = `
      <span class="summary__item summary__item--error"><span class="summary__count">${summary.errorCount}</span><span class="summary__label">Errors</span></span>
      <span class="summary__item summary__item--warning"><span class="summary__count">${summary.warningCount}</span><span class="summary__label">Warnings</span></span>
      <span class="summary__item summary__item--info"><span class="summary__count">${summary.infoCount}</span><span class="summary__label">Info</span></span>
    `;

    const banner = valid
      ? `<div class="result-banner result-banner--valid">No structural errors found.${summary.warningCount ? ' Review the warnings below - they may still be valid.' : ''}</div>`
      : `<div class="result-banner result-banner--invalid">${summary.errorCount} structural issue${summary.errorCount === 1 ? '' : 's'} found.</div>`;

    if (issues.length === 0) {
      resultsBody.innerHTML = banner;
      return;
    }

    const order = { error: 0, warning: 1, info: 2 };
    const sorted = issues.slice().sort((a, b) => order[a.severity] - order[b.severity]);

    const rows = sorted.map((issue) => `
      <li class="issue-row issue-row--${issue.severity}">
        <span class="issue-row__rail" aria-hidden="true"></span>
        <div class="issue-row__body">
          <div class="issue-row__meta">
            <span class="issue-row__badge">${issue.severity}</span>
            ${issue.unverified ? '<span class="issue-row__badge issue-row__badge--unverified">unverified</span>' : ''}
            ${igTag(issue.message) ? `<span class="issue-row__badge issue-row__badge--ig">${igTag(issue.message)}</span>` : ''}
            <span class="issue-row__path">${escapeHtml(issue.path)}</span>
          </div>
          <div class="issue-row__message">${escapeHtml(stripIgTag(issue.message))}</div>
        </div>
      </li>
    `).join('');

    resultsBody.innerHTML = `${banner}<ul class="issue-list">${rows}</ul>`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function igTag(message) {
    const m = /^\[([^\]]+)\]\s/.exec(message);
    return m ? m[1] : null;
  }

  function stripIgTag(message) {
    return message.replace(/^\[([^\]]+)\]\s/, '');
  }
})();
