// src/components/InsightsView.tsx
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDate, formatMoney } from '@/lib/utils';
import type { InsightTransaction, Insights } from '@/types';

type InsightsViewProps = {
  insights: Insights;
  currency?: string;
};

function TransactionItem({
  transaction,
  currency = 'USD',
}: {
  transaction: InsightTransaction;
  currency?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
      <div>
        <p className="font-semibold text-[var(--app-text)]">
          {transaction.description ?? 'Transfer'}
        </p>
        <p className="mt-1 text-sm text-[var(--app-muted)]">
          {formatDate(transaction.createdAt)}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-[var(--app-error)]">
          {formatMoney(transaction.amount, currency)}
        </p>
        <Badge className="mt-2">
          {transaction.correctedCategory ?? transaction.category}
        </Badge>
      </div>
    </div>
  );
}

export function InsightsView({ insights, currency = 'USD' }: InsightsViewProps) {
  const categoryMax = Math.max(
    1,
    ...insights.categoryBreakdown.map((item) => Number(item.total)),
  );

  return (
    <div className="space-y-6">
      <Card className="bg-[var(--app-surface-strong)] text-[var(--app-primary-contrast)]">
        <CardHeader>
          <CardTitle className="text-[var(--app-primary-contrast)]">Account summary</CardTitle>
          <CardDescription className="text-[var(--app-primary-contrast)] opacity-70">
            A concise overview of the calculated spending data.
          </CardDescription>
        </CardHeader>
        <p className="rounded-lg border border-white/10 bg-white/5 p-5 text-sm leading-7 text-[var(--app-primary-contrast)]">
          {insights.summary}
        </p>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category breakdown</CardTitle>
          <CardDescription>Total spending grouped by category.</CardDescription>
        </CardHeader>

        {insights.categoryBreakdown.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface-soft)] p-8 text-center text-sm text-[var(--app-muted)]">
            No debit transactions yet, so there is no spending to show.
          </p>
        ) : (
          <div className="space-y-5">
            {insights.categoryBreakdown.map((item) => {
              const total = Number(item.total);
              const width = `${Math.max(6, (total / categoryMax) * 100)}%`;

              return (
                <div key={item.category}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                    <span className="font-semibold text-[var(--app-text)]">{item.category}</span>
                    <span className="font-medium text-[var(--app-muted)]">
                      {formatMoney(total, currency)}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[var(--app-surface-soft)]">
                    <div
                      className="h-3 rounded-full bg-[var(--app-primary)]"
                      style={{ width }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly totals</CardTitle>
            <CardDescription>How much was spent each month.</CardDescription>
          </CardHeader>

          {insights.monthlyTotals.length === 0 ? (
            <p className="text-sm text-[var(--app-muted)]">No monthly spending yet.</p>
          ) : (
            <div className="grid gap-3">
              {insights.monthlyTotals.map((item) => (
                <div
                  className="flex items-center justify-between rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4 text-sm"
                  key={item.month}
                >
                  <span className="font-semibold text-[var(--app-text)]">{item.month}</span>
                  <span className="font-semibold text-[var(--app-primary)]">
                    {formatMoney(item.total, currency)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Largest transaction</CardTitle>
            <CardDescription>The biggest debit found in your history.</CardDescription>
          </CardHeader>

          {insights.largestTransaction ? (
            <TransactionItem
              currency={currency}
              transaction={insights.largestTransaction}
            />
          ) : (
            <p className="text-sm text-[var(--app-muted)]">No largest transaction yet.</p>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unusual transactions</CardTitle>
          <CardDescription>Transactions that are much larger than usual.</CardDescription>
        </CardHeader>

        {insights.unusualTransactions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface-soft)] p-8 text-center text-sm text-[var(--app-muted)]">
            No unusual activity found.
          </p>
        ) : (
          <div className="space-y-3">
            {insights.unusualTransactions.map((transaction) => (
              <TransactionItem
                currency={currency}
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
