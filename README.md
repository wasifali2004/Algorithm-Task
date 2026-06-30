# Fintech Transaction Intelligence API

A NestJS and PostgreSQL wallet API with atomic transfers, idempotent retries, concurrency-safe balances, Gemini transaction categorization, correction feedback, and spending insights.

New to NestJS? Read [CODE_GUIDE.md](./CODE_GUIDE.md) for a simple file-by-file explanation of the whole project.

## Stack

- NestJS 11 and TypeScript
- PostgreSQL with Prisma 7
- JWT bearer authentication
- Gemini `generateContent` API with model fallback
- Swagger at `/api/docs`

## Local setup

Requirements: Node.js 20.19+ or 22+, npm, and PostgreSQL.

```bash
npm install
copy .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

Set these values in `.env`:

- `DATABASE_URL`: pooled PostgreSQL URL used by the running API.
- `DIRECT_URL`: direct or session-pooler URL used by Prisma Migrate.
- `JWT_SECRET`: a long random value.
- `GEMINI_API_KEY`: a Gemini API key. The existing `GEMINI_aPI_KEY` spelling is also supported.
- `PORT`: optional; defaults to `3000`.

Open `http://localhost:3100/api/docs` for interactive documentation and `http://localhost:3100/health` for health status.

## Commands

```bash
npm run build
npm run prisma:generate
npm run prisma:migrate
npm run start:prod
```

## Main endpoints

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

## Transfer request

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

`render.yaml` and `Dockerfile` are included. Configure `DATABASE_URL`, `DIRECT_URL`, and `GEMINI_API_KEY` in the hosting platform. Render can generate `JWT_SECRET`. The start command applies committed migrations before launching the compiled API.

See [DECISIONS.md](./DECISIONS.md) for correctness, concurrency, AI feedback, assumptions, and tradeoffs.
