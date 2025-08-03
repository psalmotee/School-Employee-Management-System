"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Users, Calendar, Building2, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useEmployees } from "../hooks/useEmployees"
import { useLeaveRequests } from "../hooks/useLeaveRequests"

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth()
  const navigate = useNavigate()
  const { employees } = useEmployees()
  const { leaveRequests, getPendingRequests } = useLeaveRequests()

  const pendingRequests = getPendingRequests()
  const activeEmployees = employees.filter(emp => emp.status === 'active')
  const departments = new Set(employees.map(emp => emp.department))

  const stats = [
    {
      title: "Total Employees",
      value: employees.length.toString(),
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "bg-primary",
    },
    {
      title: "Active Departments",
      value: departments.size.toString(),
      change: "+2",
      changeType: "increase",
      icon: Building2,
      color: "bg-secondary",
    },
    {
      title: "Pending Requests",
      value: pendingRequests.length.toString(),
      change: "-5",
      changeType: "decrease",
      icon: Clock,
      color: "bg-warning",
    },
    {
      title: "This Month Leaves",
      value: leaveRequests.filter(req => {
        const now = new Date()
        const requestMonth = req.createdAt.getMonth()
        const requestYear = req.createdAt.getFullYear()
        return requestMonth === now.getMonth() && requestYear === now.getFullYear()
      }).length.toString(),
      change: "+8%",
      changeType: "increase",
      icon: Calendar,
      color: "bg-info",
    },
  ]

  const recentLeaveRequests = leaveRequests.slice(0, 3)

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
                        {request.leaveType.charAt(0).toUpperCase() + request.leaveType.slice(1)} • {request.days} day{request.days > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={getStatusBadge(request.status)}>{request.status}</div>
                    <p className="text-xs text-base-content/60 mt-1">{request.startDate.toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/leave-requests')}>View All</button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="btn btn-outline btn-primary" onClick={() => navigate('/employees')}>
                <Users className="h-5 w-5" />
                Manage Employees
              </button>
              <button className="btn btn-outline btn-secondary" onClick={() => navigate('/leave-requests')}>
                <Calendar className="h-5 w-5" />
                Leave Requests
              </button>
              <button className="btn btn-outline btn-accent" onClick={() => navigate('/departments')}>
                <Building2 className="h-5 w-5" />
                Departments
              </button>
              <button className="btn btn-outline btn-info" onClick={() => navigate('/reports')}>
                <TrendingUp className="h-5 w-5" />
                Reports
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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(departments).map((dept) => {
                  const deptEmployees = employees.filter(emp => emp.department === dept && emp.status === 'active')
                  return (
                    <tr key={dept}>
                      <td>{dept}</td>
                      <td>{deptEmployees.length}</td>
                      <td>
                        <div className={`badge ${deptEmployees.length > 0 ? 'badge-success' : 'badge-warning'}`}>
                          {deptEmployees.length > 0 ? 'Active' : 'No Staff'}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/departments')}>
              View All Departments
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
