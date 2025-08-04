"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  where,
  getDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth"; 
import { db, Timestamp, auth } from "../lib/firebase"; 
import type { Employee, UserRole } from "../types";

export const useEmployees = (
  userRole?: UserRole,
  departmentId?: string | null
) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let q = query(collection(db, "employees"), orderBy("name", "asc"));

    if (userRole === "manager" && departmentId) {
      q = query(q, where("departmentId", "==", departmentId));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const employeesData: Employee[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            dateOfBirth:
              data.dateOfBirth instanceof Timestamp
                ? data.dateOfBirth.toDate()
                : new Date(),
            hireDate:
              data.hireDate instanceof Timestamp
                ? data.hireDate.toDate()
                : new Date(),
            jobTitle: data.jobTitle,
            department: data.department,
            departmentId: data.departmentId,
            salary: data.salary,
            status: data.status,
            role: data.role,
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate()
                : new Date(),
            updatedAt:
              data.updatedAt instanceof Timestamp
                ? data.updatedAt.toDate()
                : new Date(),
          } as Employee;
        });
        setEmployees(employeesData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching employees:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userRole, departmentId]);

  const getEmployeeById = useCallback(
    async (id: string): Promise<Employee | null> => {
      try {
        const docRef = doc(db, "employees", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            userId: data.userId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            dateOfBirth:
              data.dateOfBirth instanceof Timestamp
                ? data.dateOfBirth.toDate()
                : new Date(),
            hireDate:
              data.hireDate instanceof Timestamp
                ? data.hireDate.toDate()
                : new Date(),
            jobTitle: data.jobTitle,
            department: data.department,
            departmentId: data.departmentId,
            salary: data.salary,
            status: data.status,
            role: data.role,
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate()
                : new Date(),
            updatedAt:
              data.updatedAt instanceof Timestamp
                ? data.updatedAt.toDate()
                : new Date(),
          } as Employee;
        }
        return null;
      } catch (err: any) {
        console.error("Error getting employee by ID:", err);
        setError(err.message);
        return null;
      }
    },
    []
  );

  const addEmployee = useCallback(
    async (
      employeeData: Omit<Employee, "id" | "createdAt" | "updatedAt" | "userId">,
      password?: string
    ) => {
      try {
        let userId = employeeData.email; // Default to email if no auth user is created

        if (password) {
          // Create user in Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            employeeData.email,
            password
          );
          userId = userCredential.user.uid;
        }

        await addDoc(collection(db, "employees"), {
          ...employeeData,
          userId: userId, // Link to Firebase Auth UID
          dateOfBirth: Timestamp.fromDate(employeeData.dateOfBirth),
          hireDate: Timestamp.fromDate(employeeData.hireDate),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err: any) {
        console.error("Error adding employee:", err);
        throw new Error(err.message);
      }
    },
    []
  );

  const updateEmployee = useCallback(
    async (
      id: string,
      employeeData: Partial<Omit<Employee, "id" | "createdAt">>
    ) => {
      try {
        const docRef = doc(db, "employees", id);
        await updateDoc(docRef, {
          ...employeeData,
          dateOfBirth: employeeData.dateOfBirth
            ? Timestamp.fromDate(employeeData.dateOfBirth)
            : undefined,
          hireDate: employeeData.hireDate
            ? Timestamp.fromDate(employeeData.hireDate)
            : undefined,
          updatedAt: serverTimestamp(),
        });
      } catch (err: any) {
        console.error("Error updating employee:", err);
        throw new Error(err.message);
      }
    },
    []
  );

  const deleteEmployee = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, "employees", id));
    } catch (err: any) {
      console.error("Error deleting employee:", err);
      throw new Error(err.message);
    }
  }, []);

  return {
    employees,
    loading,
    error,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
