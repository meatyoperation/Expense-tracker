// ---- EXPENSE (existing) ----
export type Category =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export const CATEGORIES: Category[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category: Category;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  date: string;
  amount: string;
  category: Category;
  description: string;
}

export interface ExpenseFilters {
  startDate: string;
  endDate: string;
  category: Category | 'All';
  search: string;
}

export interface CategorySummary {
  category: Category;
  total: number;
  count: number;
  percentage: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  label: string;
  total: number;
}

// ---- EMPLOYEE ----
export type Department =
  | 'Engineering'
  | 'Design'
  | 'Marketing'
  | 'Sales'
  | 'HR'
  | 'Finance'
  | 'Operations';

export const DEPARTMENTS: Department[] = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
];

export type EmploymentStatus = 'Active' | 'On Leave' | 'Terminated' | 'Probation';
export const EMPLOYMENT_STATUSES: EmploymentStatus[] = ['Active', 'On Leave', 'Terminated', 'Probation'];

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
export const EMPLOYMENT_TYPES: EmploymentType[] = ['Full-time', 'Part-time', 'Contract', 'Intern'];

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: Department;
  designation: string;
  employmentType: EmploymentType;
  status: EmploymentStatus;
  joinDate: string;
  salary: number;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: Department;
  designation: string;
  employmentType: EmploymentType;
  status: EmploymentStatus;
  joinDate: string;
  salary: string;
}

// ---- LEAVE ----
export type LeaveType = 'Annual' | 'Sick' | 'Personal' | 'Maternity' | 'Paternity' | 'Unpaid';
export const LEAVE_TYPES: LeaveType[] = ['Annual', 'Sick', 'Personal', 'Maternity', 'Paternity', 'Unpaid'];

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  employeeId: string;
  annual: { total: number; used: number };
  sick: { total: number; used: number };
  personal: { total: number; used: number };
}

// ---- ATTENDANCE ----
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: AttendanceStatus;
  hoursWorked?: number;
}

// ---- PAYROLL ----
export type PayslipStatus = 'Draft' | 'Processed' | 'Paid';

export interface PaySlip {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  month: string; // YYYY-MM
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: PayslipStatus;
  paidDate?: string;
  createdAt: string;
}

// ---- RECRUITMENT ----
export type JobStatus = 'Open' | 'Closed' | 'On Hold' | 'Draft';
export type ApplicationStatus = 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Hired' | 'Rejected';

export interface JobPosting {
  id: string;
  title: string;
  department: Department;
  location: string;
  type: EmploymentType;
  description: string;
  requirements: string;
  salaryRange: { min: number; max: number };
  status: JobStatus;
  applicantCount: number;
  postedDate: string;
  closingDate: string;
  createdAt: string;
}

export interface Applicant {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  status: ApplicationStatus;
  appliedDate: string;
  notes: string;
  createdAt: string;
}

// ---- PERFORMANCE ----
export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  reviewerName: string;
  period: string;
  rating: 1 | 2 | 3 | 4 | 5;
  strengths: string;
  improvements: string;
  goals: string;
  status: 'Draft' | 'Submitted' | 'Acknowledged';
  createdAt: string;
}

// ---- ANNOUNCEMENT ----
export type AnnouncementCategory = 'General' | 'Policy' | 'Event' | 'Urgent';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  author: string;
  pinned: boolean;
  publishedAt: string;
  createdAt: string;
}
