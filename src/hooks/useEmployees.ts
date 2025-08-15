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
      return docRef.id;
    } catch (error: any) {
      console.error("Error creating employee:", error);
      setError(error.message || "Failed to create employee");
      throw error;
    }
  };

  const findEmployeeByUserId = async (
    userId: string
  ): Promise<{ employee: Employee; collection: string } | null> => {
    try {
      // First check employees collection
      const employeesQuery = query(collection(db, "employees"));
      const employeesSnapshot = await getDocs(employeesQuery);

      for (const doc of employeesSnapshot.docs) {
        const data = doc.data();
        if (data.userId === userId || data.employeeId === userId) {
          return {
            employee: {
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
            } as Employee,
            collection: "employees",
          };
        }
      }

      // Then check users collection
      const usersQuery = query(collection(db, "users"));
      const usersSnapshot = await getDocs(usersQuery);

      for (const doc of usersSnapshot.docs) {
        const data = doc.data();
        if (data.userId === userId || doc.id === userId) {
          return {
            employee: {
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
            } as Employee,
            collection: "users",
          };
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
      console.log(`[v0] === EMPLOYEE UPDATE DEBUG START ===`);
      console.log(`[v0] Input ID: ${id}`);
      console.log(`[v0] Employee data to update:`, employeeData);

      const foundEmployee = await findEmployeeByUserId(id);

      if (foundEmployee) {
        console.log(`[v0] Found employee via userId search:`);
        console.log(`[v0] - Collection: ${foundEmployee.collection}`);
        console.log(`[v0] - Document ID: ${foundEmployee.employee.id}`);
        console.log(`[v0] - Employee data:`, foundEmployee.employee);

        const employeeRef = doc(
          db,
          foundEmployee.collection,
          foundEmployee.employee.id
        );
        console.log(
          `[v0] Attempting to update document at: ${foundEmployee.collection}/${foundEmployee.employee.id}`
        );

        await updateDoc(employeeRef, {
          ...employeeData,
          updatedAt: new Date(),
        });

        console.log(
          `[v0] Successfully updated employee in ${foundEmployee.collection} collection`
        );
        console.log(`[v0] === EMPLOYEE UPDATE DEBUG END (SUCCESS) ===`);
        return;
      }

      console.log(
        `[v0] Employee not found via userId search, trying direct document ID lookup`
      );

      let employeeRef = doc(db, "employees", id);
      let employeeDoc = await getDoc(employeeRef);
      let collectionName = "employees";

      console.log(`[v0] Checking employees collection for document ID: ${id}`);
      console.log(`[v0] Document exists in employees: ${employeeDoc.exists()}`);

      if (!employeeDoc.exists()) {
        console.log(
          `[v0] Not found in employees, checking users collection...`
        );
        employeeRef = doc(db, "users", id);
        employeeDoc = await getDoc(employeeRef);
        collectionName = "users";
        console.log(`[v0] Document exists in users: ${employeeDoc.exists()}`);
      }

      if (!employeeDoc.exists()) {
        const errorMessage = `Employee document with ID ${id} does not exist in either employees or users collection`;
        console.error(`[v0] ${errorMessage}`);
        console.log(
          `[v0] === EMPLOYEE UPDATE DEBUG END (FAILED - NOT FOUND) ===`
        );
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      console.log(
        `[v0] Found document in ${collectionName} collection, attempting update...`
      );
      console.log(`[v0] Document data:`, employeeDoc.data());

      await updateDoc(employeeRef, {
        ...employeeData,
        updatedAt: new Date(),
      });

      console.log(
        `[v0] Successfully updated employee in ${collectionName} collection`
      );
      console.log(`[v0] === EMPLOYEE UPDATE DEBUG END (SUCCESS) ===`);
    } catch (error: any) {
      console.error(`[v0] Error updating employee:`, error);
      console.log(`[v0] Error type:`, error.constructor.name);
      console.log(`[v0] Error code:`, error.code);
      console.log(`[v0] Error message:`, error.message);
      console.log(`[v0] === EMPLOYEE UPDATE DEBUG END (FAILED - ERROR) ===`);
      setError(error.message || "Failed to update employee");
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
        throw new Error(errorMessage);
      }

      await deleteDoc(employeeRef);
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
    findEmployeeByUserId,
  };
};
