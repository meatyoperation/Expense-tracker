'use client';

import { useState, useMemo } from 'react';
import { useRecruitment } from '@/hooks/useRecruitment';
import { STATUS_COLORS, DEPARTMENT_COLORS, formatSalary } from '@/lib/utils';
import { JobPosting, Applicant, ApplicationStatus, DEPARTMENTS, EMPLOYMENT_TYPES, Department, EmploymentType, JobStatus } from '@/lib/types';
import ExpenseModal from '@/components/expenses/ExpenseModal';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type ViewTab = 'overview' | 'jobs' | 'pipeline' | 'applicants' | 'integrations';

const PIPELINE_STAGES: { key: ApplicationStatus; label: string; color: string; bg: string; border: string }[] = [
  { key: 'Applied', label: 'Applied', color: '#3b82f6', bg: 'bg-blue-50', border: 'border-blue-200' },
  { key: 'Screening', label: 'Screening', color: '#8b5cf6', bg: 'bg-violet-50', border: 'border-violet-200' },
  { key: 'Interview', label: 'Interview', color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-200' },
  { key: 'Offered', label: 'Offered', color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { key: 'Hired', label: 'Hired', color: '#059669', bg: 'bg-green-50', border: 'border-green-200' },
  { key: 'Rejected', label: 'Rejected', color: '#ef4444', bg: 'bg-red-50', border: 'border-red-200' },
];

const INTEGRATIONS = [
  { name: 'LinkedIn Jobs', icon: 'linkedin', description: 'Post jobs and import candidates directly from LinkedIn', status: 'available' as const, color: '#0A66C2' },
  { name: 'Indeed', icon: 'indeed', description: 'Sync job postings and receive applications from Indeed', status: 'available' as const, color: '#2164F3' },
  { name: 'Glassdoor', icon: 'glassdoor', description: 'Publish openings and manage employer brand on Glassdoor', status: 'available' as const, color: '#0CAA41' },
  { name: 'AngelList', icon: 'angellist', description: 'Reach startup talent and post on AngelList/Wellfound', status: 'available' as const, color: '#000000' },
  { name: 'Google Careers', icon: 'google', description: 'Feature jobs in Google Search and Google for Jobs', status: 'coming_soon' as const, color: '#4285F4' },
  { name: 'Greenhouse', icon: 'greenhouse', description: 'Two-way sync with Greenhouse ATS for enterprise hiring', status: 'available' as const, color: '#24A47F' },
  { name: 'Lever', icon: 'lever', description: 'Import candidates and sync interview stages with Lever', status: 'coming_soon' as const, color: '#5A67D8' },
  { name: 'Slack Notifications', icon: 'slack', description: 'Get real-time hiring updates in your Slack channels', status: 'available' as const, color: '#4A154B' },
  { name: 'Calendly', icon: 'calendly', description: 'Auto-schedule interviews with candidates via Calendly', status: 'available' as const, color: '#006BFF' },
  { name: 'Zoom', icon: 'zoom', description: 'Generate Zoom meeting links for remote interviews', status: 'available' as const, color: '#2D8CFF' },
  { name: 'DocuSign', icon: 'docusign', description: 'Send offer letters and contracts for e-signature', status: 'coming_soon' as const, color: '#FFCD00' },
  { name: 'HackerRank', icon: 'hackerrank', description: 'Send coding assessments and track scores automatically', status: 'available' as const, color: '#2EC866' },
];

export default function RecruitmentPage() {
  const {
    jobs, applicants, isLoaded, stats, pipeline,
    addJob, updateJob, deleteJob,
    addApplicant, updateApplicantStatus, deleteApplicant,
  } = useRecruitment();
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [showJobModal, setShowJobModal] = useState(false);
  const [showApplicantModal, setShowApplicantModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | 'all'>('all');
  const [searchApplicants, setSearchApplicants] = useState('');
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set(['LinkedIn Jobs', 'Slack Notifications']));

  const filteredApplicants = useMemo(() => {
    let result = applicants;
    if (selectedJob !== 'all') result = result.filter((a) => a.jobId === selectedJob);
    if (searchApplicants) {
      const q = searchApplicants.toLowerCase();
      result = result.filter((a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q));
    }
    return result;
  }, [applicants, selectedJob, searchApplicants]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const pipelineChartData = PIPELINE_STAGES.map((s) => ({
    name: s.label,
    value: applicants.filter((a) => a.status === s.key).length,
    color: s.color,
  }));

  const sourceData = [
    { name: 'LinkedIn', count: 5, fill: '#0A66C2' },
    { name: 'Indeed', count: 3, fill: '#2164F3' },
    { name: 'Referral', count: 2, fill: '#10b981' },
    { name: 'Website', count: 2, fill: '#f59e0b' },
  ];

  const tabs: { key: ViewTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-2a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" /></svg> },
    { key: 'jobs', label: 'Job Postings', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg> },
    { key: 'pipeline', label: 'Pipeline', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg> },
    { key: 'applicants', label: 'Applicants', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> },
    { key: 'integrations', label: 'Integrations', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg> },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M3.41 7.41A2 2 0 014.82 7h14.36a2 2 0 011.41.59l.83.83A2 2 0 0122 9.83V19a2 2 0 01-2 2H4a2 2 0 01-2-2V9.83a2 2 0 01.59-1.42l.82-.83z" /></svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Recruitment Hub</h1>
              <p className="text-slate-500 text-sm">Hire the best talent for your organization</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowApplicantModal(true)} className="hidden sm:flex items-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            Add Candidate
          </button>
          <button onClick={() => { setEditingJob(null); setShowJobModal(true); }} className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Post New Job
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1.5 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab stats={stats} pipelineChartData={pipelineChartData} sourceData={sourceData} jobs={jobs} applicants={applicants} />
      )}
      {activeTab === 'jobs' && (
        <JobsTab jobs={jobs} applicants={applicants} onEdit={(j) => { setEditingJob(j); setShowJobModal(true); }} onDelete={deleteJob} onUpdateStatus={(id, s) => updateJob(id, { status: s })} />
      )}
      {activeTab === 'pipeline' && (
        <PipelineTab applicants={applicants} jobs={jobs} onUpdateStatus={updateApplicantStatus} onDelete={deleteApplicant} />
      )}
      {activeTab === 'applicants' && (
        <ApplicantsTab
          applicants={filteredApplicants}
          jobs={jobs}
          search={searchApplicants}
          onSearchChange={setSearchApplicants}
          selectedJob={selectedJob}
          onJobFilter={setSelectedJob}
          onUpdateStatus={updateApplicantStatus}
          onDelete={deleteApplicant}
        />
      )}
      {activeTab === 'integrations' && (
        <IntegrationsTab
          integrations={INTEGRATIONS}
          connected={connectedIntegrations}
          onToggle={(name) => {
            setConnectedIntegrations((prev) => {
              const next = new Set(prev);
              if (next.has(name)) next.delete(name); else next.add(name);
              return next;
            });
          }}
        />
      )}

      {/* Job Modal */}
      <ExpenseModal isOpen={showJobModal} onClose={() => { setShowJobModal(false); setEditingJob(null); }} title={editingJob ? 'Edit Job Posting' : 'Create Job Posting'}>
        <JobForm
          initialData={editingJob}
          onSubmit={(data) => {
            if (editingJob) updateJob(editingJob.id, data);
            else addJob(data as Omit<JobPosting, 'id' | 'createdAt' | 'applicantCount'>);
            setShowJobModal(false);
            setEditingJob(null);
          }}
          onCancel={() => { setShowJobModal(false); setEditingJob(null); }}
        />
      </ExpenseModal>

      {/* Applicant Modal */}
      <ExpenseModal isOpen={showApplicantModal} onClose={() => setShowApplicantModal(false)} title="Add Candidate">
        <ApplicantForm
          jobs={jobs}
          onSubmit={(data) => { addApplicant(data); setShowApplicantModal(false); }}
          onCancel={() => setShowApplicantModal(false)}
        />
      </ExpenseModal>
    </div>
  );
}

