"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Building2, FileText } from "lucide-react";
import type { Department } from "../../types";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

interface DepartmentFormProps {
  department?: Department;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  onSubmit,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: department?.name || "",
      description: department?.description || "",
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (department) {
      reset({
        name: department.name,
        description: department.description,
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [department, reset]);

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    const formData = {
      name: data.name,
      description: data.description,
    };
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl">
            {department ? "Edit Department" : "Add New Department"}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Input
            legend="Department Name"
            icon={Building2}
            placeholder="e.g., Human Resources"
            useFieldset={true}
            error={errors.name?.message}
            {...register("name", {
              required: "Department name is required",
            })}
          />

          <Textarea
            legend="Description"
            icon={FileText}
            placeholder="Brief description of the department..."
            rows={3}
            useFieldset={true}
            error={errors.description?.message}
            {...register("description", {
              required: "Description is required",
            })}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
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
                : department
                ? "Update Department"
                : "Create Department"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;
