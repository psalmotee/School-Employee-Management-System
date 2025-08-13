"use client";

import type React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  User,
  Settings,
  LogOut,
  Bell,
  Menu,
  GraduationCap,
} from "lucide-react";

const Navbar: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-lg border-b border-base-200">
      <div className="navbar-start">
        {/* Start Navbar */}
        {/* Mobile menu toggle */}
        <label
          htmlFor="drawer-toggle"
          className="md:hidden btn btn-ghost btn-circle"
        >
          <Menu className="h-5 w-5" />
        </label>

        {/* Desktop Logo */}
        <Link
          to="/dashboard"
          className="hidden md:block md:flex btn btn-ghost text-xl"
        >
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-bold text-primary">School EMS</span>
        </Link>
      </div>

      {/* Center Navbar */}
      <div className="navbar-center hidden lg:flex">
        {/* Mobile Logo */}
        <div className="btn btn-ghost text-xl md:hidden">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-bold text-primary">School EMS</span>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/dashboard" className="btn btn-ghost">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/employees" className="btn btn-ghost">
              Employees
            </Link>
          </li>
          <li>
            <Link to="/leave-requests" className="btn btn-ghost">
              Leave Requests
            </Link>
          </li>
          <li>
            <Link to="/departments" className="btn btn-ghost">
              Departments
            </Link>
          </li>
        </ul>
      </div>

      {/* End Navbar */}
      <div className="navbar-end">
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Bell className="h-5 w-5" />
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-10">
                    <span className="text-sm">
                      {userProfile?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="menu-title">
                <span>{userProfile?.name}</span>
                <span className="text-xs opacity-60">{userProfile?.role}</span>
              </li>
              <li>
                <Link to="/profile">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
