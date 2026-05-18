SMARTVEL MICROSITE SLACK ALERT SYSTEM

Upload/replace these files in BOTH microsite repositories:

1. smartvel-ga4-tracking.js
2. microsite-alert-tracker.js
3. api/microsite-alert.js

Then in Vercel, add this Environment Variable to BOTH projects:

Name:
SLACK_WEBHOOK_URL

Value:
Paste your Slack webhook URL

IMPORTANT:
Do NOT put the Slack webhook URL into GitHub files. Put it only in Vercel Environment Variables.

After adding the env var:
- Redeploy both Vercel projects
- Open a microsite page
- Click around
- Open 5+ pages to test the high-intent alert
- Click Schedule Meeting to test meeting-intent alert

Alerts supported:
- HIGH INTENT VISITOR — 5+ pages viewed
- RETURN VISITOR — revisited within 48 hours
- CONTACT PAGE VIEWED
- MEETING INTENT — schedule meeting clicked
- EMAIL INTENT — email clicked
- DOWNLOAD INTENT — PDF/download clicked

Rep/campaign/sector/product/site are included when available.

Note:
Exact name, title and company will appear in HubSpot only when HubSpot can identify the visitor. Anonymous visitors can still generate behaviour alerts, but not guaranteed name/title/company.
