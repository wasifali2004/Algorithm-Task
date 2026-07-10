// src/components/app-shell.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  BarChart3,
  CircleHelp,
  History,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Send,
  Settings,
  WalletCards,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuthStore } from '@/lib/store';
import { type DashboardPanel, useUiStore } from '@/lib/ui-store';
import { cn } from '@/lib/utils';

const dashboardItems: {
  panel: DashboardPanel;
  label: string;
  icon: React.ElementType;
}[] = [
  { panel: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { panel: 'send', label: 'Send money', icon: Send },
  { panel: 'recent', label: 'Transactions', icon: History },
  { panel: 'help', label: 'Help', icon: CircleHelp },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const dashboardPanel = useUiStore((state) => state.dashboardPanel);
  const setDashboardPanel = useUiStore((state) => state.setDashboardPanel);

  function openDashboardPanel(panel: DashboardPanel) {
    setDashboardPanel(panel);

    if (pathname !== '/dashboard') {
      router.push('/dashboard');
    }

    onNavigate?.();
  }

  return (
    <nav className="space-y-1">
      {dashboardItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === '/dashboard' && dashboardPanel === item.panel;

        return (
          <button
            key={item.panel}
            type="button"
            onClick={() => openDashboardPanel(item.panel)}
            className={cn(
              'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[var(--app-muted)] transition hover:bg-[var(--app-surface-soft)] hover:text-[var(--app-text)]',
              active &&
                'bg-[var(--app-sidebar-active)] text-[var(--app-sidebar-active-text)] shadow-sm hover:bg-[var(--app-sidebar-active)] hover:text-[var(--app-sidebar-active-text)]',
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        );
      })}

      <Link
        href="/insights"
        onClick={onNavigate}
        className={cn(
          'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--app-muted)] transition hover:bg-[var(--app-surface-soft)] hover:text-[var(--app-text)]',
          pathname === '/insights' &&
            'bg-[var(--app-sidebar-active)] text-[var(--app-sidebar-active-text)] shadow-sm hover:bg-[var(--app-sidebar-active)] hover:text-[var(--app-sidebar-active-text)]',
        )}
      >
        <BarChart3 className="h-4 w-4" />
        Insights
      </Link>
    </nav>
  );
}

function SettingsMenu({
  email,
  compact = false,
  onLogout,
}: {
  compact?: boolean;
  email?: string | null;
  onLogout: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn('justify-start', compact ? 'w-fit px-3' : 'w-full')}
          type="button"
          variant="outline"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <div className="px-2 py-2">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--app-muted)]">
            Account
          </p>
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-[var(--app-surface-soft)] p-2 text-sm text-[var(--app-text)]">
            <Mail className="h-4 w-4 text-[var(--app-primary)]" />
            <span className="truncate">{email}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-[var(--app-error)]" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const logout = useAuthStore((state) => state.logout);
  const setDashboardPanel = useUiStore((state) => state.setDashboardPanel);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (hasHydrated && !token) {
      router.replace('/login');
    }
  }, [hasHydrated, router, token]);

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  if (!hasHydrated || !token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] text-sm text-[var(--app-muted)]">
        Loading your wallet...
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-[var(--app-border)] bg-[var(--app-sidebar)] p-4 lg:block">
        <div className="flex h-full flex-col">
          <Link
            className="flex cursor-pointer items-center gap-3 rounded-xl p-2"
            href="/dashboard"
            onClick={() => {
              setDashboardPanel('overview');
              setMobileOpen(false);
            }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--app-primary)] text-[var(--app-primary-contrast)] shadow-sm">
              <WalletCards className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold leading-4 text-[var(--app-text)]">
                Fintech
              </span>
              <span className="text-xs text-[var(--app-muted)]">Assessment</span>
            </span>
          </Link>

          <Separator className="my-5" />
          <NavLinks />

          <div className="mt-auto">
            <SettingsMenu compact email={user?.email} onLogout={handleLogout} />
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-[var(--app-border)] bg-[var(--app-surface)]/95 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <Collapsible open={mobileOpen} onOpenChange={setMobileOpen}>
              <CollapsibleTrigger asChild>
                <Button className="lg:hidden" size="icon" type="button" variant="outline">
                  {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="absolute left-4 right-4 top-20 space-y-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3 shadow-[var(--app-shadow)] lg:hidden">
                <NavLinks onNavigate={() => setMobileOpen(false)} />
                <SettingsMenu email={user?.email} onLogout={handleLogout} />
              </CollapsibleContent>
            </Collapsible>

            <div>
              <h1 className="text-xl font-semibold text-[var(--app-text)]">
                Dashboard
              </h1>
            </div>

            <div className="ml-auto">
              <ThemeToggle compact />
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
