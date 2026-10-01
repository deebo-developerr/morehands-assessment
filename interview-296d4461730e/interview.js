(() => {
  "use strict";

  // The interview question is decrypted with the key in the URL fragment (#k=...);
  // the fragment is never sent to the server, so only holders of the full link can read it.
  const {cases} = window.ASSESSMENT_CASES;
  const nav = document.getElementById("sectionNav");
  const tabs = document.getElementById("evidenceTabs");
  const image = document.getElementById("evidenceImage");
  const viewer = document.getElementById("viewer");
  const navButtons = [];
  let sections = [];
  let current = 0;

  function fromB64url(text) {
    const b64 = text.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - text.length % 4) % 4);
    return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  }

  function lock(title, text) {
    document.getElementById("lockedTitle").textContent = title;
    document.getElementById("lockedText").textContent = text;
    document.getElementById("lockedGate").hidden = false;
  }

  async function loadInterview() {
    const keyText = new URLSearchParams(location.hash.slice(1)).get("k");
    if (!keyText) throw new Error("missing-key");
    const bundle = await (await fetch("bundle.json", {cache: "no-store"})).json();
    const key = await crypto.subtle.importKey("raw", fromB64url(keyText), "AES-GCM", false, ["decrypt"]);
    const plain = await crypto.subtle.decrypt({name: "AES-GCM", iv: fromB64url(bundle.iv)}, key, fromB64url(bundle.ct));
    return JSON.parse(new TextDecoder().decode(plain));
  }

  function renderEvidence(index) {
    const ev = sections[current].evidence[index];
    image.src = ev.src;
    image.alt = ev.alt;
    document.getElementById("evidenceLabel").textContent = ev.label;
    document.getElementById("evidenceMeta").textContent = ev.meta;
    [...tabs.children].forEach((button, i) => button.setAttribute("aria-selected", String(i === index)));
    viewer.scrollTo(0, 0);
    setZoom("fit");
  }

  function show(index) {
    current = index;
    const section = sections[index];
    navButtons.forEach((button, i) => {
      if (i === index) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    document.getElementById("sectionEyebrow").textContent = section.eyebrow;
    document.getElementById("sectionTitle").textContent = section.title;
    document.getElementById("sectionContext").textContent = section.context;
    document.getElementById("taskEyebrow").textContent = section.questions ? "Questions" : "Question";
    document.getElementById("taskTitle").textContent = section.taskTitle || section.title;
    const prompt = document.getElementById("taskPrompt");
    prompt.textContent = section.prompt || "";
    prompt.hidden = !section.prompt;
    const list = document.getElementById("questionList");
    list.replaceChildren(...(section.questions || []).map(text => {
      const li = document.createElement("li");
      li.textContent = text;
      return li;
    }));
    list.hidden = !section.questions;
    const inventory = document.getElementById("inventory");
    inventory.replaceChildren(...(section.inventory || []).map(row => {
      const el = document.createElement("div");
      el.className = "inventory-row";
      const strong = document.createElement("strong");
      const span = document.createElement("span");
      strong.textContent = row.name;
      span.textContent = row.detail;
      el.append(strong, span);
      return el;
    }));
    inventory.hidden = !section.inventory;
    tabs.replaceChildren(...section.evidence.map((ev, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.role = "tab";
      button.textContent = ev.label;
      button.addEventListener("click", () => renderEvidence(i));
      return button;
    }));
    renderEvidence(0);
  }

  function setZoom(mode) {
    image.style.width = mode === "fit" ? "100%" : `${mode}%`;
  }

  async function start() {
    let interview;
    try {
      interview = await loadInterview();
    } catch (error) {
      if (error.message === "missing-key") lock("This page needs its private link", "Open the full interview link, including everything after the # sign.");
      else lock("This link could not be opened", "The private key in this link does not match. Use the latest interview link.");
      return;
    }
    sections = [
      {...interview, navLabel: "Interview question", navShort: "Interview"},
      ...cases.map(item => ({
        eyebrow: `Case study ${item.number} of ${cases.length}`,
        title: item.title,
        context: item.context,
        taskTitle: item.taskTitle,
        prompt: item.prompt,
        inventory: item.inventory,
        // Case images are public assets one folder up from this page.
        evidence: item.evidence.map(ev => ({...ev, src: `../${ev.src}`})),
        navLabel: `Case ${item.number}`,
        navShort: String(item.number)
      }))
    ];
    sections.forEach((section, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `case-tab${index === 0 ? " interview-first interview-tab-label" : ""}`;
      button.dataset.number = section.navShort;
      button.textContent = section.navLabel;
      button.addEventListener("click", () => show(index));
      navButtons.push(button);
      nav.appendChild(button);
    });
    document.getElementById("interviewApp").hidden = false;
    show(0);
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

  start();
})();
