"use client";

import type React from "react";
import { useState, useMemo } from "react";
import {
  Calendar,
  Plus,
  Search,
  CheckCircle,
  XCircle,
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
      if (!userProfile) {
        throw new Error("User not authenticated.");
      }

      console.log("Creating request with data:", data);

      await createLeaveRequest(data);
      setShowForm(false);
    } catch (e: any) {
      console.error("Failed to create leave request:", e);
      alert(e.message || "Failed to create leave request. Please try again.");
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
      await approveLeaveRequest(
        requestId,
        userProfile.name || userProfile.email || "Manager"
      );
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
        userProfile.name || userProfile.email || "Manager",
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          <Calendar className="inline-block mr-2" size={32} /> Leave Requests
        </h1>
        <button
          className="btn btn-primary text-whit"
          onClick={() => {
            setEditingRequest(null);
            setShowForm(true);
          }}
        >
          <Plus size={20} className="inline mr-2" /> New Request
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Requests</p>
          <p className="text-2xl font-bold">{leaveRequests.length}</p>
          <p className="text-xs text-gray-400">All time</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Pending Requests</p>
          <p className="text-2xl font-bold text-yellow-600">
            {leaveRequests.filter((r) => r.status === "pending").length}
          </p>
          <p className="text-xs text-gray-400">Awaiting approval</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Approved Requests</p>
          <p className="text-2xl font-bold text-green-600">
            {leaveRequests.filter((r) => r.status === "approved").length}
          </p>
          <p className="text-xs text-gray-400">This year</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Rejected Requests</p>
          <p className="text-2xl font-bold text-red-600">
            {leaveRequests.filter((r) => r.status === "rejected").length}
          </p>
          <p className="text-xs text-gray-400">This year</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3" size={16} />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              placeholder="Search by employee or leave type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <select
            className="w-full sm:w-48 p-2 border rounded-lg"
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
            className="w-full sm:w-48 p-2 border rounded-lg"
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
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leave Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getEmployeeName(request.employeeId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {request.leaveType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(request.startDate, "PPP")} -{" "}
                  {format(request.endDate, "PPP")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{request.days}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="btn btn-sm btn-ghost text-primary mr-2"
                    title="View Details"
                    onClick={() => setViewingRequest(request)}
                  >
                    <Eye size={18} />
                  </button>
                  {/* Only show these buttons to admins and managers for pending requests */}
                  {canManageLeave && request.status === "pending" && (
                    <>
                      <button
                        className="btn btn-sm btn-ghost text-success mr-2"
                        title="Approve"
                        onClick={() => handleApprove(request.id)}
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        className="btn btn-sm btn-ghost text-error mr-2"
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
                        className="btn btn-sm btn-ghost text-warning"
                        title="Edit"
                        onClick={() => {
                          setEditingRequest(request);
                          setShowForm(true);
                        }}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="btn btn-sm btn-ghost text-error"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-4">Reject Leave Request</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Rejection Reason (Optional)
              </label>
              <textarea
                className="w-full p-2 border rounded"
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
