// src/app/(dashboard)/insights/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
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
      <div className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow)]">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--app-primary)]">
          <Sparkles className="h-4 w-4" />
          Transaction Intelligence Agent
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--app-text)]">
          Spending insights
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--app-muted)]">
          The totals are calculated from the database. Gemini is only used to write the summary paragraph.
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
