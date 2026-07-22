import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  BrainCircuit,
  Check,
  CircleDollarSign,
  Fingerprint,
  Gauge,
  Layers3,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Fintech — Financial operations, beautifully controlled',
  description:
    'A secure financial operations platform for transfers, transaction intelligence, and clearer spending decisions.',
};

const capabilities = [
  {
    index: '01',
    title: 'Move money safely',
    description:
      'Send transfers with built-in duplicate protection and balance checks at every step.',
    icon: RefreshCw,
  },
  {
    index: '02',
    title: 'See the full story',
    description:
      'Turn raw transaction history into a readable, searchable record of every movement.',
    icon: Layers3,
  },
  {
    index: '03',
    title: 'Understand spending',
    description:
      'AI-assisted categories and useful insights reveal where money goes and what changed.',
    icon: BrainCircuit,
  },
];

const transactions = [
  { name: 'Atlas Coffee', category: 'Food', amount: '− $18.50', icon: ArrowUpRight },
  { name: 'Payroll deposit', category: 'Income', amount: '+ $3,240.00', icon: ArrowDownLeft },
  { name: 'Northline Studio', category: 'Transfer', amount: '− $420.00', icon: ArrowUpRight },
];

export default function HomePage() {
  return (
    <main className="landing-page min-h-screen overflow-hidden bg-[#f3f0e8] text-[#11130f]">
      <header className="relative z-20 border-b border-[#11130f]/20">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3" aria-label="Fintech home">
            <span className="flex size-9 items-center justify-center rounded-full border-[7px] border-[#11130f]" />
            <span className="text-sm font-bold uppercase tracking-[-0.02em]">Fintech</span>
            <span className="hidden border-l border-[#11130f]/30 pl-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#575b52] sm:block">
              Wallet OS
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.13em] md:flex" aria-label="Primary navigation">
            <a className="landing-nav-link" href="#platform">Platform</a>
            <a className="landing-nav-link" href="#intelligence">Intelligence</a>
            <a className="landing-nav-link" href="#security">Security</a>
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-10">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] transition hover:bg-[#11130f]/5 sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-[#11130f] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#3154ff] sm:px-5"
            >
              Open account
              <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative border-b border-[#11130f]/20">
        <div className="landing-grid-lines pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-[1440px] lg:min-h-[760px] lg:grid-cols-[1.03fr_0.97fr]">
          <div className="flex flex-col justify-between border-[#11130f]/20 px-5 pb-10 pt-20 sm:px-8 sm:pt-24 lg:border-r lg:px-12 lg:pb-12 lg:pt-28">
            <div>
              <div className="mb-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#51564d]">
                <span className="size-2 rounded-full bg-[#3154ff] shadow-[0_0_0_5px_rgba(49,84,255,0.12)]" />
                Financial operations, re-edited
              </div>

              <h1 className="max-w-[790px] font-serif text-[clamp(4rem,8vw,8.8rem)] leading-[0.82] tracking-[-0.065em]">
                Money moves.
                <span className="mt-2 block font-sans text-[0.52em] font-semibold leading-[0.94] tracking-[-0.055em]">
                  Your system stays precise.
                </span>
              </h1>

              <div className="mt-10 grid max-w-[680px] gap-7 border-t border-[#11130f]/25 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <p className="max-w-md text-base leading-7 text-[#4d5149] sm:text-lg">
                  One considered workspace for balances, transfers, transaction history, and intelligent spending insights.
                </p>
                <Link
                  href="/register"
                  className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#d9ff52] px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.12em] text-[#11130f] ring-1 ring-[#11130f] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#11130f]"
                >
                  Start moving
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#666b61] lg:mt-8">
              <span className="flex items-center gap-2"><Check className="size-3.5" /> Instant account setup</span>
              <span className="flex items-center gap-2"><Check className="size-3.5" /> Protected transfers</span>
              <span className="flex items-center gap-2"><Check className="size-3.5" /> AI-assisted insights</span>
            </div>
          </div>

          <div className="relative flex min-h-[640px] items-center justify-center bg-[#d9ff52] px-5 py-16 sm:px-10 lg:min-h-0">
            <div className="absolute left-6 top-6 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] sm:left-10 sm:top-8">
              <Sparkles className="size-4" /> Live financial picture
            </div>
            <span className="absolute bottom-7 right-8 font-serif text-7xl leading-none text-[#11130f]/10 sm:text-9xl">01</span>

            <div className="landing-dashboard-card relative w-full max-w-[610px] overflow-hidden rounded-[28px] border border-black/10 bg-[#f8f9fb] shadow-[0_35px_80px_rgba(17,19,15,0.22)]">
              <div className="flex h-12 items-center border-b border-[#e1e5eb] bg-white px-5">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-[#ff7262]" />
                  <span className="size-2.5 rounded-full bg-[#ffc84a]" />
                  <span className="size-2.5 rounded-full bg-[#75ce78]" />
                </div>
                <span className="mx-auto -translate-x-5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#7a8493]">Overview</span>
              </div>

              <div className="grid sm:grid-cols-[128px_1fr]">
                <aside className="hidden border-r border-[#e1e5eb] bg-white p-4 sm:block">
                  <div className="mb-7 flex items-center gap-2 text-xs font-bold text-[#111827]">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-[#111827] text-white"><WalletCards className="size-3.5" /></span>
                    Fintech
                  </div>
                  <div className="space-y-2 text-[9px] font-semibold text-[#8a94a3]">
                    <div className="rounded-lg bg-[#111827] px-3 py-2.5 text-white">Dashboard</div>
                    <div className="px-3 py-2.5">Send money</div>
                    <div className="px-3 py-2.5">Transactions</div>
                    <div className="px-3 py-2.5">Insights</div>
                  </div>
                </aside>

                <div className="p-4 sm:p-5">
                  <div className="mb-4 flex items-end justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#7a8493]">Available balance</p>
                      <p className="mt-1 text-[28px] font-bold tracking-[-0.05em] text-[#111827] sm:text-[34px]">$24,680.20</p>
                    </div>
                    <span className="rounded-full bg-[#e9f8ee] px-2.5 py-1 text-[9px] font-bold text-[#267342]">+12.8%</span>
                  </div>

                  <div className="relative mb-4 h-[138px] overflow-hidden rounded-2xl bg-[#111827] p-4 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[9px] font-semibold text-white/50">Cash flow</p>
                        <p className="mt-1 text-sm font-semibold">$8,420 this month</p>
                      </div>
                      <BarChart3 className="size-4 text-[#d9ff52]" />
                    </div>
                    <div className="absolute inset-x-4 bottom-4 flex h-[62px] items-end gap-2">
                      {[32, 48, 38, 72, 58, 88, 68, 96, 82, 108].map((height, index) => (
                        <span
                          key={height + index}
                          className={`flex-1 rounded-t-sm ${index === 9 ? 'bg-[#d9ff52]' : 'bg-white/20'}`}
                          style={{ height: `${height / 1.25}px` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#e1e5eb] bg-white p-3.5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[10px] font-bold text-[#111827]">Recent activity</p>
                      <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#3154ff]">View all</span>
                    </div>
                    <div className="space-y-2.5">
                      {transactions.map((transaction) => {
                        const Icon = transaction.icon;
                        return (
                          <div key={transaction.name} className="flex items-center gap-3">
                            <span className="flex size-8 items-center justify-center rounded-full bg-[#f0f2f5] text-[#111827]"><Icon className="size-3.5" /></span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[9px] font-bold text-[#111827]">{transaction.name}</p>
                              <p className="text-[8px] text-[#8993a2]">{transaction.category}</p>
                            </div>
                            <p className={`text-[9px] font-bold ${transaction.amount.startsWith('+') ? 'text-[#267342]' : 'text-[#111827]'}`}>{transaction.amount}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-b border-[#11130f]/20 bg-[#11130f] py-4 text-[#f3f0e8]">
        <div className="landing-marquee flex min-w-max items-center gap-7 text-[10px] font-bold uppercase tracking-[0.22em]">
          {[0, 1].map((group) => (
            <div key={group} className="flex items-center gap-7" aria-hidden={group === 1}>
              <span>Balances in real time</span><span className="size-1.5 rounded-full bg-[#d9ff52]" />
              <span>Every transfer accounted for</span><span className="size-1.5 rounded-full bg-[#3154ff]" />
              <span>Intelligence built in</span><span className="size-1.5 rounded-full bg-[#ff765e]" />
              <span>Clarity by default</span><span className="size-1.5 rounded-full bg-[#d9ff52]" />
            </div>
          ))}
        </div>
      </div>

      <section id="platform" className="border-b border-[#11130f]/20 px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1344px]">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="landing-kicker">The platform / 01—03</p>
              <p className="mt-8 max-w-xs text-sm leading-6 text-[#5b6056]">
                Built for people who want financial control without the noise that usually comes with it.
              </p>
            </div>
            <div>
              <h2 className="max-w-4xl font-serif text-[clamp(3.3rem,6.2vw,6.8rem)] leading-[0.94] tracking-[-0.055em]">
                The whole picture,
                <span className="block text-[#767b70]">not another blind spot.</span>
              </h2>
            </div>
          </div>

          <div className="mt-20 grid border-l border-t border-[#11130f]/20 md:grid-cols-3 lg:mt-28">
            {capabilities.map((capability) => {
              const Icon = capability.icon;
              return (
                <article key={capability.index} className="landing-feature-card group flex min-h-[360px] flex-col border-b border-r border-[#11130f]/20 p-7 sm:p-9">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#6a6f65]">{capability.index}</span>
                    <span className="flex size-12 items-center justify-center rounded-full border border-[#11130f]/20 transition group-hover:border-[#11130f] group-hover:bg-[#11130f] group-hover:text-white">
                      <Icon className="size-5" />
                    </span>
                  </div>
                  <div className="mt-auto">
                    <h3 className="font-serif text-4xl leading-none tracking-[-0.04em]">{capability.title}</h3>
                    <p className="mt-5 max-w-sm text-sm leading-6 text-[#5b6056]">{capability.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#11130f] px-5 py-24 text-[#f5f2e9] sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1344px]">
          <div className="grid gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
            <div>
              <p className="landing-kicker !text-[#aeb3a8]">One connected system</p>
              <h2 className="mt-8 max-w-2xl font-serif text-[clamp(3.5rem,6vw,6.5rem)] leading-[0.92] tracking-[-0.055em]">
                From intent to insight.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-[#b8bcb4] lg:justify-self-end lg:text-lg">
              Every action creates a clearer record. Transfer funds, track the outcome, refine the category, and let the system turn that history into useful context.
            </p>
          </div>

          <div className="mt-20 grid gap-px overflow-hidden rounded-[28px] border border-white/15 bg-white/15 md:grid-cols-4">
            {[
              { number: '01', label: 'Initiate', text: 'Enter a recipient and amount.', icon: CircleDollarSign },
              { number: '02', label: 'Protect', text: 'Verify balance and prevent replays.', icon: ShieldCheck },
              { number: '03', label: 'Record', text: 'Write a reliable transaction history.', icon: BadgeCheck },
              { number: '04', label: 'Understand', text: 'Convert activity into useful insight.', icon: Gauge },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.number} className="relative min-h-[300px] bg-[#181b16] p-7 sm:p-8">
                  <div className="flex items-center justify-between text-[#d9ff52]">
                    <span className="font-mono text-[10px] tracking-[0.18em]">/{step.number}</span>
                    <Icon className="size-5" />
                  </div>
                  <div className="mt-28">
                    <h3 className="text-xl font-semibold tracking-[-0.03em]">{step.label}</h3>
                    <p className="mt-3 max-w-[220px] text-sm leading-6 text-[#9ea39a]">{step.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="intelligence" className="border-b border-[#11130f]/20 bg-[#ece9e0] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-[1344px] gap-16 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-24">
          <div className="relative min-h-[560px] overflow-hidden rounded-[30px] bg-[#3154ff] p-6 text-white sm:p-10">
            <div className="flex items-center justify-between border-b border-white/25 pb-5">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#d9ff52] text-[#11130f]"><BrainCircuit className="size-4" /></span>
                <div>
                  <p className="text-xs font-bold">Spending intelligence</p>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-white/60">Updated just now</p>
                </div>
              </div>
              <Sparkles className="size-5" />
            </div>

            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/65">This month</p>
              <p className="mt-2 text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">$3,840.60</p>
              <p className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">8.4% less than last month</p>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-5 text-[#11130f]">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#777f73]">Category mix</p>
                <div className="mt-8 flex h-28 items-end gap-2">
                  {[48, 72, 42, 94, 58, 78].map((height, index) => (
                    <span key={height} className={`flex-1 rounded-sm ${index === 3 ? 'bg-[#d9ff52]' : 'bg-[#11130f]'}`} style={{ height: `${height}%` }} />
                  ))}
                </div>
                <div className="mt-3 flex justify-between text-[8px] font-semibold text-[#81877d]"><span>Food</span><span>Home</span><span>Other</span></div>
              </div>
              <div className="flex flex-col rounded-2xl bg-[#11130f] p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/50">Smart note</p>
                <p className="mt-auto font-serif text-2xl leading-[1.15] tracking-[-0.03em]">Dining spend is down for the second month in a row.</p>
                <span className="mt-5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#d9ff52]">View insight <ArrowRight className="size-3" /></span>
              </div>
            </div>
          </div>

          <div>
            <p className="landing-kicker">Intelligence / human-readable</p>
            <h2 className="mt-8 font-serif text-[clamp(3.6rem,6vw,6.7rem)] leading-[0.9] tracking-[-0.06em]">
              Data that explains itself.
            </h2>
            <p className="mt-8 max-w-lg text-lg leading-8 text-[#555a51]">
              Your activity becomes more useful over time. Correct a category once, get clearer summaries next time, and spot unusual movement without digging through rows of data.
            </p>
            <ul className="mt-10 space-y-0 border-t border-[#11130f]/20">
              {['Automatic transaction categories', 'Corrections that improve future results', 'Monthly summaries and unusual activity'].map((item) => (
                <li key={item} className="flex items-center gap-4 border-b border-[#11130f]/20 py-5 text-sm font-bold">
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#d9ff52]"><Check className="size-3.5" /></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="security" className="bg-[#f3f0e8] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1344px]">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="landing-kicker">Trust, engineered</p>
              <div className="mt-10 flex size-20 items-center justify-center rounded-full bg-[#11130f] text-[#d9ff52]">
                <Fingerprint className="size-8" />
              </div>
            </div>
            <div>
              <blockquote className="font-serif text-[clamp(3rem,5.5vw,6rem)] leading-[0.96] tracking-[-0.052em]">
                “Fast enough to feel effortless. Careful enough to trust.”
              </blockquote>
              <div className="mt-14 grid gap-8 border-t border-[#11130f]/20 pt-8 sm:grid-cols-3">
                <div>
                  <LockKeyhole className="size-5" />
                  <h3 className="mt-5 text-sm font-bold">Protected access</h3>
                  <p className="mt-2 text-sm leading-6 text-[#62675d]">Authenticated account sessions keep private financial views private.</p>
                </div>
                <div>
                  <RefreshCw className="size-5" />
                  <h3 className="mt-5 text-sm font-bold">Replay protection</h3>
                  <p className="mt-2 text-sm leading-6 text-[#62675d]">Every transfer is designed to prevent accidental duplicate movement.</p>
                </div>
                <div>
                  <ShieldCheck className="size-5" />
                  <h3 className="mt-5 text-sm font-bold">Balance integrity</h3>
                  <p className="mt-2 text-sm leading-6 text-[#62675d]">Atomic updates keep sender, receiver, and records in agreement.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#11130f]/20 bg-[#d9ff52] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1344px] gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="landing-kicker">Your money / in focus</p>
            <h2 className="mt-8 max-w-5xl font-serif text-[clamp(4rem,8vw,9rem)] leading-[0.82] tracking-[-0.07em]">
              Ready when you are.
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-sm text-base leading-7 text-[#3f443b]">Create your account and move from scattered transactions to one clear financial operating view.</p>
            <Link href="/register" className="group mt-8 inline-flex items-center gap-4 rounded-full bg-[#11130f] px-7 py-4 text-xs font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-[#3154ff]">
              Open your account
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#11130f] px-5 py-10 text-white sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1344px] flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full border-[6px] border-white" />
            <span className="text-xs font-bold uppercase tracking-[0.12em]">Fintech / Wallet OS</span>
          </Link>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
            <a href="#platform" className="hover:text-white">Platform</a>
            <a href="#intelligence" className="hover:text-white">Intelligence</a>
            <a href="#security" className="hover:text-white">Security</a>
            <Link href="/login" className="hover:text-white">Log in</Link>
          </div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">Designed for financial clarity.</p>
        </div>
      </footer>
    </main>
  );
}
