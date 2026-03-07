'use client';

import { useState } from 'react';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDate, CATEGORY_BG } from '@/lib/utils';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onDeleteMultiple: (ids: string[]) => void;
}

type SortKey = 'date' | 'amount' | 'category' | 'description';
type SortDir = 'asc' | 'desc';

export default function ExpenseList({
  expenses,
  onEdit,
  onDelete,
  onDeleteMultiple,
}: ExpenseListProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = [...expenses].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'date') cmp = a.date.localeCompare(b.date);
    else if (sortKey === 'amount') cmp = a.amount - b.amount;
    else if (sortKey === 'category') cmp = a.category.localeCompare(b.category);
    else if (sortKey === 'description') cmp = a.description.localeCompare(b.description);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === sorted.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(sorted.map((e) => e.id)));
    }
  }

  function handleDeleteSelected() {
    onDeleteMultiple(Array.from(selected));
    setSelected(new Set());
  }

  function handleDeleteOne(id: string) {
    onDelete(id);
    setDeleteConfirm(null);
  }

  function SortIcon({ field }: { field: SortKey }) {
    if (sortKey !== field)
      return (
        <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    return sortDir === 'desc' ? (
      <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ) : (
      <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 flex flex-col items-center text-slate-400">
        <svg className="w-16 h-16 mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="text-base font-medium">No expenses found</p>
        <p className="text-sm mt-1">Try adjusting your filters or add a new expense</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-indigo-700">
            {selected.size} {selected.size === 1 ? 'expense' : 'expenses'} selected
          </span>
          <button
            onClick={handleDeleteSelected}
            className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === sorted.length && sorted.length > 0}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Date <SortIcon field="date" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Description <SortIcon field="description" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Category <SortIcon field="category" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Amount <SortIcon field="amount" />
                </div>
              </th>
              <th className="px-4 py-3 w-24">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.map((expense) => (
              <tr
                key={expense.id}
                className={`hover:bg-slate-50 transition-colors ${selected.has(expense.id) ? 'bg-indigo-50/50' : ''}`}
              >
                <td className="px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={selected.has(expense.id)}
                    onChange={() => toggleSelect(expense.id)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                  {formatDate(expense.date)}
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-sm text-slate-900 font-medium truncate max-w-[200px]">
                    {expense.description}
                  </p>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_BG[expense.category]}`}
                  >
                    {expense.category}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(expense.amount)}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      aria-label="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    {deleteConfirm === expense.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteOne(expense.id)}
                          className="text-xs px-2 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs px-2 py-1 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(expense.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
        </p>
        <p className="text-xs font-semibold text-slate-700">
          Total: {formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}
        </p>
      </div>
    </div>
  );
}
