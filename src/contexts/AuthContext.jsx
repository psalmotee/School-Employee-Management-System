"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.message || "Failed to log in. Please try again");
    }
  };

  const register = async (email, password, userData) => {
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
      const newUser = {
        id: user.uid,
        email: user.email,
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
    } catch (error) {
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
    } catch (error) {
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
          setUserProfile(userDoc.data());
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