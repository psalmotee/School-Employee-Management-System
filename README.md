# School Employee Management System (EMS)

A comprehensive, modern employee management system built with React, TypeScript, Firebase, and DaisyUI. This system provides role-based access control for managing employees, leave requests, departments, and organizational workflows.

## 🚀 Features

### Core Functionality
- **Employee Management**: Complete CRUD operations for employee records
- **Leave Request System**: Submit, approve, reject, and track leave requests
- **Department Management**: Organize employees by departments
- **Role-Based Access Control**: Admin, Manager, and Employee roles with different permissions
- **Real-time Data Sync**: Live updates using Firebase Firestore
- **Responsive Design**: Mobile-first design that works on all devices

### Technical Features
- **Code Splitting & Lazy Loading**: Optimized performance with dynamic imports
- **Toast Notifications**: User-friendly feedback system
- **Form Validation**: Comprehensive form validation with react-hook-form
- **Error Boundaries**: Graceful error handling
- **Dark/Light Theme**: Theme support with DaisyUI
- **Firebase Integration**: Authentication and real-time database

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **React Hook Form** - Form management and validation
- **DaisyUI** - Component library built on Tailwind CSS
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Modern icon library

### Backend & Database
- **Firebase Authentication** - User authentication and authorization
- **Firestore** - NoSQL real-time database
- **Firebase Security Rules** - Database access control

### Development Tools
- **React.js** - React framework with optimizations
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **React Hot Toast** - Toast notification system

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Firebase Project** with Firestore and Authentication enabled
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd school-employee-management-system
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Firebase Configuration
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Create a `.env.local` file in the root directory:

