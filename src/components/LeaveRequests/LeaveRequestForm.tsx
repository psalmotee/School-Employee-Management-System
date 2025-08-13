"use client";

import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, CalendarDays, Edit, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAuth } from "../../contexts/AuthContext";
import { useEmployees } from "../../hooks/useEmployees";
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
  const { userProfile } = useAuth();
  const { employees } = useEmployees();

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
    if (!userProfile) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    // Calculate the number of days
    const start = parseISO(data.startDate);
    const end = parseISO(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

    let employeeName = "";
    let employeeId = "";

    if (request) {
      // For editing existing requests, use the existing data
      employeeId = request.employeeId;
      employeeName = request.employeeName;
    } else {
      // For new requests, get employee data from current user
      employeeId = userProfile.id;

      // Try multiple sources for employee name
      // 1. Try userProfile.name first
      if (userProfile.name && userProfile.name.trim()) {
        employeeName = userProfile.name.trim();
      }
      // 2. Try userProfile.displayName
      else if (userProfile.displayName && userProfile.displayName.trim()) {
        employeeName = userProfile.displayName.trim();
      }
      // 3. Try to find matching employee record
      else {
        const matchingEmployee = employees.find(
          (emp) => emp.id === userProfile.id || emp.email === userProfile.email
        );
        if (matchingEmployee && matchingEmployee.name) {
          employeeName = matchingEmployee.name;
        }
        // 4. Fallback to email username
        else if (userProfile.email) {
          employeeName = userProfile.email.split("@")[0];
        }
        // 5. Last resort fallback
        else {
          employeeName = "Unknown Employee";
        }
      }
    }

    // Validate that we have required employee data
    if (!employeeId || !employeeName || employeeName === "Unknown Employee") {
      alert(
        "Unable to determine employee information. Please ensure your profile is complete and try again."
      );
      console.error("Employee data validation failed:", {
        employeeId,
        employeeName,
        userProfile,
      });
      return;
    }

    console.log("Submitting with employee data:", { employeeId, employeeName });

    // Construct the data object to be submitted
    const dataToSubmit = {
      ...data,
      startDate: start,
      endDate: end,
      days: diffDays,
      status: request ? request.status : "pending",
      employeeId,
      employeeName,
    };

    try {
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Failed to submit leave request. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full relative shadow-xl">
        <button
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
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
              <label className="block text-sm font-medium mb-2">
                Leave Type
              </label>
              <select
                className={`w-full p-2 border rounded ${
                  errors.leaveType ? "border-red-500" : "border-gray-300"
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.leaveType.message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>
              <input
                type="date"
                className={`w-full p-2 border rounded ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                }`}
                {...register("startDate", {
                  required: "Start date is required",
                })}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                className={`w-full p-2 border rounded ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>

            {startDate && endDate && (
              <div className="form-control">
                <label className="block text-sm font-medium mb-2">
                  Duration (Days)
                </label>
                <div className="flex items-center">
                  <Clock size={20} className="mr-2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 cursor-not-allowed"
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
              <label className="block text-sm font-medium mb-2">Reason</label>
              <textarea
                className={`w-full p-2 border rounded h-24 ${
                  errors.reason ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Briefly describe the reason for the leave"
                {...register("reason", { required: "Reason is required" })}
              />
              {errors.reason && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.reason.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 mt-6">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${
                loading ? "loading" : ""
              }`}
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
