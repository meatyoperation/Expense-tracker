'use client';

import { useRecruitment } from '@/hooks/useRecruitment';
import { STATUS_COLORS, DEPARTMENT_COLORS, formatSalary } from '@/lib/utils';

export default function RecruitmentPage() {
  const { jobs, applicants, isLoaded, stats } = useRecruitment();

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
        <h1 className="text-2xl font-bold text-slate-900">Recruitment</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage job postings and track applicants</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Open Positions</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.openPositions}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Total Applicants</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalApplicants}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">In Interview</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.inInterview}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Offers Made</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.offered}</p>
        </div>
      </div>

      {/* Job Postings */}
      <h2 className="text-lg font-semibold text-slate-900">Job Postings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => {
          const jobApplicants = applicants.filter((a) => a.jobId === job.id);
          return (
            <div key={job.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{job.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{job.location} &middot; {job.type}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[job.status]}`}>{job.status}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DEPARTMENT_COLORS[job.department]}`}>{job.department}</span>
              <p className="text-xs text-slate-400 mt-3">{formatSalary(job.salaryRange.min)} – {formatSalary(job.salaryRange.max)}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">{jobApplicants.length} applicants</span>
                <span className="text-xs text-slate-400">Posted {job.postedDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Applicant Pipeline */}
      <h2 className="text-lg font-semibold text-slate-900 mt-6">Applicant Pipeline</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(['Applied', 'Screening', 'Interview', 'Offered', 'Hired', 'Rejected'] as const).map((stage) => {
          const count = applicants.filter((a) => a.status === stage).length;
          return (
            <div key={stage} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
              <p className="text-xs text-slate-500 font-medium">{stage}</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{count}</p>
              <div className={`w-full h-1 rounded-full mt-2 ${STATUS_COLORS[stage]?.split(' ')[0] || 'bg-slate-100'}`} />
            </div>
          );
        })}
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Position</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Applied</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => {
                const job = jobs.find((j) => j.id === app.jobId);
                return (
                  <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-medium text-slate-900">{app.name}</td>
                    <td className="py-3 px-4 text-slate-500">{app.email}</td>
                    <td className="py-3 px-4 text-slate-600">{job?.title || '—'}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{app.appliedDate}</td>
                    <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[app.status]}`}>{app.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
