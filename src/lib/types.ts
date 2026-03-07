export type Category =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export const CATEGORIES: Category[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category: Category;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  date: string;
  amount: string;
  category: Category;
  description: string;
}

export interface ExpenseFilters {
  startDate: string;
  endDate: string;
  category: Category | 'All';
  search: string;
}

export interface CategorySummary {
  category: Category;
  total: number;
  count: number;
  percentage: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  label: string;
  total: number;
}
