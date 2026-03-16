import {
  Employee, Department, LeaveRequest, LeaveType, AttendanceRecord,
  PaySlip, JobPosting, Applicant, PerformanceReview, Announcement, Expense,
} from './types';

function id(prefix: string, i: number): string {
  return `${prefix}-${i}-${Date.now()}`;
}

function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function monthStr(monthsAgo: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const ts = () => new Date().toISOString();

const NAMES: { first: string; last: string; dept: Department; designation: string; salary: number }[] = [
  { first: 'Sarah', last: 'Johnson', dept: 'Engineering', designation: 'Senior Software Engineer', salary: 125000 },
  { first: 'Michael', last: 'Chen', dept: 'Engineering', designation: 'Tech Lead', salary: 145000 },
  { first: 'Emily', last: 'Rodriguez', dept: 'Design', designation: 'UI/UX Designer', salary: 95000 },
  { first: 'James', last: 'Wilson', dept: 'Marketing', designation: 'Marketing Manager', salary: 105000 },
  { first: 'Priya', last: 'Patel', dept: 'Engineering', designation: 'Frontend Developer', salary: 110000 },
  { first: 'David', last: 'Kim', dept: 'Sales', designation: 'Sales Director', salary: 130000 },
  { first: 'Lisa', last: 'Anderson', dept: 'HR', designation: 'HR Manager', salary: 98000 },
  { first: 'Robert', last: 'Taylor', dept: 'Finance', designation: 'Financial Analyst', salary: 92000 },
  { first: 'Aisha', last: 'Mohammed', dept: 'Engineering', designation: 'Backend Developer', salary: 115000 },
  { first: 'Carlos', last: 'Garcia', dept: 'Operations', designation: 'Operations Manager', salary: 100000 },
  { first: 'Jennifer', last: 'Lee', dept: 'Design', designation: 'Product Designer', salary: 105000 },
  { first: 'Thomas', last: 'Brown', dept: 'Engineering', designation: 'DevOps Engineer', salary: 120000 },
  { first: 'Maria', last: 'Santos', dept: 'Marketing', designation: 'Content Strategist', salary: 85000 },
  { first: 'Daniel', last: 'White', dept: 'Sales', designation: 'Account Executive', salary: 88000 },
  { first: 'Rachel', last: 'Green', dept: 'HR', designation: 'Recruiter', salary: 75000 },
  { first: 'Alex', last: 'Turner', dept: 'Engineering', designation: 'QA Engineer', salary: 95000 },
  { first: 'Sophie', last: 'Martin', dept: 'Finance', designation: 'Accountant', salary: 82000 },
  { first: 'Kevin', last: 'Wang', dept: 'Engineering', designation: 'Mobile Developer', salary: 118000 },
  { first: 'Nina', last: 'Kapoor', dept: 'Design', designation: 'Design Lead', salary: 115000 },
  { first: 'Chris', last: 'Davis', dept: 'Operations', designation: 'Office Manager', salary: 72000 },
  { first: 'Amanda', last: 'Clark', dept: 'Marketing', designation: 'SEO Specialist', salary: 78000 },
  { first: 'Ryan', last: 'Thompson', dept: 'Engineering', designation: 'Full Stack Developer', salary: 112000 },
  { first: 'Hannah', last: 'Scott', dept: 'Sales', designation: 'Sales Representative', salary: 70000 },
  { first: 'Omar', last: 'Hassan', dept: 'Engineering', designation: 'Data Engineer', salary: 125000 },
  { first: 'Laura', last: 'Mitchell', dept: 'Finance', designation: 'Finance Director', salary: 140000 },
];

export function seedEmployees(): Employee[] {
  const now = ts();
  return NAMES.map((n, i) => ({
    id: id('emp', i),
    firstName: n.first,
    lastName: n.last,
    email: `${n.first.toLowerCase()}.${n.last.toLowerCase()}@hrflow.com`,
    phone: `+1 (555) ${String(100 + i).padStart(3, '0')}-${String(1000 + i * 37).slice(0, 4)}`,
    department: n.dept,
    designation: n.designation,
    employmentType: i % 10 === 0 ? 'Contract' : i % 8 === 0 ? 'Part-time' : 'Full-time' as const,
    status: i === 9 ? 'On Leave' : i === 20 ? 'Probation' : 'Active' as const,
    joinDate: dateStr(365 + i * 30),
    salary: n.salary,
    createdAt: now,
    updatedAt: now,
  }));
}

export function seedLeaveRequests(employees: Employee[]): LeaveRequest[] {
  const now = ts();
  const types: LeaveType[] = ['Annual', 'Sick', 'Personal', 'Annual', 'Sick'];
  const statuses: ('Pending' | 'Approved' | 'Rejected')[] = ['Pending', 'Approved', 'Approved', 'Rejected', 'Pending'];

  return [
    { empIdx: 0, type: 0, status: 1, startDays: 5, duration: 3, reason: 'Family vacation' },
    { empIdx: 2, type: 1, status: 0, startDays: 2, duration: 1, reason: 'Feeling unwell' },
    { empIdx: 4, type: 2, status: 1, startDays: 10, duration: 2, reason: 'Personal errands' },
    { empIdx: 6, type: 0, status: 0, startDays: 1, duration: 5, reason: 'Holiday travel' },
    { empIdx: 8, type: 1, status: 3, startDays: 15, duration: 1, reason: 'Doctor appointment' },
    { empIdx: 1, type: 0, status: 1, startDays: 20, duration: 4, reason: 'Annual leave' },
    { empIdx: 3, type: 2, status: 0, startDays: 3, duration: 1, reason: 'Moving day' },
    { empIdx: 5, type: 1, status: 1, startDays: 8, duration: 2, reason: 'Medical procedure' },
    { empIdx: 7, type: 0, status: 1, startDays: 25, duration: 3, reason: 'Conference travel' },
    { empIdx: 9, type: 4, status: 0, startDays: 0, duration: 2, reason: 'Coming down with cold' },
    { empIdx: 11, type: 0, status: 1, startDays: 30, duration: 5, reason: 'Summer vacation' },
    { empIdx: 13, type: 1, status: 0, startDays: 1, duration: 1, reason: 'Migraine' },
    { empIdx: 15, type: 2, status: 1, startDays: 12, duration: 1, reason: 'Bank appointment' },
    { empIdx: 17, type: 0, status: 0, startDays: 4, duration: 3, reason: 'Wedding attendance' },
    { empIdx: 19, type: 1, status: 1, startDays: 18, duration: 2, reason: 'Flu recovery' },
  ].map((l, i) => {
    const emp = employees[l.empIdx];
    return {
      id: id('leave', i),
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      leaveType: types[l.type],
      startDate: dateStr(l.startDays),
      endDate: dateStr(Math.max(0, l.startDays - l.duration + 1)),
      days: l.duration,
      reason: l.reason,
      status: statuses[l.status],
      createdAt: now,
      updatedAt: now,
    };
  });
}

export function seedAttendance(employees: Employee[]): AttendanceRecord[] {
  const now = ts();
  const active = employees.filter(e => e.status === 'Active').slice(0, 20);
  const records: AttendanceRecord[] = [];

  for (let day = 0; day < 5; day++) {
    for (const emp of active) {
      const isLate = Math.random() < 0.15;
      const isAbsent = Math.random() < 0.05;
      if (isAbsent) {
        records.push({
          id: id('att', records.length),
          employeeId: emp.id,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          date: dateStr(day),
          checkIn: '',
          status: 'Absent',
        });
      } else {
        const checkInHour = isLate ? 9 + Math.floor(Math.random() * 2) : 8 + Math.floor(Math.random() * 1);
        const checkInMin = Math.floor(Math.random() * 60);
        const hours = 7 + Math.random() * 2;
        records.push({
          id: id('att', records.length),
          employeeId: emp.id,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          date: dateStr(day),
          checkIn: `${String(checkInHour).padStart(2, '0')}:${String(checkInMin).padStart(2, '0')}`,
          checkOut: `${String(checkInHour + Math.floor(hours)).padStart(2, '0')}:${String(checkInMin).padStart(2, '0')}`,
          status: isLate ? 'Late' : 'Present',
          hoursWorked: Math.round(hours * 10) / 10,
        });
      }
    }
  }
  return records;
}

export function seedPayslips(employees: Employee[]): PaySlip[] {
  const now = ts();
  const active = employees.filter(e => e.status !== 'Terminated');
  const slips: PaySlip[] = [];

  for (let m = 0; m < 3; m++) {
    for (const emp of active) {
      const basic = Math.round(emp.salary / 12);
      const allowances = Math.round(basic * 0.2);
      const deductions = Math.round(basic * 0.12);
      slips.push({
        id: id('pay', slips.length),
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        department: emp.department,
        month: monthStr(m),
        basicSalary: basic,
        allowances,
        deductions,
        netPay: basic + allowances - deductions,
        status: m === 0 ? 'Draft' : 'Paid',
        paidDate: m > 0 ? dateStr(m * 30) : undefined,
        createdAt: now,
      });
    }
  }
  return slips;
}

export function seedJobs(): JobPosting[] {
  const now = ts();
  const jobs: Omit<JobPosting, 'id' | 'createdAt'>[] = [
    { title: 'Senior React Developer', department: 'Engineering', location: 'Remote', type: 'Full-time', description: 'Build and maintain frontend applications using React and TypeScript.', requirements: '5+ years React, TypeScript, Next.js experience', salaryRange: { min: 120000, max: 150000 }, status: 'Open', applicantCount: 12, postedDate: dateStr(14), closingDate: dateStr(-16) },
    { title: 'Product Designer', department: 'Design', location: 'New York, NY', type: 'Full-time', description: 'Design user experiences for our suite of HR products.', requirements: '3+ years product design, Figma proficiency', salaryRange: { min: 95000, max: 125000 }, status: 'Open', applicantCount: 8, postedDate: dateStr(7), closingDate: dateStr(-23) },
    { title: 'Marketing Intern', department: 'Marketing', location: 'San Francisco, CA', type: 'Intern', description: 'Support marketing campaigns and content creation.', requirements: 'Currently pursuing marketing or related degree', salaryRange: { min: 40000, max: 50000 }, status: 'Open', applicantCount: 24, postedDate: dateStr(5), closingDate: dateStr(-25) },
    { title: 'Sales Manager', department: 'Sales', location: 'Chicago, IL', type: 'Full-time', description: 'Lead and grow our enterprise sales team.', requirements: '7+ years B2B sales, team management experience', salaryRange: { min: 110000, max: 140000 }, status: 'On Hold', applicantCount: 6, postedDate: dateStr(30), closingDate: dateStr(-1) },
    { title: 'DevOps Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', description: 'Manage cloud infrastructure and CI/CD pipelines.', requirements: 'AWS/GCP, Kubernetes, Terraform experience', salaryRange: { min: 115000, max: 145000 }, status: 'Open', applicantCount: 15, postedDate: dateStr(10), closingDate: dateStr(-20) },
  ];
  return jobs.map((j, i) => ({ ...j, id: id('job', i), createdAt: now }));
}

export function seedApplicants(jobs: JobPosting[]): Applicant[] {
  const now = ts();
  const applicants: { jobIdx: number; name: string; email: string; status: Applicant['status'] }[] = [
    { jobIdx: 0, name: 'John Baker', email: 'john.baker@email.com', status: 'Interview' },
    { jobIdx: 0, name: 'Emma Stone', email: 'emma.s@email.com', status: 'Screening' },
    { jobIdx: 0, name: 'Liam Foster', email: 'liam.f@email.com', status: 'Applied' },
    { jobIdx: 1, name: 'Olivia James', email: 'olivia.j@email.com', status: 'Offered' },
    { jobIdx: 1, name: 'Noah Wright', email: 'noah.w@email.com', status: 'Interview' },
    { jobIdx: 2, name: 'Ava Miller', email: 'ava.m@email.com', status: 'Screening' },
    { jobIdx: 2, name: 'Isabella Park', email: 'isabella.p@email.com', status: 'Applied' },
    { jobIdx: 3, name: 'Mason Reed', email: 'mason.r@email.com', status: 'Interview' },
    { jobIdx: 4, name: 'Sophia Chen', email: 'sophia.c@email.com', status: 'Hired' },
    { jobIdx: 4, name: 'Lucas Hall', email: 'lucas.h@email.com', status: 'Rejected' },
    { jobIdx: 0, name: 'Mia Roberts', email: 'mia.r@email.com', status: 'Applied' },
    { jobIdx: 4, name: 'Ethan Kumar', email: 'ethan.k@email.com', status: 'Screening' },
  ];
  return applicants.map((a, i) => ({
    id: id('app', i),
    jobId: jobs[a.jobIdx].id,
    name: a.name,
    email: a.email,
    phone: `+1 (555) ${String(200 + i).padStart(3, '0')}-${String(2000 + i * 41).slice(0, 4)}`,
    status: a.status,
    appliedDate: dateStr(Math.floor(Math.random() * 20)),
    notes: '',
    createdAt: now,
  }));
}

export function seedPerformanceReviews(employees: Employee[]): PerformanceReview[] {
  const now = ts();
  const reviews = [
    { empIdx: 0, rating: 5, period: 'Q4 2025', reviewer: 'Michael Chen' },
    { empIdx: 1, rating: 4, period: 'Q4 2025', reviewer: 'Lisa Anderson' },
    { empIdx: 2, rating: 4, period: 'Q4 2025', reviewer: 'Nina Kapoor' },
    { empIdx: 4, rating: 3, period: 'Q4 2025', reviewer: 'Michael Chen' },
    { empIdx: 5, rating: 5, period: 'Q4 2025', reviewer: 'Lisa Anderson' },
    { empIdx: 7, rating: 4, period: 'Q4 2025', reviewer: 'Laura Mitchell' },
    { empIdx: 8, rating: 4, period: 'Q4 2025', reviewer: 'Michael Chen' },
    { empIdx: 11, rating: 3, period: 'Q4 2025', reviewer: 'Michael Chen' },
  ] as const;

  return reviews.map((r, i) => {
    const emp = employees[r.empIdx];
    return {
      id: id('rev', i),
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      reviewerName: r.reviewer,
      period: r.period,
      rating: r.rating as 1 | 2 | 3 | 4 | 5,
      strengths: 'Consistently delivers high-quality work. Strong collaboration skills.',
      improvements: 'Could improve on documentation and knowledge sharing.',
      goals: 'Lead a major project initiative in the next quarter.',
      status: i < 5 ? 'Acknowledged' : 'Submitted',
      createdAt: now,
    };
  });
}

export function seedAnnouncements(): Announcement[] {
  const now = ts();
  const items: Omit<Announcement, 'id' | 'createdAt'>[] = [
    { title: 'Q1 2026 All-Hands Meeting', content: 'Join us for our quarterly all-hands meeting on March 25th at 2 PM EST. We will be reviewing company performance and upcoming initiatives.', category: 'Event', author: 'Lisa Anderson', pinned: true, publishedAt: dateStr(1) },
    { title: 'Updated Remote Work Policy', content: 'Starting April 1st, all employees can work remotely up to 3 days per week. Please coordinate with your team leads for scheduling.', category: 'Policy', author: 'Lisa Anderson', pinned: true, publishedAt: dateStr(3) },
    { title: 'Welcome New Team Members', content: 'Please welcome our newest team members joining this month: Amanda Clark (Marketing) and Ryan Thompson (Engineering). Say hello!', category: 'General', author: 'Rachel Green', pinned: false, publishedAt: dateStr(5) },
    { title: 'System Maintenance Notice', content: 'The HR portal will undergo scheduled maintenance on Saturday from 2 AM to 6 AM EST. Please save your work before this window.', category: 'Urgent', author: 'Thomas Brown', pinned: false, publishedAt: dateStr(2) },
    { title: 'Annual Benefits Enrollment', content: 'Open enrollment for 2026 benefits begins April 15th. Review your options and make selections by May 1st. HR will host info sessions next week.', category: 'Policy', author: 'Lisa Anderson', pinned: false, publishedAt: dateStr(7) },
    { title: 'Team Building Event', content: 'Save the date! Our spring team building event is scheduled for April 12th. Activities include outdoor games, team challenges, and a BBQ lunch.', category: 'Event', author: 'Chris Davis', pinned: false, publishedAt: dateStr(4) },
  ];
  return items.map((a, i) => ({ ...a, id: id('ann', i), createdAt: now }));
}

export function seedExpenses(): Expense[] {
  const now = ts();
  const seed: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>[] = [
    { date: dateStr(1), amount: 12.5, category: 'Food', description: 'Lunch at deli' },
    { date: dateStr(2), amount: 45.0, category: 'Transportation', description: 'Monthly bus pass' },
    { date: dateStr(3), amount: 89.99, category: 'Shopping', description: 'New headphones' },
    { date: dateStr(4), amount: 15.0, category: 'Entertainment', description: 'Movie ticket' },
    { date: dateStr(5), amount: 120.0, category: 'Bills', description: 'Internet bill' },
    { date: dateStr(6), amount: 8.75, category: 'Food', description: 'Coffee shop' },
    { date: dateStr(8), amount: 55.0, category: 'Food', description: 'Grocery run' },
    { date: dateStr(10), amount: 30.0, category: 'Entertainment', description: 'Streaming subscriptions' },
    { date: dateStr(12), amount: 22.5, category: 'Transportation', description: 'Rideshare' },
    { date: dateStr(14), amount: 200.0, category: 'Bills', description: 'Electricity bill' },
    { date: dateStr(16), amount: 67.0, category: 'Shopping', description: 'Clothing' },
    { date: dateStr(18), amount: 9.99, category: 'Entertainment', description: 'Music subscription' },
    { date: dateStr(20), amount: 48.0, category: 'Food', description: 'Dinner out' },
    { date: dateStr(25), amount: 35.0, category: 'Transportation', description: 'Gas' },
    { date: dateStr(30), amount: 14.5, category: 'Food', description: 'Breakfast cafe' },
  ];
  return seed.map((s, i) => ({ ...s, id: `seed-${i}-${Date.now()}`, createdAt: now, updatedAt: now }));
}
