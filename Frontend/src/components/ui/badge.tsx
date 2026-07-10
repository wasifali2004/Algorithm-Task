// src/components/ui/badge.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-[var(--app-border)] bg-[var(--app-primary-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--app-primary)]',
        className,
      )}
      {...props}
    />
  );
}
