"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Key, ArrowRight, AlertCircle, GraduationCap } from "lucide-react";
import { useInvitationCodes } from "../../hooks/useInvitationCodes";
import type { InvitationCode } from "../../types";
import { useNavigate } from "react-router-dom";

interface CodeVerificationProps {
  onCodeVerified: (code: InvitationCode) => void;
  onBack: () => void;
}

interface CodeFormData {
  code: string;
}

const CodeVerification: React.FC<CodeVerificationProps> = ({
  onCodeVerified,
  onBack,
}) => {
  const [loading, setLoading] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const { verifyCode } = useInvitationCodes();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CodeFormData>();

  const onSubmit = async (data: CodeFormData) => {
    setLoading(true);
    setVerificationError(null);

    try {
      const codeData = await verifyCode(data.code);

      if (!codeData) {
        setVerificationError("Invalid or expired invitation code");
        setError("code", { message: "Invalid or expired invitation code" });
        return;
      }

      onCodeVerified(codeData);
    } catch (error: any) {
      setVerificationError(error.message || "Failed to verify code");
      setError("code", { message: "Verification failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    onBack();
    navigate("/login");
    setVerificationError(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary rounded-full">
                <GraduationCap className="h-8 w-8 text-primary-content" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-primary">School EMS</h1>
            <p className="text-base-content/60">Enter your invitation code</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Invitation Code</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter 8-character code"
                  className={`input input-bordered w-full pl-10 uppercase tracking-wider ${
                    errors.code ? "input-error" : ""
                  }`}
                  maxLength={8}
                  {...register("code", {
                    required: "Invitation code is required",
                    minLength: {
                      value: 8,
                      message: "Code must be 8 characters",
                    },
                    maxLength: {
                      value: 8,
                      message: "Code must be 8 characters",
                    },
                    pattern: {
                      value: /^[A-Z0-9]{8}$/,
                      message: "Code must contain only letters and numbers",
                    },
                  })}
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                    setVerificationError(null);
                  }}
                />
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
              </div>
              {errors.code && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.code.message}
                  </span>
                </label>
              )}
            </div>

            {verificationError && (
              <div className="alert alert-error">
                <AlertCircle className="h-5 w-5" />
                <span>{verificationError}</span>
              </div>
            )}

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  "Verifying..."
                ) : (
                  <>
                    Verify Code
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <div className="text-center">
            <p className="text-sm mb-4">Don't have an invitation code?</p>
            <button onClick={handleBack} className="btn btn-outline btn-sm">
              Back to Login
            </button>
          </div>

          <div className="mt-6 p-4 bg-base-200 rounded-lg">
            <h3 className="font-semibold mb-2">Need an invitation code?</h3>
            <ul className="text-sm text-base-content/70 space-y-1">
              <li>• Contact your system administrator</li>
              <li>• Admin codes allow full system access</li>
              <li>• Manager codes allow department management</li>
              <li>• Employee accounts are created internally</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeVerification;
