"use client"

import type React from "react"
import { useState, useMemo } from "react" // Added useMemo
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Eye,
} from "lucide-react"
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )

  const { userProfile } = useAuth()
  const {
    employees,
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees()

  // Use useMemo to prevent re-computation on every render
  const departments = useMemo(() => {
    const departmentSet = new Set(employees.map((e) => e.department))
    return ["", ...Array.from(departmentSet)]
  }, [employees])

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment =
      !selectedDepartment || employee.department === selectedDepartment
    const matchesStatus =
      !selectedStatus || employee.status === selectedStatus

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const handleCreateEmployee = async (
    data: Omit<Employee, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await createEmployee(data)
      setShowForm(false)
    } catch (e) {
      console.error("Failed to create employee:", e)
    }
  }

  const handleUpdateEmployee = async (
    data: Omit<Employee, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!editingEmployee) return
    try {
      await updateEmployee(editingEmployee.id, data)
      setShowForm(false)
      setEditingEmployee(null)
    } catch (e) {
      console.error("Failed to update employee:", e)
    }
  }

  const handleDeleteEmployee = async (employeeId: string | null) => {
    if (!employeeId) return
    try {
      await deleteEmployee(employeeId)
      setShowDeleteConfirm(null)
    } catch (e) {
      console.error("Failed to delete employee:", e)
    }
  }

  // Determine if the current user has permission to manage employees
  const canManageEmployees =
    userProfile?.role === "admin" || userProfile?.role === "manager"

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-base-content">
          <Users className="inline-block mr-2" size={32} /> Employees
        </h1>
        {/* Only show the 'Add Employee' button for admins and managers */}
        {canManageEmployees && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingEmployee(null)
              setShowForm(true)
            }}
          >
            <Plus size={20} /> Add Employee
          </button>
        )}
      </div>

      {/* Stats Section */}
      <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 mb-6 w-full">
        <div className="stat">
          <div className="stat-title">Total Employees</div>
          <div className="stat-value">{employees.length}</div>
          <div className="stat-desc">As of today</div>
        </div>

        <div className="stat">
          <div className="stat-title">Active Employees</div>
          <div className="stat-value text-success">
            {employees.filter((e) => e.status === "active").length}
          </div>
          <div className="stat-desc">Currently working</div>
        </div>

        <div className="stat">
          <div className="stat-title">Departments</div>
          <div className="stat-value text-secondary">
            {new Set(employees.map((e) => e.department)).size}
          </div>
          <div className="stat-desc">Active departments</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1">
          <label className="input input-bordered flex items-center gap-2">
            <Search size={16} />
            <input
              type="text"
              className="grow"
              placeholder="Search by name, email, or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>
        <div className="w-full sm:w-auto">
          <select
            className="select select-bordered w-full sm:w-48"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department || "Unassigned"}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <select
            className="select select-bordered w-full sm:w-48"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Position</th>
              <th>Status</th>
              {/* Only show the 'Actions' column for admins and managers */}
              {canManageEmployees && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="font-bold">{employee.name}</div>
                  </div>
                </td>
                <td>{employee.department}</td>
                <td>{employee.position}</td>
                <td>
                  <span
                    className={`badge ${
                      employee.status === "active"
                        ? "badge-success"
                        : employee.status === "on-leave"
                        ? "badge-info"
                        : "badge-error"
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>
                {/* Actions column with conditional buttons */}
                {canManageEmployees && (
                  <td className="text-right">
                    <button
                      className="btn btn-ghost btn-sm text-info"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-warning"
                      title="Edit"
                      onClick={() => {
                        setEditingEmployee(employee)
                        setShowForm(true)
                      }}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-error"
                      title="Delete"
                      onClick={() => setShowDeleteConfirm(employee.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Employee Form Modal */}
      {showForm && (
        <EmployeeForm
          employee={editingEmployee || undefined}
          onSubmit={
            editingEmployee ? handleUpdateEmployee : handleCreateEmployee
          }
          onClose={() => {
            setShowForm(false)
            setEditingEmployee(null)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this employee? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="btn btn-outline"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => handleDeleteEmployee(showDeleteConfirm)}
              >
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
