"use client"

import type React from "react"
import { useState } from "react"
import { Calendar, Plus, Search, CheckCircle, XCircle, Clock, Eye, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { useLeaveRequests } from "../hooks/useLeaveRequests"
import { useAuth } from "../contexts/AuthContext"
import LeaveRequestForm from "../components/LeaveRequests/LeaveRequestForm"
import type { LeaveRequest } from "../types"

const LeaveRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingRequest, setEditingRequest] = useState<LeaveRequest | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const { userProfile } = useAuth()
  const {
    leaveRequests,
    loading,
    error,
    createLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
  } = useLeaveRequests()

  const leaveTypes = ["sick", "vacation", "personal", "maternity", "paternity", "emergency"]

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !selectedStatus || request.status === selectedStatus
    const matchesType = !selectedType || request.leaveType === selectedType

    return matchesSearch && matchesStatus && matchesType
  })

  const canManageRequests = userProfile?.role === "admin" || userProfile?.role === "manager"
  const canCreateRequest = userProfile?.role === "employee"

  const handleCreateRequest = async (requestData: Omit<LeaveRequest, "id" | "createdAt" | "updatedAt">) => {
    try {
      await createLeaveRequest(requestData)
      setShowForm(false)
    } catch (error) {
      console.error("Failed to create leave request:", error)
    }
  }

  const handleUpdateRequest = async (requestData: Omit<LeaveRequest, "id" | "createdAt" | "updatedAt">) => {
    if (!editingRequest) return
    try {
      await updateLeaveRequest(editingRequest.id, requestData)
      setEditingRequest(null)
      setShowForm(false)
    } catch (error) {
      console.error("Failed to update leave request:", error)
    }
  }

  const handleDeleteRequest = async (id: string) => {
    try {
      await deleteLeaveRequest(id)
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error("Failed to delete leave request:", error)
    }
  }

  const handleApprove = async (id: string) => {
    if (!userProfile) return
    try {
      await approveLeaveRequest(id, userProfile.name)
    } catch (error) {
      console.error("Failed to approve leave request:", error)
    }
  }

  const handleReject = async (id: string) => {
    if (!userProfile) return
    try {
      await rejectLeaveRequest(id, userProfile.name, rejectionReason)
      setShowRejectModal(null)
      setRejectionReason("")
    } catch (error) {
      console.error("Failed to reject leave request:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-success" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-error" />
      default:
        return <Clock className="h-5 w-5 text-warning" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "badge"
    switch (status) {
      case "approved":
        return `${baseClasses} badge-success`
      case "rejected":
        return `${baseClasses} badge-error`
      default:
        return `${baseClasses} badge-warning`
    }
  }

  const getLeaveTypeBadge = (type: string) => {
    const colors = {
      sick: "badge-error",
      vacation: "badge-primary",
      personal: "badge-secondary",
      maternity: "badge-accent",
      paternity: "badge-accent",
      emergency: "badge-warning",
    }
    return `badge ${colors[type as keyof typeof colors] || "badge-neutral"}`
  }

  const canEditRequest = (request: LeaveRequest) => {
    return request.employeeId === userProfile?.id && request.status === "pending"
  }

  const canDeleteRequest = (request: LeaveRequest) => {
    return request.employeeId === userProfile?.id && request.status === "pending"
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Leave Requests
          </h1>
          <p className="text-base-content/60">Manage employee leave applications</p>
        </div>
        {canCreateRequest && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus className="h-5 w-5" />
            New Request
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="form-control flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by employee name or ID..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
              </div>
            </div>

            <div className="form-control">
              <select
                className="select select-bordered"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="form-control">
              <select
                className="select select-bordered"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                {leaveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Duration</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-10">
                            <span className="text-sm">
                              {request.employeeName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{request.employeeName}</div>
                          <div className="text-sm opacity-50">{request.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={getLeaveTypeBadge(request.leaveType)}>
                        {request.leaveType.charAt(0).toUpperCase() + request.leaveType.slice(1)}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-medium">
                          {request.days} day{request.days > 1 ? "s" : ""}
                        </div>
                        <div className="text-sm opacity-50">
                          {format(request.startDate, "MMM dd")} - {format(request.endDate, "MMM dd")}
                        </div>
                      </div>
                    </td>
                    <td>{format(request.createdAt, "MMM dd, yyyy")}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <div className={getStatusBadge(request.status)}>{request.status}</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm">
                          <Eye className="h-4 w-4" />
                        </button>
                        {canEditRequest(request) && (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => {
                              setEditingRequest(request)
                              setShowForm(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {canDeleteRequest(request) && (
                          <button
                            className="btn btn-ghost btn-sm text-error"
                            onClick={() => setShowDeleteConfirm(request.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        {canManageRequests && request.status === "pending" && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => handleApprove(request.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button className="btn btn-error btn-sm" onClick={() => setShowRejectModal(request.id)}>
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No leave requests found</h3>
          <p className="text-base-content/60 mb-4">
            {searchTerm || selectedStatus || selectedType
              ? "Try adjusting your search criteria"
              : "No leave requests have been submitted yet"}
          </p>
          {canCreateRequest && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Plus className="h-5 w-5" />
              Submit Request
            </button>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Requests</div>
          <div className="stat-value text-primary">{leaveRequests.length}</div>
          <div className="stat-desc">All time</div>
        </div>

        <div className="stat">
          <div className="stat-title">Pending</div>
          <div className="stat-value text-warning">{leaveRequests.filter((r) => r.status === "pending").length}</div>
          <div className="stat-desc">Awaiting approval</div>
        </div>

        <div className="stat">
          <div className="stat-title">Approved</div>
          <div className="stat-value text-success">{leaveRequests.filter((r) => r.status === "approved").length}</div>
          <div className="stat-desc">This month</div>
        </div>

        <div className="stat">
          <div className="stat-title">Rejected</div>
          <div className="stat-value text-error">{leaveRequests.filter((r) => r.status === "rejected").length}</div>
          <div className="stat-desc">This month</div>
        </div>
      </div>

      {/* Leave Request Form Modal */}
      {showForm && (
        <LeaveRequestForm
          leaveRequest={editingRequest || undefined}
          onSubmit={editingRequest ? handleUpdateRequest : handleCreateRequest}
          onClose={() => {
            setShowForm(false)
            setEditingRequest(null)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this leave request? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={() => handleDeleteRequest(showDeleteConfirm)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
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
              <button className="btn btn-outline" onClick={() => setShowRejectModal(null)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={() => handleReject(showRejectModal)}>
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaveRequests
