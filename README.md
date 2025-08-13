# 🏫 School Employee Management System

A modern, role-based employee management platform built with **React**, **TypeScript**, **Tailwind CSS v4**, **DaisyUI v5**, and **Firebase**.

> 🚀 Fully customizable, responsive, and designed for managing school staff, departments, and leave workflows.

---

## ✨ Features

### 🔐 Authentication & Authorization

- Firebase email/password authentication
- Role-based access control (Admin, Manager, Employee)
- Protected routes and session persistence
- User registration with detailed profile

### 📊 Dashboard

- Key school stats and recent activity feed
- Quick links to manage employees and leaves

### 👩‍🏫 Employee Management

- Add, update, and delete staff profiles
- Filter and search by name, department, or role

### 📝 Leave Requests

- Employees submit leave requests
- Admins/Managers approve or reject requests
- Status tracking and request history

### 🏢 Departments

- Overview of department staffing
- Useful for structuring large institutions

---

## 🧱 Tech Stack

- ⚛️ **React + Vite**
- 📘 **TypeScript**
- 🎨 **Tailwind CSS v4 + DaisyUI v5**
- 🔒 **Firebase (Auth & Firestore)**
- 🧩 **Lucide Icons**
- ✅ **React Hook Form**
- 🌐 Fully responsive & mobile-first

---

## 📁 Full Project Structure

public/                                # Publicly accessible static files
├── _redirects                         # Hosting redirects configuration (e.g., Netlify)
├── placeholder-logo.svg               # Placeholder logo image
├── placeholder.svg                    # Generic placeholder image
├── school.svg                         # School logo/icon

src/                                    # Application source code
├── components/                         # Reusable UI and feature components
│   ├── Auth/                           # Authentication-related components
│   │   ├── LoginForm.tsx               # Login form UI and logic
│   │   └── RegistrationFlow.tsx        # Multi-step user registration flow
│   ├── Department/                     # Department management components
│   │   └── DepartmentForm.tsx          # Form to create/update departments
│   ├── Employees/                      # Employee management components
│   │   └── EmployeeForm.tsx            # Form to create/update employees
│   ├── Layout/                         # App layout components
│   │   ├── Layout.tsx                   # Main layout wrapper
│   │   ├── Navbar.tsx                   # Top navigation bar
│   │   └── Sidebar.tsx                  # Sidebar navigation menu
│   ├── LeaveRequests/                   # Leave request management components
│   │   ├── LeaveRequestDetails.tsx       # Detailed view of a leave request
│   │   └── LeaveRequestForm.tsx          # Form to submit a leave request
│   ├── ui/                              # Reusable UI building blocks
│   │   ├── Button.tsx                    # Styled button component
│   │   ├── Card.tsx                      # Card container component
│   │   ├── Input.tsx                     # Input field component
│   │   ├── Label.tsx                     # Form label component
│   │   ├── Modal.tsx                     # Modal dialog component
│   │   ├── Select.tsx                    # Dropdown select component
│   │   └── Textarea.tsx                  # Multi-line text input component
│   ├── ErrorBoundary.tsx                 # Error handling boundary
│   ├── FirebaseStatus.tsx                # Firebase connection status indicator
│   └── ProtectedRoute.tsx                # Auth-protected route wrapper
│
├── contexts/                            # React context providers
│   └── AuthContext.tsx                   # Authentication context & provider
│
├── hooks/                               # Custom React hooks
│   ├── useDepartments.ts                 # Department data fetching & state
│   ├── useEmployees.ts                   # Employee data fetching & state
│   └── useLeaveRequests.ts               # Leave request data fetching & state
│
├── lib/                                 # Utility and config files
│   ├── firebase/                         # (Optional) Firebase submodules/config
│   ├── env.d.ts                          # TypeScript environment variable types
│   └── firebase.ts                       # Firebase initialization & services
│
├── pages/                               # Application pages
│   ├── Dashboard.tsx                     # Dashboard overview
│   ├── Departments.tsx                   # Department listing & management
│   ├── Employees.tsx                     # Employee listing & management
│   ├── LeaveRequests.tsx                  # Leave request listing
│   ├── Notifications.tsx                  # Notifications page
│   ├── Profile.tsx                        # User profile settings
│   ├── Reports.tsx                        # Reports and analytics page
│   └── Settings.tsx                       # Application settings
│
├── types/                               # TypeScript types and interfaces
│   └── index.ts                          # Central type exports
│
├── App.tsx                              # Root application component
├── index.css                            # Global CSS styles
└── main.tsx                             # Application entry point

.vite/                                   # Vite build cache
dist/                                    # Production build output
node_modules/                            # Installed dependencies

.env                                     # Environment variables file
.gitignore                               # Files and folders to ignore in Git
bash.exe.stackdump                       # Debugging stack dump (Windows-specific)
eslint.config.js                         # ESLint configuration for code linting
index.html                               # HTML entry point for the app
jsconfig.json                            # JavaScript project path/module settings
package-lock.json                        # NPM exact dependency lock file
package.json                             # Project dependencies, scripts, metadata
README.md                                # Main project documentation
tsconfig.app.json                        # TypeScript config for application files
tsconfig.json                            # Base TypeScript configuration
tsconfig.node.json                       # TypeScript config for Node scripts
vite.config.ts                           # Vite build configuration


---

## 🚀 Getting Started

1. **Clone the repo:**

```bash
git clone https://github.com/psalmotee/School-Employee-Management-System.git
cd School-Employee-Management-System

Install dependencies:
npm install

Create a .env file in the root and add your Firebase config:
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
🧠 You can find these values in your Firebase Console.

Run the development server:
npm run dev

📸 UI Highlights
🎨 Clean and modern interface

🌒 Dark mode ready

📱 Mobile-first responsiveness

🧩 Beautiful cards, badges, and modals

📌 Roadmap
 File upload (employee photos, docs)

 Notifications and email alerts

 Multi-language support

 Admin analytics dashboard

🛡️ License
This project is licensed under the MIT License.

🤝 Contributing
Contributions, issues, and suggestions are welcome!
Feel free to open a PR or create a discussion.

📬 Contact
Built by [ Samson Tolulope Moradeyo ( Psalmotee Tech)] · [LinkedIn](http://www.linkedin.com/in/samson-moradayo-211b26187) · [Email](samsonmoradeyo@gmail.com)
