# Decisions and assumptions

## Catalogue and enquiry rules

- The home page shows Fake Store product IDs 1–5 in the configured order. Featured selection lives in code. If the upstream request fails or a selected product is missing, the home page shows a retry.
- Category names determine the URLs. Categories show up to three highest-rated products, ordered by rating descending and then by ID ascending for ties. The remaining products appear below.
- Search treats the trimmed query as a case-insensitive substring of the title or description. Storing the query in the URL makes results shareable.
- Enquiries require a name and email. The message is optional. Express retrieves the product title by ID and uses it in the email. The API waits for SMTP acceptance before returning success. If sending fails, the form keeps the entered values for retry.

## Architecture and scope

- The two apps have separate installs and build scripts. React uses relative `/api` URLs, with Vite proxying them during development and Nginx proxying them in Compose. Nginx serves the React entry point for direct catalogue URLs.
- Express owns catalogue JSON, validation, and enquiry delivery. Fake Store access and SMTP are in dedicated modules so the upstream product source and mail transport can change independently. The browser loads image assets from the URLs supplied by Express.
- All five customer flows are implemented. The proof of concept uses code-configured featured IDs and reads live catalogue data on each request, which keeps setup simple and makes catalogue and enquiry flows dependent on Fake Store API availability.
- Compose runs the frontend, backend, and Mailpit on an internal network, with published ports bound to host loopback. The Linux containers can run on an AWS EC2 host with Docker and Compose. Verification used a local Docker engine.
- Mailpit captures SMTP messages locally without an external email account. The SMTP module keeps delivery separate from catalogue and form logic.

## Dependency review

Both runtime dependency audits reported zero advisories. The full frontend audit flagged moderate advisories in Jest’s transitive tooling. The suggested fix required a Jest major-version downgrade, so the tested version was retained.

## With another day

Add a short-lived catalogue cache with stale-data fallback, automate the browser walkthrough with Mailpit, and add rate limits and idempotency before exposing the enquiry form publicly.
