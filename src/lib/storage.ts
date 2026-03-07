import { Expense } from './types';

const STORAGE_KEY = 'expense_tracker_data';

export function loadExpenses(): Expense[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultExpenses();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    console.error('Failed to save expenses to localStorage');
  }
}

// Seed data for first-time users
function getDefaultExpenses(): Expense[] {
  const now = new Date();
  const mo = (offset: number) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const seed: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>[] = [
    { date: mo(1), amount: 12.5, category: 'Food', description: 'Lunch at deli' },
    { date: mo(2), amount: 45.0, category: 'Transportation', description: 'Monthly bus pass' },
    { date: mo(3), amount: 89.99, category: 'Shopping', description: 'New headphones' },
    { date: mo(4), amount: 15.0, category: 'Entertainment', description: 'Movie ticket' },
    { date: mo(5), amount: 120.0, category: 'Bills', description: 'Internet bill' },
    { date: mo(6), amount: 8.75, category: 'Food', description: 'Coffee shop' },
    { date: mo(8), amount: 55.0, category: 'Food', description: 'Grocery run' },
    { date: mo(10), amount: 30.0, category: 'Entertainment', description: 'Streaming subscriptions' },
    { date: mo(12), amount: 22.5, category: 'Transportation', description: 'Rideshare' },
    { date: mo(14), amount: 200.0, category: 'Bills', description: 'Electricity bill' },
    { date: mo(16), amount: 67.0, category: 'Shopping', description: 'Clothing' },
    { date: mo(18), amount: 9.99, category: 'Entertainment', description: 'Music subscription' },
    { date: mo(20), amount: 48.0, category: 'Food', description: 'Dinner out' },
    { date: mo(25), amount: 35.0, category: 'Transportation', description: 'Gas' },
    { date: mo(30), amount: 14.5, category: 'Food', description: 'Breakfast cafe' },
  ];

  const ts = new Date().toISOString();
  const expenses = seed.map((s, i) => ({
    ...s,
    id: `seed-${i}-${Date.now()}`,
    createdAt: ts,
    updatedAt: ts,
  }));

  saveExpenses(expenses);
  return expenses;
}
