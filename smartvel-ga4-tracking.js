// Smartvel GA4 tracking + HubSpot tracking
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-9L6TQF5E40', {
  send_page_view: true
});

(function(){
    function getParam(name) {
        try {
            return new URLSearchParams(window.location.search).get(name) || "";
        } catch(e) {
            return "";
        }
    }

    function productFromPath() {
        var path = window.location.pathname.replace(/^\//, "").replace(/\.html$/, "");
        return path || "home";
    }

    function sendEvent(name, params) {
        if (typeof gtag !== "function") return;
        gtag('event', name, params || {});
    }

    function init() {
        var rep = getParam("rep") || "unknown";
        var campaign = getParam("campaign") || "";
        var sector = getParam("sector") || "";
        var product = productFromPath();

        sendEvent("microsite_page_view", {
            rep: rep,
            campaign: campaign,
            sector: sector,
            product_page: product
        });

        document.addEventListener("click", function(e) {
            var a = e.target.closest ? e.target.closest("a,button") : null;
            if (!a) return;

            var text = (a.innerText || "").toLowerCase();
            var href = (a.getAttribute("href") || "").toLowerCase();

            var base = {
                rep: rep,
                campaign: campaign,
                sector: sector,
                product_page: product
            };

            if (href.indexOf("meetings.hubspot.com") !== -1 || text.indexOf("schedule") !== -1) {
                sendEvent("schedule_meeting_click", base);
            }

            if (href.indexOf("mailto:") === 0 || text.indexOf("email") !== -1) {
                sendEvent("email_click", base);
            }

            if (href.indexOf(".pdf") !== -1 || a.hasAttribute("download")) {
                sendEvent("pdf_download", base);
            }

            if (text.indexOf("demo") !== -1 || text.indexOf("in action") !== -1) {
                sendEvent("demo_click", base);
            }

            if (href.indexOf("linkedin.com") !== -1) {
                sendEvent("linkedin_click", base);
            }
        }, true);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

/* HubSpot tracking: Smartvel microsites */
(function () {
    if (window.__SMARTVEL_HUBSPOT_LOADED__) return;
    window.__SMARTVEL_HUBSPOT_LOADED__ = true;

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'hs-script-loader';
    script.async = true;
    script.defer = true;
    script.src = 'https://js.hs-scripts.com/4886834.js';

    var firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
    } else {
        document.head.appendChild(script);
    }
})();
