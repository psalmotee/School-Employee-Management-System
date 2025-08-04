"use client";

import type React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Phone, Briefcase, Building2 } from "lucide-react";

const Profile: React.FC = () => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-error text-center p-4">
        User profile not found. Please log in.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex items-center gap-6 mb-6">
            <div className="avatar placeholder">
              <div className="w-24 rounded-full bg-primary text-primary-content">
                <span className="text-4xl font-bold">
                  {userProfile.name?.charAt(0) || "U"}
                </span>
              </div>
            </div>
            <div>
              <h2 className="card-title text-2xl">{userProfile.name}</h2>
              <p className="text-base-content/70 capitalize">
                {userProfile.role}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <span>{userProfile.email}</span>
            </div>
            {userProfile.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>{userProfile.phone}</span>
              </div>
            )}
            {userProfile.position && (
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-primary" />
                <span>{userProfile.position}</span>
              </div>
            )}
            {userProfile.department && (
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <span>{userProfile.department}</span>
              </div>
            )}
          </div>

          <div className="card-actions justify-end mt-6">
            <button className="btn btn-primary">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
