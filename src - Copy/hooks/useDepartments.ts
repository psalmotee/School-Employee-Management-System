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
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Department } from "../types";

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "departments"), orderBy("name"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const departmentList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Department[];

        setDepartments(departmentList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching departments:", error);
        // Provide a more specific error message to the user
        setError(
          `Failed to fetch departments. Please check your Firestore security rules. Error: ${error.message}`
        );
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const createDepartment = async (
    departmentData: Omit<Department, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      setError(null);
      const docRef = await addDoc(collection(db, "departments"), {
        ...departmentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error: any) {
      console.error("Error creating department:", error);
      setError(error.message || "Failed to create department");
      throw error;
    }
  };

  const updateDepartment = async (
    id: string,
    departmentData: Partial<Department>
  ) => {
    try {
      setError(null);
      await updateDoc(doc(db, "departments", id), {
        ...departmentData,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      console.error("Error updating department:", error);
      setError(error.message || "Failed to update department");
      throw error;
    }
  };

  const deleteDepartment = async (id: string) => {
    try {
      setError(null);
      await deleteDoc(doc(db, "departments", id));
    } catch (error: any) {
      console.error("Error deleting department:", error);
      setError(error.message || "Failed to delete department");
      throw error;
    }
  };

  const getDepartmentById = (id: string) => {
    return departments.find((dep) => dep.id === id);
  };

  return {
    departments,
    loading,
    error,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentById,
  };
};