// ==================== OVERVIEW TAB ====================

function OverviewTab({ stats, pipelineChartData, sourceData, jobs, applicants }: {
  stats: ReturnType<typeof useRecruitment>['stats'];
  pipelineChartData: { name: string; value: number; color: string }[];
  sourceData: { name: string; count: number; fill: string }[];
  jobs: JobPosting[];
  applicants: Applicant[];
}) {
  return (
    <div className="space-y-5">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Open Positions', value: stats.openPositions, color: 'from-blue-500 to-blue-600', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg> },
          { label: 'Total Applicants', value: stats.totalApplicants, color: 'from-purple-500 to-purple-600', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> },
          { label: 'In Interview', value: stats.inInterview, color: 'from-amber-500 to-amber-600', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
          { label: 'Avg Time to Hire', value: `${stats.avgTimeToHire}d`, color: 'from-emerald-500 to-emerald-600', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" /></svg> },
          { label: 'Conversion Rate', value: `${stats.conversionRate}%`, color: 'from-indigo-500 to-indigo-600', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg> },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.color} opacity-5 rounded-bl-[40px]`} />
            <div className={`w-9 h-9 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-white mb-3`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Pipeline Distribution</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineChartData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {pipelineChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Candidate Sources</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="count">
                  {sourceData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {sourceData.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.fill }} />
                <span className="text-slate-600">{s.name}</span>
                <span className="text-slate-900 font-semibold ml-auto">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Hiring Activity</h3>
        <div className="space-y-3">
          {applicants.slice(0, 6).map((app) => {
            const job = jobs.find((j) => j.id === app.jobId);
            return (
              <div key={app.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-indigo-600">{app.name.split(' ').map((n) => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{app.name}</p>
                    <p className="text-xs text-slate-400">{job?.title || 'Unknown position'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[app.status]}`}>{app.status}</span>
                  <span className="text-xs text-slate-400">{app.appliedDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==================== JOBS TAB ====================

function JobsTab({ jobs, applicants, onEdit, onDelete, onUpdateStatus }: {
  jobs: JobPosting[];
  applicants: Applicant[];
  onEdit: (job: JobPosting) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: JobStatus) => void;
}) {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{jobs.length} job postings</p>
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
          <button onClick={() => setViewMode('cards')} className={`p-2 ${viewMode === 'cards' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" /></svg>
          </button>
          <button onClick={() => setViewMode('table')} className={`p-2 ${viewMode === 'table' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
          </button>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {jobs.map((job) => {
            const jobApps = applicants.filter((a) => a.jobId === job.id);
            const interviewCount = jobApps.filter((a) => a.status === 'Interview').length;
            return (
              <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[job.status]}`}>{job.status}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(job)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => onDelete(job.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mt-2">{job.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DEPARTMENT_COLORS[job.department]}`}>{job.department}</span>
                    <span className="text-xs text-slate-400">{job.location}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 line-clamp-2">{job.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                    <span>{job.type}</span>
                    <span>&middot;</span>
                    <span>{formatSalary(job.salaryRange.min)} – {formatSalary(job.salaryRange.max)}</span>
                  </div>
                </div>
                <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-600"><strong className="text-slate-900">{jobApps.length}</strong> applicants</span>
                    {interviewCount > 0 && <span className="text-amber-600"><strong>{interviewCount}</strong> interviewing</span>}
                  </div>
                  <div className="flex gap-1">
                    {job.status === 'Open' && (
                      <button onClick={() => onUpdateStatus(job.id, 'On Hold')} className="text-xs text-amber-600 hover:text-amber-700 font-medium">Pause</button>
                    )}
                    {job.status === 'On Hold' && (
                      <button onClick={() => onUpdateStatus(job.id, 'Open')} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Resume</button>
                    )}
                    {job.status !== 'Closed' && (
                      <button onClick={() => onUpdateStatus(job.id, 'Closed')} className="text-xs text-red-500 hover:text-red-600 font-medium ml-2">Close</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Position</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Department</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Salary Range</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-600">Applicants</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const jobApps = applicants.filter((a) => a.jobId === job.id);
                  return (
                    <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="py-3 px-4"><span className="font-medium text-slate-900">{job.title}</span><br /><span className="text-xs text-slate-400">{job.type}</span></td>
                      <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DEPARTMENT_COLORS[job.department]}`}>{job.department}</span></td>
                      <td className="py-3 px-4 text-slate-600">{job.location}</td>
                      <td className="py-3 px-4 text-slate-600 text-xs">{formatSalary(job.salaryRange.min)} – {formatSalary(job.salaryRange.max)}</td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-900">{jobApps.length}</td>
                      <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[job.status]}`}>{job.status}</span></td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => onEdit(job)} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium">Edit</button>
                        <button onClick={() => onDelete(job.id)} className="text-red-500 hover:text-red-600 text-xs font-medium ml-3">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== PIPELINE TAB (KANBAN) ====================

function PipelineTab({ applicants, jobs, onUpdateStatus, onDelete }: {
  applicants: Applicant[];
  jobs: JobPosting[];
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string) => void;
}) {
  const nextStage: Record<string, ApplicationStatus | undefined> = {
    Applied: 'Screening', Screening: 'Interview', Interview: 'Offered', Offered: 'Hired',
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Drag-and-drop style pipeline &middot; Click arrows to advance candidates</p>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => {
          const stageApps = applicants.filter((a) => a.status === stage.key);
          return (
            <div key={stage.key} className={`flex-shrink-0 w-[260px] ${stage.bg} rounded-2xl border ${stage.border}`}>
              <div className="p-4 border-b" style={{ borderColor: stage.color + '30' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                    <h3 className="text-sm font-semibold text-slate-900">{stage.label}</h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded-full">{stageApps.length}</span>
                </div>
              </div>
              <div className="p-3 space-y-2 min-h-[200px] max-h-[500px] overflow-y-auto">
                {stageApps.map((app) => {
                  const job = jobs.find((j) => j.id === app.jobId);
                  const next = nextStage[app.status];
                  return (
                    <div key={app.id} className="bg-white rounded-xl p-3 shadow-sm border border-white/80 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: stage.color }}>
                            {app.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{app.name}</p>
                            <p className="text-[10px] text-slate-400">{app.email}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 bg-slate-50 px-2 py-1 rounded-lg">{job?.title || 'Unknown'}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                        <span className="text-[10px] text-slate-400">{app.appliedDate}</span>
                        <div className="flex gap-1">
                          {next && (
                            <button
                              onClick={() => onUpdateStatus(app.id, next)}
                              className="p-1 rounded-md hover:bg-emerald-50 text-emerald-500 hover:text-emerald-600"
                              title={`Move to ${next}`}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </button>
                          )}
                          {stage.key !== 'Rejected' && (
                            <button
                              onClick={() => onUpdateStatus(app.id, 'Rejected')}
                              className="p-1 rounded-md hover:bg-red-50 text-red-400 hover:text-red-500"
                              title="Reject"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(app.id)}
                            className="p-1 rounded-md hover:bg-slate-100 text-slate-300 hover:text-slate-500"
                            title="Remove"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {stageApps.length === 0 && (
                  <div className="flex items-center justify-center h-24 text-xs text-slate-400">No candidates</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== APPLICANTS TAB ====================

function ApplicantsTab({ applicants, jobs, search, onSearchChange, selectedJob, onJobFilter, onUpdateStatus, onDelete }: {
  applicants: Applicant[];
  jobs: JobPosting[];
  search: string;
  onSearchChange: (s: string) => void;
  selectedJob: string | 'all';
  onJobFilter: (id: string | 'all') => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string) => void;
}) {
  const stages: ApplicationStatus[] = ['Applied', 'Screening', 'Interview', 'Offered', 'Hired', 'Rejected'];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search candidates..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select value={selectedJob} onChange={(e) => onJobFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">All Positions</option>
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Candidate</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Position</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Applied</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Move To</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => {
                const job = jobs.find((j) => j.id === app.jobId);
                return (
                  <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-indigo-600">{app.name.split(' ').map((n) => n[0]).join('')}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{app.name}</p>
                          <p className="text-xs text-slate-400">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{job?.title || '—'}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{app.appliedDate}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[app.status]}`}>{app.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={app.status}
                        onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                        className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {stages.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => onDelete(app.id)} className="text-red-500 hover:text-red-600 text-xs font-medium">Remove</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {applicants.length === 0 && (
          <div className="text-center py-12"><p className="text-slate-400 text-sm">No candidates found</p></div>
        )}
      </div>
    </div>
  );
}

// ==================== INTEGRATIONS TAB ====================

function IntegrationsTab({ integrations, connected, onToggle }: {
  integrations: typeof INTEGRATIONS;
  connected: Set<string>;
  onToggle: (name: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-bold">Supercharge Your Hiring</h3>
        <p className="text-indigo-100 text-sm mt-1">Connect with the tools you already use to streamline your recruitment workflow. Import candidates, post jobs, schedule interviews, and send offers — all from one place.</p>
        <div className="flex gap-4 mt-4">
          <div className="bg-white/20 rounded-xl px-4 py-2">
            <p className="text-2xl font-bold">{connected.size}</p>
            <p className="text-xs text-indigo-100">Connected</p>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2">
            <p className="text-2xl font-bold">{integrations.filter((i) => i.status === 'available').length}</p>
            <p className="text-xs text-indigo-100">Available</p>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2">
            <p className="text-2xl font-bold">{integrations.filter((i) => i.status === 'coming_soon').length}</p>
            <p className="text-xs text-indigo-100">Coming Soon</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Job Boards & Sourcing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {integrations.filter((_, i) => i < 5).map((integration) => (
            <IntegrationCard key={integration.name} integration={integration} isConnected={connected.has(integration.name)} onToggle={onToggle} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">ATS & Workflow</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {integrations.filter((_, i) => i >= 5 && i < 8).map((integration) => (
            <IntegrationCard key={integration.name} integration={integration} isConnected={connected.has(integration.name)} onToggle={onToggle} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Interviews & Communication</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {integrations.filter((_, i) => i >= 8).map((integration) => (
            <IntegrationCard key={integration.name} integration={integration} isConnected={connected.has(integration.name)} onToggle={onToggle} />
          ))}
        </div>
      </div>
    </div>
  );
}

function IntegrationCard({ integration, isConnected, onToggle }: {
  integration: typeof INTEGRATIONS[0];
  isConnected: boolean;
  onToggle: (name: string) => void;
}) {
  const isComingSoon = integration.status === 'coming_soon';

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${isConnected ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-slate-100'} ${isComingSoon ? 'opacity-70' : 'hover:shadow-md'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: integration.color }}>
            {integration.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">{integration.name}</h4>
            {isComingSoon && <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">Coming Soon</span>}
          </div>
        </div>
        {isConnected && (
          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{integration.description}</p>
      <button
        onClick={() => !isComingSoon && onToggle(integration.name)}
        disabled={isComingSoon}
        className={`mt-4 w-full py-2 rounded-xl text-xs font-semibold transition-all ${
          isComingSoon
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : isConnected
              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {isComingSoon ? 'Notify Me' : isConnected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
}

// ==================== FORMS ====================

function JobForm({ initialData, onSubmit, onCancel }: {
  initialData?: JobPosting | null;
  onSubmit: (data: Partial<JobPosting>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [department, setDepartment] = useState<Department>(initialData?.department || 'Engineering');
  const [location, setLocation] = useState(initialData?.location || '');
  const [type, setType] = useState<EmploymentType>(initialData?.type || 'Full-time');
  const [description, setDescription] = useState(initialData?.description || '');
  const [requirements, setRequirements] = useState(initialData?.requirements || '');
  const [salaryMin, setSalaryMin] = useState(String(initialData?.salaryRange?.min || ''));
  const [salaryMax, setSalaryMax] = useState(String(initialData?.salaryRange?.max || ''));
  const [status, setStatus] = useState<JobStatus>(initialData?.status || 'Open');

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const today = new Date().toISOString().split('T')[0];
      onSubmit({
        title, department, location, type, description, requirements,
        salaryRange: { min: Number(salaryMin), max: Number(salaryMax) },
        status, postedDate: initialData?.postedDate || today,
        closingDate: initialData?.closingDate || today,
      });
    }} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Job Title</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Senior React Developer" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
          <select value={department} onChange={(e) => setDepartment(e.target.value as Department)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
          <input required value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Remote" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Employment Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as EmploymentType)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="Open">Open</option>
            <option value="Draft">Draft</option>
            <option value="On Hold">On Hold</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Min Salary</label>
          <input type="number" required value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Max Salary</label>
          <input type="number" required value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Requirements</label>
        <textarea required value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:from-indigo-700 hover:to-purple-700">{initialData ? 'Update' : 'Create'} Job</button>
      </div>
    </form>
  );
}

function ApplicantForm({ jobs, onSubmit, onCancel }: {
  jobs: JobPosting[];
  onSubmit: (data: Omit<Applicant, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobId, setJobId] = useState(jobs[0]?.id || '');
  const [notes, setNotes] = useState('');

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit({
        name, email, phone, jobId, notes,
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
      });
    }} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Position</label>
        <select value={jobId} onChange={(e) => setJobId(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:from-indigo-700 hover:to-purple-700">Add Candidate</button>
      </div>
    </form>
  );
}
