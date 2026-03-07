'use client';

import { useState, useMemo } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import ExpenseList from '@/components/expenses/ExpenseList';
import ExpenseFilters from '@/components/expenses/ExpenseFilters';
import ExpenseModal from '@/components/expenses/ExpenseModal';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import { Expense, ExpenseFormData } from '@/lib/types';
import { exportToCSV, filterExpenses, formatCurrency } from '@/lib/utils';

const DEFAULT_FILTERS = {
  startDate: '',
  endDate: '',
  category: 'All',
  search: '',
};

export default function ExpensesPage() {
  const { expenses, isLoaded, addExpense, updateExpense, deleteExpense, deleteMultiple } =
    useExpenses();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const filtered = useMemo(() => filterExpenses(expenses, filters), [expenses, filters]);

  function handleAdd(data: ExpenseFormData) {
    setIsSubmitting(true);
    addExpense(data);
    setIsSubmitting(false);
    setShowAddModal(false);
    showToast('Expense added!');
  }

  function handleUpdate(data: ExpenseFormData) {
    if (!editingExpense) return;
    setIsSubmitting(true);
    updateExpense(editingExpense.id, data);
    setIsSubmitting(false);
    setEditingExpense(null);
    showToast('Expense updated!');
  }

  function handleDelete(id: string) {
    deleteExpense(id);
    showToast('Expense deleted.');
  }

  function handleDeleteMultiple(ids: string[]) {
    deleteMultiple(ids);
    showToast(`${ids.length} expenses deleted.`);
  }

  function handleExport() {
    if (filtered.length === 0) {
      showToast('No expenses to export.', 'error');
      return;
    }
    exportToCSV(filtered);
    showToast(`Exported ${filtered.length} expenses to CSV.`);
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {filtered.length} of {expenses.length} expenses &middot;{' '}
            <span className="font-semibold text-slate-700">
              {formatCurrency(filtered.reduce((s, e) => s + e.amount, 0))}
            </span>{' '}
            total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export CSV
          </button>
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

      {/* Toast */}
      {toast && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {toast.type === 'success' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          {toast.msg}
        </div>
      )}

      {/* Filters */}
      <ExpenseFilters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(DEFAULT_FILTERS)}
      />

      {/* List */}
      <ExpenseList
        expenses={filtered}
        onEdit={setEditingExpense}
        onDelete={handleDelete}
        onDeleteMultiple={handleDeleteMultiple}
      />

      {/* Add Modal */}
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

      {/* Edit Modal */}
      <ExpenseModal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense"
      >
        <ExpenseForm
          initialData={editingExpense ?? undefined}
          onSubmit={handleUpdate}
          onCancel={() => setEditingExpense(null)}
          isSubmitting={isSubmitting}
        />
      </ExpenseModal>
    </div>
  );
}
