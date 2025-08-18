"use client";

import type React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const LoginForm = lazy(() => import("./components/Auth/LoginForm"));
const RegistrationForm = lazy(
  () => import("./components/Auth/RegistrationForm")
);
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Employees = lazy(() => import("./pages/Employees"));
const LeaveRequests = lazy(() => import("./pages/LeaveRequests"));
const Departments = lazy(() => import("./pages/Departments"));
const Reports = lazy(() => import("./pages/Reports"));
const Profile = lazy(() => import("./pages/Profile"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Settings = lazy(() => import("./pages/Settings"));

const LazyRoute: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <ErrorBoundary>
    <Suspense fallback={fallback || <LoadingSpinner />}>{children}</Suspense>
  </ErrorBoundary>
);

function App() {
  const { loading, isAuthReady } = useAuth();

  // Show a full-screen loading spinner while Firebase auth is initializing
  if (loading || !isAuthReady) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <LoadingSpinner />
        <p className="ml-3 text-lg text-base-content">Loading application...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LazyRoute fallback={<LoadingSpinner message="Loading login..." />}>
            <LoginForm />
          </LazyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <LazyRoute
            fallback={<LoadingSpinner message="Loading registration..." />}
          >
            <RegistrationForm />
          </LazyRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route
          path="dashboard"
          element={
            <LazyRoute
              fallback={<LoadingSpinner message="Loading dashboard..." />}
            >
              <Dashboard />
            </LazyRoute>
          }
        />
        <Route
          path="employees"
          element={
            <LazyRoute
              fallback={<LoadingSpinner message="Loading employees..." />}
            >
              <Employees />
            </LazyRoute>
          }
        />
        <Route
          path="leave-requests"
          element={
            <LazyRoute
              fallback={<LoadingSpinner message="Loading leave requests..." />}
            >
              <LeaveRequests />
            </LazyRoute>
          }
        />
        <Route
          path="departments"
          element={
            <LazyRoute
              fallback={<LoadingSpinner message="Loading departments..." />}
            >
              <Departments />
            </LazyRoute>
          }
        />
        <Route
          path="reports"
          element={
            <LazyRoute
              fallback={<LoadingSpinner message="Loading reports..." />}
            >
              <Reports />
            </LazyRoute>
          }
        />
        <Route
          path="profile"
          element={
            <LazyRoute
              fallback={<LoadingSpinner message="Loading profile..." />}
            >
              <Profile />
            </LazyRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <LazyRoute
              fallback={<LoadingSpinner message="Loading notifications..." />}
            >
              <Notifications />
            </LazyRoute>
          }
        />
        <Route
          path="settings"
          element={
            <LazyRoute
              fallback={<LoadingSpinner message="Loading settings..." />}
            >
              <Settings />
            </LazyRoute>
          }
        />
        {/* Admin route is only visible if the user role is 'admin' */}
        {/* {userProfile?.role === "admin" && (
          <Route path="admin" element={<Admin />} />
        )}
        <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
      </Route>
    </Routes>
  );
}

// Export the App component wrapped in the AuthProvider
// This is the crucial step to ensure the useAuth hook works throughout the app.
export default function AppWithProvider() {
  return (
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </AuthProvider>
  );
}