\`\`\`env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
\`\`\`

### 4. Firebase Security Rules
Deploy the security rules from `firestore.rules` to your Firebase project:

\`\`\`bash
firebase deploy --only firestore:rules
\`\`\`

### 5. Run the Development Server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

\`\`\`
## 📂 Project Structure

School Employee Management System

├── public/                          # Static assets available at build time
│   ├── _redirects                   # Netlify redirects config
│   ├── placeholder-logo.svg         # Default placeholder logo
│   ├── placeholder.svg              # Generic placeholder graphic
│   └── school.svg                   # School-themed logo/graphic

├── src/                             # Main application source code
│
│   ├── components/                  # Reusable UI and feature components
│   │
│   │   ├── Auth/                    # Authentication components
│   │   │   ├── LoginForm.tsx        # Handles user login
│   │   │   └── RegistrationForm.tsx # Handles role-based user registration
│   │
│   │   ├── Department/              
│   │   │   └── DepartmentForm.tsx   # Form to create/update school departments
│   │
│   │   ├── Employees/               
│   │   │   └── EmployeeForm.tsx     # Form for adding/updating employees
│   │
│   │   ├── Layout/                  # App layout components
│   │   │   ├── Layout.tsx           # Main layout wrapper (navbar + sidebar + content)
│   │   │   ├── Navbar.tsx           # Top navigation bar
│   │   │   └── Sidebar.tsx          # Sidebar menu for navigation
│   │
│   │   ├── LeaveRequests/           
│   │   │   ├── LeaveRequestDetails.tsx # View details of a leave request
│   │   │   └── LeaveRequestForm.tsx    # Submit new leave requests
│   │
│   │   ├── ui/                      # Shared UI components
│   │   │   ├── Button.tsx           # Styled button
│   │   │   ├── Card.tsx             # Card container for content
│   │   │   ├── Input.tsx            # Text input
│   │   │   ├── Label.tsx            # Form label
│   │   │   ├── Modal.tsx            # Modal dialog
│   │   │   ├── Select.tsx           # Dropdown select
│   │   │   └── Textarea.tsx         # Multi-line text input
│   │
│   │   ├── ErrorBoundary.tsx        # Catches runtime errors gracefully
│   │   ├── FirebaseStatus.tsx       # Shows Firebase connection status
│   │   ├── LazyComponentWrapper.tsx # Dynamically load components (code splitting)
│   │   ├── LoadingSpinner.tsx       # Spinner for loading states
│   │   └── ProtectedRoute.tsx       # Guards routes based on authentication/roles
│
│   ├── contexts/                    
│   │   └── AuthContext.tsx          # Provides authentication + role context
│
│   ├── hooks/                       # Custom React hooks
│   │   ├── useDepartments.ts        # Fetch/manage departments
│   │   ├── useEmployees.ts          # Fetch/manage employees
│   │   ├── useLazyComponent.ts      # Hook for lazy loading components
│   │   └── useLeaveRequests.ts      # Fetch/manage leave requests
│
│   ├── lib/                         # Utility libraries & Firebase setup
│   │   ├── firebase/                # Firebase-related configs
│   │   ├── env.d.ts                 # TypeScript definitions for env vars
│   │   └── firebase.ts              # Firebase initialization
│
│   ├── pages/                       # App pages (mapped to routes)
│   │   ├── Dashboard.tsx            # Main dashboard view
│   │   ├── Departments.tsx          # Manage departments
│   │   ├── Employees.tsx            # Manage employees
│   │   ├── LeaveRequests.tsx        # Manage leave requests
│   │   ├── Notifications.tsx        # User/system notifications
│   │   ├── Profile.tsx              # User profile page
│   │   ├── Reports.tsx              # Reports & analytics
│   │   └── Settings.tsx             # User/system settings
│
│   ├── types/                       
│   │   └── index.ts                 # Shared TypeScript types (e.g., User, Employee, LeaveRequest)
│
│   ├── App.tsx                      # Root React component (routes + layout)
│   ├── index.css                    # Global styles
│   └── main.tsx                     # React entry point (renders App)
│
├── .env                             # Environment variables (API keys, Firebase configs)
├── .gitignore                       # Git ignore rules
├── eslint.config.js                 # ESLint configuration
├── index.html                       # HTML entry point for Vite
├── jsconfig.json                    # JS/TS tooling config
├── package.json                     # Project dependencies & scripts
├── package-lock.json                # Dependency lock file
├── README.md                        # Main project documentation
├── tsconfig.json                    # TypeScript config
├── tsconfig.app.json                # TS config for app
├── tsconfig.node.json               # TS config for Node tooling
└── vite.config.ts                   # Vite bundler configuration


\`\`\`

## 👥 User Roles & Permissions

### Admin
- Full system access
- Manage all employees, departments, and leave requests
- Approve/reject any leave request
- Create and manage user accounts
- Access to reports and analytics

### Manager
- Manage employees in their department
- Approve/reject leave requests for their team
- View department-specific reports
- Cannot approve their own leave requests

### Employee
- View and edit their own profile
- Submit leave requests
- View their leave request history
- Cannot access other employees' data

## 🗄️ Database Structure

### Collections

## 🔐 Authentication Flow

### Registration Process
1. **Admin/Manager creates employee account** with email
2. **Employee receives email** to complete registration
3. **Employee sets password** and completes profile
4. **System assigns appropriate role** and permissions

### Login Process
1. **User enters email/password**
2. **Firebase authenticates** the user
3. **System fetches user profile** from appropriate collection
4. **Role-based routing** to appropriate dashboard

## 🎨 UI Components

### Reusable Components
- **Input**: Form input with icon support and validation
- **Button**: Customizable button with loading states
- **Select**: Dropdown select with icon support
- **Textarea**: Multi-line text input
- **Modal**: Overlay dialogs for forms and confirmations
- **Toast**: Notification system for user feedback

### Layout Components
- **Navbar**: Top navigation with user menu
- **Sidebar**: Side navigation with role-based filtering
- **Layout**: Main layout wrapper with responsive design

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile**: Sidebar drawer navigation
- **Tablet**: Responsive grid layouts
- **Desktop**: Full sidebar with expanded content areas

## 🚀 Performance Optimizations

### Code Splitting
- **Route-based splitting**: Each page loads independently
- **Component lazy loading**: Heavy components load on demand
- **Dynamic imports**: Reduces initial bundle size

### Caching & Optimization
- **Firebase real-time listeners**: Efficient data synchronization
- **React.memo**: Prevents unnecessary re-renders
- **Optimized images**: Proper image loading and sizing

## 🧪 Testing

### Demo Credentials
\`\`\`
Admin:    admin@school.edu / admin123
Manager:  manager@school.edu / manager123
Employee: employee@school.edu / employee123
\`\`\`

## 🚀 Deployment

### Netlify Deployment (Recommended)
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
\`\`\`bash
npm run build
npm run start
\`\`\`

## 🔧 Configuration

### Environment Variables
\`\`\`env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

\`\`\`

##  Troubleshooting

### Common Issues

#### Firebase Permission Errors
- Ensure Firestore security rules are properly deployed
- Check that user roles are correctly assigned
- Verify Firebase project configuration

#### Authentication Issues
- Confirm Firebase Authentication is enabled
- Check environment variables are correctly set
- Verify user exists in appropriate collection

#### Performance Issues
- Enable code splitting for large components
- Optimize Firebase queries with proper indexing
- Use React.memo for expensive components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<!-- ## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the developer
- Check the documentation for common solutions

🤝 Contributing
Contributions, issues, and suggestions are welcome!
Feel free to open a PR or create a discussion.

📬 Contact
Built by [ Samson Tolulope Moradeyo ( Psalmotee Tech)] · [LinkedIn](http://www.linkedin.com/in/samson-moradayo-211b26187) · [Email](samsonmoradeyo@gmail.com)

---

**Built with ❤️ using React, TypeScript, and Firebase**
