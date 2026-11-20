# Curato

A product catalogue with featured products, category browsing, search, product details, and email enquiries.

## Run with Docker Compose

With Docker running and internet access available, run this command from the repository root.

```sh
docker compose up --build
```

| Service | URL |
|---|---|
| Catalogue | http://127.0.0.1:8080 |
| Mailpit inbox | http://127.0.0.1:8025 |

Open a product, select **Enquire**, and submit a name and email address. The page shows a thank-you after Mailpit accepts the message. The inbox captures the product and contact details in an email addressed to `sales@curato.test` by default.

If a default port is occupied or you want to change the sender or sales inbox, copy [.env.example](.env.example) to `.env` at the repository root and update the relevant values. Port overrides change the host ports. The backend continues to connect to Mailpit over the Compose network.

Run `docker compose down` from the repository root to stop the stack. Local review requires no paid service or account.

## Run the apps independently

Use Node.js 24 and npm. Run each app in its own terminal from the repository root.

**Backend**

```sh
cd backend
npm ci && npm run dev
```

**Frontend**

```sh
cd frontend
npm ci && npm run dev
```

Open http://localhost:5173. Express defaults to http://127.0.0.1:3001. To override app settings, copy [backend/.env.example](backend/.env.example) or [frontend/.env.example](frontend/.env.example) to `.env` in the corresponding directory. Keep the frontend proxy target aligned with the backend port. Restart Express after backend source changes.

For enquiries, start Mailpit from the repository root with `docker compose up -d mailpit`, or use a standalone Mailpit binary with `mailpit --listen 127.0.0.1:8025 --smtp 127.0.0.1:1025`. If you override Mailpit’s published SMTP port, set `SMTP_PORT` in the standalone backend’s `.env` to match.

## Stack

React, TypeScript, Vite, and Tailwind CSS keep the web client small and make it quick to develop and build. Express and TypeScript give the Node.js backend a clear place to own catalogue rules, input validation, and email delivery. The browser requests catalogue JSON from Express through relative `/api` URLs. Express fetches it from Fake Store API.

## Verification

- The home page shows five featured products. Category pages show the top three by rating, then the remaining products. Search matches titles and descriptions. Product tiles open a detail page with a shareable URL.
- Run `npm test` in `frontend/` for Jest and React Testing Library form tests. Run `npm test` in `backend/` for catalogue, validation, endpoint, and SMTP tests. The backend tests use a temporary loopback port and stub the external services.
- Each app supports `npm run build` and `npm run format:check`.
- A no-cache Compose build, startup, and enquiry smoke test took **24 seconds** with Docker and the base images already available. I used alternate host ports because a local Mailpit instance was already running.

## Time spent

Approximately **2 hours 30 minutes** across planning, building, testing, and review.
