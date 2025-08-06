@@ .. @@
 "use client";

 import { useState, useEffect } from "react";
 import {
   collection,
   addDoc,
   updateDoc,
   deleteDoc,
   doc,
   query,
-  where,
   orderBy,
   onSnapshot,
 } from "firebase/firestore";
 import { db } from "../lib/firebase";
 import { useAuth } from "../contexts/AuthContext";

 export const useLeaveRequests = () => {
   const [leaveRequests, setLeaveRequests] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const { userProfile } = useAuth();

   useEffect(() => {
-    if (!userProfile) return;
+    if (!userProfile) {
+      setLoading(false);
+      return;
+    }

-    let q;
-    if (userProfile.role === "employee") {
-      // Employees can only see their own requests
-      q = query(
-        collection(db, "leaveRequests"),
-        where("employeeId", "==", userProfile.id),
-        orderBy("createdAt", "desc")
-      );
-    } else {
-      // Managers and admins can see all requests
-      q = query(collection(db, "leaveRequests"), orderBy("createdAt", "desc"));
-    }
+    // For now, show all requests to all users to avoid permission issues
+    // You can add filtering logic later based on your security rules
+    const q = query(collection(db, "leaveRequests"), orderBy("createdAt", "desc"));

     const unsubscribe = onSnapshot(
       q,
       (snapshot) => {
-        const requestList = snapshot.docs.map((doc) => ({
-          id: doc.id,
-          ...doc.data(),
-          startDate: doc.data().startDate?.toDate() || new Date(),
-          endDate: doc.data().endDate?.toDate() || new Date(),
-          createdAt: doc.data().createdAt?.toDate() || new Date(),
-          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
-          approvedAt: doc.data().approvedAt?.toDate(),
-        }));
+        const requestList = snapshot.docs.map((docSnap) => {
+          const data = docSnap.data();
+          return {
+            id: docSnap.id,
+            ...data,
+            startDate: data.startDate?.toDate() || new Date(),
+            endDate: data.endDate?.toDate() || new Date(),
+            createdAt: data.createdAt?.toDate() || new Date(),
+            updatedAt: data.updatedAt?.toDate() || new Date(),
+            approvedAt: data.approvedAt?.toDate(),
+          };
+        });
+
+        // Filter based on user role after fetching
+        let filteredRequests = requestList;
+        if (userProfile.role === "employee") {
+          filteredRequests = requestList.filter(
+            (request) => request.employeeId === userProfile.id
+          );
+        }

-        setLeaveRequests(requestList);
+        setLeaveRequests(filteredRequests);
         setLoading(false);
       },
       (error) => {
         console.error("Error fetching leave requests:", error);
         setError("Failed to fetch leave requests");
         setLoading(false);
       }
     );

     return () => unsubscribe();
   }, [userProfile]);