// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {

//     // Helper functions
//     function isAuthenticated() {
//       return request.auth != null;
//     }

//     function getUserRole() {
//       return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
//     }

//     function isAdmin() {
//       return isAuthenticated() && getUserRole() == "admin";
//     }

//     function isManager() {
//       return isAuthenticated() && (getUserRole() == "manager" || getUserRole() == "admin");
//     }

//     function isEmployee() {
//       return isAuthenticated() && getUserRole() == "employee";
//     }

//     function isOwner(userId) {
//       return isAuthenticated() && request.auth.uid == userId;
//     }

//     function isValidUserData() {
//       return request.resource.data.keys().hasAll(['name', 'email', 'role', 'department', 'position']) &&
//         request.resource.data.role in ['admin', 'manager', 'employee'] &&
//         request.resource.data.email is string &&
//         request.resource.data.name is string &&
//         request.resource.data.department is string &&
//         request.resource.data.position is string;
//     }

//     function isValidEmployeeData() {
//       return request.resource.data.keys().hasAll(['employeeId', 'name', 'email', 'department', 'position', 'status']) &&
//         request.resource.data.status in ['active', 'inactive', 'terminated'] &&
//         request.resource.data.email is string &&
//         request.resource.data.name is string &&
//         request.resource.data.employeeId is string;
//     }

//     function isValidLeaveRequest() {
//       return request.resource.data.keys().hasAll(['employeeId', 'employeeName', 'leaveType', 'startDate', 'endDate', 'reason', 'status']) &&
//         request.resource.data.leaveType in ['sick', 'vacation', 'personal', 'maternity', 'paternity', 'emergency'] &&
//         request.resource.data.status in ['pending', 'approved', 'rejected'] &&
//         request.resource.data.employeeId is string &&
//         request.resource.data.reason is string;
//     }

//     // Users
//     match /users/{userId} {
//       allow read: if isOwner(userId) || isManager();
//       allow create: if isOwner(userId) && isValidUserData();
//       allow update: if (isOwner(userId) || isAdmin()) && isValidUserData();
//       allow delete: if isAdmin();
//     }

//     // Employees
//     match /employees/{employeeId} {
//       allow read: if isAuthenticated();
//       allow create, update: if isManager() && isValidEmployeeData();
//       allow delete: if isAdmin();
//     }

//     // Leave Requests
//     match /leaveRequests/{requestId} {
//       allow read: if isAuthenticated() && (resource.data.employeeId == request.auth.uid || isManager());
//       allow create: if isAuthenticated() && request.resource.data.employeeId == request.auth.uid && isValidLeaveRequest() && request.resource.data.status == 'pending';
//       allow update: if isAuthenticated() && (
//         (resource.data.employeeId == request.auth.uid && resource.data.status == 'pending' && request.resource.data.status == 'pending') || isManager()
//       ) && isValidLeaveRequest();
//       allow delete: if isManager();
//     }

//      // Departments
//     match /departments/{departmentId} {
//       allow read: if isAuthenticated();
//       allow create, update: if isAdmin() &&
//         request.resource.data.keys().hasAll(['name', 'description']) &&
//         request.resource.data.name is string &&
//         request.resource.data.description is string;
//       allow delete: if isAdmin();
//     }


//     // Notifications
//     match /notifications/{notificationId} {
//       allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
//       allow create: if isManager() &&
//         request.resource.data.keys().hasAll(['userId', 'title', 'message', 'type', 'read']) &&
//         request.resource.data.read == false;
//       allow update: if isAuthenticated() &&
//         resource.data.userId == request.auth.uid &&
//         request.resource.data.diff(resource.data).affectedKeys().hasOnly(['read', 'updatedAt']);
//       allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
//     }

//     // Audit Logs
//     match /auditLogs/{logId} {
//       allow read: if isAdmin();
//       allow create, update, delete: if false;
//     }

//     // Reports
//     match /reports/{reportId} {
//       allow read: if isManager();
//       allow create, update, delete: if isAdmin();
//     }

//     // Settings
//     match /settings/{settingId} {
//       allow read: if isAuthenticated();
//       allow create, update, delete: if isAdmin();
//     }

//     // Invitation Codes
//     match /invitationCodes/{codeId} {
//       allow read, create, delete: if isAdmin();
//       allow update: if isAdmin() || (
//         request.resource.data.diff(resource.data).affectedKeys().hasOnly(['isUsed', 'usedBy', 'usedAt']) &&
//         request.resource.data.isUsed == true
//       );
//     }
//   }
// }
