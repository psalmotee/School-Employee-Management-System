import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Layout from "./components/Layout/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import LoginForm from "./components/Auth/LoginForm"
import RegisterForm from "./components/Auth/RegisterForm"
import Dashboard from "./pages/Dashboard"
import Employees from "./pages/Employees"
import LeaveRequests from "./pages/LeaveRequests"
import ErrorBoundary from "./components/ErrorBoundary";
// import FirebaseStatus from "./components/FirebaseStatus";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-base-200">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="employees" element={<Employees />} />
                <Route path="leave-requests" element={<LeaveRequests />} />
              </Route>
            </Routes>
            {/* <FirebaseStatus /> */}
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App
