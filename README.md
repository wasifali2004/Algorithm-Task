# Fintech Wallet Assessment

A full-stack fintech wallet application with a NestJS/PostgreSQL backend and a Next.js frontend dashboard.

The application supports accounts, balances, idempotent transfers, transaction history, category correction, Gemini-powered transaction categorization, and spending insights.

## Repository Structure

| Folder | Purpose |
| --- | --- |
| `Backend/` | NestJS API, Prisma schema, PostgreSQL migrations, transfer logic, categorization, insights, Swagger, Railway config |
| `Frontend/` | Next.js dashboard for login, balance, send money, transactions, category correction, insights, help, and theme switching |

## Live API

| Page | Link |
| --- | --- |
| API home | [Open the live API](https://alogrithm-fintech-api.up.railway.app/) |
| Swagger testing page | [Open Swagger](https://alogrithm-fintech-api.up.railway.app/api/docs) |
| Health check | [Check API and database health](https://alogrithm-fintech-api.up.railway.app/health) |

> Do not test POST or PATCH endpoints by editing the browser address bar. Use Swagger's **Try it out** and **Execute** buttons so the request includes a JSON body and bearer token.

## Public Demo Accounts

These accounts contain fake demo money and are safe to use for assessment testing.

| Role | Email | Password | Starting balance |
| --- | --- | --- | ---: |
| Funded sender | `sender@example.com` | `password123` | `$1000.00` |
| Receiver | `receiver@example.com` | `password123` | `$0.00` |

The accounts are public and shared, so balances may change after someone tests a transfer.

## Test The Backend Flow In Swagger

1. Open **Auth** and run `POST /auth/login`.

```json
{
  "email": "sender@example.com",
  "password": "password123"
}
```

2. Copy `accessToken` from the response.
3. Click **Authorize** at the top of Swagger and paste the token.
4. Run `GET /accounts/me` to check the sender balance.
5. Run `POST /transfers` with `toEmail` set to `receiver@example.com` and a new UUID as `idempotencyKey`.
6. Execute the exact same transfer body again with the same `idempotencyKey`; the API returns the original transfer and does not move money twice.
7. Run `GET /transactions` to review transaction history.
8. Run `PATCH /transactions/:id/category` with a different category to save feedback.
9. Run `GET /insights` to see category totals, monthly spending, unusual transactions, and a readable summary.

Protected endpoints return `401 Unauthorized` until the Swagger **Authorize** step is completed.

## Stack

- TypeScript throughout
- NestJS 11 backend
- Next.js 16 frontend
- PostgreSQL with Prisma 7
- JWT bearer authentication
- Gemini `generateContent` API with model fallback
- Swagger at `/api/docs`

## Local Setup

Requirements: Node.js 20.19+ or 22+, npm, and PostgreSQL.

Backend:

```bash
cd Backend
npm install
copy .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

Set these values in `Backend/.env`:

- `DATABASE_URL`: pooled PostgreSQL URL used by the running API.
- `DIRECT_URL`: direct or session-pooler URL used by Prisma Migrate.
- `JWT_SECRET`: a long random value.
- `GEMINI_API_KEY`: a Gemini API key. The existing `GEMINI_aPI_KEY` spelling is also supported.
- `PORT`: optional; defaults to `3000`.

Open `http://localhost:3100/api/docs` for Swagger and `http://localhost:3100/health` for health status.

Frontend:

```bash
cd Frontend
npm install
copy .env.local.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in `Frontend/.env.local` to the backend URL, for example:

```text
NEXT_PUBLIC_API_URL=http://localhost:3100
```

Open `http://localhost:3000`.

## Commands

Backend:

```bash
cd Backend
npm run build
npm run prisma:generate
npm run prisma:migrate
npm run start:prod
```

Frontend:

```bash
cd Frontend
npm run build
npm run dev
```

## Main API Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/auth/register` | Create a user and zero-balance account |
| POST | `/auth/login` | Receive a seven-day JWT |
| GET | `/users/me` | View the current user profile |
| GET | `/accounts/me` | View the current balance |
| POST | `/transfers` | Send an idempotent transfer |
| GET | `/transfers` | List sent and received transfers |
| GET | `/transactions` | List categorized account transactions |
| PATCH | `/transactions/:id/category` | Save a category correction |
| GET | `/insights` | Return calculated spending data and an AI summary |

Protected routes use `Authorization: Bearer <accessToken>`.

## Transfer Request

```json
{
  "idempotencyKey": "6f1be2a2-d12a-4d70-a0f2-d59ca18a451d",
  "toEmail": "recipient@example.com",
  "amount": 25.5,
  "description": "Dinner reimbursement"
}
```

The `idempotencyKey` is not a user ID. The client creates it before sending the transfer. Create a new UUID for a new transfer and reuse the same UUID only when retrying that exact transfer.

Generate one in a browser console:

```js
crypto.randomUUID()
```

Or in PowerShell:

```powershell
[guid]::NewGuid().ToString()
```

To test idempotency, execute the same request twice with the same key. Both responses should contain the same transfer ID, and the balance should change only once. Money is returned as a decimal string, for example `"25.50"`.

New accounts deliberately start at zero because a public self-funding endpoint would make wallet balances meaningless. For a local demo, set a user's balance directly in a non-production database before sending a transfer.

## Deployment

Deploy the backend with the service root set to `Backend/` so the platform uses `Backend/Dockerfile` and `Backend/railway.json`.

Configure backend service variables:

- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `PORT`

Deploy the frontend on Vercel with the project Root Directory set to `Frontend/` and set `NEXT_PUBLIC_API_URL` to the public backend URL.

The committed `vercel.json` is written for that Vercel Root Directory setting: it runs `npm ci`, `npm run build`, and uses `.next` as the output directory.

## Decisions

See [DECISIONS.md](DECISIONS.md) for correctness, concurrency, AI feedback, assumptions, tradeoffs, and intentionally omitted scope.
