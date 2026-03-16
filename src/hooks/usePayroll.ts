'use client';

import { useEffect, useState } from 'react';
import { loadPayslips } from '@/lib/storage';
import { PaySlip } from '@/lib/types';

export function usePayroll() {
  const [payslips, setPayslips] = useState<PaySlip[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setPayslips(loadPayslips());
    setIsLoaded(true);
  }, []);

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthSlips = payslips.filter((p) => p.month === currentMonth);

  const totalPayroll = currentMonthSlips.reduce((sum, p) => sum + p.netPay, 0);
  const avgSalary = currentMonthSlips.length > 0 ? totalPayroll / currentMonthSlips.length : 0;

  return {
    payslips,
    isLoaded,
    currentMonthSlips,
    stats: {
      totalPayroll,
      avgSalary,
      totalSlips: payslips.length,
      paidCount: payslips.filter((p) => p.status === 'Paid').length,
      draftCount: payslips.filter((p) => p.status === 'Draft').length,
    },
  };
}
