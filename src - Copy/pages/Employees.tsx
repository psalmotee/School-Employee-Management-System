"use client"

import type React from "react"
import { useState } from "react"
import { Users, Plus, Search, Edit, Trash2, Mail, Phone, MapPin, Eye } from "lucide-react"
import { useEmployees } from "../hooks/useEmployees"
import { useAuth } from "../contexts/AuthContext"
import EmployeeForm from "../components/Employees/EmployeeForm"
import type { Employee } from "../types"

const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const { userProfile } = useAuth()
  const { employees, loading, error, createEmployee, updateEmployee, deleteEmployee } = useEmployees()

  const departments = ["Teaching Staff", "Administration", "IT Department", "Human Resources", "Maintenance"]

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !selectedDepartment || employee.department === selectedDepartment
    const matchesStatus = !selectedStatus || employee.status === selectedStatus

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const canManageEmployees = userProfile?.role === "admin" || userProfile?.role === "manager"

  const handleCreateEmployee = async (employeeData: Omit<Employee, "id" | "createdAt" | "updatedAt">) => {
    try {
      await createEmployee(employeeData)
      setShowForm(false)
    } catch (error) {
      console.error("Failed to create employee:", error)
    }
    
  }

  const handleUpdateEmployee = async (employeeData: Omit<Employee, "id" | "createdAt" | "updatedAt">) => {
    if (!editingEmployee) return
    try {
      await updateEmployee(editingEmployee.id, employeeData)
      setEditingEmployee(null)
      setShowForm(false)
    } catch (error) {
      console.error("Failed to update employee:", error)
    }
  }

  const handleDeleteEmployee = async (id: string) => {
    try {
      await deleteEmployee(id)
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error("Failed to delete employee:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      active: "badge badge-success",
      inactive: "badge badge-warning",
      terminated: "badge badge-error",
    }
    return badges[status as keyof typeof badges] || "badge badge-neutral"
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Employees
          </h1>
          <p className="text-base-content/60">Manage your school staff members</p>
        </div>
        {canManageEmployees && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus className="h-5 w-5" />
            Add Employee
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="form-control flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
              </div>
            </div>

            <div className="form-control">
              <select
                className="select select-bordered"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <select
                className="select select-bordered"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-12">
                      <span className="text-lg font-bold">
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{employee.name}</h3>
                    <p className="text-sm text-base-content/60">{employee.employeeId}</p>
                  </div>
                </div>
                <div className={getStatusBadge(employee.status)}>{employee.status}</div>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-base-content/60" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-base-content/60" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-base-content/60" />
                  <span className="truncate">{employee.department}</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="font-medium">{employee.position}</p>
                <p className="text-sm text-base-content/60">Hired: {employee.hireDate.toLocaleDateString()}</p>
              </div>

              <div className="card-actions justify-end mt-4">
                <button className="btn btn-ghost btn-sm">
                  <Eye className="h-4 w-4" />
                </button>
                {canManageEmployees && (
                  <>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setEditingEmployee(employee)
                        setShowForm(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() => setShowDeleteConfirm(employee.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No employees found</h3>
          <p className="text-base-content/60 mb-4">
            {searchTerm || selectedDepartment || selectedStatus
              ? "Try adjusting your search criteria"
              : "Get started by adding your first employee"}
          </p>
          {canManageEmployees && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Plus className="h-5 w-5" />
              Add Employee
            </button>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Employees</div>
          <div className="stat-value text-primary">{employees.length}</div>
          <div className="stat-desc">All departments</div>
        </div>

        <div className="stat">
          <div className="stat-title">Active</div>
          <div className="stat-value text-success">{employees.filter((e) => e.status === "active").length}</div>
          <div className="stat-desc">Currently working</div>
        </div>

        <div className="stat">
          <div className="stat-title">Departments</div>
          <div className="stat-value text-secondary">{new Set(employees.map((e) => e.department)).size}</div>
          <div className="stat-desc">Active departments</div>
        </div>
      </div>

      {/* Employee Form Modal */}
      {showForm && (
        <EmployeeForm
          employee={editingEmployee || undefined}
          onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
          onClose={() => {
            setShowForm(false)
            setEditingEmployee(null)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this employee? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={() => handleDeleteEmployee(showDeleteConfirm)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Employees
