@@ .. @@
-import Navbar from "./Navbar"
 import Sidebar from "./Sidebar"

 const Layout = () => {
   return (
     <div className="drawer lg:drawer-open">
       <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />

       <div className="drawer-content flex flex-col">
-        <Navbar />
         <main className="flex-1 p-6 bg-base-100">
           <Outlet />
         </main>
       </div>

       <Sidebar />
     </div>
   )
 }