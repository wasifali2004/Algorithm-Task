// src/components/ui/checkbox.tsx
'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer flex size-4 shrink-0 items-center justify-center rounded border border-[var(--app-border)] bg-[var(--app-input)] shadow-sm outline-offset-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--app-primary)] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-[var(--app-primary)] data-[state=checked]:bg-[var(--app-primary)] data-[state=checked]:text-[var(--app-primary-contrast)]',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="h-3 w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
