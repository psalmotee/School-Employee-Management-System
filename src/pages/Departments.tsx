import type React from "react"
import { useState } from "react"
import { Building2, Users, Plus, Edit, Trash2, Search } from "lucide-react"
import { useEmployees } from "../hooks/useEmployees"
import { useAuth } from "../contexts/AuthContext"

const Departments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const { employees } = useEmployees()
  const { userProfile } = useAuth()

  const canManageDepartments = userProfile?.role === "admin" || userProfile?.role === "manager"

  // Get unique departments from employees
  const departments = Array.from(new Set(employees.map(emp => emp.department)))
    .map(deptName => {
      const deptEmployees = employees.filter(emp => emp.department === deptName)
      const activeEmployees = deptEmployees.filter(emp => emp.status === 'active')
      const manager = deptEmployees.find(emp => emp.position.toLowerCase().includes('manager') || emp.position.toLowerCase().includes('head'))
      
      return {
        id: deptName.toLowerCase().replace(/\s+/g, '-'),
        name: deptName,
        description: `${deptName} department`,
        employeeCount: deptEmployees.length,
        activeCount: activeEmployees.length,
        manager: manager?.name || 'No manager assigned',
        employees: deptEmployees
      }
    })

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Departments
          </h1>
          <p className="text-base-content/60">Manage school departments and staff allocation</p>
        </div>
        {canManageDepartments && (
          <button className="btn btn-primary">
            <Plus className="h-5 w-5" />
            Add Department
          </button>
        )}
      </div>

      {/* Search */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="form-control">
            <div className="relative">
              <input
                type="text"
                placeholder="Search departments..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((department) => (
          <div key={department.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary rounded-lg">
                    <Building2 className="h-6 w-6 text-primary-content" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{department.name}</h3>
                    <p className="text-sm text-base-content/60">{department.description}</p>
                  </div>
                </div>
                {canManageDepartments && (
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                      •••
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li>
                        <button>
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                      </li>
                      <li>
                        <button className="text-error">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="stats stats-vertical shadow mt-4">
                <div className="stat">
                  <div className="stat-title">Total Staff</div>
                  <div className="stat-value text-primary">{department.employeeCount}</div>
                  <div className="stat-desc">{department.activeCount} active</div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-base-content/60">Manager</p>
                <p className="font-medium">{department.manager}</p>
              </div>

              <div className="card-actions justify-end mt-4">
                <button className="btn btn-ghost btn-sm">
                  <Users className="h-4 w-4" />
                  View Staff
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDepartments.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No departments found</h3>
          <p className="text-base-content/60 mb-4">
            {searchTerm ? "Try adjusting your search criteria" : "No departments have been created yet"}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Departments</div>
          <div className="stat-value text-primary">{departments.length}</div>
          <div className="stat-desc">Active departments</div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Staff</div>
          <div className="stat-value text-secondary">{employees.length}</div>
          <div className="stat-desc">Across all departments</div>
        </div>

        <div className="stat">
          <div className="stat-title">Average per Dept</div>
          <div className="stat-value text-accent">
            {departments.length > 0 ? Math.round(employees.length / departments.length) : 0}
          </div>
          <div className="stat-desc">Employees per department</div>
        </div>
      </div>
    </div>
  )
}

export default Departments