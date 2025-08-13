"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import type { LeaveRequest } from "../types";

export const useLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userProfile } = useAuth();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading && !userProfile) {
        console.error("User profile not loaded after timeout");
        setError(
          "Unable to load user profile. Please refresh the page or contact support."
        );
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    // Only proceed if userProfile is available and authentication is ready
    if (!userProfile) {
      clearTimeout(timeoutId);
      return;
    }

    clearTimeout(timeoutId);

    let q;
    if (userProfile.role === "employee") {
      // Employees can only see their own requests.
      // Removed orderBy to avoid requiring a composite index.
      q = query(
        collection(db, "leaveRequests"),
        where("employeeId", "==", userProfile.id)
      );
    } else {
      // Managers and admins can see all requests.
      // This query does not require a composite index, so orderBy is fine.
      // We will remove it here for consistency and sort in-memory to prevent a potential error,
      // as the collection query without a where clause might still need an index if there's no single-field index.
      q = query(collection(db, "leaveRequests"));
    }

    // Set up the real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const requestList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          startDate: doc.data().startDate?.toDate() || new Date(),
          endDate: doc.data().endDate?.toDate() || new Date(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as LeaveRequest[];

        // Sort the data by creation date in memory to replace the removed Firestore orderBy clause
        requestList.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        setLeaveRequests(requestList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching leave requests:", err);
        setError("Failed to fetch leave requests.");
        setLoading(false); // Make sure to set loading to false on error
      }
    );

    // Clean up the listener on component unmount
    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [userProfile, loading]);

  const createLeaveRequest = async (
    requestData: Omit<LeaveRequest, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      setError(null);

      // Added validation to prevent undefined employeeName
      if (!requestData.employeeId) {
        throw new Error("Employee ID is required");
      }

      if (!requestData.employeeName) {
        throw new Error("Employee name is required");
      }

      // Validate that all required fields are not undefined
      const validatedData = {
        ...requestData,
        employeeId: requestData.employeeId,
        employeeName: requestData.employeeName,
        leaveType: requestData.leaveType || "sick",
        startDate: requestData.startDate,
        endDate: requestData.endDate,
        days: requestData.days || 0,
        reason: requestData.reason || "",
        status: requestData.status || "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Creating leave request with data:", validatedData);

      await addDoc(collection(db, "leaveRequests"), validatedData);
    } catch (error: any) {
      console.error("Error creating leave request:", error);
      setError(error.message || "Failed to create leave request");
      throw error;
    }
  };

  const updateLeaveRequest = async (
    id: string,
    requestData: Partial<LeaveRequest>
  ) => {
    try {
      setError(null);
      await updateDoc(doc(db, "leaveRequests", id), {
        ...requestData,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      console.error("Error updating leave request:", error);
      setError(error.message || "Failed to update leave request");
      throw error;
    }
  };

  const deleteLeaveRequest = async (id: string) => {
    try {
      setError(null);
      await deleteDoc(doc(db, "leaveRequests", id));
    } catch (error: any) {
      console.error("Error deleting leave request:", error);
      setError(error.message || "Failed to delete leave request");
      throw error;
    }
  };

  const approveLeaveRequest = async (id: string, approvedBy: string) => {
    await updateLeaveRequest(id, {
      status: "approved",
      approvedBy,
      approvedAt: new Date(),
    });
  };

  const rejectLeaveRequest = async (
    id: string,
    approvedBy: string,
    rejectionReason?: string
  ) => {
    await updateLeaveRequest(id, {
      status: "rejected",
      approvedBy,
      rejectionReason,
      approvedAt: new Date(),
    });
  };

  const cancelLeaveRequest = async (id: string, cancelledBy: string) => {
    await updateLeaveRequest(id, {
      status: "cancelled",
      cancelledBy,
      cancelledAt: new Date(),
    });
  };

  const getPendingRequests = () => {
    return leaveRequests.filter((req) => req.status === "pending");
  };

  const getRequestsByStatus = (status: "pending" | "approved" | "rejected") => {
    return leaveRequests.filter((req) => req.status === status);
  };

  return {
    leaveRequests,
    loading,
    error,
    createLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    cancelLeaveRequest,
    getPendingRequests,
    getRequestsByStatus,
  };
};
