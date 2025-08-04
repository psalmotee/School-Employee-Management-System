// Firestore Security Rules for School Employee Management System
// Copy this content to your Firebase Console > Firestore Database > Rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions for role-based access control
    function isAuthenticated() {
      return request.auth != null;
    }

    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }

    function isAdmin() {
      return isAuthenticated() && getUserRole() == "admin";
    }

    function isManager() {
      return isAuthenticated() && (getUserRole() == "manager" || getUserRole() == "admin");
    }

    function isEmployee() {
      return isAuthenticated() && getUserRole() == "employee";
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isValidUserData() {
      return request.resource.data.keys().hasAll(['name', 'email', 'role', 'department', 'position']) &&
        request.resource.data.role in ['admin', 'manager', 'employee'] &&
        request.resource.data.email is string &&
        request.resource.data.name is string &&
        request.resource.data.department is string &&
        request.resource.data.position is string;
    }

    function isValidEmployeeData() {
      return request.resource.data.keys().hasAll(['employeeId', 'name', 'email', 'department', 'position', 'status']) &&
        request.resource.data.status in ['active', 'inactive', 'terminated'] &&
        request.resource.data.email is string &&
        request.resource.data.name is string &&
        request.resource.data.employeeId is string;
    }

    function isValidLeaveRequest() {
      return request.resource.data.keys().hasAll(['employeeId', 'employeeName', 'leaveType', 'startDate', 'endDate', 'reason', 'status']) &&
        request.resource.data.leaveType in ['sick', 'vacation', 'personal', 'maternity', 'paternity', 'emergency'] &&
        request.resource.data.status in ['pending', 'approved', 'rejected'] &&
        request.resource.data.employeeId is string &&
        request.resource.data.reason is string;
    }

    // Users collection rules
    match /users/{userId} {
      // Users can read their own profile, managers and admins can read all
      allow read: if isOwner(userId) || isManager();
      // Only the user themselves can create their profile during registration
      allow create: if isOwner(userId) && isValidUserData();
      // Users can update their own profile, admins can update any profile
      allow update: if (isOwner(userId) || isAdmin()) && isValidUserData();
      // Only admins can delete user profiles
      allow delete: if isAdmin();
    }

    // Employees collection rules
    match /employees/{employeeId} {
      // All authenticated users can read employee data
      allow read: if isAuthenticated();
      // Only managers and admins can create employee records
      allow create: if isManager() && isValidEmployeeData();
      // Only managers and admins can update employee records
      allow update: if isManager() && isValidEmployeeData();
      // Only admins can delete employee records
      allow delete: if isAdmin();
    }

    // Leave requests collection rules
    match /leaveRequests/{requestId} {
      // Employees can read their own requests, managers can read all
      allow read: if isAuthenticated() && (resource.data.employeeId == request.auth.uid || isManager());
      // Employees can create their own leave requests
      allow create: if isAuthenticated() && request.resource.data.employeeId == request.auth.uid && isValidLeaveRequest() && request.resource.data.status == 'pending';
      // Employees can update their own pending requests, managers can update any request
      allow update: if isAuthenticated() && ((resource.data.employeeId == request.auth.uid && resource.data.status == 'pending' && request.resource.data.status == 'pending') || isManager()) && isValidLeaveRequest();
      // Only managers and admins can delete leave requests
      allow delete: if isManager();
    }

    // Departments collection rules
    match /departments/{departmentId} {
      // All authenticated users can read department data
      allow read: if isAuthenticated();
      // Only admins can create departments
      allow create: if isAdmin() && request.resource.data.keys().hasAll(['name', 'description']) && request.resource.data.name is string && request.resource.data.description is string;
      // Only admins can update departments
      allow update: if isAdmin() && request.resource.data.keys().hasAll(['name', 'description']) && request.resource.data.name is string && request.resource.data.description is string;
      // Only admins can delete departments
      allow delete: if isAdmin();
    }

    // Notifications collection rules
    match /notifications/{notificationId} {
      // Users can only read their own notifications
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      // System can create notifications, managers can create notifications for their employees
      allow create: if isManager() && request.resource.data.keys().hasAll(['userId', 'title', 'message', 'type', 'read']) && request.resource.data.read == false;
      // Users can update their own notifications (mark as read)
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['read', 'updatedAt']);
      // Users can delete their own notifications
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }

    // Audit logs collection rules (read-only for most users)
    match /auditLogs/{logId} {
      // Only admins can read audit logs
      allow read: if isAdmin();
      // System creates audit logs automatically
      allow create: if false; // Handled by server-side functions
      // Audit logs cannot be updated or deleted
      allow update, delete: if false;
    }

    // Reports collection rules
    match /reports/{reportId} {
      // Only managers and admins can read reports
      allow read: if isManager();
      // Only admins can create reports
      allow create: if isAdmin();
      // Only admins can update reports
      allow update: if isAdmin();
      // Only admins can delete reports
      allow delete: if isAdmin();
    }

    // Settings collection rules
    match /settings/{settingId} {
      // All authenticated users can read settings
      allow read: if isAuthenticated();
      // Only admins can create/update/delete settings
      allow create, update, delete: if isAdmin();
    }

    // Invitation codes collection rules
    match /invitationCodes/{codeId} {
      // Only admins can read invitation codes
      allow read: if isAdmin();
      // Only admins can create invitation codes
      allow create: if isAdmin() && request.resource.data.keys().hasAll(['code', 'role', 'createdBy', 'createdByName', 'isUsed', 'expiresAt']) && request.resource.data.role in ['admin', 'manager'] && request.resource.data.isUsed == false && request.resource.data.createdBy == request.auth.uid;
      // Only admins can update invitation codes (mark as used)
      allow update: if isAdmin() || (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['isUsed', 'usedBy', 'usedAt']) && request.resource.data.isUsed == true);
      // Only admins can delete invitation codes
      allow delete: if isAdmin();
    }
  }
}