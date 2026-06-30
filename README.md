# Fintech Transaction Intelligence API

A NestJS and PostgreSQL wallet API with atomic transfers, idempotent retries, concurrency-safe balances, Gemini transaction categorization, correction feedback, and spending insights.

## Start here: test the live API

> **This is a backend REST API. No frontend is used. Test the application through Swagger.**

### Live links

| Page | Link |
| --- | --- |
| API home | [Open the live API](https://alogrithm-fintech-api.up.railway.app/) |
| Swagger testing page | [Open Swagger](https://alogrithm-fintech-api.up.railway.app/api/docs) |
| Health check | [Check API and database health](https://alogrithm-fintech-api.up.railway.app/health) |

> **Important:** Do not test POST or PATCH endpoints by editing the browser address. The browser address bar sends a GET request without a body or login token. Open Swagger and use its **Try it out** and **Execute** buttons.

### Public demo accounts

These accounts contain fake demo money and are safe to use for assessment testing.

| Role | Email | Password | Starting balance |
| --- | --- | --- | ---: |
| Funded sender | `sender@example.com` | `password123` | `$1000.00` |
| Receiver | `receiver@example.com` | `password123` | `$0.00` |

The accounts are public and shared, so their balances may change after someone tests a transfer.

### Test the complete flow in Swagger

#### 1. Log in

Open **Auth**, choose `POST /auth/login`, click **Try it out**, and enter:

```json
{
  "email": "sender@example.com",
  "password": "password123"
}
```

Click **Execute**, then copy `accessToken` from the response.

#### 2. Authorize protected endpoints

Click **Authorize** at the top of Swagger, paste the token, and confirm. Swagger will now send the token with protected requests.

#### 3. Check the sender balance

Open **Accounts** and execute `GET /accounts/me`. It returns the current sender balance.

#### 4. Send money

Open **Transfers** and execute `POST /transfers`. Set `toEmail` to `receiver@example.com` and use a new UUID as `idempotencyKey`. The UUID instructions are provided later in this README and inside Swagger.

#### 5. Test duplicate protection

Execute the exact same transfer body again with the same `idempotencyKey`. The API returns the original transfer and does not move money twice.

#### 6. Review transfers and categories

Execute `GET /transfers`, wait a few seconds for Gemini categorization, then execute `GET /transactions`.

#### 7. Correct a category

Copy a transaction `id`. Execute `PATCH /transactions/:id/category`, place the ID in the path field, and select a different category in the request body. Future Gemini prompts use the latest category corrections as examples.

#### 8. View spending insights

Execute `GET /insights` to see category totals, monthly spending, unusual transactions, and a readable Gemini summary.

Protected endpoints return `401 Unauthorized` until the Swagger **Authorize** step is completed.

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

Railway builds the application from `Dockerfile` and uses `railway.json` for the migration, start command, and health check. Configure `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, and `GEMINI_API_KEY` as Railway service variables. Railway runs committed migrations before starting the API.

See [DECISIONS.md](./DECISIONS.md) for correctness, concurrency, AI feedback, assumptions, and tradeoffs.
