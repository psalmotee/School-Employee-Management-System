"use client";

import type React from "react";
import { useState, useMemo } from "react";
import {
  Calendar,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { useLeaveRequests } from "../hooks/useLeaveRequests";
import { useEmployees } from "../hooks/useEmployees";
import { useAuth } from "../contexts/AuthContext";
import LeaveRequestForm from "../components/LeaveRequests/LeaveRequestForm";
import LeaveRequestDetails from "../components/LeaveRequests/LeaveRequestDetails";
import type { LeaveRequest } from "../types";

const LeaveRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState<LeaveRequest | null>(
    null
  );
  const [viewingRequest, setViewingRequest] = useState<LeaveRequest | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  const { userProfile } = useAuth();
  const {
    leaveRequests,
    loading,
    error,
    createLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
  } = useLeaveRequests();

  const { employees } = useEmployees();

  // Determine if the current user has permission to manage leave requests
  const canManageLeave =
    userProfile?.role === "admin" || userProfile?.role === "manager";

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    return employee ? employee.name : "Unknown Employee";
  };

  const filteredRequests = useMemo(() => {
    return leaveRequests
      .filter((request) => {
        const matchesSearch =
          getEmployeeName(request.employeeId)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          !selectedStatus || request.status === selectedStatus;
        const matchesType = !selectedType || request.leaveType === selectedType;
        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [leaveRequests, searchTerm, selectedStatus, selectedType, employees]);

  const handleCreateRequest = async (data: any) => {
    setFormSubmitting(true);
    try {
      if (!userProfile) throw new Error("User not authenticated.");
      await createLeaveRequest({
        ...data,
        employeeId: userProfile.id,
        employeeName: userProfile.name,
      });
      setShowForm(false);
    } catch (e) {
      console.error("Failed to create leave request:", e);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingRequest) return;
    setFormSubmitting(true);
    try {
      await updateLeaveRequest(editingRequest.id, data);
      setShowForm(false);
      setEditingRequest(null);
    } catch (e) {
      console.error("Failed to update leave request:", e);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (requestId: string | null) => {
    if (!requestId) return;
    try {
      await deleteLeaveRequest(requestId);
      setShowDeleteConfirm(null);
    } catch (e) {
      console.error("Failed to delete leave request:", e);
    }
  };

  const handleApprove = async (requestId: string | null) => {
    if (!requestId || !userProfile) return;
    try {
      await approveLeaveRequest(requestId, userProfile.name);
    } catch (e) {
      console.error("Failed to approve request:", e);
    } finally {
      setShowRejectModal(null);
    }
  };

  const handleReject = async (requestId: string | null) => {
    if (!requestId || !userProfile) return;
    try {
      await rejectLeaveRequest(
        requestId,
        userProfile.name,
        rejectionReason || "No reason provided."
      );
    } catch (e) {
      console.error("Failed to reject request:", e);
    } finally {
      setShowRejectModal(null);
      setRejectionReason("");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-base-content">
          <Calendar className="inline-block mr-2" size={32} /> Leave Requests
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingRequest(null);
            setShowForm(true);
          }}
        >
          <Plus size={20} /> New Request
        </button>
      </div>

      {/* Stats Section */}
      <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 mb-6 w-full">
        <div className="stat">
          <div className="stat-title">Total Requests</div>
          <div className="stat-value">{leaveRequests.length}</div>
          <div className="stat-desc">All time</div>
        </div>
        <div className="stat">
          <div className="stat-title">Pending Requests</div>
          <div className="stat-value text-warning">
            {leaveRequests.filter((r) => r.status === "pending").length}
          </div>
          <div className="stat-desc">Awaiting approval</div>
        </div>
        <div className="stat">
          <div className="stat-title">Approved Requests</div>
          <div className="stat-value text-success">
            {leaveRequests.filter((r) => r.status === "approved").length}
          </div>
          <div className="stat-desc">This year</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1">
          <label className="input input-bordered flex items-center gap-2">
            <Search size={16} />
            <input
              type="text"
              className="grow"
              placeholder="Search by employee or leave type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>
        <div className="w-full sm:w-auto">
          <select
            className="select select-bordered w-full sm:w-48"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <select
            className="select select-bordered w-full sm:w-48"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="sick">Sick</option>
            <option value="vacation">Vacation</option>
            <option value="personal">Personal</option>
            <option value="maternity">Maternity</option>
            <option value="paternity">Paternity</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Leave Type</th>
              <th>Date Range</th>
              <th>Days</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.id}>
                <td>{getEmployeeName(request.employeeId)}</td>
                <td>{request.leaveType}</td>
                <td>
                  {format(request.startDate, "PPP")} -{" "}
                  {format(request.endDate, "PPP")}
                </td>
                <td>{request.days}</td>
                <td>
                  <span
                    className={`badge ${
                      request.status === "pending"
                        ? "badge-warning"
                        : request.status === "approved"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="text-right">
                  <button
                    className="btn btn-ghost btn-sm text-info"
                    title="View Details"
                    onClick={() => setViewingRequest(request)}
                  >
                    <Eye size={18} />
                  </button>
                  {/* Only show these buttons to admins and managers for pending requests */}
                  {canManageLeave && request.status === "pending" && (
                    <>
                      <button
                        className="btn btn-ghost btn-sm text-success"
                        title="Approve"
                        onClick={() => handleApprove(request.id)}
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm text-error"
                        title="Reject"
                        onClick={() => setShowRejectModal(request.id)}
                      >
                        <XCircle size={18} />
                      </button>
                    </>
                  )}
                  {/* Edit and Delete buttons for the request owner or admins/managers */}
                  {(userProfile?.id === request.employeeId ||
                    userProfile?.role === "admin" ||
                    userProfile?.role === "manager") && (
                    <>
                      <button
                        className="btn btn-ghost btn-sm text-warning"
                        title="Edit"
                        onClick={() => {
                          setEditingRequest(request);
                          setShowForm(true);
                        }}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm text-error"
                        title="Delete"
                        onClick={() => setShowDeleteConfirm(request.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leave Request Form Modal */}
      {showForm && (
        <LeaveRequestForm
          request={editingRequest || undefined}
          onSubmit={editingRequest ? handleUpdate : handleCreateRequest}
          onClose={() => {
            setShowForm(false);
            setEditingRequest(null);
          }}
          loading={formSubmitting}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this leave request?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="btn btn-outline"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => handleDelete(showDeleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Leave Request Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-4">Reject Leave Request</h3>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">Rejection Reason (Optional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Please provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="btn btn-outline"
                onClick={() => setShowRejectModal(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => handleReject(showRejectModal)}
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Request Details Modal */}
      {viewingRequest && (
        <LeaveRequestDetails
          request={viewingRequest}
          onClose={() => setViewingRequest(null)}
        />
      )}
    </div>
  );
};

export default LeaveRequests;
