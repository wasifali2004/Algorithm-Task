# Frontend Guide

This guide explains the frontend one file at a time in simple words.

The frontend is a Next.js dashboard that talks to the NestJS backend. It does not move money by itself. It collects user input, sends authenticated API requests, displays backend data, and gives users a clean way to test the assessment flows.

## What The Frontend Covers

The frontend supports these assessment flows:

- Register a user and confirm the backend created a wallet account.
- Login and store the JWT token locally.
- View current account balance.
- Send money to another user.
- Generate an idempotency key for transfer requests.
- Review transaction history.
- Correct transaction categories.
- Show spending insights from the backend.
- Switch theme.
- Show toast notifications after important actions.

The critical financial guarantees still live in the backend:

- Atomic balance updates.
- Negative balance prevention.
- Duplicate transfer prevention.
- Concurrent transfer safety.
- PostgreSQL constraints.
- LLM categorization and correction feedback storage.

The frontend makes those backend features usable and visible.

## How To Read The Frontend

Start with these files:

1. `src/lib/api.ts`
2. `src/lib/store.ts`
3. `src/app/(auth)/login/page.tsx`
4. `src/app/(auth)/register/page.tsx`
5. `src/components/app-shell.tsx`
6. `src/components/dashboard.tsx`
7. `src/components/CorrectCategoryModal.tsx`
8. `src/app/(dashboard)/insights/page.tsx`
9. `src/components/InsightsView.tsx`
10. `src/types/index.ts`

That order shows how requests are sent, how auth is stored, and how each requirement appears in the UI.

## Backend Connection

### `src/lib/api.ts`

This file creates the shared Axios client.

```ts
const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
```

`NEXT_PUBLIC_API_URL` comes from `.env.local` or Vercel environment variables. Example:

```text
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

Every frontend API request uses this Axios instance.

The request interceptor reads the JWT token from the auth store:

```ts
const token = useAuthStore.getState().token;
```

If a token exists, it sends:

```text
Authorization: Bearer <token>
```

That is how protected backend endpoints know which user is calling.

The response interceptor watches for `401 Unauthorized`. If the backend rejects the token, the frontend logs out and sends the user back to `/login`.

`getApiErrorMessage()` converts backend errors into readable form messages.

## Authentication State

### `src/lib/store.ts`

This file stores authentication state with Zustand.

It keeps:

- `token`
- `user`
- `hasHydrated`

The state is persisted in `localStorage` under:

```text
fintech-auth
```

Why `hasHydrated` exists:

The app needs to wait until persisted auth data has loaded before deciding whether the user is logged in. Without it, protected pages could briefly redirect incorrectly.

Main functions:

- `setAuth(token, user)`: saves login/register result.
- `logout()`: clears auth state.
- `setHasHydrated(value)`: marks local storage loading complete.

## UI State

### `src/lib/ui-store.ts`

This file stores which dashboard panel is open.

Valid panels:

```ts
'overview' | 'send' | 'recent' | 'help'
```

The sidebar uses this store. Clicking a sidebar item changes the active dashboard panel without needing separate routes for every dashboard section.

## Toast Notifications

### `src/lib/toast-store.ts`

This file stores toast notifications with Zustand.

Each toast has:

- `id`
- `title`
- `description`
- `tone`: `success`, `error`, or `info`

`showToast()` creates a toast and auto-dismisses it after a few seconds.

### `src/components/ui/toaster.tsx`

This component renders the toast stack in the top-right corner.

It is mounted once in `src/app/layout.tsx`, so any page or component can show a toast through `useToastStore`.

It is currently used when:

- A transfer succeeds.
- A transfer fails.
- A category correction succeeds.
- A category correction fails.

## Root App Files

### `src/app/layout.tsx`

This is the root layout for the whole frontend.

It sets:

- App metadata.
- Font preload links.
- The theme bootstrap script.
- The global `<Toaster />`.

The theme script runs before the app paints. It reads `fintech-theme` from `localStorage` and sets:

```ts
document.documentElement.dataset.theme = theme;
```

This prevents the dashboard from flashing the wrong theme on page load.

### `src/app/globals.css`

This file defines the visual system.

It contains CSS variables for:

- Backgrounds.
- Text colors.
- Muted text.
- Borders.
- Cards.
- Sidebar.
- Success and error states.
- Theme colors for light and dark mode.

Most components use variables like:

```css
var(--app-bg)
var(--app-text)
var(--app-border)
```

That lets the theme toggle update the entire dashboard cleanly.

### `src/app/page.tsx`

This is the root route.

It redirects visitors to:

```text
/login
```

## Auth Pages

### `src/app/(auth)/login/page.tsx`

This page lets an existing user sign in.

Main libraries:

- `react-hook-form` for form state.
- `zod` for validation.
- Axios client from `src/lib/api.ts`.
- Auth store from `src/lib/store.ts`.

Flow:

1. User enters email and password.
2. Form validates locally.
3. Frontend calls:

```ts
api.post<AuthResponse>('/auth/login', values)
```

4. Backend returns:

```ts
{
  accessToken,
  user
}
```

5. Frontend saves the token and user through `setAuth`.
6. User is routed to `/dashboard`.

Backend endpoint:

```text
POST /auth/login
```

Requirement supported:

- Users can securely access their wallet data.

### `src/app/(auth)/register/page.tsx`

This page creates a new account.

The UI intentionally matches the login page style.

Frontend validation:

- Name must be at least 2 characters.
- Email must be valid.
- Password must be at least 8 characters.

The 8-character rule matches the backend DTO.

Flow:

1. User enters name, email, and password.
2. Frontend calls:

```ts
api.post<AuthResponse>('/auth/register', values)
```

3. Backend creates:

- `User`
- related `Account`
- JWT token

4. Frontend saves the token and user.
5. Frontend immediately calls:

```ts
api.get<Account>('/accounts/me')
```

This confirms the new wallet account exists before sending the user to the dashboard.

6. User is routed to `/dashboard`.

Backend endpoints:

```text
POST /auth/register
GET /accounts/me
```

Requirements supported:

- Users can register.
- New users get accounts.
- The app can manage balances for registered users.

## Dashboard Shell

### `src/components/app-shell.tsx`

This component wraps protected dashboard pages.

It handles:

- Auth protection.
- Desktop sidebar.
- Mobile menu.
- Theme toggle.
- Logout menu.
- Dashboard panel navigation.

If auth has loaded and there is no token:

```ts
router.replace('/login')
```

Sidebar items:

- `Dashboard`
- `Send money`
- `Transactions`
- `Help`
- `Insights`

The first four are dashboard panels controlled by `useUiStore`. `Insights` is a separate route.

Requirement supported:

- Users can navigate to balance, transfer, history, help, and insights workflows.

### `src/app/(dashboard)/layout.tsx`

This route-group layout currently just returns children.

It exists because dashboard routes are grouped under `(dashboard)`.

### `src/app/(dashboard)/dashboard/page.tsx`

This route renders the dashboard experience through:

```tsx
<EfferdDashboard2 />
```

### `src/components/ui/efferd-dashboard-2.tsx`

This is a small wrapper that renders:

```tsx
<AppShell>
  <Dashboard />
