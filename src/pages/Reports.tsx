import type React from "react"
import { useState } from "react"
import { FileText, Download, Calendar, Users, TrendingUp, BarChart3, PieChart } from "lucide-react"
import { useEmployees } from "../hooks/useEmployees"
import { useLeaveRequests } from "../hooks/useLeaveRequests"
import { useAuth } from "../contexts/AuthContext"

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState("overview")
  const { employees } = useEmployees()
  const { leaveRequests } = useLeaveRequests()
  const { userProfile } = useAuth()

  const canAccessReports = userProfile?.role === "admin" || userProfile?.role === "manager"

  if (!canAccessReports) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="alert alert-warning">
          <FileText className="h-5 w-5" />
          <span>Access denied. Manager or Administrator privileges required.</span>
        </div>
      </div>
    )
  }

  const reportTypes = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "employees", label: "Employee Report", icon: Users },
    { id: "leaves", label: "Leave Report", icon: Calendar },
    { id: "departments", label: "Department Report", icon: PieChart },
  ]

  const generateEmployeeStats = () => {
    const activeEmployees = employees.filter(emp => emp.status === 'active')
    const departments = new Set(employees.map(emp => emp.department))
    
    return {
      total: employees.length,
      active: activeEmployees.length,
      inactive: employees.filter(emp => emp.status === 'inactive').length,
      terminated: employees.filter(emp => emp.status === 'terminated').length,
      departments: departments.size
    }
  }

  const generateLeaveStats = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const thisMonthRequests = leaveRequests.filter(req => {
      const reqMonth = req.createdAt.getMonth()
      const reqYear = req.createdAt.getFullYear()
      return reqMonth === currentMonth && reqYear === currentYear
    })

    return {
      total: leaveRequests.length,
      pending: leaveRequests.filter(req => req.status === 'pending').length,
      approved: leaveRequests.filter(req => req.status === 'approved').length,
      rejected: leaveRequests.filter(req => req.status === 'rejected').length,
      thisMonth: thisMonthRequests.length
    }
  }

  const employeeStats = generateEmployeeStats()
  const leaveStats = generateLeaveStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Reports
          </h1>
          <p className="text-base-content/60">Generate and view system reports</p>
        </div>
        <button className="btn btn-primary">
          <Download className="h-5 w-5" />
          Export Report
        </button>
      </div>

      {/* Report Type Selector */}
      <div className="tabs tabs-boxed">
        {reportTypes.map((report) => {
          const Icon = report.icon
          return (
            <button
              key={report.id}
              className={`tab gap-2 ${selectedReport === report.id ? "tab-active" : ""}`}
              onClick={() => setSelectedReport(report.id)}
            >
              <Icon className="h-4 w-4" />
              {report.label}
            </button>
          )
        })}
      </div>

      {/* Report Content */}
      <div className="min-h-[400px]">
        {selectedReport === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stat bg-base-100 shadow rounded-lg">
                <div className="stat-figure text-primary">
                  <Users className="h-8 w-8" />
                </div>
                <div className="stat-title">Total Employees</div>
                <div className="stat-value text-primary">{employeeStats.total}</div>
                <div className="stat-desc">{employeeStats.active} active</div>
              </div>

              <div className="stat bg-base-100 shadow rounded-lg">
                <div className="stat-figure text-secondary">
                  <Calendar className="h-8 w-8" />
                </div>
                <div className="stat-title">Leave Requests</div>
                <div className="stat-value text-secondary">{leaveStats.total}</div>
                <div className="stat-desc">{leaveStats.pending} pending</div>
              </div>

              <div className="stat bg-base-100 shadow rounded-lg">
                <div className="stat-figure text-accent">
                  <PieChart className="h-8 w-8" />
                </div>
                <div className="stat-title">Departments</div>
                <div className="stat-value text-accent">{employeeStats.departments}</div>
                <div className="stat-desc">Active departments</div>
              </div>

              <div className="stat bg-base-100 shadow rounded-lg">
                <div className="stat-figure text-info">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <div className="stat-title">This Month</div>
                <div className="stat-value text-info">{leaveStats.thisMonth}</div>
                <div className="stat-desc">Leave requests</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title">Employee Status Distribution</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Active</span>
                      <div className="flex items-center gap-2">
                        <progress className="progress progress-success w-32" value={employeeStats.active} max={employeeStats.total}></progress>
                        <span className="text-sm">{employeeStats.active}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Inactive</span>
                      <div className="flex items-center gap-2">
                        <progress className="progress progress-warning w-32" value={employeeStats.inactive} max={employeeStats.total}></progress>
                        <span className="text-sm">{employeeStats.inactive}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Terminated</span>
                      <div className="flex items-center gap-2">
                        <progress className="progress progress-error w-32" value={employeeStats.terminated} max={employeeStats.total}></progress>
                        <span className="text-sm">{employeeStats.terminated}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title">Leave Request Status</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Approved</span>
                      <div className="flex items-center gap-2">
                        <progress className="progress progress-success w-32" value={leaveStats.approved} max={leaveStats.total}></progress>
                        <span className="text-sm">{leaveStats.approved}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending</span>
                      <div className="flex items-center gap-2">
                        <progress className="progress progress-warning w-32" value={leaveStats.pending} max={leaveStats.total}></progress>
                        <span className="text-sm">{leaveStats.pending}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Rejected</span>
                      <div className="flex items-center gap-2">
                        <progress className="progress progress-error w-32" value={leaveStats.rejected} max={leaveStats.total}></progress>
                        <span className="text-sm">{leaveStats.rejected}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === "employees" && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Employee Report</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Status</th>
                      <th>Hire Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td>{employee.employeeId}</td>
                        <td>{employee.name}</td>
                        <td>{employee.department}</td>
                        <td>{employee.position}</td>
                        <td>
                          <div className={`badge ${
                            employee.status === 'active' ? 'badge-success' :
                            employee.status === 'inactive' ? 'badge-warning' : 'badge-error'
                          }`}>
                            {employee.status}
                          </div>
                        </td>
                        <td>{employee.hireDate.toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedReport === "leaves" && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Leave Requests Report</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Days</th>
                      <th>Status</th>
                      <th>Applied Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((request) => (
                      <tr key={request.id}>
                        <td>{request.employeeName}</td>
                        <td>
                          <div className="badge badge-outline">
                            {request.leaveType.charAt(0).toUpperCase() + request.leaveType.slice(1)}
                          </div>
                        </td>
                        <td>{request.startDate.toLocaleDateString()}</td>
                        <td>{request.endDate.toLocaleDateString()}</td>
                        <td>{request.days}</td>
                        <td>
                          <div className={`badge ${
                            request.status === 'approved' ? 'badge-success' :
                            request.status === 'rejected' ? 'badge-error' : 'badge-warning'
                          }`}>
                            {request.status}
                          </div>
                        </td>
                        <td>{request.createdAt.toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedReport === "departments" && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Department Report</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Total Employees</th>
                      <th>Active</th>
                      <th>Inactive</th>
                      <th>Terminated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(new Set(employees.map(emp => emp.department))).map((dept) => {
                      const deptEmployees = employees.filter(emp => emp.department === dept)
                      const active = deptEmployees.filter(emp => emp.status === 'active').length
                      const inactive = deptEmployees.filter(emp => emp.status === 'inactive').length
                      const terminated = deptEmployees.filter(emp => emp.status === 'terminated').length
                      
                      return (
                        <tr key={dept}>
                          <td className="font-medium">{dept}</td>
                          <td>{deptEmployees.length}</td>
                          <td>
                            <div className="badge badge-success">{active}</div>
                          </td>
                          <td>
                            <div className="badge badge-warning">{inactive}</div>
                          </td>
                          <td>
                            <div className="badge badge-error">{terminated}</div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports