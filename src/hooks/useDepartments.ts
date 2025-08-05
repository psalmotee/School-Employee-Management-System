"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db, Timestamp } from "../lib/firebase";
import type { Department } from "../types";

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "departments"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const departmentsData: Department[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            managerName: data.managerName || null,
            employeeCount: data.employeeCount || 0,
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate()
                : new Date(),
            updatedAt:
              data.updatedAt instanceof Timestamp
                ? data.updatedAt.toDate()
                : new Date(),
          } as Department;
        });
        setDepartments(departmentsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching departments:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getDepartmentById = useCallback(
    async (id: string): Promise<Department | null> => {
      try {
        const docRef = doc(db, "departments", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: data.name,
            description: data.description,
            managerName: data.managerName || null,
            employeeCount: data.employeeCount || 0,
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate()
                : new Date(),
            updatedAt:
              data.updatedAt instanceof Timestamp
                ? data.updatedAt.toDate()
                : new Date(),
          } as Department;
        }
        return null;
      } catch (err: any) {
        console.error("Error getting department by ID:", err);
        setError(err.message);
        return null;
      }
    },
    []
  );

  const addDepartment = useCallback(
    async (
      departmentData: Omit<
        Department,
        "id" | "createdAt" | "updatedAt" | "employeeCount"
      >
    ) => {
      try {
        await addDoc(collection(db, "departments"), {
          ...departmentData,
          employeeCount: 0, // Initialize employee count
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err: any) {
        console.error("Error adding department:", err);
        throw new Error(err.message);
      }
    },
    []
  );

  const updateDepartment = useCallback(
    async (
      id: string,
      departmentData: Partial<
        Omit<Department, "id" | "createdAt" | "employeeCount">
      >
    ) => {
      try {
        const docRef = doc(db, "departments", id);
        await updateDoc(docRef, {
          ...departmentData,
          updatedAt: serverTimestamp(),
        });
      } catch (err: any) {
        console.error("Error updating department:", err);
        throw new Error(err.message);
      }
    },
    []
  );

  const deleteDepartment = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, "departments", id));
    } catch (err: any) {
      console.error("Error deleting department:", err);
      throw new Error(err.message);
    }
  }, []);

  return {
    departments,
    loading,
    error,
    getDepartmentById,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  };
};
