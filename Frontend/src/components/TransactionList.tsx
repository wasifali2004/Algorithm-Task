// src/components/TransactionList.tsx
import { ArrowDownLeft, ArrowUpRight, ReceiptText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDate, formatMoney } from '@/lib/utils';
import type { Transaction } from '@/types';

type TransactionListProps = {
  transactions: Transaction[];
  currency?: string;
  onFixCategory: (transaction: Transaction) => void;
};

export function TransactionList({
  transactions,
  currency = 'USD',
  onFixCategory,
}: TransactionListProps) {
  return (
    <Card className="bg-[var(--app-card-blue)]">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Recent transactions</CardTitle>
          <CardDescription>
            Review categories and fix any transaction that looks wrong.
          </CardDescription>
        </div>
        <div className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1 text-xs font-semibold text-[var(--app-muted)] shadow-sm">
          {transactions.length} records
        </div>
      </CardHeader>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-primary-soft)] text-[var(--app-primary)] shadow-sm">
            <ReceiptText className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-semibold text-[var(--app-text)]">No transactions yet</p>
          <p className="mt-1 text-sm text-[var(--app-muted)]">
            Send money to create the first transaction record.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {transactions.map((transaction) => {
            const isDebit = transaction.type === 'DEBIT';
            const displayCategory =
              transaction.correctedCategory ??
              transaction.effectiveCategory ??
              transaction.category;

            return (
              <div
                className="group flex flex-col gap-4 rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--app-shadow)] sm:flex-row sm:items-center sm:justify-between"
                key={transaction.id}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={
                      isDebit
                        ? 'rounded-2xl bg-[var(--app-error-soft)] p-3 text-[var(--app-error)]'
                        : 'rounded-2xl bg-[var(--app-success-soft)] p-3 text-[var(--app-success)]'
                    }
                  >
                    {isDebit ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : (
                      <ArrowDownLeft className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-[var(--app-text)]">
                      {transaction.description ?? 'Transfer'}
                    </p>
                    <p className="mt-1 text-sm text-[var(--app-muted)]">
                      {formatDate(transaction.createdAt)} · {transaction.type.toLowerCase()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <p
                    className={
                      isDebit
                        ? 'text-lg font-semibold text-[var(--app-error)]'
                        : 'text-lg font-semibold text-[var(--app-success)]'
                    }
                  >
                    {isDebit ? '-' : '+'}
                    {formatMoney(transaction.amount, currency)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{displayCategory}</Badge>
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={() => onFixCategory(transaction)}
                    >
                      Fix category
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
