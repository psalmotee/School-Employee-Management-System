"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Building2, FileText } from "lucide-react";
import type { Department } from "../../types";

interface DepartmentFormProps {
  department?: Department;
  onSubmit: (
    data: Omit<Department, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onClose: () => void;
}

interface DepartmentFormData {
  name: string;
  description: string;
  managerId?: string;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  onSubmit,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    defaultValues: department
      ? {
          ...department,
        }
      : {},
  });

  const handleFormSubmit = async (data: DepartmentFormData) => {
    setLoading(true);
    try {
      await onSubmit({
        ...data,
        employeeCount: department?.employeeCount || 0,
      });
    } catch (err) {
      console.error("Failed to save department:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl">
            {department ? "Edit Department" : "Add New Department"}
          </h3>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Department Name</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., Human Resources"
                className="input input-bordered rounded-lg w-full pl-10"
                {...register("name", {
                  required: "Department name is required",
                })}
              />
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
            </div>
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.name.message}
                </span>
              </label>
            )}
          </div>
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <div className="relative">
              <textarea
                className="textarea textarea-bordered rounded-lg w-full pl-10 pt-3"
                placeholder="Brief description of the department..."
                rows={3}
                {...register("description", {
                  required: "Description is required",
                })}
              />
              <FileText className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
            </div>
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.description.message}
                </span>
              </label>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : department
                ? "Update Department"
                : "Create Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;
