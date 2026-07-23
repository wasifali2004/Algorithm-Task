import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Fintech Wallet — Clear financial control',
  description: 'Manage balances, transfers, transaction records, and spending reports from one secure financial workspace.',
};

const activity = [
  ['Payroll deposit', 'Today, 09:42', '+$3,240.00', 'credit'],
  ['Office subscription', 'Yesterday, 16:18', '-$89.00', 'debit'],
  ['Account transfer', '12 Jul, 11:06', '-$420.00', 'debit'],
];

const features = [
  ['Accounts', 'See available balances and recent movement without switching between tools.'],
  ['Transfers', 'Send money with balance validation and automatic duplicate protection.'],
  ['Reporting', 'Understand spending by category, month, and transaction history.'],
];

export default function HomePage() {
  return (
    <main className="landing-page min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#dce5ea] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Fintech Wallet home">
            <span className="grid size-9 place-items-center rounded-lg bg-[#102a43] text-xs font-bold text-white">FW</span>
            <span>
              <span className="block text-sm font-semibold tracking-[-0.02em] text-[#102a43]">Fintech Wallet</span>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-[#718390]">Financial operations</span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-8 text-sm font-medium text-[#526675] md:flex" aria-label="Primary navigation">
            <a href="#platform" className="transition hover:text-[#0f766e]">Platform</a>
            <a href="#reporting" className="transition hover:text-[#0f766e]">Reporting</a>
            <a href="#security" className="transition hover:text-[#0f766e]">Security</a>
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-8">
            <Link href="/login" className="hidden rounded-lg px-4 py-2.5 text-sm font-semibold text-[#102a43] transition hover:bg-[#f2f6f8] sm:block">Sign in</Link>
            <Link href="/register" className="rounded-lg bg-[#0f766e] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b625b] sm:px-5">Open an account</Link>
          </div>
        </div>
      </header>

      <section className="overflow-hidden bg-[#f7f9fa]">
        <div className="mx-auto grid max-w-[1240px] gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:py-24">
          <div className="landing-rise">
            <p className="inline-flex rounded-full border border-[#cfe2df] bg-[#eaf5f3] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0b625b]">
              Secure financial workspace
            </p>
            <h1 className="mt-7 max-w-2xl text-[clamp(3.1rem,6vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[#102a43]">
              Financial control, without the complexity.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#5f7280]">
              Manage balances, transfer funds, review transaction history, and understand spending from one dependable account workspace.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-lg bg-[#0f766e] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b625b]">Create your account</Link>
              <a href="#platform" className="inline-flex h-12 items-center justify-center rounded-lg border border-[#cfdbe2] bg-white px-6 text-sm font-semibold text-[#102a43] transition hover:border-[#aebfc9]">Explore the platform</a>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-[#dce5ea] pt-6">
              {[
                ['Protected', 'account access'],
                ['Duplicate-safe', 'transfers'],
                ['Complete', 'financial records'],
              ].map(([title, label]) => (
                <div key={title}>
                  <p className="text-sm font-semibold text-[#102a43]">{title}</p>
                  <p className="mt-1 text-xs text-[#718390]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#d5e0e6] bg-[#e9eff2] p-3 shadow-[0_24px_70px_rgba(16,42,67,0.12)] sm:p-5">
            <div className="overflow-hidden rounded-xl border border-[#d9e3e8] bg-white">
              <div className="flex items-center justify-between border-b border-[#e2e9ed] px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-[#102a43]">Account overview</p>
                  <p className="mt-1 text-xs text-[#718390]">Updated moments ago</p>
                </div>
                <span className="rounded-full bg-[#e5f4ed] px-2.5 py-1 text-[10px] font-semibold text-[#167253]">Active</span>
              </div>

              <div className="p-5 sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#718390]">Available balance</p>
                    <p className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-[#102a43] sm:text-5xl">$24,680.20</p>
                  </div>
                  <div className="rounded-lg bg-[#e8f4f2] px-3 py-2 text-right">
                    <p className="text-[10px] text-[#55756f]">Net this month</p>
                    <p className="text-sm font-semibold text-[#167253]">+$2,180.40</p>
                  </div>
                </div>

                <div className="mt-7 rounded-xl bg-[#102a43] p-5">
                  <div className="flex items-start justify-between">
                    <div><p className="text-[10px] text-[#9eb1be]">Cash movement</p><p className="mt-1 text-sm font-semibold text-white">Last 30 days</p></div>
                    <p className="text-xs font-medium text-[#75c9c0]">+12.8%</p>
                  </div>
                  <div className="mt-7 flex h-20 items-end gap-2">
                    {[42, 58, 37, 68, 49, 81, 66, 91, 74, 100].map((height, index) => (
                      <span key={index} className={`flex-1 rounded-t-sm ${index === 9 ? 'bg-[#5bb9af]' : 'bg-white/18'}`} style={{ height: `${height}%` }} />
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#102a43]">Recent activity</p>
                    <p className="text-[10px] font-medium text-[#0f766e]">View all</p>
                  </div>
                  <div className="divide-y divide-[#e5ebef]">
                    {activity.map(([name, date, amount, tone]) => (
                      <div key={name} className="flex items-center justify-between gap-4 py-3">
                        <div><p className="text-xs font-semibold text-[#294357]">{name}</p><p className="mt-0.5 text-[10px] text-[#7a8c97]">{date}</p></div>
                        <p className={`text-xs font-semibold ${tone === 'credit' ? 'text-[#167253]' : 'text-[#294357]'}`}>{amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="border-y border-[#dfe7eb] bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#0f766e]">Core platform</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#102a43] sm:text-5xl">Everything essential, clearly organized.</h2>
            <p className="mt-5 text-lg leading-8 text-[#627786]">The daily financial tools you need, presented with a consistent workflow and no unnecessary layers.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map(([title, description], index) => (
              <article key={title} className="rounded-xl border border-[#dce5ea] bg-white p-6 shadow-[0_8px_28px_rgba(16,42,67,0.05)]">
                <p className="text-xs font-semibold text-[#0f766e]">0{index + 1}</p>
                <h3 className="mt-8 text-xl font-semibold tracking-[-0.025em] text-[#102a43]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#627786]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="reporting" className="bg-[#f4f7f9] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#0f766e]">Financial reporting</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#102a43] sm:text-5xl">Useful context from every transaction.</h2>
            <p className="mt-5 text-lg leading-8 text-[#627786]">See category totals, monthly changes, and unusual activity without turning your account into a data dashboard.</p>
          </div>
          <div className="rounded-xl border border-[#d9e3e8] bg-white p-6 shadow-[0_8px_28px_rgba(16,42,67,0.05)]">
            <div className="flex items-center justify-between border-b border-[#e2e9ed] pb-5">
              <div><p className="text-sm font-semibold text-[#102a43]">Monthly spending</p><p className="mt-1 text-xs text-[#718390]">Category breakdown</p></div>
              <p className="text-2xl font-semibold tracking-[-0.035em] text-[#102a43]">$3,840.60</p>
            </div>
            <div className="mt-6 space-y-5">
              {[['Housing', '48%', '$1,843'], ['Food & dining', '24%', '$921'], ['Transport', '16%', '$614'], ['Other', '12%', '$462']].map(([label, width, amount]) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-xs"><span className="font-medium text-[#526675]">{label}</span><span className="font-semibold text-[#102a43]">{amount}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#e6ecef]"><div className="h-full rounded-full bg-[#0f766e]" style={{ width }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="security" className="bg-[#102a43] px-5 py-16 text-white sm:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#75c9c0]">Secure by design</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">A dependable account workspace for every financial decision.</h2>
          </div>
          <Link href="/register" className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-[#0f766e] px-6 text-sm font-semibold text-white transition hover:bg-[#13877e]">Open an account</Link>
        </div>
      </section>

      <footer className="border-t border-[#29465d] bg-[#102a43] px-5 py-8 text-white sm:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-4 text-xs text-[#9eb1be] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-white">Fintech Wallet</p>
          <div className="flex gap-6"><a href="#platform">Platform</a><a href="#reporting">Reporting</a><Link href="/login">Sign in</Link></div>
          <p>Clear financial operations.</p>
        </div>
      </footer>
    </main>
  );
}
