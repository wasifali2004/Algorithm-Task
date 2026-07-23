// src/app/(dashboard)/insights/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { InsightsView } from '@/components/InsightsView';
import { Card } from '@/components/ui/card';
import { api, getApiErrorMessage } from '@/lib/api';
import type { Account, Insights } from '@/types';

function InsightsContent() {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    async function loadInsights() {
      setPageError('');
      setIsLoading(true);

      try {
        const [insightsResponse, accountResponse] = await Promise.all([
          api.get<Insights>('/insights'),
          api.get<Account>('/accounts/me'),
        ]);

        setInsights(insightsResponse.data);
        setCurrency(accountResponse.data.currency);
      } catch (error) {
        setPageError(getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    loadInsights();
  }, []);

  if (isLoading) {
    return (
      <Card className="flex items-center gap-3 text-sm text-[var(--app-muted)]">
        <div className="h-3 w-3 animate-pulse rounded-full bg-[var(--app-primary)]" />
        Loading insights...
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

  if (!insights) {
    return <Card className="text-sm text-[var(--app-error)]">Insights not found.</Card>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow)]">
        <div className="text-sm font-semibold text-[var(--app-primary)]">
          Financial reporting
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[var(--app-text)]">
          Spending insights
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--app-muted)]">
          Review category totals, monthly spending, and activity that differs from your normal account history.
        </p>
      </div>

      <InsightsView currency={currency} insights={insights} />
    </div>
  );
}

export default function InsightsPage() {
  return (
    <AppShell>
      <InsightsContent />
    </AppShell>
  );
}
