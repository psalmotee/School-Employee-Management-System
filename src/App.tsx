import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Layout from "./components/Layout/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import LoginForm from "./components/Auth/LoginForm"
import RegistrationFlow from "./components/Auth/RegistrationFlow"
import Dashboard from "./pages/Dashboard"
import Employees from "./pages/Employees"
import LeaveRequests from "./pages/LeaveRequests"
import ErrorBoundary from "./components/ErrorBoundary"
// import FirebaseStatus from "./components/FirebaseStatus"
import Admin from "./pages/Admin"

function App() {
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

export default App
