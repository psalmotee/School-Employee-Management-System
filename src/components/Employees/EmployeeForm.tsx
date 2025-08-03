"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { X, User, Mail, Phone, Building2, Briefcase, Calendar, DollarSign, MapPin } from "lucide-react"
import type { Employee } from "../../types"

interface EmployeeFormProps {
  employee?: Employee
  onSubmit: (data: Omit<Employee, "id" | "createdAt" | "updatedAt">) => Promise<void>
  onClose: () => void
  loading?: boolean
}

interface EmployeeFormData {
  employeeId: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  salary: number
  hireDate: string
  status: "active" | "inactive" | "terminated"
  address?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelationship?: string
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSubmit, onClose, loading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    defaultValues: employee
      ? {
          ...employee,
          hireDate: employee.hireDate.toISOString().split("T")[0],
          emergencyContactName: employee.emergencyContact?.name || "",
          emergencyContactPhone: employee.emergencyContact?.phone || "",
          emergencyContactRelationship: employee.emergencyContact?.relationship || "",
        }
      : {
          status: "active",
          hireDate: new Date().toISOString().split("T")[0],
        },
  })

  const departments = [
    "Administration",
    "Teaching Staff",
    "IT Department",
    "Human Resources",
    "Finance",
    "Maintenance",
    "Security",
    "Library",
  ]

  const handleFormSubmit = async (data: EmployeeFormData) => {
    const employeeData = {
      ...data,
      hireDate: new Date(data.hireDate),
      emergencyContact: data.emergencyContactName
        ? {
            name: data.emergencyContactName,
            phone: data.emergencyContactPhone || "",
            relationship: data.emergencyContactRelationship || "",
          }
        : undefined,
    }

    // Remove emergency contact fields from main object
    const { emergencyContactName, emergencyContactPhone, emergencyContactRelationship, ...cleanData } = employeeData

    await onSubmit(cleanData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-base-200">
          <h2 className="text-2xl font-bold">{employee ? "Edit Employee" : "Add New Employee"}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title text-lg">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Employee ID *</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="EMP001"
                      className={`input input-bordered w-full pl-10 ${errors.employeeId ? "input-error" : ""}`}
                      {...register("employeeId", { required: "Employee ID is required" })}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                  </div>
                  {errors.employeeId && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.employeeId.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name *</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="John Doe"
                      className={`input input-bordered w-full pl-10 ${errors.name ? "input-error" : ""}`}
                      {...register("name", { required: "Name is required" })}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                  </div>
                  {errors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.name.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email *</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="john.doe@school.edu"
                      className={`input input-bordered w-full pl-10 ${errors.email ? "input-error" : ""}`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                  </div>
                  {errors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.email.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone *</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className={`input input-bordered w-full pl-10 ${errors.phone ? "input-error" : ""}`}
                      {...register("phone", { required: "Phone is required" })}
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                  </div>
                  {errors.phone && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.phone.message}</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title text-lg">Job Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Department *</span>
                  </label>
                  <div className="relative">
                    <select
                      className={`select select-bordered w-full pl-10 ${errors.department ? "select-error" : ""}`}
                      {...register("department", { required: "Department is required" })}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40 pointer-events-none" />
                  </div>
                  {errors.department && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.department.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Position *</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Mathematics Teacher"
                      className={`input input-bordered w-full pl-10 ${errors.position ? "input-error" : ""}`}
                      {...register("position", { required: "Position is required" })}
                    />
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                  </div>
                  {errors.position && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.position.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Salary *</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="50000"
                      className={`input input-bordered w-full pl-10 ${errors.salary ? "input-error" : ""}`}
                      {...register("salary", {
                        required: "Salary is required",
                        min: { value: 0, message: "Salary must be positive" },
                      })}
                    />
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                  </div>
                  {errors.salary && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.salary.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Hire Date *</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className={`input input-bordered w-full pl-10 ${errors.hireDate ? "input-error" : ""}`}
                      {...register("hireDate", { required: "Hire date is required" })}
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                  </div>
                  {errors.hireDate && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.hireDate.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Status *</span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${errors.status ? "select-error" : ""}`}
                    {...register("status", { required: "Status is required" })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="terminated">Terminated</option>
                  </select>
                  {errors.status && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.status.message}</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title text-lg">Additional Information</h3>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <div className="relative">
                    <textarea
                      placeholder="123 Main St, City, State 12345"
                      className="textarea textarea-bordered w-full pl-10 pt-3"
                      rows={2}
                      {...register("address")}
                    />
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Emergency Contact Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      className="input input-bordered w-full"
                      {...register("emergencyContactName")}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Emergency Contact Phone</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 987-6543"
                      className="input input-bordered w-full"
                      {...register("emergencyContactPhone")}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Relationship</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Spouse"
                      className="input input-bordered w-full"
                      {...register("emergencyContactRelationship")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-base-200">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className={`btn btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? "Saving..." : employee ? "Update Employee" : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmployeeForm
