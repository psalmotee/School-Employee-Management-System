"use client";

import type React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"; // Assuming shadcn/ui Card components are available
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";

const Profile: React.FC = () => {
  const { userProfile, currentUser } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={userProfile?.name || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={userProfile?.email || currentUser?.email || ""}
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={userProfile?.role || ""}
                readOnly
                className="capitalize"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={userProfile?.department || "N/A"}
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={userProfile?.position || "N/A"}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={userProfile?.phone || "N/A"} readOnly />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="createdAt">Member Since</Label>
            <Input
              id="createdAt"
              value={
                userProfile?.createdAt
                  ? new Date(userProfile.createdAt).toLocaleDateString()
                  : "N/A"
              }
              readOnly
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
