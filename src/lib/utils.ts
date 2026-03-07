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
  const headers = ['Date', 'Amount', 'Category', 'Description'];
  const rows = expenses.map((e) => [
    e.date,
    e.amount.toFixed(2),
    e.category,
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
