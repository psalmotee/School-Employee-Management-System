// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager", 
  EMPLOYEE: "employee",
  SUPER_ADMIN: "super_admin"
};

// Employee status options
export const EMPLOYEE_STATUS = {
  ACTIVE: "active",
  ON_LEAVE: "on_leave", 
  TERMINATED: "terminated"
};

// Leave request types
export const LEAVE_TYPES = {
  SICK: "sick",
  VACATION: "vacation",
  PERSONAL: "personal",
  OTHER: "other"
};

// Leave request status
export const LEAVE_STATUS = {
  PENDING: "pending",
  APPROVED: "approved", 
  REJECTED: "rejected",
  CANCELLED: "cancelled"
};

// Notification types
export const NOTIFICATION_TYPES = {
  LEAVE_STATUS: "leave_status",
  ANNOUNCEMENT: "announcement",
  SYSTEM_ALERT: "system_alert",
  NEW_EMPLOYEE: "new_employee"
};

// Report types
export const REPORT_TYPES = {
  EMPLOYEE_SUMMARY: "employee_summary",
  LEAVE_BALANCE: "leave_balance",
  DEPARTMENT_OVERVIEW: "department_overview",
  CUSTOM: "custom"
};