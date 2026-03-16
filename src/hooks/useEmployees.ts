'use client';

import { useCallback, useEffect, useState } from 'react';
import { loadEmployees, saveEmployees } from '@/lib/storage';
import { Employee, EmployeeFormData, Department } from '@/lib/types';
import { generateId } from '@/lib/utils';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setEmployees(loadEmployees());
    setIsLoaded(true);
  }, []);

  const persist = useCallback((updated: Employee[]) => {
    setEmployees(updated);
    saveEmployees(updated);
  }, []);

  const addEmployee = useCallback(
    (data: EmployeeFormData): Employee => {
      const ts = new Date().toISOString();
      const emp: Employee = {
        id: generateId(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        department: data.department,
        designation: data.designation.trim(),
        employmentType: data.employmentType,
        status: data.status,
        joinDate: data.joinDate,
        salary: parseFloat(data.salary),
        createdAt: ts,
        updatedAt: ts,
      };
      persist([emp, ...employees]);
      return emp;
    },
    [employees, persist]
  );

  const updateEmployee = useCallback(
    (id: string, data: EmployeeFormData): void => {
      const updated = employees.map((e) =>
        e.id === id
          ? {
              ...e,
              firstName: data.firstName.trim(),
              lastName: data.lastName.trim(),
              email: data.email.trim(),
              phone: data.phone.trim(),
              department: data.department,
              designation: data.designation.trim(),
              employmentType: data.employmentType,
              status: data.status,
              joinDate: data.joinDate,
              salary: parseFloat(data.salary),
              updatedAt: new Date().toISOString(),
            }
          : e
      );
      persist(updated);
    },
    [employees, persist]
  );

  const deleteEmployee = useCallback(
    (id: string): void => {
      persist(employees.filter((e) => e.id !== id));
    },
    [employees, persist]
  );

  // Stats
  const activeCount = employees.filter((e) => e.status === 'Active').length;
  const byDepartment = employees.reduce((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {} as Record<Department, number>);

  const recentHires = [...employees]
    .sort((a, b) => b.joinDate.localeCompare(a.joinDate))
    .slice(0, 5);

  return {
    employees,
    isLoaded,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    stats: {
      total: employees.length,
      active: activeCount,
      onLeave: employees.filter((e) => e.status === 'On Leave').length,
      byDepartment,
    },
    recentHires,
  };
}
