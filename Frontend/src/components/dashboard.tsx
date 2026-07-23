// src/components/dashboard.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  BadgeDollarSign,
  CircleDollarSign,
  History,
  ReceiptText,
  Send,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CorrectCategoryModal } from '@/components/CorrectCategoryModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, getApiErrorMessage } from '@/lib/api';
import { useToastStore } from '@/lib/toast-store';
import { useUiStore } from '@/lib/ui-store';
import { formatDate, formatMoney } from '@/lib/utils';
import type { Account, Transaction } from '@/types';

type MetricCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: React.ElementType;
};

type Totals = {
  sent: number;
  received: number;
};

const transferSchema = z.object({
  toEmail: z.string().email('Enter a valid recipient email'),
  amount: z.coerce.number().min(0.01, 'Amount must be at least 0.01'),
  description: z.string().max(500, 'Description is too long').optional(),
});

type TransferForm = z.infer<typeof transferSchema>;

function createTransferKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function MetricCard({ label, value, helper, icon: Icon }: MetricCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--app-muted)]">{label}</p>
          <p className="mt-2 break-words text-2xl font-semibold text-[var(--app-text)]">
            {value}
          </p>
          <p className="mt-1 text-xs text-[var(--app-muted)]">{helper}</p>
        </div>
        <div className="rounded-xl bg-[var(--app-surface-soft)] p-3 text-[var(--app-primary)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function PanelTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="rounded-xl bg-[var(--app-surface-soft)] p-3 text-[var(--app-primary)]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-[var(--app-text)]">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--app-muted)]">{description}</p>
      </div>
    </div>
  );
}

function RecentTransactionsPanel({
  currency,
  onFixCategory,
  transactions,
}: {
  currency: string;
  onFixCategory: (transaction: Transaction) => void;
  transactions: Transaction[];
}) {
  return (
    <Card>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PanelTitle
          icon={History}
          title="Transaction history"
          description="Recent transfers and category corrections for this account."
        />
        <Badge>{transactions.length} records</Badge>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface-soft)] p-8 text-center">
          <ReceiptText className="mx-auto h-8 w-8 text-[var(--app-primary)]" />
          <p className="mt-3 text-sm font-semibold text-[var(--app-text)]">
            No transactions yet
          </p>
          <p className="mt-1 text-sm text-[var(--app-muted)]">
            Use the Send money sidebar item to create the first one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const isDebit = transaction.type === 'DEBIT';
            const displayCategory =
              transaction.correctedCategory ??
              transaction.effectiveCategory ??
              transaction.category;

            return (
              <div
                className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4"
                key={transaction.id}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={
                        isDebit
                          ? 'rounded-xl bg-[var(--app-error-soft)] p-2.5 text-[var(--app-error)]'
                          : 'rounded-xl bg-[var(--app-success-soft)] p-2.5 text-[var(--app-success)]'
                      }
                    >
                      {isDebit ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--app-text)]">
                        {transaction.description ?? 'Transfer'}
                      </p>
                      <p className="mt-1 text-xs text-[var(--app-muted)]">
                        {formatDate(transaction.createdAt)} / {transaction.type.toLowerCase()}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
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

                  <p
                    className={
                      isDebit
                        ? 'text-sm font-semibold text-[var(--app-error)]'
                        : 'text-sm font-semibold text-[var(--app-success)]'
                    }
                  >
                    {isDebit ? '-' : '+'}
                    {formatMoney(transaction.amount, currency)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function buildChartData(transactions: Transaction[]) {
  return transactions
    .slice(0, 8)
    .reverse()
    .map((transaction, index) => ({
      name: `#${index + 1}`,
      amount: Number(transaction.amount),
      type: transaction.type,
    }));
}

function OverviewPanel({
  account,
  chartData,
  totals,
  transactions,
}: {
  account: Account;
  chartData: ReturnType<typeof buildChartData>;
  totals: Totals;
  transactions: Transaction[];
}) {
  return (
    <div className="space-y-6">
      <Card
        className="overflow-hidden border-[var(--app-hero-border)] p-0 shadow-[var(--app-shadow)]"
        style={{
          backgroundColor: 'var(--app-hero-bg)',
          color: 'var(--app-hero-text)',
        }}
      >
        <div className="p-6 sm:p-8">
          <div>
            <div>
              <Badge className="border-[var(--app-hero-border)] bg-[var(--app-hero-panel)] text-[var(--app-hero-text)]">
                Active account
              </Badge>
              <p className="mt-8 text-sm text-[var(--app-hero-muted)]">
                Available balance
              </p>
              <h2 className="mt-2 break-words text-4xl font-semibold text-[var(--app-hero-text)] sm:text-5xl">
                {formatMoney(account.balance, account.currency)}
              </h2>
              <p className="mt-4 text-sm text-[var(--app-hero-muted)]">
                {account.user.name} / {account.currency}
              </p>
            </div>

          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          helper="Current account value"
          icon={Wallet}
          label="Balance"
          value={formatMoney(account.balance, account.currency)}
        />
        <MetricCard
          helper="Total outgoing transfers"
          icon={ArrowUpRight}
          label="Money sent"
          value={formatMoney(totals.sent, account.currency)}
        />
        <MetricCard
          helper="Total incoming transfers"
          icon={ArrowDownLeft}
          label="Money received"
          value={formatMoney(totals.received, account.currency)}
        />
      </div>

      <Card>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--app-text)]">
              Transfer activity
            </h2>
            <p className="mt-1 text-sm text-[var(--app-muted)]">
              Recent transfer amounts from transaction history.
            </p>
          </div>
          <Badge>{chartData.length} recent</Badge>
        </div>

        {chartData.length === 0 ? (
          <div className="flex h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface-soft)] text-center">
            <ReceiptText className="h-8 w-8 text-[var(--app-primary)]" />
            <p className="mt-3 text-sm font-semibold text-[var(--app-text)]">
              No activity yet
            </p>
            <p className="mt-1 text-sm text-[var(--app-muted)]">
              Send money to create chart data.
            </p>
          </div>
        ) : (
          <div className="h-[280px] rounded-2xl bg-[var(--app-surface-soft)] p-3">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={chartData} margin={{ left: -20, right: 8, top: 10 }}>
                <CartesianGrid
                  stroke="var(--app-chart-grid)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis dataKey="name" stroke="var(--app-muted)" tickLine={false} />
                <YAxis stroke="var(--app-muted)" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--app-surface)',
                    border: '1px solid var(--app-border)',
                    borderRadius: 12,
                    color: 'var(--app-text)',
                  }}
                  formatter={(value) => formatMoney(Number(value), account.currency)}
                />
                <Bar dataKey="amount" fill="var(--app-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}

