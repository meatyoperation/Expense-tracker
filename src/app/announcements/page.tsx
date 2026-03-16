'use client';

import { useState } from 'react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { AnnouncementCategory } from '@/lib/types';
import { STATUS_COLORS } from '@/lib/utils';
import ExpenseModal from '@/components/expenses/ExpenseModal';

export default function AnnouncementsPage() {
  const { announcements, isLoaded, addAnnouncement, deleteAnnouncement, stats } = useAnnouncements();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<AnnouncementCategory | 'All'>('All');

  const filtered = filter === 'All' ? announcements : announcements.filter((a) => a.category === filter);

  if (!isLoaded) {
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
          <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
          <p className="text-slate-500 text-sm mt-0.5">{stats.total} announcements &middot; {stats.pinned} pinned</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Announcement
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['All', 'General', 'Policy', 'Event', 'Urgent'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Announcements */}
      <div className="space-y-4">
        {filtered.map((ann) => (
          <div key={ann.id} className={`bg-white rounded-2xl p-6 shadow-sm border ${ann.pinned ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 mb-2">
                {ann.pinned && (
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                )}
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[ann.category]}`}>{ann.category}</span>
              </div>
              <button onClick={() => deleteAnnouncement(ann.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
            <h3 className="text-base font-semibold text-slate-900">{ann.title}</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{ann.content}</p>
            <p className="text-xs text-slate-400 mt-3">By {ann.author} &middot; {ann.publishedAt}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No announcements found</p>
          </div>
        )}
      </div>

      {/* New Announcement Modal */}
      <ExpenseModal isOpen={showModal} onClose={() => setShowModal(false)} title="New Announcement">
        <AnnouncementForm onSubmit={(data) => { addAnnouncement(data); setShowModal(false); }} onCancel={() => setShowModal(false)} />
      </ExpenseModal>
    </div>
  );
}

function AnnouncementForm({ onSubmit, onCancel }: {
  onSubmit: (data: Omit<import('@/lib/types').Announcement, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('General');
  const [pinned, setPinned] = useState(false);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit({ title, content, category, author: 'Admin User', pinned, publishedAt: new Date().toISOString().split('T')[0] });
    }} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Content</label>
        <textarea required value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as AnnouncementCategory)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="General">General</option>
            <option value="Policy">Policy</option>
            <option value="Event">Event</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer pb-2">
            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            <span className="text-sm text-slate-600">Pin announcement</span>
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">Publish</button>
      </div>
    </form>
  );
}
