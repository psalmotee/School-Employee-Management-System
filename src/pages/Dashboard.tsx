"use client"

import type React from "react"
import { Users, Calendar, Building2, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth()

  const stats = [
    {
      title: "Total Employees",
      value: "248",
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "bg-primary",
    },
    {
      title: "Active Departments",
      value: "8",
      change: "+2",
      changeType: "increase",
      icon: Building2,
      color: "bg-secondary",
    },
    {
      title: "Pending Requests",
      value: "15",
      change: "-5",
      changeType: "decrease",
      icon: Clock,
      color: "bg-warning",
    },
    {
      title: "This Month Leaves",
      value: "42",
      change: "+8%",
      changeType: "increase",
      icon: Calendar,
      color: "bg-info",
    },
  ]

  const recentLeaveRequests = [
    {
      id: "1",
      employeeName: "John Smith",
      leaveType: "Sick Leave",
      startDate: "2024-01-15",
      endDate: "2024-01-17",
      status: "pending",
      days: 3,
    },
    {
      id: "2",
      employeeName: "Sarah Johnson",
      leaveType: "Vacation",
      startDate: "2024-01-20",
      endDate: "2024-01-25",
      status: "approved",
      days: 5,
    },
    {
      id: "3",
      employeeName: "Mike Davis",
      leaveType: "Personal",
      startDate: "2024-01-18",
      endDate: "2024-01-18",
      status: "rejected",
      days: 1,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-success" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-error" />
      default:
        return <AlertCircle className="h-5 w-5 text-warning" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "badge badge-sm"
    switch (status) {
      case "approved":
        return `${baseClasses} badge-success`
      case "rejected":
        return `${baseClasses} badge-error`
      default:
        return `${baseClasses} badge-warning`
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-primary-content">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userProfile?.name}! 👋</h1>
        <p className="text-primary-content/80">Here's what's happening in your school today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base-content/60 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp
                        className={`h-4 w-4 ${stat.changeType === "increase" ? "text-success" : "text-error"}`}
                      />
                      <span className={`text-sm ${stat.changeType === "increase" ? "text-success" : "text-error"}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Recent Leave Requests</h2>
            <div className="space-y-4">
              {recentLeaveRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium">{request.employeeName}</p>
                      <p className="text-sm text-base-content/60">
                        {request.leaveType} • {request.days} day{request.days > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={getStatusBadge(request.status)}>{request.status}</div>
                    <p className="text-xs text-base-content/60 mt-1">{request.startDate}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm">View All</button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="btn btn-outline btn-primary">
                <Users className="h-5 w-5" />
                Add Employee
              </button>
              <button className="btn btn-outline btn-secondary">
                <Calendar className="h-5 w-5" />
                New Leave Request
              </button>
              <button className="btn btn-outline btn-accent">
                <Building2 className="h-5 w-5" />
                Manage Departments
              </button>
              <button className="btn btn-outline btn-info">
                <TrendingUp className="h-5 w-5" />
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Department Overview */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Department Overview</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Employees</th>
                  <th>Manager</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Teaching Staff</td>
                  <td>85</td>
                  <td>Dr. Emily Wilson</td>
                  <td>
                    <div className="badge badge-success">Active</div>
                  </td>
                </tr>
                <tr>
                  <td>Administration</td>
                  <td>25</td>
                  <td>Robert Brown</td>
                  <td>
                    <div className="badge badge-success">Active</div>
                  </td>
                </tr>
                <tr>
                  <td>IT Department</td>
                  <td>12</td>
                  <td>Alex Chen</td>
                  <td>
                    <div className="badge badge-success">Active</div>
                  </td>
                </tr>
                <tr>
                  <td>Maintenance</td>
                  <td>18</td>
                  <td>James Miller</td>
                  <td>
                    <div className="badge badge-warning">Understaffed</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
