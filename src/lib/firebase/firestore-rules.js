// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {

//     // Helper function to check if the user is authenticated
//     function isAuthenticated() {
//       return request.auth != null;
//     }

//     // Helper function to get the user's role
//     function getRole(userId) {
//       return get(/databases/$(database)/documents/users/$(userId)).data.role;
//     }

//     // A user can read and update their own profile
//     match /users/{userId} {
//       allow read: if isAuthenticated() && request.auth.uid == userId;
//       allow update: if isAuthenticated() && request.auth.uid == userId;
//     }

//     // Leave requests can be managed by different roles
//     match /leaveRequests/{leaveRequestId} {
//       // Allow any authenticated user to create a leave request
//       allow create: if isAuthenticated() && request.resource.data.employeeId == request.auth.uid;

//       // Allow authenticated users to read
//       allow read: if isAuthenticated() && (
//         request.auth.uid == resource.data.employeeId || // Employee's own requests
//         getRole(request.auth.uid) == 'admin' ||
//         getRole(request.auth.uid) == 'manager'
//       );

//       // Allow authenticated users to update or delete
//       allow update, delete: if isAuthenticated() && (
//         (request.auth.uid == resource.data.employeeId && resource.data.status == 'pending') ||
//         getRole(request.auth.uid) == 'admin' ||
//         getRole(request.auth.uid) == 'manager'
//       );
//     }

//     // Employees can be managed by admins and managers
//     match /employees/{employeeId} {
//       // Allow unauthenticated users to read for registration
//       allow read: if request.auth == null && resource.data.isRegistered == false;

//       // Allow authenticated users to update their own employee record
//       allow update: if isAuthenticated() && (
//         (request.auth.token.email == resource.data.email &&
//          resource.data.isRegistered == false &&
//          request.resource.data.id == request.auth.uid) ||
//         (request.auth.uid == employeeId) ||
//         (getRole(request.auth.uid) == 'admin' || getRole(request.auth.uid) == 'manager')
//       );

//       // Admins and managers can create new employee records
//       allow create: if isAuthenticated() && (
//         getRole(request.auth.uid) == 'admin' ||
//         getRole(request.auth.uid) == 'manager'
//       );

//       // All authenticated users can read employee data
//       allow read: if isAuthenticated();

//       // Admins and managers can delete any employee record
//       allow delete: if isAuthenticated() && (
//         getRole(request.auth.uid) == 'admin' ||
//         getRole(request.auth.uid) == 'manager'
//       );
//     }

//     // Departments can be managed by admins and managers, but read by all
//     match /departments/{departmentId} {
//       // All authenticated users can read department data
//       allow read: if isAuthenticated();

//       // Admins and managers can create, update, or delete department records
//       allow create, update, delete: if isAuthenticated() && (
//         getRole(request.auth.uid) == 'admin' ||
//         getRole(request.auth.uid) == 'manager'
//       );
//     }

//     // Invitation codes are managed by admins/managers
//     match /invitationCodes/{codeId} {
//       allow read: if isAuthenticated();
//       allow create, update, delete: if isAuthenticated() && (
//         getRole(request.auth.uid) == 'admin' ||
//         getRole(request.auth.uid) == 'manager'
//       );
//     }
//   }
// }
