import { formatCurrency } from '@/lib/utils';

interface SummaryCardsProps {
  totalThisMonth: number;
  totalLastMonth: number;
  monthOverMonthChange: number;
  totalToday: number;
  totalAllTime: number;
  expenseCount: number;
}

function TrendIcon({ change }: { change: number }) {
  if (change === 0) return null;
  if (change > 0) {
    return (
      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );
}

export default function SummaryCards({
  totalThisMonth,
  totalLastMonth,
  monthOverMonthChange,
  totalToday,
  totalAllTime,
  expenseCount,
}: SummaryCardsProps) {
  const changeColor =
    monthOverMonthChange > 0
      ? 'text-red-600'
      : monthOverMonthChange < 0
        ? 'text-emerald-600'
        : 'text-slate-500';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* This Month */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${changeColor}`}>
            <TrendIcon change={monthOverMonthChange} />
            {monthOverMonthChange !== 0 && (
              <span>{Math.abs(monthOverMonthChange).toFixed(1)}%</span>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-500 font-medium">This Month</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalThisMonth)}</p>
        <p className="text-xs text-slate-400 mt-1">
          vs {formatCurrency(totalLastMonth)} last month
        </p>
      </div>

      {/* Today */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <p className="text-sm text-slate-500 font-medium">Today</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalToday)}</p>
        <p className="text-xs text-slate-400 mt-1">
          {totalToday === 0 ? 'No spending today' : 'Spent today'}
        </p>
      </div>

      {/* All Time */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>
        <p className="text-sm text-slate-500 font-medium">All Time</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalAllTime)}</p>
        <p className="text-xs text-slate-400 mt-1">Total tracked</p>
      </div>

      {/* Count */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        </div>
        <p className="text-sm text-slate-500 font-medium">Total Expenses</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{expenseCount}</p>
        <p className="text-xs text-slate-400 mt-1">Transactions recorded</p>
      </div>
    </div>
  );
}
