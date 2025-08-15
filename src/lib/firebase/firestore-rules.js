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

//     // Users collection
//     match /users/{userId} {
//       // Read own profile
//       allow read: if isAuthenticated() && request.auth.uid == userId;

//       // Update own profile OR admin/manager can update any
//       allow update: if isAuthenticated() && (
//         request.auth.uid == userId ||
//         getRole(request.auth.uid) == 'admin' ||
//         getRole(request.auth.uid) == 'manager'
//       );

//       // Create new profile by admin/manager
//       allow create: if isAuthenticated() && (
//         getRole(request.auth.uid) == 'admin' ||
//         getRole(request.auth.uid) == 'manager'
//       );
//     }

//     // Leave Requests collection
//     match /leaveRequests/{leaveRequestId} {
//       // Create leave request (must be their own employeeId)
//       allow create: if isAuthenticated() &&
//         request.resource.data.employeeId == request.auth.uid;

//       // Read leave request (own OR admin/manager)
//       allow read: if isAuthenticated() && (
//         request.auth.uid == resource.data.employeeId ||
//         getRole(request.auth.uid) == 'admin' ||
//         getRole(request.auth.uid) == 'manager'
//       );

//       // Update or delete (own pending OR admin/manager)
//       allow update, delete: if isAuthenticated() && (
//         (request.auth.uid == resource.data.employeeId &&
//          resource.data.status == 'pending') ||
//         getRole(request.auth.uid) == 'admin' ||
//         getRole(request.auth.uid) == 'manager'
//       );
//     }

//     // Employees collection
//     match /employees/{employeeId} {
//       // Unauthenticated read for pre-registration
//       allow read: if request.auth == null &&
//         resource.data.isRegistered == false;

//       // Update during registration (email + id match + not registered yet)
//       allow update: if isAuthenticated() && (
//         (request.auth.token.email == resource.data.email &&
//          resource.data.isRegistered == false &&
//          request.resource.data.id == request.auth.uid) ||
//         request.auth.uid == employeeId ||
//         getRole(request.auth.uid) == 'admin' ||
//         getRole(request.auth.uid) == 'manager'
//       );

//       // Admin/manager can create
//       allow create: if isAuthenticated() && (
//         getRole(request.auth.uid) == 'admin' ||
//         getRole(request.auth.uid) == 'manager'
//       );

//       // All authenticated users can read employee data
//       allow read: if isAuthenticated();

//       // Admin/manager can delete
//       allow delete: if isAuthenticated() && (
//         getRole(request.auth.uid) == 'admin' ||
//         getRole(request.auth.uid) == 'manager'
//       );
//     }

//     // Departments collection
//     match /departments/{departmentId} {
//       // Any authenticated user can read
//       allow read: if isAuthenticated();

//       // Admin/manager can create, update, delete
//       allow create, update, delete: if isAuthenticated() && (
//         getRole(request.auth.uid) == 'admin' ||
//         getRole(request.auth.uid) == 'manager'
//       );
//     }

//     // Invitation Codes collection
//     match /invitationCodes/{codeId} {
//       // Read by authenticated users
//       allow read: if isAuthenticated();

//       // Create/update/delete by admin/manager
//       allow create, update, delete: if isAuthenticated() && (
//         getRole(request.auth.uid) == 'admin' ||
//         getRole(request.auth.uid) == 'manager'
//       );
//     }
//   }
// }
