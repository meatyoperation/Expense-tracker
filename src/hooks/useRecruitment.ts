'use client';

import { useCallback, useEffect, useState } from 'react';
import { loadJobs, saveJobs, loadApplicants, saveApplicants } from '@/lib/storage';
import { JobPosting, Applicant, ApplicationStatus } from '@/lib/types';
import { generateId } from '@/lib/utils';

export function useRecruitment() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setJobs(loadJobs());
    setApplicants(loadApplicants());
    setIsLoaded(true);
  }, []);

  const persistJobs = useCallback((updated: JobPosting[]) => {
    setJobs(updated);
    saveJobs(updated);
  }, []);

  const persistApplicants = useCallback((updated: Applicant[]) => {
    setApplicants(updated);
    saveApplicants(updated);
  }, []);

  const addJob = useCallback(
    (data: Omit<JobPosting, 'id' | 'createdAt' | 'applicantCount'>): JobPosting => {
      const job: JobPosting = { ...data, id: generateId(), applicantCount: 0, createdAt: new Date().toISOString() };
      persistJobs([job, ...jobs]);
      return job;
    },
    [jobs, persistJobs]
  );

  const updateJob = useCallback(
    (id: string, data: Partial<JobPosting>): void => {
      persistJobs(jobs.map((j) => (j.id === id ? { ...j, ...data } : j)));
    },
    [jobs, persistJobs]
  );

  const deleteJob = useCallback(
    (id: string): void => {
      persistJobs(jobs.filter((j) => j.id !== id));
      persistApplicants(applicants.filter((a) => a.jobId !== id));
    },
    [jobs, applicants, persistJobs, persistApplicants]
  );

  const addApplicant = useCallback(
    (data: Omit<Applicant, 'id' | 'createdAt'>): Applicant => {
      const app: Applicant = { ...data, id: generateId(), createdAt: new Date().toISOString() };
      persistApplicants([app, ...applicants]);
      // Increment job applicant count
      persistJobs(jobs.map((j) => (j.id === data.jobId ? { ...j, applicantCount: j.applicantCount + 1 } : j)));
      return app;
    },
    [applicants, jobs, persistApplicants, persistJobs]
  );

  const updateApplicantStatus = useCallback(
    (id: string, status: ApplicationStatus): void => {
      persistApplicants(applicants.map((a) => (a.id === id ? { ...a, status } : a)));
    },
    [applicants, persistApplicants]
  );

  const deleteApplicant = useCallback(
    (id: string): void => {
      const app = applicants.find((a) => a.id === id);
      persistApplicants(applicants.filter((a) => a.id !== id));
      if (app) {
        persistJobs(jobs.map((j) => (j.id === app.jobId ? { ...j, applicantCount: Math.max(0, j.applicantCount - 1) } : j)));
      }
    },
    [applicants, jobs, persistApplicants, persistJobs]
  );

  const openJobs = jobs.filter((j) => j.status === 'Open');
  const pipeline = {
    applied: applicants.filter((a) => a.status === 'Applied'),
    screening: applicants.filter((a) => a.status === 'Screening'),
    interview: applicants.filter((a) => a.status === 'Interview'),
    offered: applicants.filter((a) => a.status === 'Offered'),
    hired: applicants.filter((a) => a.status === 'Hired'),
    rejected: applicants.filter((a) => a.status === 'Rejected'),
  };

  const avgTimeToHire = 18; // simulated metric (days)
  const conversionRate = applicants.length > 0
    ? Math.round((pipeline.hired.length / applicants.length) * 100)
    : 0;

  return {
    jobs,
    applicants,
    isLoaded,
    addJob,
    updateJob,
    deleteJob,
    addApplicant,
    updateApplicantStatus,
    deleteApplicant,
    pipeline,
    stats: {
      totalJobs: jobs.length,
      openPositions: openJobs.length,
      totalApplicants: applicants.length,
      inInterview: pipeline.interview.length,
      offered: pipeline.offered.length,
      hired: pipeline.hired.length,
      rejected: pipeline.rejected.length,
      avgTimeToHire,
      conversionRate,
    },
  };
}
