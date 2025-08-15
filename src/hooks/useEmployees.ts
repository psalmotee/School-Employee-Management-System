"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import type { Employee } from "../types";
import toast from "react-hot-toast";
import { getDocs } from "firebase/firestore";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isAuthReady } = useAuth();

  useEffect(() => {
    // Only subscribe to Firestore if the auth state has been determined.
    if (!isAuthReady) {
      return;
    }

    const q = query(collection(db, "employees"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const employeeList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate()
              : new Date(data.createdAt) || new Date(),
            updatedAt: data.updatedAt?.toDate
              ? data.updatedAt.toDate()
              : new Date(data.updatedAt) || new Date(),
            hireDate: data.hireDate?.toDate
              ? data.hireDate.toDate()
              : data.hireDate
              ? new Date(data.hireDate)
              : new Date(),
          };
        }) as Employee[];

        setEmployees(employeeList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching employees:", error);
        setError("Failed to fetch employees.");
        setLoading(false);
        toast.error("Failed to fetch employees");
      }
    );

    return () => unsubscribe();
  }, [isAuthReady]);

  const createEmployee = async (
    employeeData: Omit<Employee, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      setError(null);
      const dataToSave = {
        ...employeeData,
        hireDate: employeeData.hireDate
          ? new Date(employeeData.hireDate)
          : new Date(),
      };
      // Add a flag to indicate the employee has not yet registered
      const docRef = await addDoc(collection(db, "employees"), {
        ...dataToSave,
        isRegistered: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      toast.success("Employee created successfully");
      return docRef.id;
    } catch (error: any) {
      console.error("Error creating employee:", error);
      setError(error.message || "Failed to create employee");
      toast.error("Failed to create employee");
      throw error;
    }
  };

  const findEmployeeByUserId = async (
    userId: string
  ): Promise<Employee | null> => {
    try {
      const q = query(collection(db, "employees"));
      const snapshot = await getDocs(q);

      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (data.userId === userId || data.employeeId === userId) {
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate()
              : new Date(data.createdAt) || new Date(),
            updatedAt: data.updatedAt?.toDate
              ? data.updatedAt.toDate()
              : new Date(data.updatedAt) || new Date(),
            hireDate: data.hireDate?.toDate
              ? data.hireDate.toDate()
              : data.hireDate
              ? new Date(data.hireDate)
              : new Date(),
          } as Employee;
        }
      }
      return null;
    } catch (error) {
      console.error("Error finding employee by userId:", error);
      return null;
    }
  };

  const updateEmployee = async (
    id: string,
    employeeData: Partial<Employee>
  ) => {
    try {
      setError(null);

      let employeeRef = doc(db, "employees", id);
      let employeeDoc = await getDoc(employeeRef);
      let collectionName = "employees";

      if (!employeeDoc.exists()) {
        console.log(
          `[v0] Employee document with ID ${id} not found in employees collection, searching by userId...`
        );
        const foundEmployee = await findEmployeeByUserId(id);

        if (foundEmployee) {
          console.log(
            `[v0] Found employee by userId, using document ID: ${foundEmployee.id}`
          );
          employeeRef = doc(db, "employees", foundEmployee.id);
          employeeDoc = await getDoc(employeeRef);
        }
      }

      if (!employeeDoc.exists()) {
        console.log(
          `[v0] Employee not found in employees collection, checking users collection...`
        );
        employeeRef = doc(db, "users", id);
        employeeDoc = await getDoc(employeeRef);
        collectionName = "users";
      }

      if (!employeeDoc.exists()) {
        const errorMessage = `Employee document with ID ${id} does not exist in either employees or users collection`;
        console.error(errorMessage);
        setError(errorMessage);
        toast.error("Employee not found. Please refresh and try again.");
        throw new Error(errorMessage);
      }

      console.log(`[v0] Updating employee in ${collectionName} collection`);
      await updateDoc(employeeRef, {
        ...employeeData,
        updatedAt: new Date(),
      });
      toast.success("Employee updated successfully");
    } catch (error: any) {
      console.error("Error updating employee:", error);
      setError(error.message || "Failed to update employee");
      toast.error("Failed to update employee");
      throw error;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      setError(null);

      const employeeRef = doc(db, "employees", id);
      const employeeDoc = await getDoc(employeeRef);

      if (!employeeDoc.exists()) {
        const errorMessage = `Employee document with ID ${id} does not exist`;
        console.error(errorMessage);
        setError(errorMessage);
        toast.error("Employee not found. Please refresh and try again.");
        throw new Error(errorMessage);
      }

      await deleteDoc(employeeRef);
      toast.success("Employee deleted successfully");
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      setError(error.message || "Failed to delete employee");
      toast.error("Failed to delete employee");
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
    findEmployeeByUserId,
  };
};
