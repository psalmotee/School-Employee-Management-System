"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  type User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import type { User } from "../types";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthReady: boolean;
}
 
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Failed to log in. Please try again");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error(error.message || "Failed to log out. Please try again");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // First check users collection (for admin/manager)
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as User);
        } else {
          // If not found in users, check employees collection
          const employeeDoc = await getDoc(doc(db, "employees", user.uid));
          if (employeeDoc.exists()) {
            const employeeData = employeeDoc.data();
            // Convert employee data to User format
            const userProfile: User = {
              id: user.uid,
              email: employeeData.email || user.email || "",
              name:
                employeeData.name ||
                employeeData.firstName + " " + employeeData.lastName ||
                user.displayName ||
                user.email?.split("@")[0] ||
                "Employee",
              displayName:
                employeeData.name ||
                employeeData.firstName + " " + employeeData.lastName ||
                user.displayName,
              role: "employee",
              createdAt: employeeData.createdAt || new Date(),
              updatedAt: employeeData.updatedAt || new Date(),
              // Include any additional employee fields
              ...employeeData,
            };
            setUserProfile(userProfile);
          } else {
            // User not found in either collection - this shouldn't happen for valid employees
            console.log(
              "User document not found in users or employees collection for:",
              user.email
            );
            const basicProfile: User = {
              id: user.uid,
              email: user.email || "",
              name: user.displayName || user.email?.split("@")[0] || "Employee",
              displayName: user.displayName || undefined,
              role: "employee", // Default to employee role
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            setUserProfile(basicProfile);
            // Don't automatically create in users collection - let admin/manager handle this
          }
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
      setIsAuthReady(true);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    login,
    logout,
    loading,
    isAuthReady,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
