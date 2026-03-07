'use client';

import { CATEGORIES } from '@/lib/types';

interface Filters {
  startDate: string;
  endDate: string;
  category: string;
  search: string;
}

interface ExpenseFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClear: () => void;
}

export default function ExpenseFilters({ filters, onChange, onClear }: ExpenseFiltersProps) {
  const hasActiveFilters =
    filters.startDate || filters.endDate || filters.category !== 'All' || filters.search;

  function set(key: keyof Filters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors"
          />
        </div>

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => set('category', e.target.value)}
          className="py-2.5 px-3 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors text-slate-700"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => set('startDate', e.target.value)}
            className="py-2.5 px-3 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors text-slate-700"
            placeholder="From"
          />
          <span className="text-slate-400 text-sm flex-shrink-0">to</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => set('endDate', e.target.value)}
            className="py-2.5 px-3 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors text-slate-700"
            placeholder="To"
          />
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="py-2.5 px-4 text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0 font-medium"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
