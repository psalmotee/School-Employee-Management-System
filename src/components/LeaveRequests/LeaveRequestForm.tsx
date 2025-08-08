"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { Employee, UserRole } from "../../types";
import { useDepartments } from "../../hooks/useDepartments";
import { Save, X } from "lucide-react";

interface EmployeeFormProps {
  employee?: Employee | null;
  onSubmit: (
    employeeData: Omit<Employee, "id" | "createdAt" | "updatedAt" | "userId">,
    password?: string
  ) => Promise<void>;
  onClose: () => void;
  loading: boolean;
  error: string | null;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  onSubmit,
  onClose,
  loading,
  error,
}) => {
  const {
    departments,
    loading: departmentsLoading,
    error: departmentsError,
  } = useDepartments();

  const [name, setName] = useState(employee?.name || "");
  const [email, setEmail] = useState(employee?.email || "");
  const [phone, setPhone] = useState(employee?.phone || "");
  const [address, setAddress] = useState(employee?.address || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    employee?.dateOfBirth?.toISOString().split("T")[0] || ""
  );
  const [hireDate, setHireDate] = useState(
    employee?.hireDate?.toISOString().split("T")[0] || ""
  );
  const [jobTitle, setJobTitle] = useState(employee?.jobTitle || "");
  const [departmentId, setDepartmentId] = useState(
    employee?.departmentId || ""
  );
  const [salary, setSalary] = useState(employee?.salary || 0);
  const [status, setStatus] = useState(employee?.status || "active");
  const [role, setRole] = useState<UserRole>(employee?.role || "employee");
  const [password, setPassword] = useState(""); // New password state

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setEmail(employee.email);
      setPhone(employee.phone);
      setAddress(employee.address);
      setDateOfBirth(employee.dateOfBirth?.toISOString().split("T")[0] || "");
      setHireDate(employee.hireDate?.toISOString().split("T")[0] || "");
      setJobTitle(employee.jobTitle);
      setDepartmentId(employee.departmentId);
      setSalary(employee.salary);
      setStatus(employee.status);
      setRole(employee.role);
      setPassword(""); // Clear password field when editing
    } else {
      // Reset form for new employee
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setDateOfBirth("");
      setHireDate("");
      setJobTitle("");
      setDepartmentId("");
      setSalary(0);
      setStatus("active");
      setRole("employee");
      setPassword("");
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedDepartment = departments.find(
      (dept) => dept.id === departmentId
    );
    if (!selectedDepartment) {
      alert("Please select a valid department.");
      return;
    }

    if (!employee && !password) {
      // Password is required for new employees
      alert("Password is required for new employee accounts.");
      return;
    }

    const employeeData: Omit<
      Employee,
      "id" | "createdAt" | "updatedAt" | "userId"
    > = {
      name,
      email,
      phone,
      address,
      dateOfBirth: new Date(dateOfBirth),
      hireDate: new Date(hireDate),
      jobTitle,
      department: selectedDepartment.name, // Denormalize department name
      departmentId,
      salary: Number(salary),
      status: status as "active" | "on-leave" | "terminated" | "inactive",
      role: role as UserRole,
    };

    await onSubmit(employeeData, employee ? undefined : password); // Pass password only for new employees
  };

  return (
    <form onSubmit={handleSubmit} className="py-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Full Name</span>
          </label>
          <input
            type="text"
            placeholder="John Doe"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="john.doe@example.com"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Password {employee ? "(Leave blank to keep current)" : ""}
            </span>
          </label>
          <input
            type="password"
            placeholder={employee ? "********" : "Enter password"}
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!employee} // Required only for new employees
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone</span>
          </label>
          <input
            type="tel"
            placeholder="123-456-7890"
            className="input input-bordered w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Address</span>
          </label>
          <input
            type="text"
            placeholder="123 Main St, Anytown"
            className="input input-bordered w-full"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Date of Birth</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Hire Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={hireDate}
            onChange={(e) => setHireDate(e.target.value)}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Job Title</span>
          </label>
          <input
            type="text"
            placeholder="Software Engineer"
            className="input input-bordered w-full"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Department</span>
          </label>
          {departmentsLoading ? (
            <span className="loading loading-spinner"></span>
          ) : departmentsError ? (
            <p className="text-error text-sm">{departmentsError}</p>
          ) : (
            <select
              className="select select-bordered w-full"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Department
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Salary</span>
          </label>
          <input
            type="number"
            placeholder="50000"
            className="input input-bordered w-full"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Status</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="terminated">Terminated</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Role</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-error text-sm">
          <span>{error}</span>
        </div>
      )}

      <div className="modal-action">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onClose}
          disabled={loading}
        >
          <X className="h-5 w-5" /> Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <Save className="h-5 w-5" />{" "}
          {employee ? "Update Employee" : "Add Employee"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
