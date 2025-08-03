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

## 🗂️ Project Structure

src/
├── components/ # Reusable UI and feature components
├── contexts/ # Global auth context
├── hooks/ # Custom hooks (employees, leaves)
├── pages/ # Route-based pages (Dashboard, Employees, Leaves)
├── lib/ # Firebase config and utility functions
├── types/ # TypeScript interfaces and types
└── main.tsx, App.tsx # Entry points

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
