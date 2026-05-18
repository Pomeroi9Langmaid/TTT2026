// Smartvel microsite analytics tracking
// Microsoft Clarity project: wsy8r0qfcn
// Loaded globally across the microsite.

(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "wsy8r0qfcn");

(function(){
    function getParam(name) {
        try { return new URLSearchParams(window.location.search).get(name) || ""; }
        catch(e) { return ""; }
    }

    function productFromPath() {
        var path = window.location.pathname.replace(/^\//, "").replace(/\.html$/, "");
        if (!path) return "home";
        return path;
    }

    function claritySet(key, value) {
        if (!value || typeof window.clarity !== "function") return;
        try { window.clarity("set", key, value); } catch(e) {}
    }

    function sendClarityEvent(name) {
        if (typeof window.clarity !== "function") return;
        try { window.clarity("event", name); } catch(e) {}
    }

    function init() {
        var rep = getParam("rep") || "unknown";
        var campaign = getParam("campaign") || "";
        var sector = getParam("sector") || "";
        var product = productFromPath();

        claritySet("rep", rep);
        claritySet("campaign", campaign);
        claritySet("sector", sector);
        claritySet("product_page", product);

        sendClarityEvent("page_view_" + product);
        if (rep !== "unknown") sendClarityEvent("rep_" + rep + "_page_view");

        document.addEventListener("click", function(e) {
            var a = e.target.closest ? e.target.closest("a,button") : null;
            if (!a) return;

            var text = (a.innerText || a.getAttribute("aria-label") || a.getAttribute("title") || "").trim().toLowerCase();
            var href = (a.getAttribute("href") || "").toLowerCase();

            if (href.indexOf("meetings.hubspot.com") !== -1 || text.indexOf("schedule") !== -1 || text.indexOf("meeting") !== -1) {
                sendClarityEvent("schedule_meeting_click");
            }

            if (href.indexOf("mailto:") === 0 || text.indexOf("email") !== -1) {
                sendClarityEvent("email_click");
            }

            if (href.indexOf(".pdf") !== -1 || a.hasAttribute("download")) {
                sendClarityEvent("download_click");
            }

            if (text.indexOf("demo") !== -1 || text.indexOf("in action") !== -1 || href.indexOf("finnair.com") !== -1) {
                sendClarityEvent("demo_click");
            }

            if (href.indexOf("linkedin.com") !== -1) {
                sendClarityEvent("linkedin_click");
            }
        }, true);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
