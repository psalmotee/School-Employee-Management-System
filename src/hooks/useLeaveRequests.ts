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
    // We must wait for the user profile to be ready before fetching data
    if (!userProfile) {
      setLoading(false);
      return;
    }

    let q;
    // Admins and managers can see all requests, while employees can only see their own
    if (userProfile.role === "employee") {
      q = query(
        collection(db, "leaveRequests"),
        // This query now only filters by employeeId
        where("employeeId", "==", userProfile.id)
      );
    } else {
      q = query(collection(db, "leaveRequests"));
    }

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

        // Sort the data client-side after fetching
        const sortedRequestList = requestList.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        setLeaveRequests(sortedRequestList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching leave requests:", error);
        setError("Failed to fetch leave requests.");
        setLoading(false);
      }
    );

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [userProfile]);

  const createLeaveRequest = async (
    leaveRequestData: Omit<LeaveRequest, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      setError(null);
      const dataToSave = {
        ...leaveRequestData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await addDoc(collection(db, "leaveRequests"), dataToSave);
      return docRef.id;
    } catch (error: any) {
      console.error("Error creating leave request:", error);
      setError(error.message || "Failed to create leave request");
      throw error;
    }
  };

  const updateLeaveRequest = async (
    id: string,
    leaveRequestData: Partial<LeaveRequest>
  ) => {
    try {
      setError(null);
      await updateDoc(doc(db, "leaveRequests", id), {
        ...leaveRequestData,
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
    getPendingRequests,
    getRequestsByStatus,
  };
};
