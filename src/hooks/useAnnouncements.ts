'use client';

import { useCallback, useEffect, useState } from 'react';
import { loadAnnouncements, saveAnnouncements } from '@/lib/storage';
import { Announcement } from '@/lib/types';
import { generateId } from '@/lib/utils';

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setAnnouncements(loadAnnouncements());
    setIsLoaded(true);
  }, []);

  const persist = useCallback((updated: Announcement[]) => {
    setAnnouncements(updated);
    saveAnnouncements(updated);
  }, []);

  const addAnnouncement = useCallback(
    (data: Omit<Announcement, 'id' | 'createdAt'>): Announcement => {
      const ts = new Date().toISOString();
      const ann: Announcement = { ...data, id: generateId(), createdAt: ts };
      persist([ann, ...announcements]);
      return ann;
    },
    [announcements, persist]
  );

  const deleteAnnouncement = useCallback(
    (id: string): void => {
      persist(announcements.filter((a) => a.id !== id));
    },
    [announcements, persist]
  );

  const pinned = announcements.filter((a) => a.pinned);
  const recent = [...announcements].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return {
    announcements,
    isLoaded,
    addAnnouncement,
    deleteAnnouncement,
    pinned,
    recent,
    stats: {
      total: announcements.length,
      pinned: pinned.length,
    },
  };
}
