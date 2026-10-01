// Shared by the candidate assessment (app.js) and the live interview page.
(() => {
  "use strict";

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

  window.ASSESSMENT_CASES = {cases, finalVideoPrompt};
})();
