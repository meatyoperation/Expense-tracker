import { CategorySummary } from '@/lib/types';
import { formatCurrency, CATEGORY_BG } from '@/lib/utils';

interface CategoryBreakdownProps {
  categories: CategorySummary[];
}

export default function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 className="text-base font-semibold text-slate-900 mb-6">Spending by Category</h2>
      {categories.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
          No expenses yet
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_BG[cat.category]}`}
                  >
                    {cat.category}
                  </span>
                  <span className="text-xs text-slate-400">{cat.count} transactions</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(cat.total)}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-0.5 text-right">
                {cat.percentage.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
