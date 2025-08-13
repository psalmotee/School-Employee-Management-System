"use client";

import React from "react";
import { X, Calendar, User, Info, CheckCircle, XCircle } from "lucide-react";
import type { LeaveRequest } from "../../types";
import Button from "../../components/ui/Button";


interface LeaveRequestDetailsProps {
  request: LeaveRequest;
  onClose: () => void;
}

const LeaveRequestDetails: React.FC<LeaveRequestDetailsProps> = ({
  request,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-base-200">
          <h2 className="text-2xl font-bold">Leave Request Details</h2>
          <Button onClick={onClose} variant="ghost" size="sm" className="btn-circle">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold text-lg">{request.employeeName}</p>
              <p className="text-sm text-base-content/70">
                Employee ID: {request.employeeId}
              </p>
            </div>
          </div>

          <div className="divider"></div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-accent" />
              <p className="font-medium">Leave Type:</p>
              <span className="badge badge-lg badge-info">
                {request.leaveType}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-success" />
              <p className="font-medium">Dates:</p>
              <p>
                {new Date(request.startDate).toLocaleDateString()} to{" "}
                {new Date(request.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-success" />
              <p className="font-medium">Days:</p>
              <p>{request.days}</p>
            </div>
            <div className="flex items-center space-x-2">
              {request.status === "approved" ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : request.status === "rejected" ? (
                <XCircle className="h-5 w-5 text-error" />
              ) : (
                <Info className="h-5 w-5 text-warning" />
              )}
              <p className="font-medium">Status:</p>
              <span
                className={`badge badge-lg ${
                  request.status === "approved"
                    ? "badge-success"
                    : request.status === "rejected"
                    ? "badge-error"
                    : "badge-warning"
                }`}
              >
                {request.status}
              </span>
            </div>
          </div>

          <div className="divider"></div>

          <div className="space-y-2">
            <p className="font-medium">Reason:</p>
            <p className="bg-base-200 p-4 rounded-lg">{request.reason}</p>
          </div>

          {request.rejectionReason && (
            <div className="space-y-2">
              <p className="font-medium text-error">Rejection Reason:</p>
              <p className="bg-base-200 p-4 rounded-lg text-error">
                {request.rejectionReason}
              </p>
            </div>
          )}

          {request.approvedBy && (
            <div className="space-y-2">
              <p className="font-medium text-success">Approved By:</p>
              <p className="bg-base-200 p-4 rounded-lg text-success">
                {request.approvedBy} on{" "}
                {new Date(request.approvedAt as Date).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-base-200 flex justify-end">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestDetails;
