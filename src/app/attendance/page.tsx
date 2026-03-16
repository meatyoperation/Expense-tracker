'use client';

import { useState } from 'react';
import { useAttendance } from '@/hooks/useAttendance';
import { STATUS_COLORS, formatDateToISO } from '@/lib/utils';

export default function AttendancePage() {
  const { records, isLoaded, stats } = useAttendance();
  const [selectedDate, setSelectedDate] = useState(formatDateToISO(new Date()));

  const dateRecords = records.filter((r) => r.date === selectedDate);

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
        <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
        <p className="text-slate-500 text-sm mt-0.5">Track daily attendance across your organization</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Present</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.present}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Late</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.late}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Absent</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.absent}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Total Tracked</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </div>
      </div>

      {/* Date picker */}
      <div className="flex items-center gap-3">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span className="text-sm text-slate-500">{dateRecords.length} records</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Employee</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Check In</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Check Out</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-600">Hours</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {dateRecords.map((rec) => (
                <tr key={rec.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-indigo-600">{rec.employeeName.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <span className="font-medium text-slate-900">{rec.employeeName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{rec.checkIn || '—'}</td>
                  <td className="py-3 px-4 text-slate-600">{rec.checkOut || '—'}</td>
                  <td className="py-3 px-4 text-center font-medium text-slate-900">{rec.hoursWorked ? `${rec.hoursWorked}h` : '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[rec.status]}`}>{rec.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {dateRecords.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No attendance records for this date</p>
          </div>
        )}
      </div>
    </div>
  );
}
