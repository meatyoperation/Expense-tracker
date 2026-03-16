'use client';

import { useEffect, useState } from 'react';
import { loadReviews } from '@/lib/storage';
import { PerformanceReview } from '@/lib/types';

export function usePerformance() {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setReviews(loadReviews());
    setIsLoaded(true);
  }, []);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return {
    reviews,
    isLoaded,
    stats: {
      total: reviews.length,
      avgRating: Math.round(avgRating * 10) / 10,
      submitted: reviews.filter((r) => r.status === 'Submitted').length,
      acknowledged: reviews.filter((r) => r.status === 'Acknowledged').length,
    },
  };
}
