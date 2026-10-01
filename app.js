(() => {
  "use strict";

  const config = window.ASSESSMENT_CONFIG;
  const cases = [
    {
      number: 1,
      title: "Drop alert: would you buy?",
      context: "James Taylor and His All-Star Band · 26 September 2026 · Hollywood, Florida",
      taskTitle: "Your drop checker just alerted you",
      prompt: "You are monitoring this event for new inventory, and your drop checker has just alerted you that new tickets have been released. Would you buy?\n\nExplain what you would buy or avoid and why. Include your view on Section 101 at $428 per ticket, Section 302 and the 100-level sections.",
      inventory: [
        {name: "Section 101", detail: "100 level · front section beside the stage · $428 per ticket"},
        {name: "Section 302", detail: "300 level · upper tier · use the evidence tabs for prices"},
        {name: "100-level sections", detail: "Lower bowl · Sections 101–117 · front, sides and rear"}
      ],
      videoPrompt: "Case Study A — Explain what you would buy or avoid and why, including your view on Section 101 at $428 per ticket, Section 302 and the 100-level sections.",
      fields: [
        {key: "fullName", label: "Full name", type: "text", autocomplete: "name"},
        {key: "c1Decision", label: "What is your overall decision?", type: "select", options: ["", "Buy selected inventory", "Pass", "Need more information before deciding"]},
        {key: "c1BuyAvoid", label: "What would you buy or avoid, and why?", type: "textarea"},
        {key: "c1Section101", label: "Section 101 at $428 per ticket — would you buy it, and why?", type: "textarea"},
        {key: "c1Section302", label: "Section 302 — would you buy it, and why?", type: "textarea"},
        {key: "c1Level100", label: "The 100-level sections — what is your view, and why?", type: "textarea"}
      ],
      evidence: [
        {label: "Ticketmaster · standard inventory", src: "assets/case1/ticketmaster-standard.webp", alt: "Frozen Ticketmaster standard inventory and event map", meta: "Primary market"},
        {label: "Primary prices · zones and availability", src: "assets/case1/original-primary-prices.webp", alt: "Frozen original primary price ranges, availability and section map for the 100, 200 and 300 zones", meta: "Primary market · original prices"},
        {label: "StubHub · market overview", src: "assets/case1/stubhub-market.webp", alt: "Frozen StubHub overview with venue map and asking prices", meta: "Secondary market · overview"},
        {label: "StubHub · 200 level", src: "assets/case1/stubhub-zone-200-level.webp", alt: "Frozen StubHub asking prices for the 200-level zone", meta: "Secondary market · Sections 201–207"},
        {label: "StubHub · 100 level rear and sides", src: "assets/case1/stubhub-zone-100-rear-side.webp", alt: "Frozen StubHub asking prices for rear and side 100-level sections", meta: "Secondary market · Sections 113 and 117"},
        {label: "StubHub · 100 level front", src: "assets/case1/stubhub-zone-100-front.webp", alt: "Frozen StubHub asking prices for front 100-level sections", meta: "Secondary market · Sections 101–103"}
      ]
    },
    {
      number: 2,
      title: "Price this inventory",
      context: "Use the supplied frozen market evidence.",
      taskTitle: "Set the listing prices",
      prompt: "State your listing price for each pair. Explain how you reached it and what you would do next.",
      videoPrompt: "Case 2 — Explain the listing price you chose for Inventory A and Inventory B, the market evidence and assumptions you used, and what would cause you to reprice.",
      inventory: [
        {name: "Inventory A", detail: "2 tickets · Section 119, Row J · purchased at $200 per ticket"},
        {name: "Inventory B", detail: "2 tickets · Section 103, Row X, Seats 14–15 · purchased at $75 per ticket"}
      ],
      fields: [
        {key: "c2APrice", label: "Inventory A — listing price per ticket", type: "text", inputmode: "decimal"},
        {key: "c2AReason", label: "Inventory A — explain your pricing decision", type: "textarea"},
        {key: "c2BPrice", label: "Inventory B — listing price per ticket", type: "text", inputmode: "decimal"},
        {key: "c2BReason", label: "Inventory B — explain your pricing decision", type: "textarea"}
      ],
      evidence: [
        {label: "Inventory A · market evidence", src: "assets/case2/inventory-a-market-evidence.webp", alt: "Frozen marketplace evidence for pricing Inventory A", meta: "Frozen snapshot"},
        {label: "Inventory B · market evidence", src: "assets/case2/inventory-b-market-evidence.webp", alt: "Frozen marketplace evidence for pricing Inventory B", meta: "Frozen snapshot"}
      ]
    },
    {
      number: 3,
      title: "Automatiq sale error",
      context: "A marketplace sale reaches Automatiq and the error below appears.",
      taskTitle: "Respond to the incident",
      prompt: "What would you do next, and why?",
      videoPrompt: "Case 3 — Explain your first action after the Automatiq sale error, how you would protect the sale, what you would document, and when you would escalate.",
      fields: [{key: "c3Response", label: "What would you do next, and why?", type: "textarea"}],
      evidence: [
        {label: "Automatiq error", src: "assets/case3/automatiq-sale-error-1.webp", alt: "Automatiq sale error screenshot", meta: "Operational case"},
        {label: "Related order evidence", src: "assets/case3/automatiq-sale-error-2.webp", alt: "Related Automatiq order information screenshot", meta: "Operational case"}
      ]
    },
    {
      number: 4,
      title: "Checkout payment error",
      context: "You receive the payment error below during checkout.",
      taskTitle: "Respond to the incident",
      prompt: "What would you do next, and why?",
      videoPrompt: "Case 4 — Explain your troubleshooting order for the checkout payment error, how you would avoid a duplicate charge or purchase, and when you would stop and escalate.",
      fields: [{key: "c4Response", label: "What would you do next, and why?", type: "textarea"}],
      evidence: [{label: "Checkout error", src: "assets/case4/checkout-payment-error.webp", alt: "Checkout payment error screenshot", meta: "Operational case"}]
    },
    {
      number: 5,
      title: "Paused browser session",
      context: "The browser session becomes paused during checkout.",
      taskTitle: "Respond to the incident",
      prompt: "What would you do next, and why?",
      videoPrompt: "Case 5 — Explain your diagnosis of the paused browser session, your next action, what information you would preserve, how you would protect the session, and when you would escalate.",
      fields: [{key: "c5Response", label: "What would you do next, and why?", type: "textarea"}],
      evidence: [{label: "Paused session", src: "assets/case5/paused-browser-session.webp", alt: "Paused browser session screenshot", meta: "Operational case"}]
    }
  ];

  const finalVideoPrompt = "Why are you a strong fit for this role? This is your opportunity to impress us. Tell us about any relevant experience, technical ability, software knowledge, or anything else you want us to know that would help you succeed in the role.";
  const params = new URLSearchParams(location.search);
  const preview = params.get("preview") === "1";
  const rawCid = (params.get("cid") || "").trim();
  const rawEmail = (params.get("email") || "").trim();
  const activeCid = /^[A-Za-z0-9_-]{12,64}$/.test(rawCid) ? rawCid : (preview ? "QA-PREVIEW-ONLY" : "");
  const candidateEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) ? rawEmail : (preview ? "qa-preview@example.com" : "");
  const app = document.getElementById("assessmentApp");
  const gate = document.getElementById("accessGate");
  // Key unchanged from the one-video-per-case flow so in-progress candidates keep their drafts.
  const stateKey = `ticket-assessment:${activeCid}:guided-v1`;
  let state = {answers: {}, writtenComplete: {}, serverSaved: {}, currentCase: 0, phase: "written", submitted: false, submissionRequested: false};
  let current = 0;
  let submissionPending = false;
  let submissionTimer = null;
  let localDraftAvailable = true;
  let caseSavePending = false;

  if (!activeCid || !candidateEmail) {
    gate.hidden = false;
    return;
  }
  let localSaved = null;
  let sessionSaved = null;
  try {
    localSaved = JSON.parse(localStorage.getItem(stateKey) || "null");
  } catch (_) {
    localDraftAvailable = false;
  }
  try {
    sessionSaved = JSON.parse(sessionStorage.getItem(stateKey) || "null");
  } catch (_) {
    // sessionStorage is only a secondary copy.
  }
  const saved = [localSaved, sessionSaved]
    .filter(candidate => candidate && typeof candidate === "object")
    .sort((a, b) => (Number(b.revision || 0) - Number(a.revision || 0)) || (Number(b.savedAt || 0) - Number(a.savedAt || 0)))[0] || null;
  if (saved) state = {...state, ...saved, answers: saved.answers || {}, writtenComplete: saved.writtenComplete || {}, serverSaved: saved.serverSaved || {}};
  current = Number.isInteger(state.currentCase) && state.currentCase >= 0 && state.currentCase < cases.length ? state.currentCase : 0;

  app.hidden = false;
  document.getElementById("candidateChip").hidden = false;
  document.getElementById("candidateIdLabel").textContent = activeCid;
  document.getElementById("copyCandidateId").addEventListener("click", async () => {
    await navigator.clipboard.writeText(activeCid);
    showToast("Candidate ID copied");
  });

  const nav = document.getElementById("caseNav");
  const tabs = document.getElementById("evidenceTabs");
  const image = document.getElementById("evidenceImage");
  const viewer = document.getElementById("viewer");
  const writtenStage = document.getElementById("writtenStage");
  const reviewStage = document.getElementById("finalReviewSection");
  const videoStage = document.getElementById("videoSection");
  const finalSubmitButton = document.getElementById("finalSubmitButton");
  const openRecorder = document.getElementById("openRecorder");
  const sendRecordingIssue = document.getElementById("sendRecordingIssue");
  const caseButtons = [];

  cases.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "case-tab";
    button.dataset.number = String(item.number);
    button.textContent = `Case ${item.number}`;
    button.addEventListener("click", () => {
      if (caseSavePending) return;
      showWritten(index);
    });
    caseButtons.push(button);
    nav.appendChild(button);
  });

  const summaryButton = document.createElement("button");
  summaryButton.type = "button";
  summaryButton.className = "case-tab summary-tab";
  summaryButton.addEventListener("click", () => {
    if (caseSavePending) return;
    if (submissionLocked()) showVideos();
    else showReview();
  });
  nav.appendChild(summaryButton);

  function saveState() {
    state.currentCase = current;
    state.revision = Number(state.revision || 0) + 1;
    state.savedAt = Date.now();
    let saved = false;
    try {
      localStorage.setItem(stateKey, JSON.stringify(state));
      localDraftAvailable = true;
      saved = true;
    } catch (_) {
      localDraftAvailable = false;
    }
    try {
      sessionStorage.setItem(stateKey, JSON.stringify(state));
      saved = true;
    } catch (_) {
      // Secondary copy only.
    }
    return saved;
  }

  function writtenCaseComplete(index) {
    const item = cases[index];
    return Boolean(state.writtenComplete[index]) && item.fields.every(field => String(state.answers[field.key] || "").trim());
  }

  function writtenCompletionCount() {
    return cases.filter((_, index) => writtenCaseComplete(index)).length;
  }

  function firstIncompleteCase() {
    return cases.findIndex((_, index) => !writtenCaseComplete(index));
  }

  function submissionLocked() {
    return Boolean(state.submitted || state.submissionRequested);
  }

  function updateProgress(label) {
    document.getElementById("progressText").textContent = label;
    // Seven steps: five cases, written submission, videos. Video completion is only known to Hirevire.
    const steps = writtenCompletionCount() + (submissionLocked() ? 1 : 0);
    document.getElementById("progressBar").style.width = `${Math.max(4, (steps / 7) * 100)}%`;
    const onSummary = state.phase === "final-review" || state.phase === "videos";
    caseButtons.forEach((button, index) => {
      const done = writtenCaseComplete(index);
      button.classList.toggle("visited", done);
      button.classList.toggle("recorded", done);
      button.disabled = Boolean(caseSavePending);
      if (!onSummary && index === current) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
      const status = done ? "written answer saved" : "written answer not yet completed";
      button.setAttribute("aria-label", `Open Case ${index + 1}: ${status}`);
      button.title = `Case ${index + 1}: ${status}`;
    });
    summaryButton.textContent = submissionLocked() ? "Step 2: Videos" : "Submit written answers";
    summaryButton.dataset.number = submissionLocked() ? "Step 2: Videos" : "Submit";
    summaryButton.disabled = Boolean(caseSavePending);
    if (onSummary) summaryButton.setAttribute("aria-current", "step");
    else summaryButton.removeAttribute("aria-current");
  }

  function showStage(stage) {
    writtenStage.hidden = stage !== writtenStage;
    reviewStage.hidden = stage !== reviewStage;
    videoStage.hidden = stage !== videoStage;
  }

  function renderEvidence(index) {
    const ev = cases[current].evidence[index];
    image.src = ev.src;
    image.alt = ev.alt;
    image.onerror = () => {
      image.alt = "Evidence image could not be loaded. Please report this before submitting the assessment.";
      showToast("Evidence image failed to load");
    };
    document.getElementById("evidenceLabel").textContent = ev.label;
    document.getElementById("evidenceMeta").textContent = ev.meta;
    [...tabs.children].forEach((button, i) => button.setAttribute("aria-selected", String(i === index)));
    viewer.scrollTo(0, 0);
    setZoom("fit");
  }

  function makeField(field) {
    const wrapper = document.createElement("label");
    wrapper.className = "written-field";
    const labelText = document.createElement("span");
    labelText.textContent = field.label;
    const required = document.createElement("b");
    required.textContent = "Required";
    labelText.appendChild(required);
    let control;
    if (field.type === "textarea") {
      control = document.createElement("textarea");
      control.rows = 5;
    } else if (field.type === "select") {
      control = document.createElement("select");
      field.options.forEach((value, index) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = index === 0 ? "Select one" : value;
        control.appendChild(option);
      });
    } else {
      control = document.createElement("input");
      control.type = field.type;
      if (field.inputmode) control.inputMode = field.inputmode;
      if (field.autocomplete) control.autocomplete = field.autocomplete;
    }
    control.name = field.key;
    control.required = true;
    control.value = state.answers[field.key] || "";
    control.addEventListener("input", () => {
      state.answers[field.key] = control.value;
      delete state.serverSaved[current];
      const savedLocally = saveState();
      document.getElementById("draftState").textContent = savedLocally
        ? "Draft saved in this browser. Save the case to send a backup copy."
        : "Browser draft storage is unavailable. Save this case to send a backup copy.";
    });
    wrapper.append(labelText, control);
    return wrapper;
  }

  function showWritten(index) {
    current = index;
    state.phase = "written";
    saveState();
    showStage(writtenStage);
    const item = cases[index];
    const locked = submissionLocked();
    document.getElementById("caseNumber").textContent = `Case study ${item.number} of ${cases.length}`;
    document.getElementById("caseTitle").textContent = item.title;
    document.getElementById("caseContext").textContent = item.context;
    document.getElementById("taskTitle").textContent = item.taskTitle;
    document.getElementById("taskPrompt").textContent = item.prompt;
    const saveButton = document.getElementById("saveAndRecord");
    saveButton.hidden = locked;
    saveButton.disabled = locked;
    saveButton.textContent = state.reviewReady
      ? `Save Case ${item.number} and return to submit page`
      : (index < cases.length - 1 ? `Save Case ${item.number} and continue to Case ${item.number + 1}` : `Save Case ${item.number} and review your answers`);
    document.getElementById("caseControlHint").textContent = locked
      ? "Your written answers have been submitted. This view is read-only."
      : "Open any case from the tabs above. Nothing is final until you submit your written answers.";
    const previous = document.getElementById("previousCase");
    previous.disabled = !locked && !state.reviewReady && index === 0;
    previous.textContent = locked ? "Back to videos" : (state.reviewReady ? "Back to submit page" : "Previous case");

    const inventory = document.getElementById("inventory");
    inventory.replaceChildren();
    inventory.hidden = !item.inventory;
    (item.inventory || []).forEach(row => {
      const el = document.createElement("div");
      el.className = "inventory-row";
      const strong = document.createElement("strong");
      const span = document.createElement("span");
      strong.textContent = row.name;
      span.textContent = row.detail;
      el.append(strong, span);
      inventory.appendChild(el);
    });

    const fields = document.getElementById("writtenFields");
    fields.replaceChildren(...item.fields.map(makeField));
    if (locked) {
      fields.querySelectorAll("input, textarea, select").forEach(control => { control.disabled = true; });
    }
    document.getElementById("draftState").textContent = state.serverSaved[index]
      ? "Saved. A backup copy was sent when you last saved this case."
      : (localDraftAvailable
        ? "Drafts are saved in this browser. Saving the case also sends a backup copy."
        : "Browser draft storage is unavailable. Saving this case will still send a backup copy.");

    tabs.replaceChildren();
    item.evidence.forEach((ev, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.role = "tab";
      button.textContent = ev.label;
      button.setAttribute("aria-selected", String(i === 0));
      button.addEventListener("click", () => renderEvidence(i));
      tabs.appendChild(button);
    });
    renderEvidence(0);
    updateProgress(`Step 1 · Case ${item.number} of 5`);
    writtenStage.scrollIntoView({behavior: "smooth", block: "start"});
  }

  function providerUrl() {
    const url = new URL(config.videoProviderUrl, location.href);
    url.searchParams.set("custom", activeCid);
    url.searchParams.set("email", candidateEmail);
    const fullName = String(state.answers.fullName || "").trim().split(/\s+/);
    if (fullName[0]) url.searchParams.set("first_name", fullName[0]);
    if (fullName.length > 1) url.searchParams.set("last_name", fullName.slice(1).join(" "));
    return url.toString();
  }

  function browserInformation() {
    return JSON.stringify({
      userAgent: navigator.userAgent,
      language: navigator.language,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      screen: `${window.screen.width}x${window.screen.height}`,
      standalone: Boolean(window.navigator.standalone),
      online: navigator.onLine,
      pageUrl: `${location.origin}${location.pathname}`,
      recorderOpenedAt: state.recorderOpenedAt || ""
    });
  }

  async function submitRecoveryEvent({eventType, stage, answerSnapshot = "", issueCategory = "", issueDetails = ""}) {
    if (!config.recoveryFormResponseUrl || !config.recoveryEntries) {
      throw new Error("Online backup channel is unavailable");
    }
    const entries = config.recoveryEntries;
    const payload = new URLSearchParams();
    payload.set(`entry.${entries.eventType}`, eventType);
    payload.set(`entry.${entries.candidateId}`, activeCid);
    payload.set(`entry.${entries.applicationEmail}`, candidateEmail);
    payload.set(`entry.${entries.fullName}`, state.answers.fullName || "");
    payload.set(`entry.${entries.stage}`, stage);
    payload.set(`entry.${entries.answerSnapshot}`, answerSnapshot);
    payload.set(`entry.${entries.issueCategory}`, issueCategory);
    payload.set(`entry.${entries.issueDetails}`, issueDetails);
    payload.set(`entry.${entries.browserInformation}`, browserInformation());
    payload.set(`entry.${entries.clientTimestamp}`, new Date().toISOString());
    payload.set("fvv", "1");
    payload.set("draftResponse", "[]");
    payload.set("pageHistory", "0");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      await fetch(config.recoveryFormResponseUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"},
        body: payload.toString(),
        signal: controller.signal,
        keepalive: true
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  function renderReviewChecklist() {
    const checklist = document.getElementById("finalReviewChecklist");
    checklist.replaceChildren();
    cases.forEach((item, index) => {
      const done = writtenCaseComplete(index);
      const row = document.createElement("section");
      row.className = "summary-row";
      const heading = document.createElement("div");
      const title = document.createElement("strong");
      const subtitle = document.createElement("span");
      title.textContent = `Case ${index + 1}`;
      subtitle.textContent = item.title;
      heading.append(title, subtitle);
      const statuses = document.createElement("div");
      statuses.className = "summary-row-statuses";
      const status = document.createElement("span");
      status.className = `summary-status ${done ? "complete" : "missing"}`;
      status.textContent = done ? "✓ Complete" : "! Not finished";
      statuses.appendChild(status);
      const action = document.createElement("button");
      action.type = "button";
      action.className = "secondary summary-action";
      action.textContent = done ? `Review Case ${index + 1}` : `Finish Case ${index + 1}`;
      action.addEventListener("click", () => showWritten(index));
      row.append(heading, statuses, action);
      checklist.appendChild(row);
    });
  }

  function showReview() {
    state.reviewReady = true;
    state.phase = "final-review";
    saveState();
    showStage(reviewStage);
    renderReviewChecklist();
    const writtenCount = writtenCompletionCount();
    if (!submissionPending) {
      finalSubmitButton.disabled = writtenCount < cases.length;
      finalSubmitButton.textContent = "Submit written answers and continue to videos";
    }
    const remaining = cases.length - writtenCount;
    document.getElementById("finalReviewHint").textContent = remaining
      ? `${remaining} case${remaining === 1 ? "" : "s"} still to finish. Use the button beside each one.`
      : "All five cases are complete. You can still review any case before submitting.";
    updateProgress(`Step 1 · Submit written answers (${writtenCount}/5 complete)`);
    reviewStage.scrollIntoView({behavior: "smooth", block: "start"});
  }

  function renderVideoQuestions() {
    const list = document.getElementById("videoQuestions");
    list.replaceChildren();
    const prompts = [...cases.map(item => item.videoPrompt), finalVideoPrompt];
    prompts.forEach((prompt, index) => {
      const li = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = index < cases.length ? `Question ${index + 1} · Case ${index + 1}` : "Question 6 · Why you";
      const text = document.createElement("p");
      text.textContent = prompt;
      li.append(title, text);
      if (index < cases.length) {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = `Your Case ${index + 1} written answer`;
        const answers = document.createElement("dl");
        cases[index].fields.filter(field => field.key !== "fullName").forEach(field => {
          const dt = document.createElement("dt");
          const dd = document.createElement("dd");
          dt.textContent = field.label;
          dd.textContent = state.answers[field.key] || "—";
          answers.append(dt, dd);
        });
        details.append(summary, answers);
        li.appendChild(details);
      }
      list.appendChild(li);
    });
  }

  function showVideos() {
    state.phase = "videos";
    saveState();
    showStage(videoStage);
    if (config.videoProviderUrl) {
      openRecorder.href = providerUrl();
    } else {
      openRecorder.removeAttribute("href");
      openRecorder.textContent = "Video recorder unavailable. Please contact the hiring team.";
    }
    renderVideoQuestions();
    updateProgress("Step 2 · Record 6 videos in Hirevire");
    videoStage.scrollIntoView({behavior: "smooth", block: "start"});
  }

  openRecorder.addEventListener("click", () => {
    if (!openRecorder.getAttribute("href")) return;
    state.recorderOpenedAt = new Date().toISOString();
    saveState();
    // Funnel signal only: shows the hiring team who opened the recorder but never submitted.
    submitRecoveryEvent({eventType: "recorder_opened", stage: "videos"}).catch(() => {});
  });

  document.getElementById("previousCase").addEventListener("click", () => {
    if (submissionLocked()) showVideos();
    else if (state.reviewReady) showReview();
    else if (current > 0) showWritten(current - 1);
  });
  finalSubmitButton.addEventListener("click", submitWrittenAnswers);

  document.getElementById("writtenCaseForm").addEventListener("submit", async event => {
    event.preventDefault();
    if (caseSavePending || submissionLocked()) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const submittedCase = current;
    for (const field of cases[submittedCase].fields) state.answers[field.key] = String(form.elements[field.key].value || "").trim();
    state.writtenComplete[submittedCase] = true;
    const submittedControls = cases[submittedCase].fields.map(field => form.elements[field.key]);
    const draftState = document.getElementById("draftState");
    const saveButton = document.getElementById("saveAndRecord");
    caseSavePending = true;
    submittedControls.forEach(control => { control.disabled = true; });
    saveButton.disabled = true;
    saveButton.textContent = "Saving…";
    updateProgress(`Step 1 · Case ${cases[submittedCase].number} of 5 · saving`);
    const savedLocally = saveState();
    let cloudRequested = false;
    try {
      await submitRecoveryEvent({
        eventType: "case_saved",
        stage: `case-${submittedCase + 1}`,
        answerSnapshot: JSON.stringify(state.answers)
      });
      cloudRequested = true;
      state.serverSaved[submittedCase] = `requested:${new Date().toISOString()}`;
    } catch (error) {
      delete state.serverSaved[submittedCase];
    }
    saveState();
    if (!savedLocally && !cloudRequested) {
      // Neither copy is durable: stay on this case with answers intact rather than advance.
      state.writtenComplete[submittedCase] = false;
      caseSavePending = false;
      submittedControls.forEach(control => { control.disabled = false; });
      saveButton.disabled = false;
      saveButton.textContent = `Retry saving Case ${cases[submittedCase].number}`;
      draftState.textContent = "Your answers could not be saved. Check your connection and press Retry. Do not close this page.";
      updateProgress(`Step 1 · Case ${cases[submittedCase].number} of 5 · save required`);
      return;
    }
    caseSavePending = false;
    if (state.reviewReady || submittedCase === cases.length - 1) showReview();
    else showWritten(submittedCase + 1);
  });

  sendRecordingIssue.addEventListener("click", async () => {
    const category = document.getElementById("recordingIssueCategory").value;
    const details = document.getElementById("recordingIssueDetails").value.trim();
    const status = document.getElementById("recordingIssueStatus");
    sendRecordingIssue.disabled = true;
    status.textContent = "Sending…";
    try {
      await submitRecoveryEvent({
        eventType: "recording_issue",
        stage: "videos",
        issueCategory: category,
        issueDetails: details
      });
      status.textContent = "Report sent. Your written answers are safe. You can try the recorder again in another browser.";
      showToast("Problem report sent");
    } catch (error) {
      status.textContent = "The report could not be sent. Your written answers are still safe; please contact the hiring team.";
      showToast("Problem report could not be sent");
    } finally {
      sendRecordingIssue.disabled = false;
    }
  });

  function addHidden(form, name, value) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  function submitWrittenAnswers() {
    if (submissionPending || submissionLocked()) return;
    const missingCase = firstIncompleteCase();
    if (missingCase !== -1) {
      showToast(`Finish Case ${missingCase + 1} before submitting`);
      showWritten(missingCase);
      return;
    }
    const form = document.getElementById("writtenSubmitForm");
    form.replaceChildren();
    form.action = config.formResponseUrl;
    addHidden(form, "emailAddress", candidateEmail);
    addHidden(form, `entry.${config.formEntries.candidateId}`, activeCid);
    Object.entries(config.formEntries).forEach(([key, entryId]) => {
      if (key === "candidateId" || key === "declaration") return;
      addHidden(form, `entry.${entryId}`, state.answers[key] || "");
    });
    addHidden(form, `entry.${config.formEntries.declaration}`, "I confirm");
    addHidden(form, "fvv", "1");
    addHidden(form, "draftResponse", "[]");
    addHidden(form, "pageHistory", "0,1,2,3,4,5,6");
    state.submissionRequested = true;
    if (!saveState()) {
      state.submissionRequested = false;
      showToast("This browser cannot save your progress. Keep this page open and contact the hiring team.");
      return;
    }
    submissionPending = true;
    finalSubmitButton.disabled = true;
    finalSubmitButton.textContent = "Submitting written answers…";
    form.submit();
    clearTimeout(submissionTimer);
    submissionTimer = setTimeout(() => {
      if (!submissionPending) return;
      submissionPending = false;
      state.submissionRequested = false;
      saveState();
      finalSubmitButton.disabled = false;
      finalSubmitButton.textContent = "Retry submitting written answers";
      showToast("Submission did not confirm. Please retry.");
    }, 20000);
  }

  document.getElementById("writtenSubmitTarget").addEventListener("load", () => {
    if (!submissionPending) return;
    submissionPending = false;
    clearTimeout(submissionTimer);
    state.submissionRequested = true;
    saveState();
    showVideos();
  });

  function setZoom(mode) {
    image.style.width = mode === "fit" ? "100%" : `${mode}%`;
  }
  document.querySelectorAll("[data-zoom]").forEach(button => button.addEventListener("click", () => setZoom(button.dataset.zoom)));

  const dialog = document.getElementById("imageDialog");
  const dialogImage = document.getElementById("dialogImage");
  document.getElementById("openImage").addEventListener("click", () => {
    dialogImage.src = image.src;
    dialogImage.alt = image.alt;
    dialog.showModal();
  });
  document.getElementById("closeDialog").addEventListener("click", () => dialog.close());

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
  }

  if (submissionLocked()) {
    showVideos();
  } else if (state.phase === "written") {
    showWritten(current);
  } else if (state.phase === "final-review") {
    showReview();
  } else {
    // Saved by the old one-video-per-case flow ("video", "final-video"): resume the written step.
    const next = firstIncompleteCase();
    if (next === -1) showReview();
    else showWritten(next);
  }
})();
