// src/components/BalanceCard.tsx
import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatMoney } from '@/lib/utils';
import type { Account } from '@/types';

type BalanceCardProps = {
  account: Account;
  onSendMoney: () => void;
};

export function BalanceCard({ account, onSendMoney }: BalanceCardProps) {
  return (
    <Card className="premium-grid relative overflow-hidden border-[#111827] bg-[#020617] p-0 text-white shadow-[0_24px_80px_rgba(2,6,23,0.28)]">
      <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100">
            <ShieldCheck className="h-3.5 w-3.5" />
            Protected wallet account
          </div>
          <p className="mt-8 text-sm text-slate-300">Current balance</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight sm:text-6xl">
            {formatMoney(account.balance, account.currency)}
          </h1>
          <p className="mt-4 text-sm text-slate-300">
            {account.user.name} · {account.user.email} · {account.currency}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Sparkles className="h-4 w-4 text-blue-300" />
              AI ready
            </div>
            <p className="mt-1 max-w-xs">Transfers are categorized after they are created.</p>
          </div>
          <Button className="w-full sm:w-auto" variant="light" onClick={onSendMoney}>
            Send Money
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
