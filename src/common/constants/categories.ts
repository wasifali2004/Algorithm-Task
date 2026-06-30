import { Category } from '../../generated/prisma/enums';

export const CATEGORY_LABELS = [
  'Food & Dining',
  'Transport',
  'Bills',
  'Shopping',
  'Entertainment',
  'Salary',
  'Transfers',
  'Other',
] as const;

export type CategoryLabel = (typeof CATEGORY_LABELS)[number];

export const CATEGORY_TO_LABEL: Record<Category, CategoryLabel> = {
  FOOD_DINING: 'Food & Dining',
  TRANSPORT: 'Transport',
  BILLS: 'Bills',
  SHOPPING: 'Shopping',
  ENTERTAINMENT: 'Entertainment',
  SALARY: 'Salary',
  TRANSFERS: 'Transfers',
  OTHER: 'Other',
};

export const LABEL_TO_CATEGORY: Record<CategoryLabel, Category> = {
  'Food & Dining': Category.FOOD_DINING,
  Transport: Category.TRANSPORT,
  Bills: Category.BILLS,
  Shopping: Category.SHOPPING,
  Entertainment: Category.ENTERTAINMENT,
  Salary: Category.SALARY,
  Transfers: Category.TRANSFERS,
  Other: Category.OTHER,
};

export function isCategoryLabel(value: string): value is CategoryLabel {
  // check the category name
  return CATEGORY_LABELS.includes(value as CategoryLabel);
}
