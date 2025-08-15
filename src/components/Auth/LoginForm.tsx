"use client";

import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (error: any) {
      setError("email", { message: "Invalid email or password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body p-4 sm:p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary rounded-full">
                <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-primary-content" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
              School EMS
            </h1>
            <p className="text-sm sm:text-base text-base-content/60">
              Employee Management System
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 z-30"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-control mt-6">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </form>

          <div className="divider text-xs sm:text-sm">OR</div>

          <div className="text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="link link-primary">
                Sign up here
              </Link>
            </p>
          </div>

          <div className="divider text-xs sm:text-sm">Demo Credentials</div>
          <div className="text-xs sm:text-sm text-base-content/70 space-y-1">
            <p>
              <strong>Admin:</strong> admin@school.edu / admin123
            </p>
            <p>
              <strong>Manager:</strong> manager@school.edu / manager123
            </p>
            <p>
              <strong>Employee:</strong> employee@school.edu / employee123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
