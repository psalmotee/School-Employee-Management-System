import type React from "react"
import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

const Layout: React.FC = () => {
  return (
    <div className="drawer md:drawer-open">
      <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 bg-base-100">
          <Outlet />
        </main>
      </div>

      <Sidebar />
    </div>
  )
}

export default Layout
