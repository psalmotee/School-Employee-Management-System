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
  Users,
  Shield,
} from "lucide-react";
import type { Employee } from "../../types";
import { useDepartments } from "../../hooks/useDepartments";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

interface EmployeeFormData {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: "employee" | "manager" | "admin";
  salary: number;
  hireDate: string;
  status: "active" | "inactive" | "terminated" | "EmployeeStatus";
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
}

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
          role: employee.role || "employee",
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
    if (employee) {
      reset({
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
        role: employee.role || "employee",
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

    const formattedData = {
      ...rest,
      salary: Number(data.salary),
      emergencyContact,
    };

    const employeeData = {
      ...formattedData,
      role: data.role,
      dateOfBirth: employee?.dateOfBirth,
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
          <Button variant="ghost" size="sm" shape="circle" onClick={onClose}>
            <X size={20} />
          </Button>
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
                  <Input
                    label="Employee ID"
                    icon={User}
                    placeholder="e.g. EMP-001"
                    error={errors.employeeId?.message}
                    {...register("employeeId", {
                      required: "Employee ID is required",
                    })}
                  />
                  <Input
                    label="Full Name"
                    icon={User}
                    placeholder="John Doe"
                    error={errors.name?.message}
                    {...register("name", { required: "Name is required" })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    icon={Mail}
                    placeholder="johndoe@example.com"
                    error={errors.email?.message}
                    {...register("email", { required: "Email is required" })}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    icon={Phone}
                    placeholder="+1 (555) 123-4567"
                    error={errors.phone?.message}
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                  />
                  <Input
                    label="Address"
                    icon={MapPin}
                    placeholder="123 Main St, Anytown, USA"
                    {...register("address")}
                  />
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
                  <Select
                    label="Department"
                    icon={Building2}
                    error={errors.department?.message}
                    disabled={departmentsLoading}
                    {...register("department", {
                      required: "Department is required",
                    })}
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </Select>
                  <Input
                    label="Position"
                    icon={Briefcase}
                    placeholder="Software Engineer"
                    error={errors.position?.message}
                    {...register("position", {
                      required: "Position is required",
                    })}
                  />
                  <Select
                    label="Role"
                    icon={Shield}
                    error={errors.role?.message}
                    {...register("role", {
                      required: "Role is required",
                    })}
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </Select>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Salary</span>
                    </label>
                    <div className="join">
                      <span className="join-item btn btn-ghost no-animation">
                        <DollarSign size={18} />
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
                  <Input
                    label="Hire Date"
                    type="date"
                    icon={Calendar}
                    error={errors.hireDate?.message}
                    {...register("hireDate", {
                      required: "Hire date is required",
                    })}
                  />
                  <Select
                    label="Status"
                    icon={Users}
                    error={errors.status?.message}
                    {...register("status", {
                      required: "Status is required",
                    })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="terminated">Terminated</option>
                  </Select>
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
                  <Input
                    label="Name"
                    icon={User}
                    placeholder="Jane Doe"
                    {...register("emergencyContactName")}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    icon={Phone}
                    placeholder="+1 (555) 987-6543"
                    {...register("emergencyContactPhone")}
                  />
                  <Input
                    label="Relationship"
                    icon={Users}
                    placeholder="Spouse"
                    {...register("emergencyContactRelationship")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-base-200 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : employee
                ? "Update Employee"
                : "Create Employee"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
