'use client';

import { useState } from 'react';
import { useLeaves } from '@/hooks/useLeaves';
import { useEmployees } from '@/hooks/useEmployees';
import { LeaveRequest, LEAVE_TYPES, LeaveType } from '@/lib/types';
import { STATUS_COLORS, daysBetween } from '@/lib/utils';
import ExpenseModal from '@/components/expenses/ExpenseModal';

export default function LeavePage() {
  const { leaves, isLoaded, addLeave, updateStatus, stats } = useLeaves();
  const { employees, isLoaded: empLoaded } = useEmployees();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const filtered = filter === 'All' ? leaves : leaves.filter((l) => l.status === filter);

  if (!isLoaded || !empLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">{stats.pending} pending &middot; {stats.approved} approved &middot; {stats.rejected} rejected</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Request Leave
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: stats.total, color: 'indigo' },
          { label: 'Pending', value: stats.pending, color: 'amber' },
          { label: 'Approved', value: stats.approved, color: 'emerald' },
          { label: 'Rejected', value: stats.rejected, color: 'red' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500 font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((f) => (
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
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Period</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-600">Days</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Reason</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((leave) => (
                <tr key={leave.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-indigo-600">{leave.employeeName.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <span className="font-medium text-slate-900">{leave.employeeName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{leave.leaveType}</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">{leave.startDate} to {leave.endDate}</td>
                  <td className="py-3 px-4 text-center font-medium text-slate-900">{leave.days}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs max-w-[200px] truncate">{leave.reason}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[leave.status]}`}>{leave.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {leave.status === 'Pending' && (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => updateStatus(leave.id, 'Approved')} className="text-emerald-600 hover:text-emerald-700 text-xs font-medium">Approve</button>
                        <button onClick={() => updateStatus(leave.id, 'Rejected')} className="text-red-500 hover:text-red-600 text-xs font-medium">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No leave requests found</p>
          </div>
        )}
      </div>

      {/* Request Leave Modal */}
      <ExpenseModal isOpen={showModal} onClose={() => setShowModal(false)} title="Request Leave">
        <LeaveForm employees={employees} onSubmit={(data) => { addLeave(data); setShowModal(false); }} onCancel={() => setShowModal(false)} />
      </ExpenseModal>
    </div>
  );
}

function LeaveForm({ employees, onSubmit, onCancel }: {
  employees: { id: string; firstName: string; lastName: string }[];
  onSubmit: (data: Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}) {
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || '');
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const emp = employees.find((e) => e.id === employeeId);
  const days = startDate && endDate ? daysBetween(startDate, endDate) : 0;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (!emp) return;
      onSubmit({
        employeeId, employeeName: `${emp.firstName} ${emp.lastName}`,
        leaveType, startDate, endDate, days, reason, status: 'Pending',
      });
    }} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Employee</label>
        <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Leave Type</label>
        <select value={leaveType} onChange={(e) => setLeaveType(e.target.value as LeaveType)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
          <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
          <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      {days > 0 && <p className="text-xs text-indigo-600 font-medium">{days} day{days > 1 ? 's' : ''} requested</p>}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Reason</label>
        <textarea required value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">Submit Request</button>
      </div>
    </form>
  );
}
