import type React from "react"
import { useState } from "react"
import { User, Mail, Phone, Building2, Briefcase, Calendar, Edit, Save, X } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useForm } from "react-hook-form"

interface ProfileFormData {
  name: string
  phone: string
  department: string
  position: string
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const { userProfile, currentUser } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: userProfile?.name || "",
      phone: userProfile?.phone || "",
      department: userProfile?.department || "",
      position: userProfile?.position || "",
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Here you would update the user profile in Firebase
      console.log("Updating profile:", data)
      setIsEditing(false)
      // Show success message
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8 text-primary" />
            Profile
          </h1>
          <p className="text-base-content/60">Manage your personal information</p>
        </div>
        {!isEditing && (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            <Edit className="h-5 w-5" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center">
            <div className="avatar placeholder mb-4">
              <div className="bg-primary text-primary-content rounded-full w-24">
                <span className="text-3xl font-bold">
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
            </div>
            <h2 className="card-title justify-center">{userProfile.name}</h2>
            <p className="text-base-content/60">{userProfile.position}</p>
            <div className={`badge ${
              userProfile.role === 'admin' ? 'badge-error' :
              userProfile.role === 'manager' ? 'badge-warning' : 'badge-info'
            } badge-lg`}>
              {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title mb-6">Personal Information</h3>
              
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Full Name</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${errors.name ? "input-error" : ""}`}
                        {...register("name", { required: "Name is required" })}
                      />
                      {errors.name && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.name.message}</span>
                        </label>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Phone Number</span>
                      </label>
                      <input
                        type="tel"
                        className={`input input-bordered ${errors.phone ? "input-error" : ""}`}
                        {...register("phone", { required: "Phone is required" })}
                      />
                      {errors.phone && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.phone.message}</span>
                        </label>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Department</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${errors.department ? "input-error" : ""}`}
                        {...register("department", { required: "Department is required" })}
                      />
                      {errors.department && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.department.message}</span>
                        </label>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Position</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${errors.position ? "input-error" : ""}`}
                        {...register("position", { required: "Position is required" })}
                      />
                      {errors.position && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.position.message}</span>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button type="button" className="btn btn-outline" onClick={handleCancel}>
                      <X className="h-5 w-5" />
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <Save className="h-5 w-5" />
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">Full Name</p>
                        <p className="font-medium">{userProfile.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <Mail className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">Email</p>
                        <p className="font-medium">{userProfile.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Phone className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">Phone</p>
                        <p className="font-medium">{userProfile.phone || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-info/10 rounded-lg">
                        <Building2 className="h-5 w-5 text-info" />
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">Department</p>
                        <p className="font-medium">{userProfile.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-warning/10 rounded-lg">
                        <Briefcase className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">Position</p>
                        <p className="font-medium">{userProfile.position}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-success/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">Member Since</p>
                        <p className="font-medium">{userProfile.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-base-content/60">User ID</p>
              <p className="font-mono text-sm">{currentUser?.uid}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Account Status</p>
              <div className="badge badge-success">Active</div>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Email Verified</p>
              <div className={`badge ${currentUser?.emailVerified ? 'badge-success' : 'badge-warning'}`}>
                {currentUser?.emailVerified ? 'Verified' : 'Not Verified'}
              </div>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Last Sign In</p>
              <p className="text-sm">{currentUser?.metadata.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleString() : 'Never'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile