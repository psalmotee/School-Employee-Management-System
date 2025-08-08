"use client"

import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "manager" | "employee"
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { currentUser, userProfile } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && userProfile?.role !== requiredRole && userProfile?.role !== "admin") {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
