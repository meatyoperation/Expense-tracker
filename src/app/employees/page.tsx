'use client';

import { useState, useMemo } from 'react';
import { useEmployees } from '@/hooks/useEmployees';
import { Employee, EmployeeFormData, DEPARTMENTS, EMPLOYMENT_STATUSES, EMPLOYMENT_TYPES, Department, EmploymentStatus } from '@/lib/types';
import { getInitials, DEPARTMENT_COLORS, STATUS_COLORS, formatSalary } from '@/lib/utils';
import ExpenseModal from '@/components/expenses/ExpenseModal';

const EMPTY_FORM: EmployeeFormData = {
  firstName: '', lastName: '', email: '', phone: '',
  department: 'Engineering', designation: '', employmentType: 'Full-time',
  status: 'Active', joinDate: '', salary: '',
};

export default function EmployeesPage() {
  const { employees, isLoaded, addEmployee, updateEmployee, deleteEmployee, stats } = useEmployees();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<Department | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<EmploymentStatus | 'All'>('All');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      if (search) {
        const q = search.toLowerCase();
        if (!`${e.firstName} ${e.lastName}`.toLowerCase().includes(q) &&
            !e.email.toLowerCase().includes(q) &&
            !e.designation.toLowerCase().includes(q)) return false;
      }
      if (deptFilter !== 'All' && e.department !== deptFilter) return false;
      if (statusFilter !== 'All' && e.status !== statusFilter) return false;
      return true;
    });
  }, [employees, search, deptFilter, statusFilter]);

  function handleSubmit(data: EmployeeFormData) {
    if (editing) {
      updateEmployee(editing.id, data);
    } else {
      addEmployee(data);
    }
    setShowModal(false);
    setEditing(null);
  }

  function openEdit(emp: Employee) {
    setEditing(emp);
    setShowModal(true);
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {filtered.length} of {employees.length} employees &middot; {stats.active} active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center border border-slate-200 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button onClick={() => setViewMode('table')} className={`p-2 ${viewMode === 'table' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            </button>
          </div>
          <button
            onClick={() => { setEditing(null); setShowModal(true); }}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Employee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value as Department | 'All')} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="All">All Departments</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as EmploymentStatus | 'All')} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="All">All Statuses</option>
          {EMPLOYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((emp) => (
            <div key={emp.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => openEdit(emp)}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: DEPARTMENT_COLORS[emp.department]?.includes('blue') ? '#dbeafe' : DEPARTMENT_COLORS[emp.department]?.includes('purple') ? '#f3e8ff' : '#e0e7ff', color: '#4338ca' }}>
                  {getInitials(emp.firstName, emp.lastName)}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[emp.status]}`}>
                  {emp.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{emp.firstName} {emp.lastName}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{emp.designation}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DEPARTMENT_COLORS[emp.department]}`}>
                  {emp.department}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">{emp.email}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Department</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Designation</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600">Salary</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-indigo-600">{getInitials(emp.firstName, emp.lastName)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DEPARTMENT_COLORS[emp.department]}`}>{emp.department}</span></td>
                    <td className="py-3 px-4 text-slate-600">{emp.designation}</td>
                    <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[emp.status]}`}>{emp.status}</span></td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900">{formatSalary(emp.salary)}</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => openEdit(emp)} className="text-indigo-600 hover:text-indigo-700 font-medium text-xs">Edit</button>
                      <button onClick={(e) => { e.stopPropagation(); deleteEmployee(emp.id); }} className="text-red-500 hover:text-red-600 font-medium text-xs ml-3">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm">No employees found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <ExpenseModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditing(null); }}
        title={editing ? 'Edit Employee' : 'Add Employee'}
      >
        <EmployeeForm
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowModal(false); setEditing(null); }}
        />
      </ExpenseModal>
    </div>
  );
}

function EmployeeForm({ initialData, onSubmit, onCancel }: {
  initialData?: Employee | null;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<EmployeeFormData>(
    initialData
      ? {
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          email: initialData.email,
          phone: initialData.phone,
          department: initialData.department,
          designation: initialData.designation,
          employmentType: initialData.employmentType,
          status: initialData.status,
          joinDate: initialData.joinDate,
          salary: String(initialData.salary),
        }
      : EMPTY_FORM
  );

  const update = (field: keyof EmployeeFormData, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">First Name</label>
          <input required value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Last Name</label>
          <input required value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
        <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
        <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
          <select value={form.department} onChange={(e) => update('department', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Designation</label>
          <input required value={form.designation} onChange={(e) => update('designation', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Employment Type</label>
          <select value={form.employmentType} onChange={(e) => update('employmentType', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
          <select value={form.status} onChange={(e) => update('status', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {EMPLOYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Join Date</label>
          <input type="date" required value={form.joinDate} onChange={(e) => update('joinDate', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Salary (Annual)</label>
          <input type="number" required value={form.salary} onChange={(e) => update('salary', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">{initialData ? 'Update' : 'Add'} Employee</button>
      </div>
    </form>
  );
}
