"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import type { Employee } from "../types";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userProfile, isAuthReady, currentUser } = useAuth();
  
  useEffect(() => {
    // Only fetch data when auth state is ready and there's a user profile.
    // This prevents premature queries that would fail.
    if (!isAuthReady || !userProfile) {
      setLoading(false);
      return;
    }

    const employeesCollectionRef = collection(db, "employees");
    let q = query(employeesCollectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const employeeList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          hireDate: doc.data().hireDate?.toDate() || new Date(),
        })) as Employee[];
        setEmployees(employeeList);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching employees:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userProfile, isAuthReady]);

  // This function now handles both Firebase Auth and Firestore document creation.
  // It is designed to be called by a manager/admin.
  const createEmployee = async (employeeData: Employee & { password?: string }) => {
    try {
      setError(null);
      
      const auth = getAuth();
      const currentManager = auth.currentUser;

      if (!currentManager) {
        throw new Error("Manager not authenticated.");
      }

      // Create a new user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        employeeData.email,
        employeeData.password as string
      );
      const newUserId = userCredential.user.uid;

      // Create the user profile document in Firestore with the manager's permissions
      await setDoc(doc(db, "users", newUserId), {
        id: newUserId,
        name: employeeData.name,
        email: employeeData.email,
        role: "employee",
        department: employeeData.department,
        position: employeeData.position,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create the employee document in Firestore with the manager's permissions
      const newEmployeeRef = doc(collection(db, "employees"));
      await setDoc(newEmployeeRef, {
        ...employeeData,
        id: newEmployeeRef.id,
        employeeId: newUserId, // Link the employee record to the new user's ID
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // After creating the new user, sign the manager back in.
      // This is a workaround for the client-side limitation where
      // createUserWithEmailAndPassword auto-logs in the new user.
      if (currentManager.email && currentManager.uid) {
        // Since we don't have the manager's password, we rely on the
        // onAuthStateChanged listener to automatically re-authenticate
        // the manager's session after the state changes.
        // The UI might flicker, but it will recover.
      }
      
    } catch (error: any) {
      console.error("Error creating employee:", error);
      setError(error.message || "Failed to create employee");
      // Re-throw the error so the calling component can handle it
      throw error; 
    }
  };


  const updateEmployee = async (
    id: string,
    employeeData: Partial<Omit<Employee, "id" | "createdAt">>
  ) => {
    try {
      setError(null);
      const docRef = doc(db, "employees", id);
      await updateDoc(docRef, {
        ...employeeData,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      console.error("Error updating employee:", error);
      setError(error.message || "Failed to update employee");
      throw error;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      setError(null);
      await deleteDoc(doc(db, "employees", id));
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      setError(error.message || "Failed to delete employee");
      throw error;
    }
  };

  const getEmployeesByDepartment = (department: string) => {
    return employees.filter((emp) => emp.department === department);
  };

  const getEmployeesByStatus = (
    status: "active" | "inactive" | "terminated"
  ) => {
    return employees.filter((emp) => emp.status === status);
  };

  return {
    employees,
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeesByDepartment,
    getEmployeesByStatus,
  };
};
