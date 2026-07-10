// src/components/ui/toaster.tsx
'use client';

import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import type { ElementType } from 'react';
import { Button } from '@/components/ui/button';
import { useToastStore, type ToastTone } from '@/lib/toast-store';
import { cn } from '@/lib/utils';

const toneStyles: Record<
  ToastTone,
  {
    icon: ElementType;
    iconClassName: string;
    ringClassName: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    iconClassName: 'text-[var(--app-success)]',
    ringClassName: 'bg-[var(--app-success-soft)]',
  },
  error: {
    icon: AlertCircle,
    iconClassName: 'text-[var(--app-error)]',
    ringClassName: 'bg-[var(--app-error-soft)]',
  },
  info: {
    icon: Info,
    iconClassName: 'text-[var(--app-primary)]',
    ringClassName: 'bg-[var(--app-surface-soft)]',
  },
};

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6"
    >
      {toasts.map((toast) => {
        const tone = toneStyles[toast.tone];
        const Icon = tone.icon;

        return (
          <div
            className="pointer-events-auto overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 text-[var(--app-text)] shadow-[0_22px_70px_rgba(0,0,0,0.18)]"
            key={toast.id}
            role={toast.tone === 'error' ? 'alert' : 'status'}
          >
            <div className="flex items-start gap-3">
              <div className={cn('rounded-xl p-2', tone.ringClassName)}>
                <Icon className={cn('h-5 w-5', tone.iconClassName)} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--app-text)]">
                  {toast.title}
                </p>
                {toast.description ? (
                  <p className="mt-1 text-sm leading-5 text-[var(--app-muted)]">
                    {toast.description}
                  </p>
                ) : null}
              </div>

              <Button
                aria-label="Dismiss notification"
                className="h-8 w-8 shrink-0 rounded-lg"
                size="icon"
                type="button"
                variant="ghost"
                onClick={() => dismissToast(toast.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
