// src/components/ui/input.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'h-11 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-input)] px-3.5 py-2 text-sm text-[var(--app-text)] shadow-sm outline-none placeholder:text-[#94a3ad] focus:border-[var(--app-primary)] focus:ring-4 focus:ring-[var(--app-ring)] disabled:cursor-not-allowed disabled:opacity-60',
      className,
    )}
    {...props}
  />
));

Input.displayName = 'Input';
