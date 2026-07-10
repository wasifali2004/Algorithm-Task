// src/types/index.ts
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type Account = {
  id: string;
  balance: string;
  currency: string;
  user: { name: string; email: string };
};

export type Transaction = {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: string;
  category: string;
  correctedCategory: string | null;
  effectiveCategory?: string;
  description: string | null;
  createdAt: string;
  corrections?: {
    originalCategory: string;
    correctedCategory: string;
    createdAt: string;
  }[];
};

export type Transfer = {
  id: string;
  amount: string;
  status: string;
  description: string | null;
  createdAt: string;
};

export type InsightTransaction = {
  id: string;
  amount: string;
  category: string;
  correctedCategory?: string | null;
  description: string | null;
  createdAt: string;
  type?: 'CREDIT' | 'DEBIT';
};

export type Insights = {
  categoryBreakdown: { category: string; total: number | string }[];
  monthlyTotals: { month: string; total: number | string }[];
  unusualTransactions: InsightTransaction[];
  largestTransaction: InsightTransaction | null;
  summary: string;
};

export const CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Bills',
  'Shopping',
  'Entertainment',
  'Salary',
  'Transfers',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];

