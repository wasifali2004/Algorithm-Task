// src/components/CorrectCategoryModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api, getApiErrorMessage } from '@/lib/api';
import { useToastStore } from '@/lib/toast-store';
import { CATEGORIES, type Category, type Transaction } from '@/types';

type CorrectCategoryModalProps = {
  transaction: Transaction | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: (transaction: Transaction) => void;
};

export function CorrectCategoryModal({
  transaction,
  onOpenChange,
  onSuccess,
}: CorrectCategoryModalProps) {
  const [category, setCategory] = useState<Category>('Other');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToastStore((state) => state.showToast);
  const open = Boolean(transaction);

  useEffect(() => {
    if (transaction) {
      setCategory(
        (transaction.correctedCategory ?? transaction.category) as Category,
      );
      setFormError('');
    }
  }, [transaction]);

  async function onSubmit() {
    if (!transaction) {
      return;
    }

    setFormError('');
    setIsLoading(true);

    try {
      const response = await api.patch<Transaction>(
        `/transactions/${transaction.id}/category`,
        { category },
      );
      onSuccess(response.data);
      onOpenChange(false);
      showToast({
        tone: 'success',
        title: 'Category updated',
        description: `Saved as ${category}. Future categorization can use this correction.`,
      });
    } catch (error) {
      const message = getApiErrorMessage(error);
      setFormError(message);
      showToast({
        tone: 'error',
        title: 'Category update failed',
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fix category</DialogTitle>
          <DialogDescription>
            Update the category saved for this transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]">
              <Tags className="h-4 w-4 text-[var(--app-primary)]" />
              Category correction
            </div>
            <p className="mt-1 text-sm text-[var(--app-muted)]">
              The backend stores this correction with the transaction history.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as Category)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formError ? <p className="text-sm text-[var(--app-error)]">{formError}</p> : null}

          <Button className="w-full" disabled={isLoading} onClick={onSubmit} variant="primary">
            {isLoading ? 'Saving...' : 'Save category'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
