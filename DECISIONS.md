# Decisions and assumptions

- One Git repository contains two apps with independent npm installs and scripts.
- The browser uses relative `/api` URLs. Vite proxies these locally so the frontend and backend can run in separate processes.
- Express will own the Fake Store API integration, search, category ranking, enquiry validation, and SMTP delivery. Keep the upstream product source and mail transport separate from route handling so each can be replaced.
- The home page will use five configured product IDs. Category pages will feature up to three products by rating and list the remaining products separately. Search will match titles and descriptions case-insensitively.
- Mailpit will capture local enquiry email without a paid service or reviewer account.
- The initial featured selection uses Fake Store product IDs 1–5 in configured order. If the upstream request fails or a selected product is missing, the API returns an error so the home page can show a retry instead of an incomplete selection.
- Category and product URLs support direct visits and refreshes. Category slugs come from Fake Store category names. Rating ties break by ascending product ID. Categories with fewer than three products show all available products in the top-rated section.
- Search uses a trimmed, case-insensitive substring across titles and descriptions. The search term is stored in the URL so results can be refreshed or shared.
- Enquiries require a name and email address. The message is optional. Express looks up the product by ID and uses the server-side title in the email. The API returns success only after SMTP accepts the sales recipient and finishes handing off the message.

## Scope and trade-offs

- All five customer flows are implemented. Featured selection is a list of IDs in code, since the challenge calls for a preselected set and gives no admin workflow.
- Each catalogue request reads from Fake Store API. This keeps the proof of concept free of database and cache setup. Catalogue pages and enquiries depend on Fake Store API being reachable.
- SMTP delivery is synchronous. This makes the thank-you reflect actual SMTP acceptance. If delivery fails, the form retains the details for retry.
- The frontend uses links and URL query parameters for navigation. A lightweight Vite proxy connects the two apps locally. A deployment would need to serve the frontend with a fallback for catalogue URLs and forward `/api` requests to Express.

## With another day

Add a short-lived catalogue cache with a stale-data fallback, browser regression tests that launch Mailpit automatically, and enquiry rate limits and idempotency before exposing the form publicly.

## Dependency review

The runtime dependency audits reported zero advisories in both apps. The full frontend audit reported moderate advisories in Jest's transitive tooling. The audit proposed a Jest major-version downgrade, so this submission keeps the tested Jest version and records the finding for follow-up.
