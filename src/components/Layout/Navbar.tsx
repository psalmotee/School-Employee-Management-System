"use client";

import type React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Bell, LogOut, UserCircle } from "lucide-react";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { userProfile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4 py-2">
      <div className="flex-none lg:hidden">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-square btn-ghost"
          onClick={toggleSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-6 h-6 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>
      <div className="flex-1">
        <Link
          to="/dashboard"
          className="btn btn-ghost normal-case text-xl text-primary font-bold"
        >
          School EMS
        </Link>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Bell className="h-6 w-6" />
              <span className="badge badge-sm indicator-item badge-primary">
                99+
              </span>{" "}
              {/* Placeholder for notifications */}
            </div>
          </label>
          <div
            tabIndex={0}
            className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
          >
            <div className="card-body">
              <span className="font-bold text-lg">8 Notifications</span>
              <span className="text-info">View all notifications</span>
              <div className="card-actions">
                <Link to="/notifications" className="btn btn-primary btn-block">
                  View Notifications
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              {/* Placeholder for user avatar */}
              <UserCircle className="h-10 w-10 text-base-content/60" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/profile" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <button onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
