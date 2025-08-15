"use client";

import type React from "react";
import { useState, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Building2,
  Activity,
} from "lucide-react";
import { useEmployees } from "../hooks/useEmployees";
import { useAuth } from "../contexts/AuthContext";
import EmployeeForm from "../components/Employees/EmployeeForm";
import type { Employee } from "../types";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const { userProfile } = useAuth();
  const {
    employees,
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees();

  const departments = useMemo(() => {
    const departmentSet = new Set(employees.map((e) => e.department));
    return ["", ...Array.from(departmentSet)];
  }, [employees]);

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !selectedDepartment || employee.department === selectedDepartment;
    const matchesStatus = !selectedStatus || employee.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleCreateEmployee = async (
    data: Omit<Employee, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await createEmployee(data);
      setShowForm(false);
    } catch (e) {
      console.error("Failed to create employee:", e);
      toast.error("Failed to create employee. Please try again.");
    }
  };

  const handleUpdateEmployee = async (
    data: Omit<Employee, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!editingEmployee) return;
    try {
      await updateEmployee(editingEmployee.id, data);
      setShowForm(false);
      setEditingEmployee(null);
    } catch (e) {
      console.error("Failed to update employee:", e);
      toast.error("Failed to update employee. Please try again.");
    }
  };

  const handleDeleteEmployee = async (employeeId: string | null) => {
    if (!employeeId) return;
    try {
      await deleteEmployee(employeeId);
      setShowDeleteConfirm(null);
    } catch (e) {
      console.error("Failed to delete employee:", e);
      toast.error("Failed to delete employee. Please try again.");
    }
  };

  const canManageEmployees =
    userProfile?.role === "admin" || userProfile?.role === "manager";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <p>Error: please contact your IT department</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-base-content">
          <Users className="inline-block mr-2" size={32} /> Employees
        </h1>
        {canManageEmployees && (
          <Button
            variant="primary"
            onClick={() => {
              setEditingEmployee(null);
              setShowForm(true);
            }}
          >
            <Plus size={20} /> Add Employee
          </Button>
        )}
      </div>

      {/* Stats Section */}
      <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 mb-6 w-full">
        <div className="stat">
          <p className="stat-title">Total Employees</p>
          <p className="stat-value">{employees.length}</p>
          <p className="stat-desc">As of today</p>
        </div>

        <div className="stat">
          <p className="stat-title">Active Employees</p>
          <p className="stat-value text-success">
            {employees.filter((e) => e.status === "active").length}
          </p>
          <p className="stat-desc">Currently working</p>
        </div>

        <div className="stat">
          <p className="stat-title">Departments</p>
          <p className="stat-value text-secondary">
            {new Set(employees.map((e) => e.department)).size}
          </p>
          <p className="stat-desc">Active departments</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search by name, email, or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <Select
            icon={Building2}
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full sm:w-48"
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department || "Unassigned"}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-full sm:w-auto">
          <Select
            icon={Activity}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-48"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </Select>
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
              <th>Role</th>
              <th>Status</th>
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
                      employee.role === "admin"
                        ? "badge-error"
                        : employee.role === "manager"
                        ? "badge-warning"
                        : "badge-info"
                    }`}
                  >
                    {employee.role}
                  </span>
                </td>
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
                {canManageEmployees && (
                  <td className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-info"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-warning"
                      title="Edit"
                      onClick={() => {
                        setEditingEmployee(employee);
                        setShowForm(true);
                      }}
                    >
                      <Edit size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-error"
                      title="Delete"
                      onClick={() => setShowDeleteConfirm(employee.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
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
            setShowForm(false);
            setEditingEmployee(null);
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this employee? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="error"
                onClick={() => handleDeleteEmployee(showDeleteConfirm)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
