'use client';

import { useCallback, useEffect, useState } from 'react';
import { loadExpenses, saveExpenses } from '@/lib/storage';
import { Expense, ExpenseFormData } from '@/lib/types';
import { generateId, getTodayISO } from '@/lib/utils';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setExpenses(loadExpenses());
    setIsLoaded(true);
  }, []);

  const persist = useCallback((updated: Expense[]) => {
    setExpenses(updated);
    saveExpenses(updated);
  }, []);

  const addExpense = useCallback(
    (data: ExpenseFormData): Expense => {
      const ts = new Date().toISOString();
      const expense: Expense = {
        id: generateId(),
        date: data.date,
        amount: parseFloat(data.amount),
        category: data.category,
        description: data.description.trim(),
        createdAt: ts,
        updatedAt: ts,
      };
      persist([expense, ...expenses]);
      return expense;
    },
    [expenses, persist]
  );

  const updateExpense = useCallback(
    (id: string, data: ExpenseFormData): void => {
      const updated = expenses.map((e) =>
        e.id === id
          ? {
              ...e,
              date: data.date,
              amount: parseFloat(data.amount),
              category: data.category,
              description: data.description.trim(),
              updatedAt: new Date().toISOString(),
            }
          : e
      );
      persist(updated);
    },
    [expenses, persist]
  );

  const deleteExpense = useCallback(
    (id: string): void => {
      persist(expenses.filter((e) => e.id !== id));
    },
    [expenses, persist]
  );

  const deleteMultiple = useCallback(
    (ids: string[]): void => {
      const idSet = new Set(ids);
      persist(expenses.filter((e) => !idSet.has(e.id)));
    },
    [expenses, persist]
  );

  // Summary stats
  const totalAllTime = expenses.reduce((sum, e) => sum + e.amount, 0);

  const currentMonthExpenses = expenses.filter((e) => {
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return e.date.startsWith(monthStr);
  });

  const totalThisMonth = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const lastMonthExpenses = expenses.filter((e) => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return e.date.startsWith(monthStr);
  });

  const totalLastMonth = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const monthOverMonthChange =
    totalLastMonth > 0
      ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100
      : totalThisMonth > 0
        ? 100
        : 0;

  const recentExpenses = [...expenses]
    .sort((a, b) => {
      if (b.date !== a.date) return b.date.localeCompare(a.date);
      return b.createdAt.localeCompare(a.createdAt);
    })
    .slice(0, 5);

  const today = getTodayISO();
  const todayExpenses = expenses.filter((e) => e.date === today);
  const totalToday = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  return {
    expenses,
    isLoaded,
    addExpense,
    updateExpense,
    deleteExpense,
    deleteMultiple,
    stats: {
      totalAllTime,
      totalThisMonth,
      totalLastMonth,
      monthOverMonthChange,
      totalToday,
      count: expenses.length,
    },
    recentExpenses,
    currentMonthExpenses,
  };
}
