import type { Timestamp } from "firebase/firestore";

// A consistent type for user roles
export type UserRole = "admin" | "manager" | "employee";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  position: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date | Timestamp;
  displayName?: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  hireDate: Date;
  // Added "on-leave" status for better leave management
  status: "active" | "inactive" | "terminated" | "on-leave" | EmployeeStatus;
  avatar?: string;
  address?: string;
  dateOfBirth?: Date;
  role: UserRole;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: Date;
  updatedAt: Date | Timestamp;
  displayName?: string;
  defaultValues?: any;
}

type EmployeeStatus = "active" | "inactive" | "terminated" | "on-leave";

// interface EmployeeFormData {
//   status: EmployeeStatus;
// }

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType:
    | "sick"
    | "vacation"
    | "personal"
    | "maternity"
    | "paternity"
    | "emergency";
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date | Timestamp;
  defaultValues: "employeeId" | "name" | "email" | "phone" | "department" | "position" | "salary" | "hireDate" | "status";
  displayName: "";

}

export interface Department {
  id: string;
  name: string;
  description: string;
  managerId?: string;
  employeeCount: number;
  createdAt: Date;
  updatedAt: Date | Timestamp;
  managerName?: string; // Optional field for manager's name
  defaultValues:
    | "employeeId"
    | "name"
    | "email"
    | "phone"
    | "department"
    | "position"
    | "salary"
    | "hireDate"
    | "status";
  displayName: "";
}

export interface Input {
  InputProps: string;
}