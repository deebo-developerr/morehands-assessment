(() => {
  "use strict";

  // The interview question is decrypted with the key in the URL fragment (#k=...);
  // the fragment is never sent to the server, so only holders of the full link can read it.
  const {cases} = window.ASSESSMENT_CASES;
  const nav = document.getElementById("sectionNav");
  const tabs = document.getElementById("evidenceTabs");
  const image = document.getElementById("evidenceImage");
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
    const taskTitle = document.getElementById("taskTitle");
    taskTitle.textContent = section.taskTitle || "";
    taskTitle.hidden = !section.taskTitle || section.taskTitle === section.title;
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
    fitImage();
  }

  // Size images to the screen height left below the evidence tabs, so the whole image is visible without scrolling.
  function fitImage() {
    const viewerTop = document.getElementById("viewer").getBoundingClientRect().top + window.scrollY;
    const caption = document.querySelector(".evidence-caption").offsetHeight;
    const available = Math.max(360, window.innerHeight - viewerTop - caption - 16);
    document.documentElement.style.setProperty("--fit-height", `${available}px`);
  }
  window.addEventListener("resize", fitImage);

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
      ...interview.interviews.map((item, i) => ({...item, interview: true, navLabel: `Interview Q${i + 1}`, navShort: `Interview Q${i + 1}`})),
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
      button.className = `case-tab${section.interview ? " interview-tab interview-tab-label" : ""}`;
      button.dataset.number = section.navShort;
      button.textContent = section.navLabel;
      button.addEventListener("click", () => show(index));
      navButtons.push(button);
      nav.appendChild(button);
    });
    document.getElementById("interviewApp").hidden = false;
    show(0);
  }

  const dialog = document.getElementById("imageDialog");
  const dialogImage = document.getElementById("dialogImage");
  function openFullImage() {
    dialogImage.src = image.src;
    dialogImage.alt = image.alt;
    dialog.showModal();
  }
  document.getElementById("openImage").addEventListener("click", openFullImage);
  image.addEventListener("click", openFullImage);
  document.getElementById("closeDialog").addEventListener("click", () => dialog.close());

  start();
})();
