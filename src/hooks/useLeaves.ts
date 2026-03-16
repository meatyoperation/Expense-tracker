'use client';

import { useCallback, useEffect, useState } from 'react';
import { loadLeaveRequests, saveLeaveRequests } from '@/lib/storage';
import { LeaveRequest } from '@/lib/types';
import { generateId } from '@/lib/utils';

export function useLeaves() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setLeaves(loadLeaveRequests());
    setIsLoaded(true);
  }, []);

  const persist = useCallback((updated: LeaveRequest[]) => {
    setLeaves(updated);
    saveLeaveRequests(updated);
  }, []);

  const addLeave = useCallback(
    (data: Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'>): LeaveRequest => {
      const ts = new Date().toISOString();
      const leave: LeaveRequest = { ...data, id: generateId(), createdAt: ts, updatedAt: ts };
      persist([leave, ...leaves]);
      return leave;
    },
    [leaves, persist]
  );

  const updateStatus = useCallback(
    (id: string, status: LeaveRequest['status']): void => {
      const updated = leaves.map((l) =>
        l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l
      );
      persist(updated);
    },
    [leaves, persist]
  );

  const deleteLeave = useCallback(
    (id: string): void => {
      persist(leaves.filter((l) => l.id !== id));
    },
    [leaves, persist]
  );

  const pending = leaves.filter((l) => l.status === 'Pending');
  const approved = leaves.filter((l) => l.status === 'Approved');

  return {
    leaves,
    isLoaded,
    addLeave,
    updateStatus,
    deleteLeave,
    stats: {
      total: leaves.length,
      pending: pending.length,
      approved: approved.length,
      rejected: leaves.filter((l) => l.status === 'Rejected').length,
    },
    pending,
  };
}
