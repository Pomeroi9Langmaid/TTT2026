// Smartvel microsite Slack alert tracker
// Sends high-intent visitor alerts to /api/microsite-alert.
// Requires /api/microsite-alert.js deployed and SLACK_WEBHOOK_URL set in Vercel.

(function () {
  const ALERT_ENDPOINT = "/api/microsite-alert";
  const SESSION_KEY = "sv_microsite_session_v1";
  const VISITOR_KEY = "sv_microsite_visitor_v1";
  const NOW = Date.now();
  const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

  function getParam(name) {
    try {
      return new URLSearchParams(window.location.search).get(name) || "";
    } catch (e) {
      return "";
    }
  }

  function productFromPath() {
    const path = window.location.pathname.replace(/^\//, "").replace(/\.html$/, "");
    return path || "home";
  }

  function loadJSON(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function getVisitor() {
    let visitor = loadJSON(VISITOR_KEY, null);
    if (!visitor || !visitor.id) {
      visitor = {
        id: "sv_" + Math.random().toString(36).slice(2) + "_" + Date.now(),
        firstSeen: NOW,
        lastSeen: 0,
        previousVisitAt: 0,
        returnAlertSentAt: 0
      };
    }
    return visitor;
  }

  function getSession() {
    let session = loadJSON(SESSION_KEY, null);
    const expired = !session || !session.startedAt || (NOW - session.lastActivityAt > 30 * 60 * 1000);

    if (expired) {
      session = {
        id: "sess_" + Math.random().toString(36).slice(2) + "_" + Date.now(),
        startedAt: NOW,
        lastActivityAt: NOW,
        pagesViewed: 0,
        uniquePages: [],
        alertsSent: {}
      };
    }

    return session;
  }

  const visitor = getVisitor();
  const session = getSession();

  const currentPage = productFromPath();
  const currentUrl = window.location.href;
  const rep = getParam("rep") || "unknown";
  const campaign = getParam("campaign") || "";
  const sector = getParam("sector") || "";
  const site = window.location.hostname;

  session.lastActivityAt = NOW;
  session.pagesViewed += 1;

  if (!session.uniquePages.includes(currentPage)) {
    session.uniquePages.push(currentPage);
  }

  const previousVisitAt = visitor.lastSeen || 0;
  const isReturnWithin48h =
    previousVisitAt &&
    NOW - previousVisitAt > 30 * 60 * 1000 &&
    NOW - previousVisitAt <= FORTY_EIGHT_HOURS;

  visitor.previousVisitAt = previousVisitAt;
  visitor.lastSeen = NOW;

  saveJSON(VISITOR_KEY, visitor);
  saveJSON(SESSION_KEY, session);

  function durationSeconds() {
    return Math.max(0, Math.round((Date.now() - session.startedAt) / 1000));
  }

  function payload(alertType, eventDetail) {
    return {
      alertType,
      site,
      rep,
      campaign,
      sector,
      product: currentPage,
      url: currentUrl,
      referrer: document.referrer || "",
      pagesViewed: session.pagesViewed,
      uniquePages: session.uniquePages,
      sessionDurationSeconds: durationSeconds(),
      eventDetail: eventDetail || "",
      timestamp: new Date().toISOString()
    };
  }

  function sendAlert(alertKey, alertType, eventDetail, force) {
    if (!force && session.alertsSent[alertKey]) return;

    session.alertsSent[alertKey] = Date.now();
    saveJSON(SESSION_KEY, session);

    fetch(ALERT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload(alertType, eventDetail)),
      keepalive: true
    }).catch(function () {});
  }

  // Alert 1: high intent - 5+ pages viewed in one session
  if (session.pagesViewed >= 5) {
    sendAlert(
      "high_intent_5_pages",
      "HIGH INTENT VISITOR — 5+ pages viewed",
      "Visitor viewed five or more pages in one session."
    );
  }

  // Alert 2: return visitor within 48 hours
  if (isReturnWithin48h && (!visitor.returnAlertSentAt || NOW - visitor.returnAlertSentAt > FORTY_EIGHT_HOURS)) {
    visitor.returnAlertSentAt = NOW;
    saveJSON(VISITOR_KEY, visitor);

    sendAlert(
      "return_48h",
      "RETURN VISITOR — revisited within 48 hours",
      "Visitor returned within 48 hours of a previous session.",
      true
    );
  }

  // Alert 3: contact page viewed
  if (currentPage === "contact") {
    sendAlert(
      "contact_page_viewed",
      "CONTACT PAGE VIEWED",
      "Visitor reached the contact page."
    );
  }

  // Alert 4: meeting click and other high-value clicks
  document.addEventListener("click", function (e) {
    const el = e.target.closest ? e.target.closest("a,button") : null;
    if (!el) return;

    const text = (el.innerText || el.getAttribute("aria-label") || el.getAttribute("title") || "").toLowerCase();
    const href = (el.getAttribute("href") || "").toLowerCase();

    if (href.includes("meetings.hubspot.com") || text.includes("schedule") || text.includes("meeting")) {
      sendAlert(
        "meeting_click_" + Date.now(),
        "MEETING INTENT — schedule meeting clicked",
        "Visitor clicked a Schedule Meeting / HubSpot meetings link.",
        true
      );
      return;
    }

    if (href.startsWith("mailto:") || text.includes("email")) {
      sendAlert(
        "email_click_" + Date.now(),
        "EMAIL INTENT — email link clicked",
        "Visitor clicked an email/contact link.",
        true
      );
      return;
    }

    if (href.includes(".pdf") || el.hasAttribute("download")) {
      sendAlert(
        "download_click_" + Date.now(),
        "DOWNLOAD INTENT — PDF/download clicked",
        "Visitor clicked a downloadable file or PDF.",
        true
      );
      return;
    }
  }, true);
})();
