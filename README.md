# Fintech Wallet Assessment

This repository contains both parts of the assessment:

- `Backend/` - NestJS, Prisma, PostgreSQL, idempotent transfers, Gemini categorization, and spending insights.
- `Frontend/` - Next.js dashboard for login, balance, transfers, transaction history, category correction, insights, and help.

## Local Run

Backend:

```bash
cd Backend
npm install
copy .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

Frontend:

```bash
cd Frontend
npm install
copy .env.local.example .env.local
npm run dev
```

The frontend expects `NEXT_PUBLIC_API_URL` to point at the backend API.

## Deployment Notes

Deploy the backend with the service root set to `Backend/` so it uses `Backend/Dockerfile` and `Backend/railway.json`.

Deploy the frontend with the service root set to `Frontend/` and set `NEXT_PUBLIC_API_URL` to the public backend URL.

## Decisions

See [Backend/DECISIONS.md](Backend/DECISIONS.md) for the required decisions, tradeoffs, and intentionally omitted scope.