</AppShell>
```

It keeps compatibility with the existing component name while the real dashboard logic lives in `src/components/dashboard.tsx`.

## Main Dashboard

### `src/components/dashboard.tsx`

This is the most important frontend file.

It loads:

```ts
GET /accounts/me
GET /transactions
```

The results are stored as:

- `account`
- `transactions`

The dashboard computes:

- Total sent.
- Total received.
- Recent chart data.

It renders different panels depending on `dashboardPanel` from `useUiStore`.

### Overview Panel

Shows:

- Available balance.
- Account owner and currency.
- Transaction count.
- Total sent.
- Total received.
- Transfer activity chart.

Backend endpoints used:

```text
GET /accounts/me
GET /transactions
```

Requirements supported:

- Users can view balance.
- Users can see account activity.
- Users can review financial summary.

### Send Money Panel

This panel sends money to another user.

The form fields are:

- Recipient email.
- Amount.
- Description.

Before a transfer is submitted, the frontend has an idempotency key:

```ts
const [idempotencyKey, setIdempotencyKey] = useState(createTransferKey);
```

`createTransferKey()` uses:

```ts
crypto.randomUUID()
```

The transfer request sends:

```ts
api.post('/transfers', {
  idempotencyKey,
  toEmail: values.toEmail,
  amount: values.amount,
  description: values.description || undefined,
})
```

After success:

1. The form resets.
2. A new idempotency key is generated.
3. Account and transaction data reload.
4. A success toast appears.

If the backend returns an error, an error toast appears.

Important note:

The frontend prevents normal double-clicks by disabling the submit button during submission. True idempotency is still tested at the API level by resending the same request body with the same `idempotencyKey`.

Backend endpoint:

```text
POST /transfers
```

Requirements supported:

- Users can send money.
- Client sends an idempotency key.
- Users get immediate success or error feedback.

The backend enforces:

- Balance movement.
- Negative balance protection.
- Duplicate transfer prevention.
- Concurrent transfer safety.

### Transactions Panel

This panel displays transaction history.

For each transaction it shows:

- Description.
- Date.
- Debit or credit.
- Amount.
- Effective category.
- `Fix category` button.

Backend endpoint used to load history:

```text
GET /transactions
```

Requirements supported:

- Users can review transaction history.
- Users can review transaction categories.

### Help Panel

This panel shows demo account details:

- `sender@example.com`
- `receiver@example.com`
- `password123`

It also explains the simple test flow:

1. Sign in.
2. Send money.
3. Review transaction history and fix categories.

Requirement supported:

- Makes the deployed app easier to test during assessment review.

## Category Correction

### `src/components/CorrectCategoryModal.tsx`

This modal opens when the user clicks `Fix category` in the transaction history panel.

It receives:

```ts
transaction: Transaction | null
```

When a transaction is selected, the modal opens and preselects the current category.

The user chooses a category from:

```ts
CATEGORIES
```

On save, the frontend calls:

```ts
api.patch<Transaction>(
  `/transactions/${transaction.id}/category`,
  { category },
)
```

After success:

1. Parent dashboard updates the transaction in local state.
2. Modal closes.
3. Success toast appears.

After error:

1. Error message stays in the modal.
2. Error toast appears.

Backend endpoint:

```text
PATCH /transactions/:id/category
```

Requirements supported:

- Users can correct categories.
- Backend stores corrections.
- Backend uses corrections in future categorization prompts.

## Spending Insights

### `src/app/(dashboard)/insights/page.tsx`

This page is protected by `AppShell`.

It loads:

```ts
GET /insights
GET /accounts/me
```

It gets the account currency from `/accounts/me` so money can be formatted consistently.

Backend endpoint:

```text
GET /insights
```

Requirements supported:

- Users can view useful spending insights.
- Frontend shows backend-generated insight data.

### `src/components/InsightsView.tsx`

This component renders the insights response.

It displays:

- Spending summary.
- Category breakdown.
- Monthly totals.
- Largest transaction.
- Unusual transactions.

Backend calculates the numbers. Gemini only writes the summary paragraph. The frontend only displays the result.

Requirement supported:

- Spending insights are visible to the user.

## Theme

### `src/components/theme-toggle.tsx`

This component switches between light and dark themes.

It stores the selected theme in:

```text
fintech-theme
```

It applies the theme by setting:

```ts
document.documentElement.dataset.theme = theme;
```

The CSS variables in `globals.css` respond to that attribute.

Requirement supported:

- Not a core assessment requirement, but improves usability and polish.

## Types

### `src/types/index.ts`

This file defines the frontend TypeScript types for backend responses.

Important types:

- `AuthUser`
- `AuthResponse`
- `Account`
- `Transaction`
- `Transfer`
- `Insights`
- `Category`

These types keep API usage safer in the frontend.

Example:

```ts
api.get<Account>('/accounts/me')
```

This tells TypeScript what shape the backend response should have.

## Utility Files

### `src/lib/utils.ts`

This file contains helper functions such as:

- `cn()` for merging class names.
- `formatMoney()` for displaying decimal strings as money.
- `formatDate()` for readable transaction dates.

These helpers keep formatting consistent across dashboard, transactions, and insights.

## UI Components

The `src/components/ui/` folder contains reusable interface primitives.

### `button.tsx`

Defines the shared `Button` component and variants:

- `primary`
- `light`
- `outline`
- `ghost`
- `danger`

Used across login, register, dashboard, modals, and toasts.

### `card.tsx`

Defines `Card`, `CardHeader`, `CardTitle`, and `CardDescription`.

Cards are used for dashboard panels, loading states, errors, metrics, and insights.

### `input.tsx`

Shared input styling for forms.

Used by:

- Login.
- Register.
- Send money.

### `label.tsx`

Shared form label styling.

### `select.tsx`

Shared dropdown/select component.

Used by `CorrectCategoryModal` to choose transaction categories.

### `dialog.tsx`

Shared modal component.

Used by category correction and older send-money modal code.

### `dropdown-menu.tsx`

Used by the settings menu in the sidebar.

### `collapsible.tsx`

Used for mobile sidebar/menu behavior.

### `checkbox.tsx`

Used by the login page's remember-me checkbox.

### `badge.tsx`

Small label component used for categories, counts, and account state.

### `separator.tsx`

Small visual divider used in the sidebar.

### `avatar.tsx`

Reusable avatar primitive. It is available for account UI expansion.

### `toaster.tsx`

Global notification renderer.

It reads from `toast-store.ts` and shows themed success/error/info messages.

## Older Or Compatibility Components

Some components still exist but are not the main current dashboard path.

### `src/components/SendMoneyModal.tsx`

This is the older modal-based send money flow.

The current dashboard uses the inline `SendMoneyPanel` in `dashboard.tsx`. The modal is still in the codebase but not the primary flow.

### `src/components/TransactionList.tsx`

This is an older reusable transaction-list component.

The current dashboard uses the transactions panel inside `dashboard.tsx`.

### `src/components/BalanceCard.tsx`

This is an older balance-card component.

The current overview panel has its own balance hero and metric cards.

These components can be removed later if you want a cleanup pass, but leaving them does not affect the deployed dashboard.

## Config Files

### `package.json`

Defines frontend scripts:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Important dependencies:

- `next`
- `react`
- `axios`
- `zustand`
- `react-hook-form`
- `zod`
- `recharts`
- `lucide-react`

### `.env.local.example`

Shows the required frontend environment variable:

```text
NEXT_PUBLIC_API_URL=http://localhost:3100
```

For production, set it to the deployed backend URL.

### `next.config.ts`

Next.js configuration file.

### `tsconfig.json`

TypeScript configuration.

### `eslint.config.mjs`

ESLint configuration.

### `postcss.config.mjs`

PostCSS/Tailwind pipeline configuration.

### `vercel.json` At Repository Root

This file is in the main repository root, not inside `Frontend`.

It is written for Vercel with Root Directory set to:

```text
Frontend
```

It tells Vercel:

```json
{
  "installCommand": "npm ci",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

This prevents Vercel from looking for a missing `public` directory.

## Requirement Trace

### Users Can Register

Frontend:

- `src/app/(auth)/register/page.tsx`

Backend calls:

- `POST /auth/register`
- `GET /accounts/me`

### Users Can Login

Frontend:

- `src/app/(auth)/login/page.tsx`
- `src/lib/store.ts`

Backend call:

- `POST /auth/login`

### Users Can View Balance

Frontend:

- `src/components/dashboard.tsx`

Backend call:

- `GET /accounts/me`

### Users Can Send Money

Frontend:

- `SendMoneyPanel` inside `src/components/dashboard.tsx`

Backend call:

- `POST /transfers`

### Idempotency Key Is Sent

Frontend:

- `createTransferKey()` in `src/components/dashboard.tsx`

The frontend generates:

```ts
crypto.randomUUID()
```

and sends it as:

```ts
idempotencyKey
```

Backend guarantees the same key cannot process twice.

### Users Can Review Transaction History

Frontend:

- Transactions panel inside `src/components/dashboard.tsx`

Backend call:

- `GET /transactions`

### Users Can Correct Categories

Frontend:

- `src/components/CorrectCategoryModal.tsx`

Backend call:

- `PATCH /transactions/:id/category`

### Corrections Influence Future Categorization

Frontend role:

- Sends the correction to the backend.
- Shows the updated category immediately.

Backend role:

- Stores correction.
- Loads recent corrections into future Gemini prompts.

### Users Can View Spending Insights

Frontend:

- `src/app/(dashboard)/insights/page.tsx`
- `src/components/InsightsView.tsx`

Backend call:

- `GET /insights`

### App Has Clear User Feedback

Frontend:

- `src/lib/toast-store.ts`
- `src/components/ui/toaster.tsx`

Used by:

- Transfer success/failure.
- Category update success/failure.

## Important Review Explanation

If someone asks what the frontend is responsible for, answer this:

The frontend is responsible for authentication UI, dashboard navigation, collecting transfer details, generating the client idempotency key, sending authenticated requests, showing balances/history/insights, letting users correct categories, and showing feedback through toasts.

If someone asks what the backend is responsible for, answer this:

The backend is responsible for all financial correctness: PostgreSQL persistence, atomic transfer transactions, row locks, duplicate transfer prevention, balance constraints, transaction records, LLM categorization, correction learning, and insights calculation.

## Common Test Flow

1. Open the frontend.
2. Login with:

```text
sender@example.com
password123
```

3. Open `Dashboard` to view balance.
4. Open `Send money`.
5. Send money to:

```text
receiver@example.com
```

6. Confirm the success toast appears.
7. Open `Transactions`.
8. Click `Fix category`.
9. Save a new category.
10. Confirm the category toast appears and the category updates.
11. Open `Insights` to view spending data.

## Idempotency Testing Note

The frontend creates a new UUID for each new transfer.

That is correct because each intentional new transfer should have a new idempotency key.

To test replay/idempotency behavior, use Swagger or Postman and send the exact same `POST /transfers` request twice with the exact same `idempotencyKey`.

Expected result:

- Same transfer ID comes back.
- Balance changes only once.
- No duplicate money movement happens.

The frontend prevents normal double-click duplicate sends, while the backend guarantees true idempotency.
