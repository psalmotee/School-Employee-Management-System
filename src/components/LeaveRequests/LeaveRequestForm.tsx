"use client";

import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, CalendarDays, Edit, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { LeaveRequest } from "../../types";

// This interface defines the shape of the form data
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
  days: number;
}

// Props for the LeaveRequestForm component
interface LeaveRequestFormProps {
  request?: LeaveRequest;
  onSubmit: (
    data: Omit<LeaveRequest, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  request,
  onSubmit,
  onClose,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<LeaveRequestFormData>({
    defaultValues: request
      ? {
          ...request,
          startDate: format(request.startDate, "yyyy-MM-dd"),
          endDate: format(request.endDate, "yyyy-MM-dd"),
          // The `days` field is a calculated value, so we'll re-calculate it
          days: 0,
        }
      : undefined,
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  // A useEffect hook to handle form reset when a new request is passed in for editing
  useEffect(() => {
    if (request) {
      reset({
        ...request,
        startDate: format(request.startDate, "yyyy-MM-dd"),
        endDate: format(request.endDate, "yyyy-MM-dd"),
      });
    } else {
      reset();
    }
  }, [request, reset]);

  // Handle form submission and data formatting
  const handleFormSubmit = async (data: LeaveRequestFormData) => {
    // Calculate the number of days
    const start = parseISO(data.startDate);
    const end = parseISO(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

    // Construct the data object to be submitted
    const dataToSubmit = {
      ...data,
      startDate: start,
      endDate: end,
      days: diffDays,
      status: request ? request.status : "pending",
      employeeId: request?.employeeId || "", // We'll get this from the auth context in the parent
      employeeName: request?.employeeName || "", // We'll get this from the auth context in the parent
    };

    await onSubmit(dataToSubmit);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg p-6 max-w-2xl w-full relative shadow-xl">
        <button
          className="btn btn-sm btn-circle absolute top-4 right-4"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <h3 className="font-bold text-2xl mb-4 flex items-center">
          {request ? (
            <>
              <Edit size={24} className="mr-2" /> Edit Leave Request
            </>
          ) : (
            <>
              <CalendarDays size={24} className="mr-2" /> Request Leave
            </>
          )}
        </h3>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Leave Type</span>
              </label>
              <select
                className={`select select-bordered w-full ${
                  errors.leaveType ? "select-error" : ""
                }`}
                {...register("leaveType", {
                  required: "Leave type is required",
                })}
              >
                <option value="">Select leave type</option>
                <option value="sick">Sick</option>
                <option value="vacation">Vacation</option>
                <option value="personal">Personal</option>
                <option value="maternity">Maternity</option>
                <option value="paternity">Paternity</option>
                <option value="emergency">Emergency</option>
              </select>
              {errors.leaveType && (
                <p className="text-error text-sm mt-1">
                  {errors.leaveType.message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Start Date</span>
              </label>
              <input
                type="date"
                className={`input input-bordered w-full ${
                  errors.startDate ? "input-error" : ""
                }`}
                {...register("startDate", {
                  required: "Start date is required",
                })}
              />
              {errors.startDate && (
                <p className="text-error text-sm mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">End Date</span>
              </label>
              <input
                type="date"
                className={`input input-bordered w-full ${
                  errors.endDate ? "input-error" : ""
                }`}
                {...register("endDate", {
                  required: "End date is required",
                  validate: (value) =>
                    !startDate ||
                    value >= startDate ||
                    "End date must be after start date",
                })}
              />
              {errors.endDate && (
                <p className="text-error text-sm mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>

            {startDate && endDate && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Duration (Days)</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-base-300">
                    <Clock size={20} />
                  </span>
                  <input
                    type="text"
                    className="input input-bordered w-full cursor-not-allowed"
                    value={
                      Math.ceil(
                        (parseISO(endDate).getTime() -
                          parseISO(startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) + 1
                    }
                    disabled
                  />
                </div>
              </div>
            )}

            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Reason</span>
              </label>
              <textarea
                className={`textarea textarea-bordered h-24 ${
                  errors.reason ? "textarea-error" : ""
                }`}
                placeholder="Briefly describe the reason for the leave"
                {...register("reason", { required: "Reason is required" })}
              />
              {errors.reason && (
                <p className="text-error text-sm mt-1">
                  {errors.reason.message}
                </p>
              )}
            </div>
          </div>

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
                ? "Submitting..."
                : request
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