function SendMoneyPanel({
  account,
  onSuccess,
}: {
  account: Account;
  onSuccess: () => Promise<void>;
}) {
  const [idempotencyKey, setIdempotencyKey] = useState(createTransferKey);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      toEmail: '',
      amount: undefined,
      description: '',
    },
  });

  function refreshTransferKey() {
    setIdempotencyKey(createTransferKey());
  }

  async function onSubmit(values: TransferForm) {
    setFormError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      await api.post('/transfers', {
        idempotencyKey,
        toEmail: values.toEmail,
        amount: values.amount,
        description: values.description || undefined,
      });

      reset({ toEmail: '', amount: undefined, description: '' });
      refreshTransferKey();
      await onSuccess();
      setSuccessMessage('Transfer sent. The account balance and history are updated.');
      showToast({
        tone: 'success',
        title: 'Transfer sent',
        description: `${formatMoney(values.amount, account.currency)} was sent to ${values.toEmail}.`,
      });
    } catch (error) {
      const message = getApiErrorMessage(error);
      setFormError(message);
      showToast({
        tone: 'error',
        title: 'Transfer failed',
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Card>
        <PanelTitle
          icon={Send}
          title="Send money"
          description="Create a transfer from the active account."
        />

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="toEmail">Recipient email</Label>
              <Input
                id="toEmail"
                placeholder="recipient@domain.com"
                type="email"
                {...register('toEmail')}
              />
              {errors.toEmail?.message ? (
                <p className="text-sm text-[var(--app-error)]">
                  {errors.toEmail.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                min="0.01"
                placeholder="25.50"
                step="0.01"
                type="number"
                {...register('amount')}
              />
              {errors.amount?.message ? (
                <p className="text-sm text-[var(--app-error)]">
                  {errors.amount.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Dinner reimbursement"
              {...register('description')}
            />
            {errors.description?.message ? (
              <p className="text-sm text-[var(--app-error)]">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4 text-sm text-[var(--app-text)]">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4 text-[var(--app-primary)]" />
              Protected transfer
            </div>
            <p className="mt-1 text-xs leading-5 text-[var(--app-muted)]">
              One generated retry key is attached to this transfer.
            </p>
          </div>

          {formError ? (
            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-error-soft)] p-3 text-sm text-[var(--app-error)]">
              {formError}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-success-soft)] p-3 text-sm text-[var(--app-success)]">
              {successMessage}
            </div>
          ) : null}

          <Button
            className="w-full sm:w-fit"
            disabled={isSubmitting || !idempotencyKey}
            type="submit"
            variant="primary"
          >
            {isSubmitting ? 'Sending...' : 'Send money'}
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </form>
      </Card>

      <Card className="h-fit">
        <PanelTitle
          icon={Wallet}
          title="Active account"
          description="Transfers are sent from this balance."
        />
        <div className="space-y-3 text-sm">
          <div className="rounded-2xl bg-[var(--app-surface-soft)] p-4">
            <p className="text-[var(--app-muted)]">Owner</p>
            <p className="mt-1 font-semibold text-[var(--app-text)]">
              {account.user.name}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--app-surface-soft)] p-4">
            <p className="text-[var(--app-muted)]">Balance</p>
            <p className="mt-1 font-semibold text-[var(--app-text)]">
              {formatMoney(account.balance, account.currency)}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--app-surface-soft)] p-4">
            <p className="text-[var(--app-muted)]">Currency</p>
            <p className="mt-1 font-semibold text-[var(--app-text)]">
              {account.currency}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function HelpPanel() {
  return (
    <Card>
      <PanelTitle
        icon={CircleDollarSign}
        title="Transfer guide"
        description="A simple workflow for sending and reviewing account activity."
      />

      <div className="grid gap-3 text-sm md:grid-cols-3">
        <div className="rounded-xl border border-[var(--app-border)] p-4">
          <p className="font-semibold text-[var(--app-text)]">1. Review balance</p>
          <p className="mt-2 leading-6 text-[var(--app-muted)]">
            Confirm the available account balance before creating a transfer.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] p-4">
          <p className="font-semibold text-[var(--app-text)]">2. Enter details</p>
          <p className="mt-2 leading-6 text-[var(--app-muted)]">
            Add the recipient, amount, and an optional transaction note.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] p-4">
          <p className="font-semibold text-[var(--app-text)]">3. Verify record</p>
          <p className="mt-2 leading-6 text-[var(--app-muted)]">
            Confirm the completed transfer in transaction history.
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4 text-sm text-[var(--app-text)]">
        <BadgeDollarSign className="mt-0.5 h-4 w-4 text-[var(--app-primary)]" />
        Idempotency keys are generated automatically for each transfer.
      </div>
    </Card>
  );
}

export function Dashboard() {
  const dashboardPanel = useUiStore((state) => state.dashboardPanel);
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const loadDashboard = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;

    setPageError('');

    if (!silent) {
      setIsLoading(true);
    }

    try {
      const [accountResponse, transactionsResponse] = await Promise.all([
        api.get<Account>('/accounts/me'),
        api.get<Transaction[]>('/transactions'),
      ]);

      setAccount(accountResponse.data);
      setTransactions(transactionsResponse.data);
    } catch (error) {
      setPageError(getApiErrorMessage(error));
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const totals = useMemo(() => {
    const sent = transactions
      .filter((transaction) => transaction.type === 'DEBIT')
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    const received = transactions
      .filter((transaction) => transaction.type === 'CREDIT')
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    return { sent, received };
  }, [transactions]);

  const chartData = useMemo(() => buildChartData(transactions), [transactions]);

  function handleCategorySaved(updated: Transaction) {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === updated.id ? updated : transaction,
      ),
    );
  }

  if (isLoading) {
    return (
      <Card className="flex items-center gap-3 text-sm text-[var(--app-muted)]">
        <div className="h-3 w-3 animate-pulse rounded-full bg-[var(--app-primary)]" />
        Loading dashboard...
      </Card>
    );
  }

  if (pageError) {
    return (
      <Card className="flex items-center gap-3 text-sm text-[var(--app-error)]">
        <AlertCircle className="h-5 w-5" />
        {pageError}
      </Card>
    );
  }

  if (!account) {
    return <Card className="text-sm text-[var(--app-error)]">Account not found.</Card>;
  }

  return (
    <div className="space-y-6">
      {dashboardPanel === 'overview' ? (
        <OverviewPanel
          account={account}
          chartData={chartData}
          totals={totals}
          transactions={transactions}
        />
      ) : null}

      {dashboardPanel === 'send' ? (
        <SendMoneyPanel
          account={account}
          onSuccess={() => loadDashboard({ silent: true })}
        />
      ) : null}

      {dashboardPanel === 'recent' ? (
        <RecentTransactionsPanel
          currency={account.currency}
          transactions={transactions}
          onFixCategory={setSelectedTransaction}
        />
      ) : null}

      {dashboardPanel === 'help' ? <HelpPanel /> : null}

      <CorrectCategoryModal
        transaction={selectedTransaction}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTransaction(null);
          }
        }}
        onSuccess={handleCategorySaved}
      />
    </div>
  );
}
