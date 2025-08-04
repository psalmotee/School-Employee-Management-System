import type { User } from "firebase/auth";

// Utility type to make properties optional
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type UserRole = "admin" | "manager" | "employee" | "super_admin";

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  login: (credentials: LoginFormInputs) => Promise<void>;
  register: (data: RegisterFormInputs) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  fetchUserProfile: (user: User) => Promise<void>;
}

export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface RegisterFormInputs extends LoginFormInputs {
  name: string;
  invitationCode?: string;
}

export interface Employee {
  id: string;
  userId: string; // Firebase Auth UID
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  hireDate?: Date;
  jobTitle?: string;
  department?: string;
  departmentId?: string;
  salary?: number;
  status: "active" | "on_leave" | "terminated";
  role: UserRole; // Employee's role within the organization
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveRequest {
  id: string;
  employeeId: string; // Firebase Auth UID of the employee
  employeeName: string;
  type: "sick" | "vacation" | "personal" | "other";
  startDate: Date;
  endDate: Date;
  status: "pending" | "approved" | "rejected" | "cancelled";
  reason?: string;
  comments?: string;
  requestedAt: Date;
  reviewedBy?: string; // UID of manager/admin who reviewed
  reviewedAt?: Date;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  managerName?: string;
  employeeCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvitationCode {
  id: string;
  code: string;
  role: UserRole;
  expiresAt: Date;
  usedBy?: string; // UID of user who used it
  usedAt?: Date;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string; // Recipient's UID
  type: "leave_status" | "announcement" | "system_alert" | "new_employee";
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string; // Optional link to relevant page
}

export interface Report {
  id: string;
  type: "employee_summary" | "leave_balance" | "department_overview" | "custom";
  generatedBy: string; // UID of user who generated it
  generatedAt: Date;
  parameters: Record<string, any>; // e.g., { departmentId: 'HR', startDate: '2023-01-01' }
  dataUrl?: string; // URL to a generated report file (e.g., PDF, CSV)
  summary?: string;
}

export interface AuditLog {
  id: string;
  userId: string; // UID of user who performed the action
  action: string; // e.g., 'employee_created', 'leave_request_approved'
  timestamp: Date;
  details: Record<string, any>; // e.g., { employeeId: 'xyz', changes: { status: 'active' } }
}
