"use client";

import type React from "react";
import { useState } from "react";
import { useDepartments } from "../hooks/useDepartments";
import { useAuth } from "../contexts/AuthContext";
import type { Department } from "../types";
import { PlusCircle, Edit, Trash2, Save, X, Building2 } from "lucide-react";

const Departments: React.FC = () => {
  const {
    departments,
    loading,
    error,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartments();
  const { userProfile } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(
    null
  );
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [departmentManagerName, setDepartmentManagerName] = useState("");

  const isAdminOrManager =
    userProfile?.role === "admin" || userProfile?.role === "manager";

  const openModal = (department?: Department) => {
    setCurrentDepartment(department || null);
    setDepartmentName(department?.name || "");
    setDepartmentDescription(department?.description || "");
    setDepartmentManagerName(department?.managerName || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDepartment(null);
    setDepartmentName("");
    setDepartmentDescription("");
    setDepartmentManagerName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentName || !departmentDescription) {
      alert("Name and Description are required.");
      return;
    }

    try {
      if (currentDepartment?.id) {
        await updateDepartment(currentDepartment.id, {
          name: departmentName,
          description: departmentDescription,
          managerName: departmentManagerName,
        });
      } else {
        await addDepartment({
          name: departmentName,
          description: departmentDescription,
          managerName: departmentManagerName,
        });
      }
      closeModal();
    } catch (err) {
      alert(
        `Failed to save department: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id);
      } catch (err) {
        alert(
          `Failed to delete department: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="ml-2 text-lg">Loading departments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Departments
          </h1>
          <p className="text-base-content/60">
            Manage school departments and their details
          </p>
        </div>
        {isAdminOrManager && (
          <button className="btn btn-primary" onClick={() => openModal()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Department
          </button>
        )}
      </div>

      {departments.length === 0 ? (
        <div className="text-center text-base-content/60 p-8">
          <Building2 className="h-16 w-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No departments found</h3>
          <p className="text-base-content/60 mb-4">
            {isAdminOrManager
              ? "Click 'Add Department' to create your first one."
              : "No departments have been added yet."}
          </p>
          {isAdminOrManager && (
            <button className="btn btn-primary" onClick={() => openModal()}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add Department
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto card bg-base-100 shadow-lg">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Manager</th>
                <th>Employees</th>
                {isAdminOrManager && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td className="font-medium">{dept.name}</td>
                  <td>{dept.description}</td>
                  <td>{dept.managerName || "N/A"}</td>
                  <td>{dept.employeeCount || 0}</td>
                  {isAdminOrManager && (
                    <td className="text-right">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => openModal(dept)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {userProfile?.role === "admin" && ( // Only admin can delete
                        <button
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => handleDelete(dept.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {currentDepartment ? "Edit Department" : "Add New Department"}
            </h3>
            <form onSubmit={handleSubmit} className="py-4 space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Department Name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Teaching Staff"
                  className="input input-bordered w-full"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  placeholder="Brief description of the department"
                  className="textarea textarea-bordered w-full"
                  value={departmentDescription}
                  onChange={(e) => setDepartmentDescription(e.target.value)}
                  rows={3}
                  required
                ></textarea>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Manager Name (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Dr. Emily Wilson"
                  className="input input-bordered w-full"
                  value={departmentManagerName}
                  onChange={(e) => setDepartmentManagerName(e.target.value)}
                />
              </div>
              <div className="modal-action">
                <button className="btn btn-outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save className="h-5 w-5" />{" "}
                  {currentDepartment ? "Save Changes" : "Add Department"}
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
