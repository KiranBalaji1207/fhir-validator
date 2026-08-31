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
  const mmbMembers = document.getElementById('mmb-members');
  const mmbAddBtn = document.getElementById('mmb-add');
  const mmbGenerateBtn = document.getElementById('mmb-generate');
  const mmbRequestType = document.getElementById('mmb-request-type');

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

  // ---- Member Match request builder ----
  let mmbMemberCount = 0;

  function mmbCardHtml(defaults) {
    defaults = defaults || {};
    const d = (key, fallback) => escapeHtml(defaults[key] !== undefined ? defaults[key] : fallback);
    return `
      <div class="mmb-card">
        <div class="mmb-card__head">
          <span class="mmb-card__title">Member</span>
          <button type="button" class="link-btn mmb-remove">Remove</button>
        </div>
        <fieldset class="mmb-fieldset">
          <legend>Patient (MemberPatient)</legend>
          <div class="mmb-grid">
            <input data-field="given" placeholder="Given name" value="${d('given', '')}">
            <input data-field="family" placeholder="Family name" value="${d('family', '')}">
            <select data-field="gender">
              <option value="">Gender...</option>
              <option value="male" ${defaults.gender === 'male' ? 'selected' : ''}>male</option>
              <option value="female" ${defaults.gender === 'female' ? 'selected' : ''}>female</option>
              <option value="other" ${defaults.gender === 'other' ? 'selected' : ''}>other</option>
              <option value="unknown" ${defaults.gender === 'unknown' ? 'selected' : ''}>unknown</option>
            </select>
            <input type="date" data-field="birthDate" value="${d('birthDate', '')}" title="Birth date">
            <input data-field="oldIdSystem" placeholder="Old member ID system (URI)" value="${d('oldIdSystem', '')}">
            <input data-field="oldIdValue" placeholder="Old member ID value" value="${d('oldIdValue', '')}">
            <input data-field="assignerDisplay" placeholder="Old payer name (assigner)" value="${d('assignerDisplay', '')}">
          </div>
        </fieldset>
        <fieldset class="mmb-fieldset">
          <legend>Coverage to match</legend>
          <div class="mmb-grid">
            <input data-field="subscriberId" placeholder="Subscriber ID" value="${d('subscriberId', '')}">
            <input data-field="payorNpi" placeholder="Payor NPI" value="${d('payorNpi', '')}">
            <input data-field="payorDisplay" placeholder="Payor display name" value="${d('payorDisplay', '')}">
            <input data-field="groupValue" placeholder="Group number" value="${d('groupValue', '')}">
            <input data-field="planValue" placeholder="Plan identifier" value="${d('planValue', '')}">
            <input type="date" data-field="periodStart" value="${d('periodStart', '')}" title="Coverage period start">
            <input type="date" data-field="periodEnd" value="${d('periodEnd', '')}" title="Coverage period end">
          </div>
        </fieldset>
        <label class="mmb-checkbox-row">
          <input type="checkbox" class="mmb-toggle-link">
          Include CoverageToLink (new/prospective coverage)
        </label>
        <fieldset class="mmb-fieldset mmb-link-fields" hidden>
          <legend>Coverage to link</legend>
          <div class="mmb-grid">
            <input data-field="linkPayorNpi" placeholder="New payor NPI">
            <input data-field="linkPayorDisplay" placeholder="New payor display name">
            <input data-field="linkSubscriberId" placeholder="New subscriber ID">
          </div>
        </fieldset>
        <fieldset class="mmb-fieldset">
          <legend>Consent</legend>
          <div class="mmb-grid">
            <input data-field="performerNpi" placeholder="Performer (provider) NPI" value="${d('performerNpi', '')}">
            <input data-field="performerDisplay" placeholder="Performer display" value="${d('performerDisplay', '')}">
            <input data-field="orgNpi" placeholder="Organization NPI" value="${d('orgNpi', '')}">
            <input data-field="orgDisplay" placeholder="Organization display" value="${d('orgDisplay', '')}">
            <input data-field="policyUri" placeholder="Policy URI" value="${d('policyUri', '')}">
            <input type="datetime-local" data-field="consentDateTime" value="${d('consentDateTime', '')}" title="Consent date/time">
          </div>
        </fieldset>
      </div>`;
  }

  function mmbVal(card, field) {
    const el = card.querySelector(`[data-field="${field}"]`);
    return el ? el.value.trim() : '';
  }

  function addMmbMember(defaults) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = mmbCardHtml(defaults);
    const card = wrapper.firstElementChild;
    mmbMembers.appendChild(card);
    mmbMemberCount++;
    renumberMmbCards();

    card.querySelector('.mmb-remove').addEventListener('click', () => {
      card.remove();
      renumberMmbCards();
    });
    const toggle = card.querySelector('.mmb-toggle-link');
    const linkFields = card.querySelector('.mmb-link-fields');
    toggle.addEventListener('change', () => { linkFields.hidden = !toggle.checked; });
  }

  function renumberMmbCards() {
    Array.from(mmbMembers.querySelectorAll('.mmb-card')).forEach((card, i) => {
      card.querySelector('.mmb-card__title').textContent = `Member ${i + 1}`;
    });
  }

  mmbAddBtn.addEventListener('click', () => addMmbMember());

  // Seed one example member so the section is useful without any typing.
  addMmbMember({
    given: 'Robert', family: 'Johnson', gender: 'male', birthDate: '1965-08-15',
    oldIdSystem: 'http://example.org/old-payer/identifiers/member', oldIdValue: 'PAT-001',
    assignerDisplay: 'Previous Health Plan',
    subscriberId: '12345678', payorNpi: '9876543210', payorDisplay: 'Previous Health Plan',
    groupValue: 'EMPLOY-12345', planValue: 'PPO-GOLD', periodStart: '2023-01-01', periodEnd: '2023-12-31',
    performerNpi: '1234567893', performerDisplay: 'Dr. Susan Smith, MD',
    orgNpi: '1982947230', orgDisplay: 'Springfield Medical Center',
    policyUri: 'https://example.org/provider-attestation-policy', consentDateTime: '2024-12-10T14:30'
  });

  function buildMemberBundle(card, index) {
    const patientId = `patient-${index + 1}`;
    const coverageId = `coverage-${index + 1}`;
    const consentId = `consent-${index + 1}`;

    // --- Patient ---
    const patient = { resourceType: 'Patient', id: patientId };
    const given = mmbVal(card, 'given');
    const family = mmbVal(card, 'family');
    if (given || family) {
      const nameEntry = { use: 'official' };
      if (family) nameEntry.family = family;
      if (given) nameEntry.given = [given];
      patient.name = [nameEntry];
    }
    const oldIdValue = mmbVal(card, 'oldIdValue');
    if (oldIdValue) {
      const identifier = {
        type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'MB' }] },
        value: oldIdValue
      };
      const oldIdSystem = mmbVal(card, 'oldIdSystem');
      if (oldIdSystem) identifier.system = oldIdSystem;
      const assignerDisplay = mmbVal(card, 'assignerDisplay');
      if (assignerDisplay) identifier.assigner = { display: assignerDisplay };
      patient.identifier = [identifier];
    }
    const gender = mmbVal(card, 'gender');
    if (gender) patient.gender = gender;
    const birthDate = mmbVal(card, 'birthDate');
    if (birthDate) patient.birthDate = birthDate;

    const part = [{ name: 'MemberPatient', resource: patient }];

    // --- CoverageToMatch ---
    const coverage = {
      resourceType: 'Coverage', id: coverageId, status: 'draft',
      type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'HIP', display: 'health insurance plan policy' }] },
      subscriber: { reference: `Patient/${patientId}` },
      beneficiary: { reference: `Patient/${patientId}` },
      relationship: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/subscriber-relationship', code: 'self' }] }
    };
    const subscriberId = mmbVal(card, 'subscriberId');
    if (subscriberId) coverage.subscriberId = subscriberId;
    const periodStart = mmbVal(card, 'periodStart');
    const periodEnd = mmbVal(card, 'periodEnd');
    if (periodStart || periodEnd) {
      coverage.period = {};
      if (periodStart) coverage.period.start = periodStart;
      if (periodEnd) coverage.period.end = periodEnd;
    }
    const payorNpi = mmbVal(card, 'payorNpi');
    const payorDisplay = mmbVal(card, 'payorDisplay');
    if (payorNpi || payorDisplay) {
      const payor = {};
      if (payorNpi) payor.identifier = { system: 'http://hl7.org/fhir/sid/us-npi', value: payorNpi };
      if (payorDisplay) payor.display = payorDisplay;
      coverage.payor = [payor];
    }
    const classes = [];
    const groupValue = mmbVal(card, 'groupValue');
    const planValue = mmbVal(card, 'planValue');
    if (groupValue) classes.push({ type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/coverage-class', code: 'group' }] }, value: groupValue });
    if (planValue) classes.push({ type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/coverage-class', code: 'plan' }] }, value: planValue });
    if (classes.length) coverage.class = classes;

    part.push({ name: 'CoverageToMatch', resource: coverage });

    // --- CoverageToLink (optional) ---
    const linkToggle = card.querySelector('.mmb-toggle-link');
    if (linkToggle && linkToggle.checked) {
      const linkPayorNpi = mmbVal(card, 'linkPayorNpi');
      const linkPayorDisplay = mmbVal(card, 'linkPayorDisplay');
      const linkSubscriberId = mmbVal(card, 'linkSubscriberId');
      const coverageLink = {
        resourceType: 'Coverage', id: `coverage-link-${index + 1}`, status: 'draft',
        beneficiary: { reference: `Patient/${patientId}` },
        relationship: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/subscriber-relationship', code: 'self' }] }
      };
      if (linkSubscriberId) coverageLink.subscriberId = linkSubscriberId;
      if (linkPayorNpi || linkPayorDisplay) {
        const payor = {};
        if (linkPayorNpi) payor.identifier = { system: 'http://hl7.org/fhir/sid/us-npi', value: linkPayorNpi };
        if (linkPayorDisplay) payor.display = linkPayorDisplay;
        coverageLink.payor = [payor];
      }
      part.push({ name: 'CoverageToLink', resource: coverageLink });
    }

    // --- Consent ---
    const consent = {
      resourceType: 'Consent', id: consentId, status: 'active',
      scope: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/consentscope', code: 'patient-privacy' }] },
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'IDSCL', display: 'Information Disclosure' }] }],
      patient: { reference: `Patient/${patientId}` }
    };
    const consentDateTime = mmbVal(card, 'consentDateTime');
    if (consentDateTime) consent.dateTime = consentDateTime.length === 16 ? consentDateTime + ':00Z' : consentDateTime;
    const performerNpi = mmbVal(card, 'performerNpi');
    const performerDisplay = mmbVal(card, 'performerDisplay');
    if (performerNpi || performerDisplay) {
      const performer = {};
      if (performerNpi) performer.identifier = { system: 'http://hl7.org/fhir/sid/us-npi', value: performerNpi };
      if (performerDisplay) performer.display = performerDisplay;
      consent.performer = [performer];
    }
    const orgNpi = mmbVal(card, 'orgNpi');
    const orgDisplay = mmbVal(card, 'orgDisplay');
    if (orgNpi || orgDisplay) {
      const org = {};
      if (orgNpi) org.identifier = { system: 'http://hl7.org/fhir/sid/us-npi', value: orgNpi };
      if (orgDisplay) org.display = orgDisplay;
      consent.organization = [org];
    }
    const policyUri = mmbVal(card, 'policyUri');
    if (policyUri) consent.policy = [{ uri: policyUri }];
    consent.provision = { type: 'permit' };
    if (periodStart || periodEnd) {
      consent.provision.period = {};
      if (periodStart) consent.provision.period.start = periodStart;
      if (periodEnd) consent.provision.period.end = periodEnd;
    }

    part.push({ name: 'Consent', resource: consent });

    return { name: 'MemberBundle', part };
  }

  mmbGenerateBtn.addEventListener('click', () => {
    const requestType = mmbRequestType.value;
    const profileUrl = requestType === 'provider'
      ? 'http://hl7.org/fhir/us/davinci-pdex/StructureDefinition/provider-parameters-multi-member-match-bundle-in'
      : 'http://hl7.org/fhir/us/davinci-pdex/StructureDefinition/pdex-parameters-multi-member-match-bundle-in';

    const cards = Array.from(mmbMembers.querySelectorAll('.mmb-card'));
    const payload = {
      resourceType: 'Parameters',
      id: requestType === 'provider' ? 'provider-member-match-request' : 'payer-multi-member-match-in',
      meta: { profile: [profileUrl] },
      parameter: cards.map((card, i) => buildMemberBundle(card, i))
    };

    setForcedFormat('json');
    inputArea.value = JSON.stringify(payload, null, 2);
    genNote.hidden = true;
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
