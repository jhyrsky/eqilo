"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase/client";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

export function useIsAdmin(): boolean {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function check() {
      if (loading) return;
      if (!user) { setIsAdmin(false); return; }
      try {
        const userDoc = await getDoc(doc(db, "customers", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") { setIsAdmin(true); return; }
        if (user.email) {
          const snap = await getDocs(query(collection(db, "customers"), where("email", "==", user.email), where("role", "==", "admin")));
          setIsAdmin(!snap.empty);
        } else {
          setIsAdmin(false);
        }
      } catch { setIsAdmin(false); }
    }

    check();
  }, [user, loading]);

  return isAdmin;
}
