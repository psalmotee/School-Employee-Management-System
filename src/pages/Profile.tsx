"use client";

import type React from "react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import {
  User,
  Mail,
  Shield,
  Building2,
  Briefcase,
  Phone,
  Calendar,
  Edit,
  Save,
  X,
} from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const Profile: React.FC = () => {
  const { userProfile, currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    email: userProfile?.email || currentUser?.email || "",
    phone: userProfile?.phone || "",
    bio: userProfile?.bio || "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: userProfile?.name || "",
      email: userProfile?.email || currentUser?.email || "",
      phone: userProfile?.phone || "",
      bio: userProfile?.bio || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: userProfile?.name || "",
      email: userProfile?.email || currentUser?.email || "",
      phone: userProfile?.phone || "",
      bio: userProfile?.bio || "",
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!userProfile?.id) {
        throw new Error("User profile not found");
      }

      try {
        const userDocRef = doc(db, "users", userProfile.id);
        await updateDoc(userDocRef, {
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
          updatedAt: new Date(),
        });
      } catch (userUpdateError) {
        console.log("Trying employees collection...");
        const employeeDocRef = doc(db, "employees", userProfile.id);
        await updateDoc(employeeDocRef, {
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
          updatedAt: new Date(),
        });
      }

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {!isEditing ? (
          <Button variant="outline" onClick={handleEdit} icon={Edit}>
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleCancel} icon={X}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              loading={loading}
              icon={Save}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={isEditing ? formData.name : userProfile?.name || ""}
                onChange={handleInputChange}
                readOnly={!isEditing}
                icon={User}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={
                  isEditing
                    ? formData.email
                    : userProfile?.email || currentUser?.email || ""
                }
                onChange={handleInputChange}
                readOnly={!isEditing}
                icon={Mail}
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
                icon={Shield}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={userProfile?.department || "N/A"}
                readOnly
                icon={Building2}
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
                icon={Briefcase}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={isEditing ? formData.phone : userProfile?.phone || "N/A"}
                onChange={handleInputChange}
                readOnly={!isEditing}
                icon={Phone}
              />
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
              icon={Calendar}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio / Notes</Label>
            <Textarea
              id="bio"
              name="bio"
              value={
                isEditing
                  ? formData.bio
                  : userProfile?.bio || "No bio available"
              }
              onChange={handleInputChange}
              readOnly={!isEditing}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
