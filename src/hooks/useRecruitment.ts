'use client';

import { useEffect, useState } from 'react';
import { loadJobs, loadApplicants } from '@/lib/storage';
import { JobPosting, Applicant } from '@/lib/types';

export function useRecruitment() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setJobs(loadJobs());
    setApplicants(loadApplicants());
    setIsLoaded(true);
  }, []);

  const openJobs = jobs.filter((j) => j.status === 'Open');

  return {
    jobs,
    applicants,
    isLoaded,
    stats: {
      totalJobs: jobs.length,
      openPositions: openJobs.length,
      totalApplicants: applicants.length,
      inInterview: applicants.filter((a) => a.status === 'Interview').length,
      offered: applicants.filter((a) => a.status === 'Offered').length,
    },
  };
}
