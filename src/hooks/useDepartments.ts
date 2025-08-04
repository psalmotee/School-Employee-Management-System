"use client";
import { useState } from "react";
import useDepartments from "../hooks/useDepartments";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

const Departments = () => {
  const {
    departments,
    loading,
    error,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartments();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<any>(null);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    managerName: "",
  });

  const openModal = (department?: any) => {
    if (department) {
      setCurrentDepartment(department);
      setFormState({
        name: department.name,
        description: department.description || "",
        managerName: department.managerName || "",
      });
    } else {
      setCurrentDepartment(null);
      setFormState({ name: "", description: "", managerName: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDepartment(null);
    setFormState({ name: "", description: "", managerName: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentDepartment?.id) {
      await updateDepartment(currentDepartment.id, formState);
    } else {
      await addDepartment(formState);
    }
    closeModal();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      await deleteDepartment(id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <div className="text-error text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Departments</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus className="h-5 w-5" /> Add Department
        </button>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">All Departments</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Manager</th>
                  <th>Employees</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-4 text-base-content/60"
                    >
                      No departments found.
                    </td>
                  </tr>
                ) : (
                  departments.map((dept) => (
                    <tr key={dept.id}>
                      <td>{dept.name}</td>
                      <td>{dept.description || "N/A"}</td>
                      <td>{dept.managerName || "N/A"}</td>
                      <td>{dept.employeeCount}</td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => openModal(dept)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => handleDelete(dept.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">
                {currentDepartment ? "Edit Department" : "Add New Department"}
              </h3>
              <button
                className="btn btn-ghost btn-sm btn-circle"
                onClick={closeModal}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="py-4 space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Department Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="e.g., Teaching Staff"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  value={formState.description}
                  onChange={handleChange}
                  placeholder="Brief description of the department"
                  className="textarea textarea-bordered w-full"
                  rows={3}
                ></textarea>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Manager Name (Optional)</span>
                </label>
                <input
                  type="text"
                  name="managerName"
                  value={formState.managerName}
                  onChange={handleChange}
                  placeholder="e.g., Dr. Emily Wilson"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="modal-action">
                <button type="button" className="btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save className="h-5 w-5" />{" "}
                  {currentDepartment ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={closeModal}></div>
        </div>
      )}
    </div>
  );
};

export default Departments;
