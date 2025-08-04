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
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

export const useLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userProfile } = useAuth();

  useEffect(() => {
    if (!userProfile) return;

    let q;
    if (userProfile.role === "employee") {
      // Employees can only see their own requests
      q = query(
        collection(db, "leaveRequests"),
        where("employeeId", "==", userProfile.id),
        orderBy("createdAt", "desc")
      );
    } else {
      // Managers and admins can see all requests
      q = query(collection(db, "leaveRequests"), orderBy("createdAt", "desc"));
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
          approvedAt: doc.data().approvedAt?.toDate(),
        }));

        setLeaveRequests(requestList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching leave requests:", error);
        setError("Failed to fetch leave requests");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userProfile]);

  const createLeaveRequest = async (requestData) => {
    try {
      setError(null);
      const docRef = await addDoc(collection(db, "leaveRequests"), {
        ...requestData,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating leave request:", error);
      setError(error.message || "Failed to create leave request");
      throw error;
    }
  };

  const updateLeaveRequest = async (id, requestData) => {
    try {
      setError(null);
      await updateDoc(doc(db, "leaveRequests", id), {
        ...requestData,
        updatedAt: new Date(),
        ...(requestData.status &&
          requestData.status !== "pending" && { approvedAt: new Date() }),
      });
    } catch (error) {
      console.error("Error updating leave request:", error);
      setError(error.message || "Failed to update leave request");
      throw error;
    }
  };

  const deleteLeaveRequest = async (id) => {
    try {
      setError(null);
      await deleteDoc(doc(db, "leaveRequests", id));
    } catch (error) {
      console.error("Error deleting leave request:", error);
      setError(error.message || "Failed to delete leave request");
      throw error;
    }
  };

  const approveLeaveRequest = async (id, approvedBy) => {
    await updateLeaveRequest(id, {
      status: "approved",
      approvedBy,
      approvedAt: new Date(),
    });
  };

  const rejectLeaveRequest = async (id, approvedBy, rejectionReason) => {
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

  const getRequestsByStatus = (status) => {
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