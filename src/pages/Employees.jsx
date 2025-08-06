@@ .. @@
 "use client"

 import { useState } from "react"
-import { Users, Plus, Search, Edit, Trash2, Mail, Phone, MapPin, Eye } from "lucide-react"
+import { Users, Plus, Search, Edit, Trash2, Mail, Phone, MapPin, Eye, Menu } from "lucide-react"
 import { useEmployees } from "../hooks/useEmployees"
 import { useAuth } from "../contexts/AuthContext"
 import EmployeeForm from "../components/Employees/EmployeeForm"

 const Employees = () => {
   const [searchTerm, setSearchTerm] = useState("")
   const [selectedDepartment, setSelectedDepartment] = useState("")
   const [selectedStatus, setSelectedStatus] = useState("")
   const [showForm, setShowForm] = useState(false)
   const [editingEmployee, setEditingEmployee] = useState(null)
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

   const { userProfile } = useAuth()
   const { employees, loading, error, createEmployee, updateEmployee, deleteEmployee } = useEmployees()

   const departments = ["Teaching Staff", "Administration", "IT Department", "Human Resources", "Maintenance"]

   const filteredEmployees = employees.filter((employee) => {
     const matchesSearch =
       employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
     const matchesDepartment = !selectedDepartment || employee.department === selectedDepartment
     const matchesStatus = !selectedStatus || employee.status === selectedStatus

     return matchesSearch && matchesDepartment && matchesStatus
   })

   const canManageEmployees = userProfile?.role === "admin" || userProfile?.role === "manager"

   const handleCreateEmployee = async (employeeData) => {
     try {
       await createEmployee(employeeData)
       setShowForm(false)
     } catch (error) {
       console.error("Failed to create employee:", error)
     }
   }

   const handleUpdateEmployee = async (employeeData) => {
     if (!editingEmployee) return
     try {
       await updateEmployee(editingEmployee.id, employeeData)
       setEditingEmployee(null)
       setShowForm(false)
     } catch (error) {
       console.error("Failed to update employee:", error)
     }
   }

   const handleDeleteEmployee = async (id) => {
     try {
       await deleteEmployee(id)
       setShowDeleteConfirm(null)
     } catch (error) {
       console.error("Failed to delete employee:", error)
     }
   }

   const getStatusBadge = (status) => {
     const badges = {
       active: "badge badge-success",
       inactive: "badge badge-warning",
       terminated: "badge badge-error",
     }
     return badges[status] || "badge badge-neutral"
   }

   if (loading) {
     return (
       <div className="flex justify-center items-center h-64">
         <span className="loading loading-spinner loading-lg"></span>
       </div>
     )
   }

   if (error) {
     return (
       <div className="alert alert-error">
         <span>{error}</span>
       </div>
     )
   }

   return (
     <div className="space-y-6">
+      {/* Mobile Menu Button */}
+      <div className="lg:hidden flex items-center justify-between mb-4">
+        <h1 className="text-2xl font-bold">Employees</h1>
+        <label htmlFor="drawer-toggle" className="btn btn-ghost btn-circle">
+          <Menu className="h-6 w-6" />
+        </label>
+      </div>
+
       {/* Header */}
-      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
+      <div className="hidden lg:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h1 className="text-3xl font-bold flex items-center gap-2">
             <Users className="h-8 w-8 text-primary" />
             Employees
           </h1>
           <p className="text-base-content/60">Manage your school staff members</p>
         </div>
         {canManageEmployees && (
           <button className="btn btn-primary" onClick={() => setShowForm(true)}>
             <Plus className="h-5 w-5" />
             Add Employee
           </button>
         )}
       </div>