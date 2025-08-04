"use client";
import { useState, useEffect, useCallback } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

export function useDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const departmentsCollectionRef = collection(db, "departments");

  const getDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(departmentsCollectionRef, orderBy("name", "asc"));
      const data = await getDocs(q);
      const fetchedDepartments = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt
          ? doc.data().updatedAt.toDate()
          : doc.data().createdAt.toDate(),
      }));
      setDepartments(fetchedDepartments);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  const addDepartment = async (department) => {
    setLoading(true);
    try {
      const newDepartment = {
        ...department,
        employeeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await addDoc(departmentsCollectionRef, newDepartment);
      await getDepartments();
      return { success: true };
    } catch (err) {
      console.error("Error adding department:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (id, department) => {
    setLoading(true);
    try {
      const departmentDoc = doc(db, "departments", id);
      await updateDoc(departmentDoc, { ...department, updatedAt: new Date() });
      await getDepartments();
      return { success: true };
    } catch (err) {
      console.error("Error updating department:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id) => {
    setLoading(true);
    try {
      const departmentDoc = doc(db, "departments", id);
      await deleteDoc(departmentDoc);
      await getDepartments();
      return { success: true };
    } catch (err) {
      console.error("Error deleting department:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    departments,
    loading,
    error,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartments,
  };
}