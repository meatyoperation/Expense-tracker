'use client';

import { useState } from 'react';
import { usePayroll } from '@/hooks/usePayroll';
import { formatSalary, STATUS_COLORS, DEPARTMENT_COLORS } from '@/lib/utils';

export default function PayrollPage() {
  const { payslips, isLoaded, stats, currentMonthSlips } = usePayroll();
  const [filter, setFilter] = useState<'All' | 'Draft' | 'Processed' | 'Paid'>('All');

  const filtered = filter === 'All' ? payslips : payslips.filter((p) => p.status === filter);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payroll</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage employee compensation and payslips</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Monthly Payroll</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatSalary(stats.totalPayroll)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Avg Salary</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatSalary(stats.avgSalary)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Paid</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.paidCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Drafts</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.draftCount}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['All', 'Draft', 'Processed', 'Paid'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Employee</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Department</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Month</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">Basic</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">Allowances</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">Deductions</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">Net Pay</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map((slip) => (
                <tr key={slip.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-medium text-slate-900">{slip.employeeName}</td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DEPARTMENT_COLORS[slip.department]}`}>{slip.department}</span></td>
                  <td className="py-3 px-4 text-slate-600">{slip.month}</td>
                  <td className="py-3 px-4 text-right text-slate-600">{formatSalary(slip.basicSalary)}</td>
                  <td className="py-3 px-4 text-right text-emerald-600">+{formatSalary(slip.allowances)}</td>
                  <td className="py-3 px-4 text-right text-red-500">-{formatSalary(slip.deductions)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">{formatSalary(slip.netPay)}</td>
                  <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[slip.status]}`}>{slip.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No payslips found</p>
          </div>
        )}
      </div>
    </div>
  );
}
