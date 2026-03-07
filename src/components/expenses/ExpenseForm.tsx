'use client';

import { useState, useEffect } from 'react';
import { CATEGORIES, Category, Expense, ExpenseFormData } from '@/lib/types';
import { getTodayISO, validateExpenseForm } from '@/lib/utils';

interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const defaultForm: ExpenseFormData = {
  date: getTodayISO(),
  amount: '',
  category: 'Food',
  description: '',
};

export default function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: ExpenseFormProps) {
  const [form, setForm] = useState<ExpenseFormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        date: initialData.date,
        amount: initialData.amount.toString(),
        category: initialData.category,
        description: initialData.description,
      });
    } else {
      setForm({ ...defaultForm, date: getTodayISO() });
    }
    setErrors({});
    setTouched({});
  }, [initialData]);

  function handleChange(field: keyof ExpenseFormData, value: string) {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) {
      setErrors(validateExpenseForm(updated));
    }
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateExpenseForm(form));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true]));
    setTouched(allTouched);
    const errs = validateExpenseForm(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSubmit(form);
    }
  }

  const inputClass = (field: string) =>
    `w-full px-3.5 py-2.5 text-sm rounded-xl border transition-colors outline-none focus:ring-2 focus:ring-indigo-500/20 ${
      errors[field] && touched[field]
        ? 'border-red-300 bg-red-50 focus:border-red-400'
        : 'border-slate-200 bg-white focus:border-indigo-400'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
        <input
          type="date"
          value={form.date}
          max={getTodayISO()}
          onChange={(e) => handleChange('date', e.target.value)}
          onBlur={() => handleBlur('date')}
          className={inputClass('date')}
        />
        {errors.date && touched.date && (
          <p className="text-xs text-red-500 mt-1">{errors.date}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
            $
          </span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            onBlur={() => handleBlur('amount')}
            className={`${inputClass('amount')} pl-8`}
          />
        </div>
        {errors.amount && touched.amount && (
          <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleChange('category', cat)}
              className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
                form.category === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {getCategoryEmoji(cat)} {cat}
            </button>
          ))}
        </div>
        {errors.category && touched.category && (
          <p className="text-xs text-red-500 mt-1">{errors.category}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
        <input
          type="text"
          placeholder="What was this expense for?"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          className={inputClass('description')}
          maxLength={100}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description && touched.description ? (
            <p className="text-xs text-red-500">{errors.description}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-slate-400 ml-auto">{form.description.length}/100</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}

function getCategoryEmoji(category: Category): string {
  const map: Record<Category, string> = {
    Food: '🍔',
    Transportation: '🚗',
    Entertainment: '🎬',
    Shopping: '🛍️',
    Bills: '📄',
    Other: '📦',
  };
  return map[category];
}
