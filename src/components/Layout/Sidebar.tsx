"use client"

import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Users, Calendar, Building2, FileText, User } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { userProfile } = useAuth()

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/employees", icon: Users, label: "Employees", adminOnly: false },
    { path: "/leave-requests", icon: Calendar, label: "Leave Requests" },
    { path: "/departments", icon: Building2, label: "Departments"},
    // { path: "/admin", icon: Settings, label: "Administration", adminOnly: true },
    { path: "/reports", icon: FileText, label: "Reports", adminOnly: true },
    { path: "/profile", icon: User, label: "Profile" },
  ]

  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || userProfile?.role === "admin" || userProfile?.role === "manager",
  )

  return (
    <div className="drawer-side">
      <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
      <aside className="w-64 min-h-full bg-base-200">
        <div className="p-4">
          <div className="text-center mb-6">
            <div className="avatar">
              <div className="w-16 rounded-full bg-primary">
                <div className="flex items-center justify-center h-full">
                  <span className="text-2xl text-primary-content font-bold">{userProfile?.name?.charAt(0) || "U"}</span>
                </div>
              </div>
            </div>
            <h3 className="font-semibold mt-2">{userProfile?.name}</h3>
            <p className="text-sm opacity-60 capitalize">{userProfile?.role}</p>
          </div>

          <ul className="menu p-0 space-y-2">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive ? "bg-primary text-primary-content" : "hover:bg-base-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>
    </div>
  )
}

export default Sidebar
