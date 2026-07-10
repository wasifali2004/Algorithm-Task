// src/components/SendMoneyModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, getApiErrorMessage } from '@/lib/api';

const transferSchema = z.object({
  toEmail: z.string().email('Enter a valid recipient email'),
  amount: z.coerce.number().min(0.01, 'Amount must be at least 0.01'),
  description: z.string().max(500, 'Description is too long').optional(),
});

type TransferForm = z.infer<typeof transferSchema>;

type SendMoneyModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function SendMoneyModal({
  open,
  onOpenChange,
  onSuccess,
}: SendMoneyModalProps) {
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      toEmail: '',
      amount: undefined,
      description: '',
    },
  });

  useEffect(() => {
    if (open) {
      setIdempotencyKey(crypto.randomUUID());
      setFormError('');
      reset({ toEmail: '', amount: undefined, description: '' });
    }
  }, [open, reset]);

  async function onSubmit(values: TransferForm) {
    setFormError('');
    setIsLoading(true);

    try {
      await api.post('/transfers', {
        idempotencyKey,
        toEmail: values.toEmail,
        amount: values.amount,
        description: values.description || undefined,
      });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-primary)] text-[var(--app-primary-contrast)] shadow-sm">
          <ArrowUpRight className="h-5 w-5" />
        </div>

        <DialogHeader>
          <DialogTitle>Send money</DialogTitle>
          <DialogDescription>
            Enter the receiver email and amount. The retry key is generated safely in the background.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-green)] p-3 text-sm text-[var(--app-text)]">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4 text-[var(--app-success)]" />
              Protected transfer
            </div>
            <p className="mt-1 text-xs leading-5 text-[var(--app-muted)]">
              Repeated clicks or network retries will not duplicate the transfer.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="toEmail">Recipient email</Label>
            <Input
              id="toEmail"
              type="email"
              placeholder="receiver@example.com"
              {...register('toEmail')}
            />
            {errors.toEmail?.message ? (
              <p className="text-sm text-[var(--app-error)]">{errors.toEmail.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              min="0.01"
              step="0.01"
              type="number"
              placeholder="25.50"
              {...register('amount')}
            />
            {errors.amount?.message ? (
              <p className="text-sm text-[var(--app-error)]">{errors.amount.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Dinner reimbursement"
              {...register('description')}
            />
            {errors.description?.message ? (
              <p className="text-sm text-[var(--app-error)]">{errors.description.message}</p>
            ) : null}
          </div>

          {formError ? (
            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-error-soft)] p-3 text-sm text-[var(--app-error)]">
              {formError}
            </div>
          ) : null}

          <Button
            className="w-full"
            disabled={isLoading || !idempotencyKey}
            type="submit"
            variant="primary"
          >
            {isLoading ? 'Sending...' : 'Send money'}
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
