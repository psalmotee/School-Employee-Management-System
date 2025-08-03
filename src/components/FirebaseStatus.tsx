"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { CheckCircle, XCircle, AlertCircle, WifiOff } from "lucide-react";

const FirebaseStatus: React.FC = () => {
  const [status, setStatus] = useState({
    auth: "checking",
    firestore: "checking",
    config: "checking",
  });

  useEffect(() => {
    checkFirebaseStatus();
  }, []);

  const checkFirebaseStatus = async () => {
    // Check Firebase config
    const configStatus = checkConfig();

    // Check Auth
    const authStatus = auth ? "connected" : "error";

    // Check Firestore
    let firestoreStatus = "error";
    try {
      // Try to read from a test document
      await getDoc(doc(db, "test", "connection"));
      firestoreStatus = "connected";
    } catch (error: any) {
      console.error("Firestore connection error:", error);
      if (error.code === "permission-denied") {
        firestoreStatus = "permission-denied";
      }
    }

    setStatus({
      auth: authStatus,
      firestore: firestoreStatus,
      config: configStatus,
    });
  };

  const checkConfig = () => {
    try {
      const config = auth.app.options;
      const requiredFields = ["apiKey", "authDomain", "projectId"];
      const hasAllFields = requiredFields.every(
        (field) =>
          config[field as keyof typeof config] &&
          !String(config[field as keyof typeof config]).includes("your-")
      );
      return hasAllFields ? "connected" : "error";
    } catch {
      return "error";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "checking":
        return <AlertCircle className="h-5 w-5 text-warning animate-pulse" />;
      case "permission-denied":
        return <XCircle className="h-5 w-5 text-warning" />;
      default:
        return <XCircle className="h-5 w-5 text-error" />;
    }
  };

  const getStatusText = (service: string, status: string) => {
    if (status === "checking") return "Checking...";
    if (status === "connected") return "Connected";
    if (status === "permission-denied") return "Rules not set";

    switch (service) {
      case "config":
        return "Config missing";
      case "auth":
        return "Auth failed";
      case "firestore":
        return "Connection failed";
      default:
        return "Error";
    }
  };

  // Only show if there are issues
  const hasIssues = Object.values(status).some((s) => s !== "connected");

  if (!hasIssues) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="card bg-base-100 shadow-xl border border-warning">
        <div className="card-body p-4">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            Firebase Status
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span>Configuration:</span>
              <div className="flex items-center gap-1">
                {getStatusIcon(status.config)}
                <span>{getStatusText("config", status.config)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Authentication:</span>
              <div className="flex items-center gap-1">
                {getStatusIcon(status.auth)}
                <span>{getStatusText("auth", status.auth)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Firestore:</span>
              <div className="flex items-center gap-1">
                {getStatusIcon(status.firestore)}
                <span>{getStatusText("firestore", status.firestore)}</span>
              </div>
            </div>
          </div>
          {status.config === "error" && (
            <div className="alert alert-warning mt-2 p-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">
                Update Firebase config in src/lib/firebase.ts
              </span>
            </div>
          )}
          {status.firestore === "permission-denied" && (
            <div className="alert alert-warning mt-2 p-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">Apply Firestore security rules</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirebaseStatus;
