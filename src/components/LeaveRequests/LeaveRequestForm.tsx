"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { X, Calendar, FileText, Clock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import type { LeaveRequest } from "../../types";

interface LeaveRequestFormProps {
  leaveRequest?: LeaveRequest;
  onSubmit: (
    data: Omit<LeaveRequest, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

interface LeaveRequestFormData {
  leaveType:
    | "sick"
    | "vacation"
    | "personal"
    | "maternity"
    | "paternity"
    | "emergency";
  startDate: string;
  endDate: string;
  reason: string;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  leaveRequest,
  onSubmit,
  onClose,
  loading = false,
}) => {
  const { userProfile } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LeaveRequestFormData>({
    defaultValues: leaveRequest
      ? {
          ...leaveRequest,
          startDate: leaveRequest.startDate.toISOString().split("T")[0],
          endDate: leaveRequest.endDate.toISOString().split("T")[0],
        }
      : {
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date().toISOString().split("T")[0],
        },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const leaveTypes = [
    { value: "sick", label: "Sick Leave", color: "badge-error" },
    { value: "vacation", label: "Vacation", color: "badge-primary" },
    { value: "personal", label: "Personal Leave", color: "badge-secondary" },
    { value: "maternity", label: "Maternity Leave", color: "badge-accent" },
    { value: "paternity", label: "Paternity Leave", color: "badge-accent" },
    { value: "emergency", label: "Emergency Leave", color: "badge-warning" },
  ];

  const handleFormSubmit = async (data: LeaveRequestFormData) => {
    if (!userProfile) return;

    const requestData = {
      employeeId: userProfile.id,
      employeeName: userProfile.name,
      leaveType: data.leaveType,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      days: calculateDays(),
      reason: data.reason,
      status: "pending" as const,
    };

    await onSubmit(requestData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-base-200">
          <h2 className="text-2xl font-bold">
            {leaveRequest ? "Edit Leave Request" : "Submit Leave Request"}
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-6"
        >
          {/* Employee Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title text-lg">Employee Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Employee Name</span>
                  </label>
                  <input
                    type="text"
                    value={userProfile?.name || ""}
                    className="input input-bordered w-full"
                    disabled
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Department</span>
                  </label>
                  <input
                    type="text"
                    value={userProfile?.department || ""}
                    className="input input-bordered w-full"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Leave Details */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title text-lg">Leave Details</h3>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Leave Type *</span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      errors.leaveType ? "select-error" : ""
                    }`}
                    {...register("leaveType", {
                      required: "Leave type is required",
                    })}
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.leaveType && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.leaveType.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Start Date *</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className={`input input-bordered w-full pl-10 ${
                          errors.startDate ? "input-error" : ""
                        }`}
                        {...register("startDate", {
                          required: "Start date is required",
                        })}
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                    </div>
                    {errors.startDate && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.startDate.message}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">End Date *</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className={`input input-bordered w-full pl-10 ${
                          errors.endDate ? "input-error" : ""
                        }`}
                        {...register("endDate", {
                          required: "End date is required",
                          validate: (value) => {
                            if (startDate && value < startDate) {
                              return "End date must be after start date";
                            }
                            return true;
                          },
                        })}
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                    </div>
                    {errors.endDate && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.endDate.message}
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Duration Display */}
                {startDate && endDate && (
                  <div className="alert alert-info">
                    <Clock className="h-5 w-5" />
                    <span>
                      Duration: {calculateDays()} day
                      {calculateDays() > 1 ? "s" : ""}
                    </span>
                  </div>
                )}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Reason *</span>
                  </label>
                  <div className="relative">
                    <textarea
                      placeholder="Please provide a detailed reason for your leave request..."
                      className={`textarea textarea-bordered w-full pl-10 pt-3 ${
                        errors.reason ? "textarea-error" : ""
                      }`}
                      rows={4}
                      {...register("reason", {
                        required: "Reason is required",
                        minLength: {
                          value: 10,
                          message: "Reason must be at least 10 characters",
                        },
                      })}
                    />
                    <FileText className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
                  </div>
                  {errors.reason && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.reason.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-base-200">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : leaveRequest
                ? "Update Request"
                : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestForm;
