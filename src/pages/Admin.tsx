"use client"

import type React from "react"
import { useState } from "react"
import { Shield, Key, Users, Settings, BarChart3 } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import InvitationCodeManager from "../components/Admin/InvitationCodeManager"

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState("codes")
  const { userProfile } = useAuth()

  if (userProfile?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="alert alert-warning">
          <Shield className="h-5 w-5" />
          <span>Access denied. Administrator privileges required.</span>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "codes", label: "Invitation Codes", icon: Key },
    { id: "users", label: "User Management", icon: Users },
    { id: "settings", label: "System Settings", icon: Settings },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Administration
        </h1>
        <p className="text-base-content/60">System administration and management</p>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              className={`tab gap-2 ${activeTab === tab.id ? "tab-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "codes" && <InvitationCodeManager />}
        {activeTab === "users" && (
          <div className="alert alert-info">
            <Users className="h-5 w-5" />
            <span>User management features coming soon...</span>
          </div>
        )}
        {activeTab === "settings" && (
          <div className="alert alert-info">
            <Settings className="h-5 w-5" />
            <span>System settings features coming soon...</span>
          </div>
        )}
        {activeTab === "analytics" && (
          <div className="alert alert-info">
            <BarChart3 className="h-5 w-5" />
            <span>Analytics dashboard coming soon...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
