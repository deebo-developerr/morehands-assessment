(() => {
  "use strict";

  const params = new URLSearchParams(location.search);
  const cid = (params.get("cid") || "").trim();
  const preview = params.get("preview") === "1";
  const validCid = /^[A-Za-z0-9_-]{12,64}$/.test(cid);
  const activeCid = validCid ? cid : (preview ? "QA-PREVIEW-ONLY" : "");
  const app = document.getElementById("videoApp");
  const gate = document.getElementById("accessGate");
  const config = window.ASSESSMENT_CONFIG;

  if (!activeCid) {
    gate.hidden = false;
    return;
  }

  app.hidden = false;
  document.getElementById("candidateChip").hidden = false;
  document.getElementById("candidateIdLabel").textContent = activeCid;
  const backParams = new URLSearchParams({cid: activeCid});
  if (preview) backParams.set("preview", "1");
  document.getElementById("backLink").href = `index.html?${backParams}`;

  const providerLink = document.getElementById("providerLink");
  if (config.videoProviderUrl) {
    const destination = new URL(config.videoProviderUrl, location.href);
    destination.searchParams.set("candidate_id", activeCid);
    providerLink.href = destination.toString();
    providerLink.textContent = "Start video recording";
    providerLink.classList.remove("disabled-link");
    providerLink.removeAttribute("aria-disabled");
    providerLink.rel = "noopener";
    document.getElementById("recordingTitle").textContent = "Ready to record";
    document.getElementById("recordingMessage").textContent = "Open the secure recording portal and complete all five video explanations.";
    document.getElementById("providerStatus").classList.add("ready");
    document.querySelector("#providerStatus strong").textContent = "Recording portal ready";
    document.querySelector("#providerStatus span:last-child").textContent = "Use the button below when you are ready to begin.";
  } else {
    providerLink.addEventListener("click", event => event.preventDefault());
  }

  document.getElementById("copyCandidateId").addEventListener("click", async () => {
    await navigator.clipboard.writeText(activeCid);
    const toast = document.getElementById("toast");
    toast.textContent = "Candidate ID copied";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1800);
  });
})();
