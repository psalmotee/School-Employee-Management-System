"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  type User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import type { User } from "../types";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    userData: Partial<User>
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
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

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Failed to log in. Please try again");
    }
  };

  const register = async (
    email: string,
    password: string,
    userData: Partial<User>
  ) => {
    try {
      console.log("Starting user registration...", { email, userData });

      // Create the user account first
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User account created:", user.uid);

      // Prepare user profile data
      const newUser: User = {
        id: user.uid,
        email: user.email!,
        name: userData.name || "",
        role: userData.role || "employee",
        department: userData.department || "",
        position: userData.position || "",
        phone: userData.phone || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Creating user profile document...", newUser);

      // Create user profile document
      await setDoc(doc(db, "users", user.uid), newUser);
      console.log("User profile created successfully");
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle specific Firebase errors
      if (error.code === "auth/email-already-in-use") {
        throw new Error("An account with this email already exists");
      } else if (error.code === "auth/weak-password") {
        throw new Error("Password should be at least 6 characters");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address");
      } else if (error.code === "permission-denied") {
        throw new Error(
          "Permission denied. Please check Firestore security rules"
        );
      } else if (error.code === "unavailable") {
        throw new Error(
          "Firebase service is currently unavailable. Please try again later"
        );
      } else {
        throw new Error(
          error.message || "Failed to create account. Please try again"
        );
      }
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
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as User);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
