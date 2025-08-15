"use client";

import type React from "react";
import { useState } from "react";
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
import { auth, db } from "../../lib/firebase";
import { Mail, Lock, UserPlus } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import toast from "react-hot-toast";

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

      // 2. Create the new Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // 3. Update the existing employee document with the user's new UID and set isRegistered to true
      await updateDoc(doc(db, "employees", employeeDoc.id), {
        id: user.uid,
        isRegistered: true,
        updatedAt: new Date(),
      });
      toast.success("Registration successful! You can now log in.");

      // 4. Redirect to the dashboard
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.message ||
          "Registration failed. Please check your information and try again."
      );
      toast.error(
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
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              icon={Lock}
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              icon={Lock}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "The passwords do not match",
              })}
            />

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

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              className="w-full mt-6"
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>

          <p className="text-center text-sm text-base-content/60 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="link link-hover text-primary">
              Log in
            </Link>
          </p>

          <div className="bg-info/10 border border-info/20 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-info mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-info mb-1">
                  Registration Instructions
                </h4>
                <p className="text-xs text-base-content/70 leading-relaxed">
                  To successfully register on this platform, your email must
                  first be added to the system by an administrator or manager.
                  Once your email is registered in the employee database, you
                  can complete your account setup by creating a password. If you
                  encounter any issues, please contact your administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFlow;
