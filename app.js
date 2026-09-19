(() => {
  "use strict";

  const cases = [
    {
      number: 1,
      title: "Mixed inventory: would you buy?",
      context: "James Taylor and His All-Star Band · 26 September 2026 · Hollywood, Florida",
      taskTitle: "Make a purchase decision",
      prompt: "Explain what you would buy or avoid and why. Include your view on:\n\n• Section 101 at $428 per ticket\n• Section 302\n• The 100-level sections",
      evidence: [
        {label: "Ticketmaster · standard inventory", src: "assets/case1/ticketmaster-standard.webp", alt: "Frozen Ticketmaster standard inventory and event map", meta: "Primary market"},
        {label: "Ticketmaster · resale inventory", src: "assets/case1/ticketmaster-resale.webp", alt: "Frozen Ticketmaster verified resale inventory and event map", meta: "Primary marketplace resale"},
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
      inventory: [
        {name: "Inventory A", detail: "2 tickets · Section 119, Row J · purchased at $200 per ticket"},
        {name: "Inventory B", detail: "2 tickets · Section 103, Row X, Seats 14–15 · purchased at $75 per ticket"}
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
      evidence: [
        {label: "Checkout error", src: "assets/case4/checkout-payment-error.webp", alt: "Checkout payment error screenshot", meta: "Operational case"}
      ]
    },
    {
      number: 5,
      title: "Paused browser session",
      context: "The browser session becomes paused during checkout.",
      taskTitle: "Respond to the incident",
      prompt: "What would you do next, and why?",
      evidence: [
        {label: "Paused session", src: "assets/case5/paused-browser-session.webp", alt: "Paused browser session screenshot", meta: "Operational case"}
      ]
    }
  ];

  const params = new URLSearchParams(location.search);
  const cid = (params.get("cid") || "").trim();
  const preview = params.get("preview") === "1";
  const validCid = /^[A-Za-z0-9_-]{12,64}$/.test(cid);
  const activeCid = validCid ? cid : (preview ? "QA-PREVIEW-ONLY" : "");
  const app = document.getElementById("assessmentApp");
  const gate = document.getElementById("accessGate");
  const chip = document.getElementById("candidateChip");
  const config = window.ASSESSMENT_CONFIG;

  if (!activeCid) {
    gate.hidden = false;
    return;
  }

  app.hidden = false;
  chip.hidden = false;
  document.getElementById("candidateIdLabel").textContent = activeCid;

  const formParams = new URLSearchParams({usp: "pp_url", [`entry.${config.candidateIdEntry}`]: activeCid, embedded: "true"});
  const formUrl = `${config.formUrl}?${formParams}`;
  const form = document.getElementById("responseForm");
  form.src = formUrl;
  document.getElementById("openFormNewTab").addEventListener("click", () => window.open(formUrl.replace("&embedded=true", ""), "_blank", "noopener"));
  const videoButton = document.getElementById("videoLink");
  const inlineVideoSection = document.getElementById("inlineVideoSection");
  const providerFrame = document.getElementById("videoProviderFrame");
  const providerStatus = document.getElementById("inlineProviderStatus");
  videoButton.addEventListener("click", () => {
    inlineVideoSection.hidden = false;
    inlineVideoSection.scrollIntoView({behavior: "smooth", block: "start"});
  });
  if (config.videoProviderUrl) {
    const providerUrl = new URL(config.videoProviderUrl, location.href);
    providerUrl.searchParams.set("custom", activeCid);
    const candidateEmail = (params.get("email") || "").trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateEmail)) {
      providerUrl.searchParams.set("email", candidateEmail);
    }
    providerFrame.src = providerUrl.toString();
    providerFrame.hidden = false;
    document.getElementById("recorderPlaceholder").hidden = true;
    providerStatus.classList.add("ready");
    document.querySelector("#inlineProviderStatus strong").textContent = "Hirevire recorder ready";
    document.querySelector("#inlineProviderStatus span:last-child").textContent = "Submit the written answers above, then complete all five recordings here.";
    window.addEventListener("message", event => {
      if (event.origin !== providerUrl.origin) return;
      const type = event.data && event.data.type;
      if (type === "interview.finished" || type === "videoask_submitted") {
        localStorage.setItem(`ticket-assessment:${activeCid}:video`, "completed");
        providerStatus.classList.add("ready");
        document.querySelector("#inlineProviderStatus strong").textContent = "Video explanations submitted";
        document.querySelector("#inlineProviderStatus span:last-child").textContent = "Your written and video assessment stages are complete.";
      }
    });
  }

  const nav = document.getElementById("caseNav");
  const tabs = document.getElementById("evidenceTabs");
  const image = document.getElementById("evidenceImage");
  const viewer = document.getElementById("viewer");
  const visitedKey = `ticket-assessment:${activeCid}:visited`;
  const visited = new Set(JSON.parse(localStorage.getItem(visitedKey) || "[]"));
  let current = Number(localStorage.getItem(`ticket-assessment:${activeCid}:case`) || 0);
  if (!Number.isInteger(current) || current < 0 || current >= cases.length) current = 0;
  let currentEvidence = 0;

  cases.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "case-tab";
    button.dataset.number = String(item.number);
    button.textContent = `Case ${item.number}`;
    button.addEventListener("click", () => renderCase(index));
    nav.appendChild(button);
  });

  function renderCase(index) {
    current = index;
    currentEvidence = 0;
    visited.add(index);
    localStorage.setItem(visitedKey, JSON.stringify([...visited]));
    localStorage.setItem(`ticket-assessment:${activeCid}:case`, String(index));
    const item = cases[index];
    document.getElementById("caseNumber").textContent = `Case study ${item.number} of ${cases.length}`;
    document.getElementById("caseTitle").textContent = item.title;
    document.getElementById("caseContext").textContent = item.context;
    document.getElementById("taskTitle").textContent = item.taskTitle;
    document.getElementById("taskPrompt").textContent = item.prompt;
    document.getElementById("progressText").textContent = `Case ${item.number} of ${cases.length}`;
    document.getElementById("progressBar").style.width = `${(item.number / cases.length) * 100}%`;
    [...nav.children].forEach((button, i) => {
      button.toggleAttribute("aria-current", i === index);
      if (i === index) button.setAttribute("aria-current", "step");
      button.classList.toggle("visited", visited.has(i));
    });
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
    document.getElementById("previousCase").disabled = index === 0;
    document.getElementById("nextCase").textContent = index === cases.length - 1 ? "Go to responses" : "Next case";
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

  function setZoom(mode) {
    if (mode === "fit") image.style.width = "100%";
    else image.style.width = `${mode}%`;
  }

  document.querySelectorAll("[data-zoom]").forEach(button => button.addEventListener("click", () => setZoom(button.dataset.zoom)));
  document.getElementById("previousCase").addEventListener("click", () => renderCase(Math.max(0, current - 1)));
  document.getElementById("nextCase").addEventListener("click", () => {
    if (current === cases.length - 1) document.getElementById("submitSection").scrollIntoView({behavior: "smooth", block: "start"});
    else renderCase(current + 1);
  });
  document.getElementById("copyCandidateId").addEventListener("click", async () => {
    await navigator.clipboard.writeText(activeCid);
    showToast("Candidate ID copied");
  });

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
    setTimeout(() => toast.classList.remove("show"), 1800);
  }

  renderCase(current);
})();
