// src/lib/toast-store.ts
'use client';

import { create } from 'zustand';

export type ToastTone = 'success' | 'error' | 'info';

export type AppToast = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastInput = Omit<AppToast, 'id'> & {
  durationMs?: number;
};

type ToastState = {
  toasts: AppToast[];
  dismissToast: (id: string) => void;
  showToast: (toast: ToastInput) => string;
};

function createToastId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  showToast: ({ durationMs = 4200, ...toast }) => {
    const id = createToastId();

    set((state) => ({
      toasts: [{ ...toast, id }, ...state.toasts].slice(0, 4),
    }));

    window.setTimeout(() => {
      get().dismissToast(id);
    }, durationMs);

    return id;
  },
}));
