"use client";

import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  Lock,
} from "lucide-react";
import type { Employee } from "../../types";
import { useDepartments } from "../../hooks/useDepartments";

// EmployeeFormData interface with corrected fields for the form
interface EmployeeFormData {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status: "active" | "inactive" | "terminated";
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
}

// Update onSubmit prop type to match the data sent from the form
interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (
    data: Omit<Employee, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  onSubmit,
  onClose,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    defaultValues: employee
      ? {
          employeeId: employee.employeeId,
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          department: employee.department,
          position: employee.position,
          salary: employee.salary,
          hireDate: employee.hireDate?.toISOString().split("T")[0],
          status: employee.status,
          address: employee.address,
          emergencyContactName: employee.emergencyContact?.name,
          emergencyContactPhone: employee.emergencyContact?.phone,
          emergencyContactRelationship: employee.emergencyContact?.relationship,
        }
      : {},
  });

  const { departments, loading: departmentsLoading } = useDepartments();

  useEffect(() => {
    // Reset form when employee prop changes (e.g., for editing a different employee)
    if (employee) {
      reset({
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
        salary: employee.salary,
        hireDate: employee.hireDate?.toISOString().split("T")[0],
        status: employee.status,
        address: employee.address,
        emergencyContactName: employee.emergencyContact?.name,
        emergencyContactPhone: employee.emergencyContact?.phone,
        emergencyContactRelationship: employee.emergencyContact?.relationship,
      });
    }
  }, [employee, reset]);

  const handleFormSubmit = async (data: EmployeeFormData) => {
    const {
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      ...rest
    } = data;
    const emergencyContact =
      emergencyContactName &&
      emergencyContactPhone &&
      emergencyContactRelationship
        ? {
            name: emergencyContactName,
            phone: emergencyContactPhone,
            relationship: emergencyContactRelationship,
          }
        : undefined;

    // Ensure salary is a number before passing to onSubmit
    const formattedData = {
      ...rest,
      salary: Number(data.salary),
      // hireDate is already a string
      emergencyContact,
    };

    // The form no longer handles password, so we omit it from the submission data
    const employeeData = {
      ...formattedData,
      role: employee?.role || "employee", // Default to 'employee' role for new employee
      dateOfBirth: employee?.dateOfBirth, // Preserve date of birth if it exists
    };

    await onSubmit(
      employeeData as Omit<Employee, "id" | "createdAt" | "updatedAt">
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-box p-6 shadow-xl max-w-4xl w-full mx-4 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center pb-4 border-b border-base-200">
          <h2 className="text-2xl font-bold">
            {employee ? "Edit Employee" : "Create New Employee"}
          </h2>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold mb-4 flex items-center">
                  <User className="mr-2" /> Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Employee ID</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. EMP-001"
                      className={`input input-bordered w-full ${
                        errors.employeeId ? "input-error" : ""
                      }`}
                      {...register("employeeId", {
                        required: "Employee ID is required",
                      })}
                    />
                    {errors.employeeId && (
                      <p className="text-error text-sm mt-1">
                        {errors.employeeId.message}
                      </p>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className={`input input-bordered w-full ${
                        errors.name ? "input-error" : ""
                      }`}
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <p className="text-error text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="johndoe@example.com"
                      className={`input input-bordered w-full ${
                        errors.email ? "input-error" : ""
                      }`}
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && (
                      <p className="text-error text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Phone</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className={`input input-bordered w-full ${
                        errors.phone ? "input-error" : ""
                      }`}
                      {...register("phone", {
                        required: "Phone number is required",
                      })}
                    />
                    {errors.phone && (
                      <p className="text-error text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Address</span>
                    </label>
                    <input
                      type="text"
                      placeholder="123 Main St, Anytown, USA"
                      className="input input-bordered w-full"
                      {...register("address")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold mb-4 flex items-center">
                  <Briefcase className="mr-2" /> Job Details
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Department</span>
                    </label>
                    <select
                      className={`select select-bordered w-full ${
                        errors.department ? "select-error" : ""
                      }`}
                      {...register("department", {
                        required: "Department is required",
                      })}
                      disabled={departmentsLoading}
                    >
                      <option value="">Select a department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    {errors.department && (
                      <p className="text-error text-sm mt-1">
                        {errors.department.message}
                      </p>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Position</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Software Engineer"
                      className={`input input-bordered w-full ${
                        errors.position ? "input-error" : ""
                      }`}
                      {...register("position", {
                        required: "Position is required",
                      })}
                    />
                    {errors.position && (
                      <p className="text-error text-sm mt-1">
                        {errors.position.message}
                      </p>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Salary</span>
                    </label>
                    <div className="join">
                      <span className="join-item btn btn-ghost no-animation">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="50000"
                        className={`input input-bordered w-full join-item ${
                          errors.salary ? "input-error" : ""
                        }`}
                        {...register("salary", {
                          required: "Salary is required",
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    {errors.salary && (
                      <p className="text-error text-sm mt-1">
                        {errors.salary.message}
                      </p>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Hire Date</span>
                    </label>
                    <input
                      type="date"
                      className={`input input-bordered w-full ${
                        errors.hireDate ? "input-error" : ""
                      }`}
                      {...register("hireDate", {
                        required: "Hire date is required",
                      })}
                    />
                    {errors.hireDate && (
                      <p className="text-error text-sm mt-1">
                        {errors.hireDate.message}
                      </p>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Status</span>
                    </label>
                    <select
                      className={`select select-bordered w-full ${
                        errors.status ? "select-error" : ""
                      }`}
                      {...register("status", {
                        required: "Status is required",
                      })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="terminated">Terminated</option>
                    </select>
                    {errors.status && (
                      <p className="text-error text-sm mt-1">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="card bg-base-200 shadow-md md:col-span-2">
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold mb-4 flex items-center">
                  <Phone className="mr-2" /> Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Name</span>
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
                      <span className="label-text">Phone</span>
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
          <div className="flex justify-end gap-4 pt-4 border-t border-base-200 mt-6">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : employee
                ? "Update Employee"
                : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
