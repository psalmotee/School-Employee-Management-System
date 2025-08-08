"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import type { InvitationCode } from "../types";

export const useInvitationCodes = () => {
  const [codes, setCodes] = useState<InvitationCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userProfile, currentUser } = useAuth();

  useEffect(() => {
    if (!userProfile || userProfile.role !== "admin") {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "invitationCodes"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const codeList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          expiresAt: doc.data().expiresAt?.toDate() || new Date(),
          usedAt: doc.data().usedAt?.toDate(),
        })) as InvitationCode[];

        setCodes(codeList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching invitation codes:", error);
        setError("Failed to fetch invitation codes");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userProfile]);

  const generateCode = async (role: "admin" | "manager", expiryDays = 7) => {
    if (!userProfile || !currentUser) {
      throw new Error("User not authenticated");
    }

    try {
      setError(null);

      // Generate a secure 8-character code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiryDays);

      // Use currentUser.uid as fallback if userProfile.id is undefined
      const userId = userProfile.id || currentUser.uid;
      const userName = userProfile.name || currentUser.email || "Unknown User";

      console.log("Creating invitation code with:", {
        userId,
        userName,
        userProfile,
        currentUser,
      });

      const codeData: Omit<InvitationCode, "id"> = {
        code,
        role,
        createdBy: userId,
        createdByName: userName,
        isUsed: false,
        expiresAt,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "invitationCodes"), codeData);
      return { id: docRef.id, code };
    } catch (error: any) {
      console.error("Error generating invitation code:", error);
      setError(error.message || "Failed to generate invitation code");
      throw error;
    }
  };

  const verifyCode = async (code: string): Promise<InvitationCode | null> => {
    try {
      setError(null);

      const q = query(
        collection(db, "invitationCodes"),
        where("code", "==", code.toUpperCase()),
        where("isUsed", "==", false)
      );

      return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            unsubscribe();

            if (snapshot.empty) {
              resolve(null);
              return;
            }

            const codeDoc = snapshot.docs[0];
            const codeData = {
              id: codeDoc.id,
              ...codeDoc.data(),
              createdAt: codeDoc.data().createdAt?.toDate() || new Date(),
              expiresAt: codeDoc.data().expiresAt?.toDate() || new Date(),
              usedAt: codeDoc.data().usedAt?.toDate(),
            } as InvitationCode;

            // Check if code is expired
            if (codeData.expiresAt < new Date()) {
              resolve(null);
              return;
            }

            resolve(codeData);
          },
          reject
        );
      });
    } catch (error: any) {
      console.error("Error verifying invitation code:", error);
      setError(error.message || "Failed to verify invitation code");
      throw error;
    }
  };

  const markCodeAsUsed = async (codeId: string, usedBy: string) => {
    try {
      setError(null);
      await updateDoc(doc(db, "invitationCodes", codeId), {
        isUsed: true,
        usedBy,
        usedAt: new Date(),
      });
    } catch (error: any) {
      console.error("Error marking code as used:", error);
      setError(error.message || "Failed to mark code as used");
      throw error;
    }
  };

  const deleteCode = async (codeId: string) => {
    try {
      setError(null);
      await deleteDoc(doc(db, "invitationCodes", codeId));
    } catch (error: any) {
      console.error("Error deleting invitation code:", error);
      setError(error.message || "Failed to delete invitation code");
      throw error;
    }
  };

  const getActiveCodesByRole = (role: "admin" | "manager") => {
    return codes.filter(
      (code) =>
        code.role === role && !code.isUsed && code.expiresAt > new Date()
    );
  };

  const getUsedCodes = () => {
    return codes.filter((code) => code.isUsed);
  };

  const getExpiredCodes = () => {
    return codes.filter((code) => !code.isUsed && code.expiresAt <= new Date());
  };

  return {
    codes,
    loading,
    error,
    generateCode,
    verifyCode,
    markCodeAsUsed,
    deleteCode,
    getActiveCodesByRole,
    getUsedCodes,
    getExpiredCodes,
  };
};
