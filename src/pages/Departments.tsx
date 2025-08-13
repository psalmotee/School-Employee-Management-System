"use client";

import type React from "react";
import { useState } from "react";
import { Plus, Search, Edit, Trash2, Building2 } from "lucide-react";
import { useDepartments } from "../hooks/useDepartments";
import { useAuth } from "../contexts/AuthContext";
import DepartmentForm from "../components/Department/DepartmentForm";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import type { Department } from "../types";

const Departments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const { userProfile } = useAuth();
  const {
    departments,
    loading,
    error,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartments();

  const isManagerOrAdmin =
    userProfile?.role === "admin" || userProfile?.role === "manager";

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDepartment = async (
    data: Omit<Department, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await createDepartment(data);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create department:", err);
    }
  };

  const handleUpdateDepartment = async (
    id: string,
    data: Partial<Department>
  ) => {
    try {
      await updateDepartment(id, data);
      setShowForm(false);
      setEditingDepartment(null);
    } catch (err) {
      console.error("Failed to update department:", err);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      await deleteDepartment(id);
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete department:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-base-content">
          <Building2 className="mr-2 inline-block" size={32} />
          Departments
        </h1>
        {isManagerOrAdmin && (
          <Button className="btn-soft" icon={Plus} onClick={() => setShowForm(true)}>
            Add Department
          </Button>
        )}
      </div>

      <div className="bg-base-100 rounded-2xl p-6 shadow-xl mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="form-control w-full md:w-1/3">
            <Input
              type="text"
              placeholder="Search departments..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="text-sm text-base-content/60">
            Showing {filteredDepartments.length} of {departments.length}{" "}
            departments
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((department) => (
          <div
            key={department.id}
            className="card bg-base-100 shadow-lg rounded-2xl border border-base-200"
          >
            <div className="card-body p-6">
              <h2 className="card-title text-xl font-semibold text-primary">
                {department.name}
              </h2>
              <p className="text-sm text-base-content/80">
                {department.description}
              </p>
              <div className="flex items-center text-sm text-base-content/60 mt-2">
                <Building2 size={16} className="mr-2" />
                Employee Count: {department.employeeCount}
              </div>
              <div className="card-actions justify-end mt-4">
                {isManagerOrAdmin && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit}
                      className="text-warning"
                      onClick={() => {
                        setEditingDepartment(department);
                        setShowForm(true);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      className="text-error"
                      onClick={() => setShowDeleteConfirm(department.id)}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Department Form Modal */}
      {showForm && (
        <DepartmentForm
          department={editingDepartment || undefined}
          onSubmit={
            editingDepartment ? handleUpdateDepartment : handleCreateDepartment
          }
          onClose={() => {
            setShowForm(false);
            setEditingDepartment(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p className="mb-6 text-base-content/80">
              Are you sure you want to delete this department? This action
              cannot be undone.
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
                loading={loading}
                onClick={() => handleDeleteDepartment(showDeleteConfirm)}
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

export default Departments;
