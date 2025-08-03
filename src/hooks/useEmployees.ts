"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "../lib/firebase"
import type { Employee } from "../types"

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const q = query(collection(db, "employees"), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const employeeList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          hireDate: doc.data().hireDate?.toDate() || new Date(),
        })) as Employee[]

        setEmployees(employeeList)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching employees:", error)
        setError("Failed to fetch employees")
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  const createEmployee = async (employeeData: Omit<Employee, "id" | "createdAt" | "updatedAt">) => {
    try {
      setError(null)
      const docRef = await addDoc(collection(db, "employees"), {
        ...employeeData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      return docRef.id
    } catch (error: any) {
      console.error("Error creating employee:", error)
      setError(error.message || "Failed to create employee")
      throw error
    }
  }

  const updateEmployee = async (id: string, employeeData: Partial<Employee>) => {
    try {
      setError(null)
      await updateDoc(doc(db, "employees", id), {
        ...employeeData,
        updatedAt: new Date(),
      })
    } catch (error: any) {
      console.error("Error updating employee:", error)
      setError(error.message || "Failed to update employee")
      throw error
    }
  }

  const deleteEmployee = async (id: string) => {
    try {
      setError(null)
      await deleteDoc(doc(db, "employees", id))
    } catch (error: any) {
      console.error("Error deleting employee:", error)
      setError(error.message || "Failed to delete employee")
      throw error
    }
  }

  const getEmployeesByDepartment = (department: string) => {
    return employees.filter((emp) => emp.department === department)
  }

  const getEmployeesByStatus = (status: "active" | "inactive" | "terminated") => {
    return employees.filter((emp) => emp.status === status)
  }

  return {
    employees,
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeesByDepartment,
    getEmployeesByStatus,
  }
}
