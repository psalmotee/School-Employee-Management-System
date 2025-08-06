@@ .. @@
 "use client";

+import { useState } from "react";
 import {
   Users,
   Calendar,
   Building2,
   TrendingUp,
   Clock,
   CheckCircle,
   XCircle,
   AlertCircle,
+  Menu,
 } from "lucide-react";
 import { useAuth } from "../contexts/AuthContext";
 import { useEmployees } from "../hooks/useEmployees";
 import { useLeaveRequests } from "../hooks/useLeaveRequests";
 import { useDepartments } from "../hooks/useDepartments";
 import { Link } from "react-router-dom";

 const Dashboard = () => {
   const { userProfile } = useAuth();
   const { employees, loading: employeesLoading } = useEmployees();
   const { leaveRequests, loading: leaveRequestsLoading } = useLeaveRequests();
   const { departments, loading: departmentsLoading } = useDepartments();

   const totalEmployees = employees.length;
   const activeDepartments = departments.length;
   const pendingLeaveRequests = leaveRequests.filter(
     (req) => req.status === "pending"
   ).length;
   const thisMonthLeaves = leaveRequests.filter((req) => {
     const now = new Date();
     const reqDate = new Date(req.startDate);
     return (
       reqDate.getMonth() === now.getMonth() &&
       reqDate.getFullYear() === now.getFullYear()
     );
   }).length;

   const recentLeaveRequestsDisplay = leaveRequests
     .sort((a, b) => {
       const aDate =
         a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
       const bDate =
         b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
       return bDate.getTime() - aDate.getTime();
     })
     .slice(0, 3); // Show top 3 recent requests

   const stats = [
     {
       title: "Total Employees",
       value: employeesLoading ? "..." : totalEmployees.toString(),
       change: "+12%", // Placeholder, would need historical data for real change
       changeType: "increase",
       icon: Users,
       color: "bg-primary",
     },
     {
       title: "Active Departments",
       value: departmentsLoading ? "..." : activeDepartments.toString(),
       change: "+2", // Placeholder
       changeType: "increase",
       icon: Building2,
       color: "bg-secondary",
     },
     {
       title: "Pending Requests",
       value: leaveRequestsLoading ? "..." : pendingLeaveRequests.toString(),
       change: "-5", // Placeholder
       changeType: "decrease",
       icon: Clock,
       color: "bg-warning",
     },
     {
       title: "This Month Leaves",
       value: leaveRequestsLoading ? "..." : thisMonthLeaves.toString(),
       change: "+8%", // Placeholder
       changeType: "increase",
       icon: Calendar,
       color: "bg-info",
     },
   ];

   const getStatusIcon = (status) => {
     switch (status) {
       case "approved":
         return <CheckCircle className="h-5 w-5 text-success" />;
       case "rejected":
         return <XCircle className="h-5 w-5 text-error" />;
       default:
         return <AlertCircle className="h-5 w-5 text-warning" />;
     }
   };

   const getStatusBadge = (status) => {
     const baseClasses = "badge badge-sm";
     switch (status) {
       case "approved":
         return `${baseClasses} badge-success`;
       case "rejected":
         return `${baseClasses} badge-error`;
       default:
         return `${baseClasses} badge-warning`;
     }
   };

   return (
     <div className="space-y-6">
+      {/* Mobile Menu Button */}
+      <div className="lg:hidden flex items-center justify-between mb-4">
+        <h1 className="text-2xl font-bold">Dashboard</h1>
+        <label htmlFor="drawer-toggle" className="btn btn-ghost btn-circle">
+          <Menu className="h-6 w-6" />
+        </label>
+      </div>
+
       {/* Welcome Section */}
       <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-primary-content">
         <h1 className="text-3xl font-bold mb-2">
           Welcome back, {userProfile?.name}! 👋
         </h1>
         <p className="text-primary-content/80">
           Here's what's happening in your school today.
         </p>
       </div>