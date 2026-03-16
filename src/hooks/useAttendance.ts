'use client';

import { useEffect, useState } from 'react';
import { loadAttendance } from '@/lib/storage';
import { AttendanceRecord } from '@/lib/types';
import { formatDateToISO } from '@/lib/utils';

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setRecords(loadAttendance());
    setIsLoaded(true);
  }, []);

  const today = formatDateToISO(new Date());
  const todayRecords = records.filter((r) => r.date === today);

  const present = todayRecords.filter((r) => r.status === 'Present').length;
  const late = todayRecords.filter((r) => r.status === 'Late').length;
  const absent = todayRecords.filter((r) => r.status === 'Absent').length;

  return {
    records,
    isLoaded,
    todayRecords,
    stats: {
      total: todayRecords.length,
      present,
      late,
      absent,
      onTime: present,
    },
  };
}
