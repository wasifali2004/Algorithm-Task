# Technical Decisions

## Assumptions

- Each user owns one USD account. The currency column is retained so the model can grow later, but this release does not exchange currencies.
- New accounts start at `0.00`. Funding and external bank rails are outside this assessment API; test or demo balances are seeded directly in the database.
- A transfer creates one debit transaction for the sender and one credit transaction for the recipient. This gives both users a correct history while the transfer remains the single money-movement operation.
- Spending insights use debit transactions only. Incoming transfers are not treated as spending.
- AI categorization happens after the database transfer commits. A provider failure cannot roll back or delay money movement, and the safe stored category remains `Transfers`.

## Prisma Over TypeORM

Prisma keeps the database shape in one readable schema and generates TypeScript types from it. This reduces drift between PostgreSQL columns and application data. Prisma Migrate also produces reviewable SQL, while the PostgreSQL adapter works with Supabase's pooled runtime connection.

The transfer flow still uses parameterized raw SQL for `SELECT ... FOR UPDATE`. Prisma remains useful for ordinary queries without hiding the database lock required for safe balance updates.

## Money Representation

Balances and amounts use PostgreSQL `DECIMAL(18,2)` and Prisma `Decimal`; no money value is stored as a float. API responses serialize money as fixed two-decimal strings so JSON clients do not lose cents.

DTO validation allows at most two decimal places and a bounded safe JavaScript number. Values are converted to Prisma `Decimal` before any comparison or update. PostgreSQL check constraints also reject negative balances, nonpositive transfer amounts, nonpositive transaction amounts, and transfers between the same account.

## Client-Generated Idempotency Key

The client creates a UUID before its first transfer attempt and reuses it for every retry. This still works when the client loses the response and cannot know whether the server completed the request.

The service first looks for an existing key and returns that transfer with HTTP 200. Inside the database transaction it checks the key again after the account locks are held. This handles two copies of the same request arriving together: the second request waits, sees the completed transfer, and returns it without changing balances.

The unique database constraint is the final guard. If two requests still race at the insert, the loser fetches and returns the saved transfer.

An idempotency key is global. If a different sender presents an existing key, the API returns 409 instead of exposing another user's transfer.

## Row Locks And Double Spending

Both account rows are locked with `SELECT ... FOR UPDATE` inside one interactive Prisma transaction. IDs are sorted before locking so opposite-direction transfers take locks in the same order and avoid common deadlocks.

The sender balance is checked only after both locks are held. The debit, credit, two transaction records, and completed transfer status are written before commit. Another transfer involving either account must wait and then see the new balance. A database serialization or deadlock conflict returns 409 so the client can retry.

PostgreSQL's nonnegative-balance constraint is the final safety net if application code changes in the future.

## Gemini Integration And Fallback Models

Gemini is called through its HTTPS `generateContent` endpoint, so no extra AI SDK is needed. The API key is sent in the `x-goog-api-key` header and is never included in URLs or logs.

Models are tried in this order:

1. `gemini-2.5-flash`
2. `gemini-2.0-flash`
3. `gemini-2.0-flash-001`

Each request tries the models in that order. Timeouts, retired models, rate limits, and empty responses move to the next candidate. Categorization accepts only an exact category from the supported list; invalid or unavailable output leaves the category as `Transfers`.

## Category Corrections As Learning Feedback

The original effective category and the new category are stored in `category_corrections`, while `transactions.corrected_category` holds the user's current choice.

Future classification prompts load the same user's five most recent corrections through transaction and account ownership. Each correction becomes a small description-to-category example. Feedback is never mixed between users. This is lightweight few-shot learning: it changes future prompts without training or hosting a custom model.

## Spending Insights

Category totals, six calendar-month buckets, averages, the largest debit, and unusual activity are calculated with Prisma `Decimal` in application code. A debit over 2.5 times the user's debit average is marked unusual. Months with no spending are returned with `0.00` so clients can draw stable charts.

Gemini receives only the calculated summary object and writes a short paragraph. It never calculates balances or totals. If Gemini is unavailable, the endpoint returns all calculated data with a deterministic plain-language summary.

## Tradeoffs

- Categorization is fire-and-forget to keep transfer latency and financial availability independent from Gemini. A production system would move this work to a durable queue with retries.
- The current insights query loads a user's debit history and aggregates it in application code. This is simple and correct for the assessment scale; a high-volume system would use SQL aggregates or maintained rollups.
- JWTs expire after seven days and are stateless. Token revocation would require a session or deny-list store.
- One account per user keeps ownership and the `/accounts/me` contract clear. Supporting multiple wallets would require an account selector on transfer and history endpoints.

## Intentionally Left Out

- Deposits, withdrawals, bank integrations, exchange rates, and multi-currency transfers.
- Transfer fees, scheduled transfers, reversals, chargebacks, and webhooks.
- Refresh tokens, password reset, email verification, account deletion, and token revocation.
- Rate limiting, device risk, fraud models, KYC/AML, sanctions checks, and audit exports.
- A production double-entry general ledger, reconciliation jobs, durable AI jobs, and operational alerting.
