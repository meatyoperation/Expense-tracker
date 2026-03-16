import {
  Expense, Employee, LeaveRequest, AttendanceRecord, PaySlip,
  JobPosting, Applicant, PerformanceReview, Announcement,
} from './types';
import {
  seedEmployees, seedLeaveRequests, seedAttendance, seedPayslips,
  seedJobs, seedApplicants, seedPerformanceReviews, seedAnnouncements, seedExpenses,
} from './seed-data';

const KEYS = {
  expenses: 'hrflow_expenses',
  employees: 'hrflow_employees',
  leaves: 'hrflow_leaves',
  attendance: 'hrflow_attendance',
  payslips: 'hrflow_payslips',
  jobs: 'hrflow_jobs',
  applicants: 'hrflow_applicants',
  reviews: 'hrflow_reviews',
  announcements: 'hrflow_announcements',
};

function load<T>(key: string): T[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function save<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.error(`Failed to save ${key} to localStorage`);
  }
}

// ---- Expenses ----
export function loadExpenses(): Expense[] {
  const data = load<Expense>(KEYS.expenses);
  if (data) return data;
  const seeded = seedExpenses();
  save(KEYS.expenses, seeded);
  return seeded;
}

export function saveExpenses(expenses: Expense[]): void {
  save(KEYS.expenses, expenses);
}

// ---- Employees ----
export function loadEmployees(): Employee[] {
  const data = load<Employee>(KEYS.employees);
  if (data) return data;
  const seeded = seedEmployees();
  save(KEYS.employees, seeded);
  return seeded;
}

export function saveEmployees(employees: Employee[]): void {
  save(KEYS.employees, employees);
}

// ---- Leave Requests ----
export function loadLeaveRequests(): LeaveRequest[] {
  const data = load<LeaveRequest>(KEYS.leaves);
  if (data) return data;
  const employees = loadEmployees();
  const seeded = seedLeaveRequests(employees);
  save(KEYS.leaves, seeded);
  return seeded;
}

export function saveLeaveRequests(leaves: LeaveRequest[]): void {
  save(KEYS.leaves, leaves);
}

// ---- Attendance ----
export function loadAttendance(): AttendanceRecord[] {
  const data = load<AttendanceRecord>(KEYS.attendance);
  if (data) return data;
  const employees = loadEmployees();
  const seeded = seedAttendance(employees);
  save(KEYS.attendance, seeded);
  return seeded;
}

export function saveAttendance(records: AttendanceRecord[]): void {
  save(KEYS.attendance, records);
}

// ---- Payslips ----
export function loadPayslips(): PaySlip[] {
  const data = load<PaySlip>(KEYS.payslips);
  if (data) return data;
  const employees = loadEmployees();
  const seeded = seedPayslips(employees);
  save(KEYS.payslips, seeded);
  return seeded;
}

export function savePayslips(slips: PaySlip[]): void {
  save(KEYS.payslips, slips);
}

// ---- Jobs ----
export function loadJobs(): JobPosting[] {
  const data = load<JobPosting>(KEYS.jobs);
  if (data) return data;
  const seeded = seedJobs();
  save(KEYS.jobs, seeded);
  return seeded;
}

export function saveJobs(jobs: JobPosting[]): void {
  save(KEYS.jobs, jobs);
}

// ---- Applicants ----
export function loadApplicants(): Applicant[] {
  const data = load<Applicant>(KEYS.applicants);
  if (data) return data;
  const jobs = loadJobs();
  const seeded = seedApplicants(jobs);
  save(KEYS.applicants, seeded);
  return seeded;
}

export function saveApplicants(applicants: Applicant[]): void {
  save(KEYS.applicants, applicants);
}

// ---- Performance Reviews ----
export function loadReviews(): PerformanceReview[] {
  const data = load<PerformanceReview>(KEYS.reviews);
  if (data) return data;
  const employees = loadEmployees();
  const seeded = seedPerformanceReviews(employees);
  save(KEYS.reviews, seeded);
  return seeded;
}

export function saveReviews(reviews: PerformanceReview[]): void {
  save(KEYS.reviews, reviews);
}

// ---- Announcements ----
export function loadAnnouncements(): Announcement[] {
  const data = load<Announcement>(KEYS.announcements);
  if (data) return data;
  const seeded = seedAnnouncements();
  save(KEYS.announcements, seeded);
  return seeded;
}

export function saveAnnouncements(announcements: Announcement[]): void {
  save(KEYS.announcements, announcements);
}
