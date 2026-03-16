'use client';

import { usePerformance } from '@/hooks/usePerformance';
import { STATUS_COLORS, DEPARTMENT_COLORS } from '@/lib/utils';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-4 h-4 ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function PerformancePage() {
  const { reviews, isLoaded, stats } = usePerformance();

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
        <h1 className="text-2xl font-bold text-slate-900">Performance</h1>
        <p className="text-slate-500 text-sm mt-0.5">Track employee performance reviews and ratings</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Total Reviews</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Avg Rating</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl font-bold text-amber-600">{stats.avgRating}</p>
            <Stars rating={Math.round(stats.avgRating)} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Submitted</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.submitted}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Acknowledged</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.acknowledged}</p>
        </div>
      </div>

      {/* Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{review.employeeName}</h3>
                <p className="text-xs text-slate-500">{review.period} &middot; Reviewed by {review.reviewerName}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[review.status]}`}>{review.status}</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DEPARTMENT_COLORS[review.department]}`}>{review.department}</span>
              <Stars rating={review.rating} />
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <p className="font-medium text-slate-600">Strengths</p>
                <p className="text-slate-500">{review.strengths}</p>
              </div>
              <div>
                <p className="font-medium text-slate-600">Areas for Improvement</p>
                <p className="text-slate-500">{review.improvements}</p>
              </div>
              <div>
                <p className="font-medium text-slate-600">Goals</p>
                <p className="text-slate-500">{review.goals}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
