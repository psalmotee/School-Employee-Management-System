"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase"; // Correctly import auth and db directly
import { Mail, Lock, UserPlus } from "lucide-react";

interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegistrationFlow: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormData>();

  const password = watch("password");

  const handleRegistration = async (data: RegistrationFormData) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Verify that an employee profile with this email exists and is not yet registered
      const employeeQuery = query(
        collection(db, "employees"),
        where("email", "==", data.email),
        where("isRegistered", "==", false)
      );
      const querySnapshot = await getDocs(employeeQuery);

      if (querySnapshot.empty) {
        setError("No pending employee registration found for this email.");
        setLoading(false);
        return;
      }

      const employeeDoc = querySnapshot.docs[0];
      // const employeeData = employeeDoc.data(); // This variable isn't used, so we can remove it.

      // 2. Create the new Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // 3. Update the existing employee document with the user's new UID and set isRegistered to true
      await updateDoc(doc(db, "employees", employeeDoc.id), {
        id: user.uid, // Add the Firebase Auth UID to the employee document
        isRegistered: true,
        updatedAt: new Date(),
      });

      // 4. Redirect to the login page with a success message
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.message ||
          "Registration failed. Please check your information and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col items-center mb-6">
            <UserPlus className="h-12 w-12 text-primary" />
            <h2 className="card-title text-3xl mt-2">Employee Registration</h2>
            <p className="text-sm text-base-content/60 text-center">
              Create your account to get started.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleRegistration)}
            className="space-y-4"
          >
            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full pl-10"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-error text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  type="password"
                  placeholder="Create a password"
                  className="input input-bordered w-full pl-10"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-error text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="input input-bordered w-full pl-10"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "The passwords do not match",
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-error text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {error && (
              <div role="alert" className="alert alert-error mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary w-full mt-6 ${
                loading ? "loading" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-base-content/60 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="link link-hover text-primary">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFlow;
