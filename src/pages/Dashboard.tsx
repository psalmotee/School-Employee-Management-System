"use client"

import type React from "react"
import { Users, Calendar, Building2, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const { employees, loading: employeesLoading } = useEmployees();
  const { leaveRequests, loading: leaveRequestsLoading } = useLeaveRequests();
  const { departments, loading: departmentsLoading } = useDepartments();

  const totalEmployees = employees.length;
  const activeDepartments = departments.length;
  const pendingLeaveRequests = leaveRequests.filter(
    (req) => req.status === "pending"
  ).length;
  const thisMonthLeaves = leaveRequests.filter((req) => {
    const now = new Date();
    const reqDate = new Date(req.startDate);
    return (
      reqDate.getMonth() === now.getMonth() &&
      reqDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const recentLeaveRequestsDisplay = leaveRequests
    .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime())
    .slice(0, 3); // Show top 3 recent requests

  const stats = [
    {
      title: "Total Employees",
      value: employeesLoading ? "..." : totalEmployees.toString(),
      change: "+12%", // Placeholder, would need historical data for real change
      changeType: "increase",
      icon: Users,
      color: "bg-primary",
    },
    {
      title: "Active Departments",
      value: departmentsLoading ? "..." : activeDepartments.toString(),
      change: "+2", // Placeholder
      changeType: "increase",
      icon: Building2,
      color: "bg-secondary",
    },
    {
      title: "Pending Requests",
      value: leaveRequestsLoading ? "..." : pendingLeaveRequests.toString(),
      change: "-5", // Placeholder
      changeType: "decrease",
      icon: Clock,
      color: "bg-warning",
    },
    {
      title: "This Month Leaves",
      value: leaveRequestsLoading ? "..." : thisMonthLeaves.toString(),
      change: "+8%", // Placeholder
      changeType: "increase",
      icon: Calendar,
      color: "bg-info",
    },
  ];

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
    <div className="p-6 space-y-6">
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
              {leaveRequestsLoading ? (
                <div className="text-center">
                  Loading recent leave requests...
                </div>
              ) : recentLeaveRequestsDisplay.length === 0 ? (
                <div className="text-center text-base-content/60">
                  No recent leave requests.
                </div>
              ) : (
                recentLeaveRequestsDisplay.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-base-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <p className="font-medium">{request.employeeName}</p>
                        <p className="text-sm text-base-content/60">
                          {request.leaveType} • {request.days} day
                          {request.days > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={getStatusBadge(request.status)}>
                        {request.status}
                      </div>
                      <p className="text-xs text-base-content/60 mt-1">
                        {new Date(request.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="card-actions justify-end">
              <Link to="/leave-requests" className="btn btn-primary btn-sm">
                View All
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/employees" className="btn btn-outline btn-primary">
                <Users className="h-5 w-5" />
                Add Employee
              </Link>
              <Link
                to="/leave-requests"
                className="btn btn-outline btn-secondary"
              >
                <Calendar className="h-5 w-5" />
                New Leave Request
              </Link>
              <Link to="/departments" className="btn btn-outline btn-accent">
                <Building2 className="h-5 w-5" />
                Manage Departments
              </Link>
              <Link to="/reports" className="btn btn-outline btn-info">
                <TrendingUp className="h-5 w-5" />
                View Reports
              </Link>
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
                  <th>Manager</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {departmentsLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      Loading department data...
                    </td>
                  </tr>
                ) : departments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-4 text-base-content/60"
                    >
                      No departments found.
                    </td>
                  </tr>
                ) : (
                  departments.map((dept) => (
                    <tr key={dept.id}>
                      <td>{dept.name}</td>
                      <td>{dept.employeeCount}</td>
                      <td>{dept.managerName || "N/A"}</td>
                      <td>
                        <div className="badge badge-success">Active</div>{" "}
                        {/* Assuming all fetched departments are active for now */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
