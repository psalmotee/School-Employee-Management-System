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
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { useLeaveRequests } from "../hooks/useLeaveRequests";
import { useEmployees } from "../hooks/useEmployees";
import { useAuth } from "../contexts/AuthContext";
import LeaveRequestForm from "../components/LeaveRequests/LeaveRequestForm";
import LeaveRequestDetails from "../components/LeaveRequests/LeaveRequestDetails";
import type { LeaveRequest } from "../types";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import Button from "../components/ui/Button";

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
  // const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(
  //   null
  // );
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

  // const handleCancel = async (requestId: string | null) => {
  //   if (!requestId || !userProfile) return;
  //   try {
  //     await cancelLeaveRequest(
  //       requestId,
  //       userProfile.name || userProfile.email || "User"
  //     );
  //     setShowCancelConfirm(null);
  //   } catch (e) {
  //     console.error("Failed to cancel request:", e);
  //   }
  // };

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
        <Button
          variant="primary"
          onClick={() => {
            setEditingRequest(null);
            setShowForm(true);
          }}
        >
          <Plus size={20} className="inline mr-2" /> New Request
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Requests</div>
          <div className="text-2xl font-bold">{leaveRequests.length}</div>
          <div className="text-xs text-gray-400">All time</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Pending Requests</div>
          <div className="text-2xl font-bold text-yellow-600">
            {leaveRequests.filter((r) => r.status === "pending").length}
          </div>
          <div className="text-xs text-gray-400">Awaiting approval</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Approved Requests</div>
          <div className="text-2xl font-bold text-green-600">
            {leaveRequests.filter((r) => r.status === "approved").length}
          </div>
          <div className="text-xs text-gray-400">This year</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="text"
            icon={Search}
            placeholder="Search by employee or leave type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <Select
            icon={Filter}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-48"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>
        <div className="w-full sm:w-auto">
          <Select
            icon={Filter}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full sm:w-48"
          >
            <option value="">All Types</option>
            <option value="sick">Sick</option>
            <option value="vacation">Vacation</option>
            <option value="personal">Personal</option>
            <option value="maternity">Maternity</option>
            <option value="paternity">Paternity</option>
            <option value="emergency">Emergency</option>
          </Select>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leave Type
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Range
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Days
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        : request.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : request.status === "cancelled"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-900 mr-2"
                    title="View Details"
                    onClick={() => setViewingRequest(request)}
                  >
                    <Eye size={18} />
                  </Button>
                  {userProfile?.role === "admin" ||
                    (userProfile?.role === "manager" &&
                      request.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-900 mr-2"
                            title="Approve"
                            onClick={() => handleApprove(request.id)}
                          >
                            <CheckCircle size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-900 mr-2"
                            title="Reject"
                            onClick={() => setShowRejectModal(request.id)}
                          >
                            <XCircle size={18} />
                          </Button>
                        </>
                      ))}
                  {(userProfile?.id === request.employeeId ||
                    userProfile?.role === "admin" ||
                    userProfile?.role === "manager") && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-yellow-600 hover:text-yellow-900 mr-2"
                        title="Edit"
                        onClick={() => {
                          setEditingRequest(request);
                          setShowForm(true);
                        }}
                      >
                        <Edit size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                        onClick={() => setShowDeleteConfirm(request.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </>
                  )}
                  {/* {(userProfile?.id === request.employeeId ||
                    userProfile?.role === "admin" ||
                    userProfile?.role === "manager") &&
                    (request.status === "pending" ||
                      request.status === "approved") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-orange-600 hover:text-orange-900 mr-2"
                        title="Cancel Request"
                        onClick={() => setShowCancelConfirm(request.id)}
                      >
                        <Ban size={18} />
                      </Button>
                    )} */}
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this leave request?
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
                onClick={() => handleDelete(showDeleteConfirm)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Leave Request Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(null)}
              >
                Cancel
              </Button>
              <Button
                variant="error"
                onClick={() => handleReject(showRejectModal)}
              >
                Reject Request
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {/* {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <Ban className="text-orange-500 mr-3" size={24} />
              <h3 className="font-bold text-lg">Cancel Leave Request</h3>
            </div>
            <p className="mb-6 text-gray-600">
              Are you sure you want to cancel this leave request? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(null)}
              >
                Keep Request
              </Button>
              <Button
                variant="warning"
                onClick={() => handleCancel(showCancelConfirm)}
              >
                Cancel Request
              </Button>
            </div>
          </div>
        </div>
      )} */}

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
