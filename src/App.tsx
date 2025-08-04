"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./components/Auth/LoginForm";
import RegistrationFlow from "./components/Auth/RegistrationFlow";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import LeaveRequests from "./pages/LeaveRequests";
import Departments from "./pages/Departments";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { currentUser, loading, userProfile } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-3 text-lg text-base-content">Loading application...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegistrationFlow />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="leave-requests" element={<LeaveRequests />} />
        <Route path="departments" element={<Departments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        {userProfile?.role === "admin" && (
          <Route path="admin" element={<Admin />} />
        )}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
