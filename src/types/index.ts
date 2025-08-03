export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "manager" | "employee"
  department: string
  position: string
  phone?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Employee {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  salary: number
  hireDate: Date
  status: "active" | "inactive" | "terminated"
  avatar?: string
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  leaveType: "sick" | "vacation" | "personal" | "maternity" | "paternity" | "emergency"
  startDate: Date
  endDate: Date
  days: number
  reason: string
  status: "pending" | "approved" | "rejected"
  approvedBy?: string
  approvedAt?: Date
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface Department {
  id: string
  name: string
  description: string
  managerId?: string
  employeeCount: number
  createdAt: Date
}

export interface InvitationCode {
  id: string
  code: string
  role: "admin" | "manager"
  createdBy: string
  createdByName: string
  isUsed: boolean
  usedBy?: string
  usedAt?: Date
  expiresAt: Date
  createdAt: Date
}
