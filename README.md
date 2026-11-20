# Curato

Curato is a product catalogue proof of concept. The home page shows five featured products supplied by the backend.

## Run with Docker Compose

From the repository root, run:

```sh
docker compose up --build
```

Open the catalogue at http://127.0.0.1:8080 and Mailpit at http://127.0.0.1:8025. The backend fetches catalogue data from Fake Store API, so the stack needs internet access. Stop the stack with `docker compose down`.

The default host ports are 8080 for the catalogue, 1025 for SMTP, and 8025 for the Mailpit inbox. If a port is occupied, set `FRONTEND_PORT`, `MAILPIT_SMTP_PORT`, or `MAILPIT_UI_PORT` in a root `.env` file. You can also set `SMTP_FROM` or `SALES_EMAIL` there to override the sender or inbox.

## Run the apps independently

Use Node.js 24, npm, and either Docker Compose or the standalone Mailpit binary. The catalogue needs internet access to reach Fake Store API. Run each app in a separate terminal from the repository root.

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

Open http://localhost:5173 and check that five featured products appear. The API health endpoint is at http://127.0.0.1:3001/api/health. Both apps support `npm run build`. The frontend serves its build with `npm run preview`, and the backend runs its build with `npm start`.

Both apps run with defaults. To override the API port or proxy target, copy the relevant app's `.env.example` to `.env` and keep the two settings aligned.

Start Mailpit with `docker compose up -d mailpit`. If you have the standalone Mailpit binary, run `mailpit --listen 127.0.0.1:8025 --smtp 127.0.0.1:1025`. Express sends enquiry email to Mailpit on SMTP port 1025 by default. Open a product, select **Enquire**, and submit your name and email. After the page shows a thank-you, open the Mailpit inbox at http://127.0.0.1:8025 to see the message addressed to `sales@curato.test`. Backend SMTP settings are listed in `backend/.env.example`.

## Stack

React, TypeScript, Vite, and Tailwind CSS provide a small web client and fast local feedback. Node.js, Express, and TypeScript provide an independently runnable API with a straightforward place to implement catalogue and enquiry logic.

## Catalogue walkthrough

Choose a category in the header to see its three highest-rated products followed by the remaining products. Submit a phrase in the search box to match titles and descriptions. Open a product tile to see its details. Each category and product has a direct URL.

Run `npm test` in `backend/` to check catalogue behavior, enquiry validation, and SMTP acceptance handling. Run `npm test` in `frontend/` to check the enquiry form with Jest and React Testing Library. Both suites run without internet access. The backend endpoint tests open a temporary loopback port.

## Time spent

Approximately 2 hours 30 minutes across planning, building, testing, and review. Time was tracked as a total.

A clean setup reached a successful browser enquiry in about 22 seconds on the review machine. This included installing both apps from their lockfiles with an empty npm cache and starting both apps and Mailpit. Node.js, Chrome, and the standalone Mailpit binary were already available.
