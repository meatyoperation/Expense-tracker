import Link from 'next/link';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDate, CATEGORY_BG } from '@/lib/utils';

interface RecentExpensesProps {
  expenses: Expense[];
}

export default function RecentExpenses({ expenses }: RecentExpensesProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-slate-900">Recent Expenses</h2>
        <Link
          href="/expenses"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          View all
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
          <svg className="w-12 h-12 mb-3 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-sm">No expenses yet</p>
          <Link href="/expenses" className="mt-2 text-sm text-indigo-600 hover:underline">
            Add your first expense
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${getCategoryEmojiBg(expense.category)}` }}
                >
                  {getCategoryEmoji(expense.category)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {expense.description}
                  </p>
                  <p className="text-xs text-slate-400">{formatDate(expense.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <span
                  className={`hidden sm:inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_BG[expense.category]}`}
                >
                  {expense.category}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    Food: '🍔',
    Transportation: '🚗',
    Entertainment: '🎬',
    Shopping: '🛍️',
    Bills: '📄',
    Other: '📦',
  };
  return map[category] ?? '💰';
}

function getCategoryEmojiBg(category: string): string {
  const map: Record<string, string> = {
    Food: '#fff7ed',
    Transportation: '#eff6ff',
    Entertainment: '#faf5ff',
    Shopping: '#fdf2f8',
    Bills: '#fef2f2',
    Other: '#f9fafb',
  };
  return map[category] ?? '#f9fafb';
}
