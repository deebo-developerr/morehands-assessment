(() => {
  "use strict";

  const config = window.ASSESSMENT_CONFIG;
  const cases = [
    {
      number: 1,
      title: "Mixed inventory: would you buy?",
      context: "James Taylor and His All-Star Band · 26 September 2026 · Hollywood, Florida",
      taskTitle: "Make a purchase decision",
      prompt: "Explain what you would buy or avoid and why. Include your view on Section 101 at $428 per ticket, Section 302 and the 100-level sections.",
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
  const stateKey = `ticket-assessment:${activeCid}:guided-v1`;
  let state = {answers: {}, writtenComplete: {}, serverSaved: {}, recorded: {}, currentCase: 0, phase: "written", submitted: false};
  let current = 0;
  let currentEvidence = 0;
  let providerStarted = false;
  let providerLoaded = false;
  let providerLoadTimer = null;
  let submissionPending = false;
  let submissionTimer = null;

  if (!activeCid || !candidateEmail) {
    gate.hidden = false;
    return;
  }
  try {
    const saved = JSON.parse(localStorage.getItem(stateKey) || "null");
    if (saved && typeof saved === "object") state = {...state, ...saved, answers: saved.answers || {}, writtenComplete: saved.writtenComplete || {}, serverSaved: saved.serverSaved || {}, recorded: saved.recorded || {}};
  } catch (_) {}
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
  const videoStage = document.getElementById("inlineVideoSection");
  const completionStage = document.getElementById("completionSection");
  const providerFrame = document.getElementById("videoProviderFrame");
  const providerStatus = document.getElementById("inlineProviderStatus");
  const recordingConfirmed = document.getElementById("recordingConfirmed");
  const videoReturnButton = document.getElementById("videoReturnButton");
  const openRecorderDirect = document.getElementById("openRecorderDirect");
  const sendRecordingIssue = document.getElementById("sendRecordingIssue");

  cases.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "case-tab";
    button.dataset.number = String(item.number);
    button.textContent = `Case ${item.number}`;
    button.addEventListener("click", () => {
      if (state.submitted) return;
      showWritten(index);
    });
    nav.appendChild(button);
  });

  function saveState() {
    state.currentCase = current;
    localStorage.setItem(stateKey, JSON.stringify(state));
  }

  function furthestWrittenCase() {
    let furthest = 0;
    for (let i = 0; i < cases.length; i += 1) {
      if (state.writtenComplete[i]) furthest = Math.min(i + 1, cases.length - 1);
      else break;
    }
    return furthest;
  }

  function completedSteps() {
    const written = Object.values(state.writtenComplete).filter(Boolean).length;
    const videos = Object.values(state.recorded).filter(Boolean).length;
    return Math.min(11, written + videos);
  }

  function updateProgress(label) {
    document.getElementById("progressText").textContent = label;
    document.getElementById("progressBar").style.width = `${Math.max(4, (completedSteps() / 11) * 100)}%`;
    [...nav.children].forEach((button, index) => {
      button.classList.toggle("visited", Boolean(state.writtenComplete[index]));
      button.classList.toggle("recorded", Boolean(state.recorded[index]));
      button.classList.toggle("pending", Boolean(state.writtenComplete[index]) && !state.recorded[index]);
      button.disabled = Boolean(state.submitted);
      if (index === current) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
      const status = state.recorded[index]
        ? "written answer and video recorded"
        : (state.writtenComplete[index] ? "written answer saved; video still pending" : "written answer not yet completed");
      button.setAttribute("aria-label", `Open Case ${index + 1} written section — ${status}`);
      button.title = `Open Case ${index + 1}: ${status}`;
    });
  }

  function renderEvidence(index) {
    currentEvidence = index;
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
      saveState();
      document.getElementById("draftState").textContent = "Draft saved in this browser. Save the case to request a fresh online recovery backup.";
    });
    wrapper.append(labelText, control);
    return wrapper;
  }

  function showWritten(index) {
    current = index;
    state.phase = "written";
    saveState();
    writtenStage.hidden = false;
    videoStage.hidden = true;
    completionStage.hidden = true;
    currentEvidence = 0;
    const item = cases[index];
    document.getElementById("caseNumber").textContent = `Case study ${item.number} of ${cases.length}`;
    document.getElementById("caseTitle").textContent = item.title;
    document.getElementById("caseContext").textContent = item.context;
    document.getElementById("taskTitle").textContent = item.taskTitle;
    document.getElementById("taskPrompt").textContent = item.prompt;
    const saveButton = document.getElementById("saveAndRecord");
    saveButton.disabled = false;
    saveButton.textContent = `Save answers and record Case ${item.number} explanation`;
    document.getElementById("caseControlHint").textContent = "Use the case tabs above to review or complete written cases in any order. You may record videos later, but all six are required before final submission.";
    const previous = document.getElementById("previousCase");
    previous.disabled = true;
    previous.textContent = index === 0 ? "Start with Case 1" : "Previous case recorded";

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
    document.getElementById("draftState").textContent = state.serverSaved[index]
      ? "Saved in this browser; an online recovery backup was requested when you last continued."
      : "Drafts are saved in this browser. Continuing also requests an online recovery backup.";

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
    updateProgress(`Case ${item.number} of 5 · written answer`);
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

  function setProviderStatus(kind, title, detail) {
    providerStatus.classList.remove("ready", "status-loaded", "status-warning", "status-error");
    if (kind) providerStatus.classList.add(kind);
    providerStatus.querySelector("strong").textContent = title;
    providerStatus.querySelector("span:last-child").textContent = detail;
  }

  function ensureProviderLoaded() {
    if (!config.videoProviderUrl) {
      setProviderStatus("status-error", "Hirevire link unavailable", "Please report the problem to the hiring team. Your written answers remain saved in this browser.");
      return;
    }
    const url = providerUrl();
    openRecorderDirect.href = url;
    if (providerStarted) return;
    providerStarted = true;
    providerLoaded = false;
    setProviderStatus("", "Loading Hirevire", "The page is loading; camera and microphone checks happen inside Hirevire.");
    providerFrame.src = url;
    clearTimeout(providerLoadTimer);
    providerLoadTimer = setTimeout(() => {
      if (providerLoaded) return;
      setProviderStatus("status-warning", "Embedded recorder is taking longer than expected", "Use “Open recorder in a new tab” above. Your browser-saved written answers will remain here.");
      document.getElementById("recorderPlaceholder").hidden = false;
    }, 12000);
  }

  providerFrame.addEventListener("load", () => {
    if (!providerStarted) return;
    providerLoaded = true;
    clearTimeout(providerLoadTimer);
    providerFrame.hidden = false;
    document.getElementById("recorderPlaceholder").hidden = true;
    setProviderStatus("status-warning", "Hirevire frame responded", "This only confirms that the embedded frame navigated. It does not confirm camera, microphone, recording or submission. Use the new-tab option if anything looks wrong.");
  });

  providerFrame.addEventListener("error", () => {
    clearTimeout(providerLoadTimer);
    providerLoaded = false;
    providerFrame.hidden = true;
    document.getElementById("recorderPlaceholder").hidden = false;
    setProviderStatus("status-error", "Embedded Hirevire page could not load", "Use “Open recorder in a new tab” above. Your browser-saved written answers will remain here.");
  });

  function browserInformation() {
    return JSON.stringify({
      userAgent: navigator.userAgent,
      language: navigator.language,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      screen: `${window.screen.width}x${window.screen.height}`,
      standalone: Boolean(window.navigator.standalone),
      online: navigator.onLine,
      pageUrl: `${location.origin}${location.pathname}`,
      providerState: providerLoaded ? "frame-loaded" : (providerStarted ? "loading-or-failed" : "not-started")
    });
  }

  function submitRecoveryEvent({eventType, stage, answerSnapshot = "", issueCategory = "", issueDetails = ""}) {
    if (!config.recoveryFormResponseUrl || !config.recoveryEntries) {
      throw new Error("Online backup channel is unavailable");
    }
    const form = document.createElement("form");
    form.method = "post";
    form.target = "recoverySubmitTarget";
    form.hidden = true;
    const entries = config.recoveryEntries;
    form.action = config.recoveryFormResponseUrl;
    addHidden(form, `entry.${entries.eventType}`, eventType);
    addHidden(form, `entry.${entries.candidateId}`, activeCid);
    addHidden(form, `entry.${entries.applicationEmail}`, candidateEmail);
    addHidden(form, `entry.${entries.fullName}`, state.answers.fullName || "");
    addHidden(form, `entry.${entries.stage}`, stage);
    addHidden(form, `entry.${entries.answerSnapshot}`, answerSnapshot);
    addHidden(form, `entry.${entries.issueCategory}`, issueCategory);
    addHidden(form, `entry.${entries.issueDetails}`, issueDetails);
    addHidden(form, `entry.${entries.browserInformation}`, browserInformation());
    addHidden(form, `entry.${entries.clientTimestamp}`, new Date().toISOString());
    addHidden(form, "fvv", "1");
    addHidden(form, "draftResponse", "[]");
    addHidden(form, "pageHistory", "0");
    document.body.appendChild(form);
    form.submit();
    setTimeout(() => form.remove(), 30000);
  }

  function showVideo(caseIndex) {
    current = caseIndex;
    state.phase = "video";
    saveState();
    ensureProviderLoaded();
    writtenStage.hidden = true;
    videoStage.hidden = false;
    completionStage.hidden = true;
    recordingConfirmed.checked = false;
    videoReturnButton.disabled = true;
    const item = cases[caseIndex];
    document.getElementById("videoEyebrow").textContent = `Case ${item.number} video explanation`;
    document.getElementById("videoTitle").textContent = `Record Hirevire Question ${item.number}`;
    document.getElementById("videoStepBadge").textContent = `Question ${item.number} of 6`;
    document.getElementById("videoInstructions").textContent = item.videoPrompt;
    const beforeRecording = item.number === 1
      ? "Record only Hirevire Question 1."
      : `If Hirevire is still showing an earlier question, use its red Next button only until Question ${item.number} is displayed, before recording.`;
    document.getElementById("videoReturnInstructionText").textContent = `${beforeRecording} After recording and reviewing Question ${item.number}, STOP. Do not press Hirevire’s red Next button and do not record later answers. Return below and press the blue assessment button.`;
    document.getElementById("recordingConfirmText").textContent = `I recorded only Hirevire Question ${item.number} for this step. I did not record any later questions, and I can see Question ${item.number} saved.`;
    videoReturnButton.textContent = caseIndex < 4 ? `I recorded Question ${item.number} — continue to Case ${item.number + 1}` : "I recorded Question 5 — continue to the final fit question";
    document.getElementById("videoReturnHint").textContent = `Made an error? Use Hirevire’s Retake before continuing. After Question ${item.number} is correct, press the blue button above—not the red Next button.`;
    updateProgress(`Case ${item.number} of 5 · video defence`);
    videoStage.scrollIntoView({behavior: "smooth", block: "start"});
  }

  function showFinalVideo() {
    state.phase = "final-video";
    saveState();
    ensureProviderLoaded();
    writtenStage.hidden = true;
    videoStage.hidden = false;
    completionStage.hidden = true;
    recordingConfirmed.checked = false;
    videoReturnButton.disabled = true;
    document.getElementById("videoEyebrow").textContent = "Final video question";
    document.getElementById("videoTitle").textContent = "Record Hirevire Question 6 and submit Hirevire";
    document.getElementById("videoStepBadge").textContent = "Question 6 of 6";
    document.getElementById("videoInstructions").textContent = finalVideoPrompt;
    document.getElementById("videoReturnInstructionText").textContent = "Record only Hirevire Question 6. You may use Retake before submission if it is offered. This is the final video: submit the complete Hirevire application, then return below and press the blue assessment button.";
    document.getElementById("recordingConfirmText").textContent = "I have recorded Question 6 and submitted the complete Hirevire application.";
    videoReturnButton.textContent = "Submit my written answers and finish";
    document.getElementById("videoReturnHint").textContent = "Only continue after Hirevire confirms that all six recordings were submitted.";
    updateProgress("Final fit question · video and submission");
    videoStage.scrollIntoView({behavior: "smooth", block: "start"});
  }

  document.getElementById("writtenCaseForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    for (const field of cases[current].fields) state.answers[field.key] = String(form.elements[field.key].value || "").trim();
    state.writtenComplete[current] = true;
    const draftState = document.getElementById("draftState");
    try {
      submitRecoveryEvent({
        eventType: "case_saved",
        stage: `case-${current + 1}`,
        answerSnapshot: JSON.stringify(state.answers)
      });
      state.serverSaved[current] = `requested:${new Date().toISOString()}`;
      draftState.textContent = "Saved in this browser. An online recovery backup was requested.";
    } catch (error) {
      delete state.serverSaved[current];
      draftState.textContent = "Saved in this browser. The online backup could not be requested, but you can continue to Hirevire.";
    }
    saveState();
    if (state.recorded[current] && current === 4) showFinalVideo();
    else if (state.recorded[current] && current < 4) showWritten(current + 1);
    else showVideo(current);
  });

  sendRecordingIssue.addEventListener("click", () => {
    const category = document.getElementById("recordingIssueCategory").value;
    const details = document.getElementById("recordingIssueDetails").value.trim();
    const status = document.getElementById("recordingIssueStatus");
    sendRecordingIssue.disabled = true;
    status.textContent = "Submitting technical report…";
    try {
      submitRecoveryEvent({
        eventType: "recording_issue",
        stage: state.phase === "final-video" ? "question-6" : `question-${current + 1}`,
        issueCategory: category,
        issueDetails: details
      });
      status.textContent = "Report request started. This page cannot verify receipt. Use “Open recorder in a new tab” above to continue.";
      showToast("Recording problem report requested");
    } catch (error) {
      status.textContent = "The report could not be submitted. Your written answers are still safe; please contact the hiring team.";
      showToast("Problem report could not be submitted");
    } finally {
      sendRecordingIssue.disabled = false;
    }
  });

  recordingConfirmed.addEventListener("change", () => {
    videoReturnButton.disabled = !recordingConfirmed.checked;
  });

  videoReturnButton.addEventListener("click", () => {
    if (!recordingConfirmed.checked) return;
    if (state.phase === "final-video") {
      state.recorded[5] = true;
      saveState();
      submitWrittenAnswers();
      return;
    }
    state.recorded[current] = true;
    saveState();
    if (current < 4) showWritten(current + 1);
    else showFinalVideo();
  });

  function addHidden(form, name, value) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  function submitWrittenAnswers() {
    const missingCase = cases.findIndex((item, index) => !state.writtenComplete[index] || item.fields.some(field => !String(state.answers[field.key] || "").trim()));
    if (missingCase !== -1) {
      showToast(`Complete Case ${missingCase + 1} before submitting`);
      showWritten(missingCase);
      return;
    }
    const missingVideo = Array.from({length: 6}, (_, index) => index).find(index => !state.recorded[index]);
    if (missingVideo !== undefined) {
      showToast(`Record Hirevire Question ${missingVideo + 1} before submitting`);
      if (missingVideo < 5) showVideo(missingVideo);
      else showFinalVideo();
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
    submissionPending = true;
    videoReturnButton.disabled = true;
    videoReturnButton.textContent = "Submitting written answers…";
    form.submit();
    clearTimeout(submissionTimer);
    submissionTimer = setTimeout(() => {
      if (!submissionPending) return;
      submissionPending = false;
      videoReturnButton.disabled = false;
      videoReturnButton.textContent = "Retry written-answer submission";
      showToast("Written submission did not confirm. Please retry.");
    }, 20000);
  }

  document.getElementById("writtenSubmitTarget").addEventListener("load", () => {
    if (!submissionPending) return;
    submissionPending = false;
    clearTimeout(submissionTimer);
    state.submitted = true;
    state.phase = "complete";
    saveState();
    writtenStage.hidden = true;
    videoStage.hidden = true;
    completionStage.hidden = false;
    updateProgress("Written assessment submitted");
    document.getElementById("progressBar").style.width = "100%";
    completionStage.scrollIntoView({behavior: "smooth", block: "start"});
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

  if (state.submitted) {
    writtenStage.hidden = true;
    videoStage.hidden = true;
    completionStage.hidden = false;
    updateProgress("Written assessment submitted");
    document.getElementById("progressBar").style.width = "100%";
  } else if (state.phase === "final-video") {
    showFinalVideo();
  } else if (state.phase === "video" && state.writtenComplete[current] && !state.recorded[current]) {
    showVideo(current);
  } else {
    showWritten(current);
  }
})();
