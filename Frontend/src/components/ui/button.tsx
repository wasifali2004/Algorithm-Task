// src/components/ui/button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold outline-none transition duration-150 active:scale-[0.99] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--app-surface-strong)] text-[var(--app-primary-contrast)] shadow-sm hover:opacity-90 focus-visible:ring-4 focus-visible:ring-[var(--app-ring)]',
        primary:
          'bg-[var(--app-primary)] text-[var(--app-primary-contrast)] shadow-sm hover:bg-[var(--app-primary-hover)] focus-visible:ring-4 focus-visible:ring-[var(--app-ring)]',
        light:
          'bg-[var(--app-surface)] text-[var(--app-text)] shadow-sm hover:bg-[var(--app-surface-soft)] focus-visible:ring-4 focus-visible:ring-[var(--app-ring)]',
        outline:
          'border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:border-[#b8c7d0] hover:bg-[var(--app-surface-soft)] focus-visible:ring-4 focus-visible:ring-[var(--app-ring)]',
        ghost:
          'text-[var(--app-text)] hover:bg-[var(--app-surface-soft)] focus-visible:ring-4 focus-visible:ring-[var(--app-ring)]',
        danger:
          'bg-[var(--app-error)] text-white shadow-sm hover:opacity-90 focus-visible:ring-4 focus-visible:ring-[var(--app-ring)]',
      },
      size: {
        default: 'h-11 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-5',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
