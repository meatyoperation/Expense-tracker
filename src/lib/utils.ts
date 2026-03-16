import { Category, CategorySummary, Expense, MonthlyData } from './types';

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#f97316',
  Transportation: '#3b82f6',
  Entertainment: '#a855f7',
  Shopping: '#ec4899',
  Bills: '#ef4444',
  Other: '#6b7280',
};

export const CATEGORY_BG: Record<Category, string> = {
  Food: 'bg-orange-100 text-orange-700',
  Transportation: 'bg-blue-100 text-blue-700',
  Entertainment: 'bg-purple-100 text-purple-700',
  Shopping: 'bg-pink-100 text-pink-700',
  Bills: 'bg-red-100 text-red-700',
  Other: 'bg-gray-100 text-gray-700',
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function getCurrentMonthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: formatDateToISO(start),
    end: formatDateToISO(end),
  };
}

export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayISO(): string {
  return formatDateToISO(new Date());
}

export function getCategoryBreakdown(expenses: Expense[]): CategorySummary[] {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const map: Partial<Record<Category, { total: number; count: number }>> = {};

  for (const expense of expenses) {
    if (!map[expense.category]) map[expense.category] = { total: 0, count: 0 };
    map[expense.category]!.total += expense.amount;
    map[expense.category]!.count += 1;
  }

  return Object.entries(map)
    .map(([category, data]) => ({
      category: category as Category,
      total: data!.total,
      count: data!.count,
      percentage: total > 0 ? (data!.total / total) * 100 : 0,
      color: CATEGORY_COLORS[category as Category],
    }))
    .sort((a, b) => b.total - a.total);
}

export function getLast6MonthsData(expenses: Expense[]): MonthlyData[] {
  const now = new Date();
  const months: MonthlyData[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('en-US', { month: 'short' });
    const total = expenses
      .filter((e) => e.date.startsWith(monthStr))
      .reduce((sum, e) => sum + e.amount, 0);
    months.push({ month: monthStr, label, total });
  }

  return months;
}

export function filterExpenses(
  expenses: Expense[],
  filters: {
    startDate: string;
    endDate: string;
    category: string;
    search: string;
  }
): Expense[] {
  return expenses.filter((expense) => {
    if (filters.startDate && expense.date < filters.startDate) return false;
    if (filters.endDate && expense.date > filters.endDate) return false;
    if (filters.category !== 'All' && expense.category !== filters.category) return false;
    if (
      filters.search &&
      !expense.description.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });
}

export function exportToCSV(expenses: Expense[]): void {
  const headers = ['Date', 'Category', 'Amount', 'Description'];
  const rows = expenses.map((e) => [
    e.date,
    e.category,
    e.amount.toFixed(2),
    `"${e.description.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `expenses-${getTodayISO()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ---- HR Portal utilities ----

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export const DEPARTMENT_COLORS: Record<string, string> = {
  Engineering: 'bg-blue-100 text-blue-700',
  Design: 'bg-purple-100 text-purple-700',
  Marketing: 'bg-orange-100 text-orange-700',
  Sales: 'bg-emerald-100 text-emerald-700',
  HR: 'bg-pink-100 text-pink-700',
  Finance: 'bg-amber-100 text-amber-700',
  Operations: 'bg-slate-100 text-slate-700',
};

export const DEPARTMENT_DOT_COLORS: Record<string, string> = {
  Engineering: 'bg-blue-500',
  Design: 'bg-purple-500',
  Marketing: 'bg-orange-500',
  Sales: 'bg-emerald-500',
  HR: 'bg-pink-500',
  Finance: 'bg-amber-500',
  Operations: 'bg-slate-500',
};

export const DEPARTMENT_CHART_COLORS: Record<string, string> = {
  Engineering: '#3b82f6',
  Design: '#a855f7',
  Marketing: '#f97316',
  Sales: '#10b981',
  HR: '#ec4899',
  Finance: '#f59e0b',
  Operations: '#64748b',
};

export const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700',
  'On Leave': 'bg-amber-100 text-amber-700',
  Terminated: 'bg-red-100 text-red-700',
  Probation: 'bg-blue-100 text-blue-700',
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-red-100 text-red-700',
  Cancelled: 'bg-slate-100 text-slate-700',
  Present: 'bg-emerald-100 text-emerald-700',
  Absent: 'bg-red-100 text-red-700',
  Late: 'bg-amber-100 text-amber-700',
  'Half Day': 'bg-blue-100 text-blue-700',
  Draft: 'bg-slate-100 text-slate-700',
  Processed: 'bg-blue-100 text-blue-700',
  Paid: 'bg-emerald-100 text-emerald-700',
  Open: 'bg-emerald-100 text-emerald-700',
  Closed: 'bg-slate-100 text-slate-700',
  'On Hold': 'bg-amber-100 text-amber-700',
  Applied: 'bg-blue-100 text-blue-700',
  Screening: 'bg-violet-100 text-violet-700',
  Interview: 'bg-amber-100 text-amber-700',
  Offered: 'bg-emerald-100 text-emerald-700',
  Hired: 'bg-emerald-100 text-emerald-700',
  Submitted: 'bg-blue-100 text-blue-700',
  Acknowledged: 'bg-emerald-100 text-emerald-700',
  General: 'bg-blue-100 text-blue-700',
  Policy: 'bg-violet-100 text-violet-700',
  Event: 'bg-emerald-100 text-emerald-700',
  Urgent: 'bg-red-100 text-red-700',
};

export function formatSalary(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function daysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
}

export function validateExpenseForm(data: {
  date: string;
  amount: string;
  category: string;
  description: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.date) {
    errors.date = 'Date is required';
  } else if (data.date > getTodayISO()) {
    errors.date = 'Date cannot be in the future';
  }

  const amount = parseFloat(data.amount);
  if (!data.amount) {
    errors.amount = 'Amount is required';
  } else if (isNaN(amount) || amount <= 0) {
    errors.amount = 'Amount must be a positive number';
  } else if (amount > 1_000_000) {
    errors.amount = 'Amount is too large';
  }

  if (!data.category) {
    errors.category = 'Category is required';
  }

  if (!data.description.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.trim().length < 2) {
    errors.description = 'Description must be at least 2 characters';
  } else if (data.description.trim().length > 100) {
    errors.description = 'Description must be under 100 characters';
  }

  return errors;
}
