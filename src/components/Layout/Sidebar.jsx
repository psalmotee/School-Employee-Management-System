@@ .. @@
 "use client"

-import { Link, useLocation } from "react-router-dom"
-import { LayoutDashboard, Users, Calendar, Building2, FileText, Settings, User } from "lucide-react"
+import { Link, useLocation, useNavigate } from "react-router-dom"
+import { 
+  LayoutDashboard, 
+  Users, 
+  Calendar, 
+  Building2, 
+  FileText, 
+  Settings, 
+  User, 
+  Bell,
+  LogOut,
+  GraduationCap,
+  Menu,
+  X
+} from "lucide-react"
 import { useAuth } from "../../contexts/AuthContext"

 const Sidebar = () => {
   const location = useLocation()
-  const { userProfile } = useAuth()
+  const navigate = useNavigate()
+  const { userProfile, logout } = useAuth()
+
+  const handleLogout = async () => {
+    try {
+      await logout()
+      navigate("/login")
+    } catch (error) {
+      console.error("Failed to logout:", error)
+    }
+  }

   const menuItems = [
     { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
     { path: "/employees", icon: Users, label: "Employees", adminOnly: false },
     { path: "/leave-requests", icon: Calendar, label: "Leave Requests" },
-    { path: "/departments", icon: Building2, label: "Departments"},
+    { path: "/departments", icon: Building2, label: "Departments" },
     { path: "/admin", icon: Settings, label: "Administration", adminOnly: true },
     { path: "/reports", icon: FileText, label: "Reports", adminOnly: true },
+    { path: "/notifications", icon: Bell, label: "Notifications" },
     { path: "/profile", icon: User, label: "Profile" },
+    { path: "/settings", icon: Settings, label: "Settings" },
   ]

   const filteredMenuItems = menuItems.filter(
-    (item) => !item.adminOnly || userProfile?.role === "admin" || userProfile?.role === "manager",
+    (item) => !item.adminOnly || userProfile?.role === "admin" || userProfile?.role === "manager"
   )

   return (
     <div className="drawer-side">
       <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
-      <aside className="w-64 min-h-full bg-base-200">
+      <aside className="w-64 min-h-full bg-base-200 flex flex-col">
+        {/* Mobile Header */}
+        <div className="lg:hidden flex items-center justify-between p-4 border-b border-base-300">
+          <Link to="/dashboard" className="flex items-center gap-2">
+            <GraduationCap className="h-6 w-6 text-primary" />
+            <span className="font-bold text-primary text-lg">School EMS</span>
+          </Link>
+          <label htmlFor="drawer-toggle" className="btn btn-ghost btn-sm btn-circle">
+            <X className="h-5 w-5" />
+          </label>
+        </div>
+
+        {/* User Profile Section */}
         <div className="p-4">
           <div className="text-center mb-6">
             <div className="avatar">
               <div className="w-16 rounded-full bg-primary">
                 <div className="flex items-center justify-center h-full">
                   <span className="text-2xl text-primary-content font-bold">{userProfile?.name?.charAt(0) || "U"}</span>
                 </div>
               </div>
             </div>
             <h3 className="font-semibold mt-2">{userProfile?.name}</h3>
             <p className="text-sm opacity-60 capitalize">{userProfile?.role}</p>
           </div>
+        </div>

-          <ul className="menu p-0 space-y-2">
+        {/* Navigation Menu */}
+        <div className="flex-1 px-4">
+          <ul className="menu p-0 space-y-1">
             {filteredMenuItems.map((item) => {
               const Icon = item.icon
               const isActive = location.pathname === item.path

               return (
                 <li key={item.path}>
                   <Link
                     to={item.path}
-                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
+                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors w-full ${
                       isActive ? "bg-primary text-primary-content" : "hover:bg-base-300"
                     }`}
+                    onClick={() => {
+                      // Close drawer on mobile after navigation
+                      const drawerToggle = document.getElementById("drawer-toggle")
+                      if (drawerToggle) drawerToggle.checked = false
+                    }}
                   >
                     <Icon className="h-5 w-5" />
                     <span>{item.label}</span>
                   </Link>
                 </li>
               )
             })}
           </ul>
         </div>
+
+        {/* Logout Button */}
+        <div className="p-4 border-t border-base-300">
+          <button
+            onClick={handleLogout}
+            className="flex items-center gap-3 p-3 rounded-lg transition-colors w-full hover:bg-error hover:text-error-content text-error"
+          >
+            <LogOut className="h-5 w-5" />
+            <span>Logout</span>
+          </button>
+        </div>
       </aside>
     </div>
   )
 }