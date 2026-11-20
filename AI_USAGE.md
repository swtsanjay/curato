# AI usage

## Tools and models

OpenAI Codex helped extract the challenge requirements, plan the work, implement the two apps, and run verification. The session did not expose a specific model identifier. Verification used npm, the Node test runner, Jest, React Testing Library, Chrome via Playwright, and standalone Mailpit. No repo-specific agent instruction files were used.

## Plan

1. Scaffold two independent apps on a feature branch and check the Vite-to-Express connection.
2. Implement and verify the featured products, category ranking, matching search, and product details.
3. Add the enquiry form, validation, and SMTP delivery. Test with stubs and a real Mailpit inbox.
4. Time a clean setup, review the code and docs, and prepare an open PR into `main`.

## Prompts and decisions

1. “Do not write code yet.” Extract the acceptance criteria and agree on a short, reviewable workflow before changes.
2. “Use one Git repository with two independent apps.” Keep separate npm installs and let Express handle catalogue rules and email delivery.
3. “Show its three highest-rated products first then list the rest below.” Compare each category’s displayed order with the source data in Chrome.
4. “Show the thankyou message only after Mailpit accepts the email.” Return `204` after SMTP acceptance and verify the pending, success, and failure states.
5. “Use Jest and React Testing Library” and the existing Node runner. Test the form separately from the Express endpoint and supplement them with a real SMTP walkthrough.

## Corrections during verification

- The initial backend dev command watched the dependency tree and hit a file-watcher limit. The startup check caught it. The revised command starts the TypeScript entry point directly and requires a restart after changes.
- Docker was unavailable on the review machine. The SMTP walkthrough used the standalone Mailpit binary and verified the captured message before shutting down the temporary services.
