'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useExpenses } from '@/hooks/useExpenses';
import SummaryCards from '@/components/dashboard/SummaryCards';
import SpendingChart from '@/components/dashboard/SpendingChart';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import RecentExpenses from '@/components/dashboard/RecentExpenses';
import ExpenseModal from '@/components/expenses/ExpenseModal';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import { getCategoryBreakdown, getLast6MonthsData } from '@/lib/utils';
import { ExpenseFormData } from '@/lib/types';

export default function DashboardPage() {
  const { expenses, isLoaded, addExpense, stats, recentExpenses } = useExpenses();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const categoryBreakdown = getCategoryBreakdown(expenses);
  const monthlyData = getLast6MonthsData(expenses);

  function handleAdd(data: ExpenseFormData) {
    setIsSubmitting(true);
    addExpense(data);
    setIsSubmitting(false);
    setShowAddModal(false);
    setSuccessMsg('Expense added successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading your expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/expenses"
            className="hidden sm:flex items-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            View All
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </button>
        </div>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMsg}
        </div>
      )}

      {/* Summary cards */}
      <SummaryCards
        totalThisMonth={stats.totalThisMonth}
        totalLastMonth={stats.totalLastMonth}
        monthOverMonthChange={stats.monthOverMonthChange}
        totalToday={stats.totalToday}
        totalAllTime={stats.totalAllTime}
        expenseCount={stats.count}
      />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendingChart data={monthlyData} />
        </div>
        <div>
          <CategoryBreakdown categories={categoryBreakdown} />
        </div>
      </div>

      {/* Recent expenses */}
      <RecentExpenses expenses={recentExpenses} />

      {/* Add Expense Modal */}
      <ExpenseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Expense"
      >
        <ExpenseForm
          onSubmit={handleAdd}
          onCancel={() => setShowAddModal(false)}
          isSubmitting={isSubmitting}
        />
      </ExpenseModal>
    </div>
  );
}
