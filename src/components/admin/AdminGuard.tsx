"use client";

import { useAuth } from "@/components/auth-provider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase/client";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { ShieldAlert, Loader2, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      if (loading) return;

      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        // Primary lookup: by Firebase UID (document ID)
        const userDoc = await getDoc(doc(db, "customers", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
          return;
        }
        // Fallback: look up by email (handles mismatched UIDs from different auth methods)
        if (user.email) {
          const q = query(collection(db, "customers"), where("email", "==", user.email), where("role", "==", "admin"));
          const snap = await getDocs(q);
          if (!snap.empty) {
            setIsAdmin(true);
            return;
          }
        }
        setIsAdmin(false);
      } catch (e) {
        console.error("Failed to verify admin status", e);
        setIsAdmin(false);
      }
    }

    checkAdmin();
  }, [user, loading]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading || isAdmin === null) {
    return (
      <div className="h-full w-full flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAdmin === false) {
    if (!user || user.isAnonymous) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center p-4 sm:p-20 min-h-screen bg-muted/20">
          <div className="w-full max-w-md mb-8">
            <Button onClick={() => router.push("/")} variant="ghost" className="mb-4">
              <Home className="w-4 h-4 mr-2" /> Return to Store
            </Button>
            <LoginForm />
          </div>
        </div>
      );
    }

    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-20 text-center min-h-screen bg-muted/20">
        <div className="p-4 bg-destructive/10 rounded-full mb-4">
          <ShieldAlert className="w-12 h-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          You are logged in as <strong>{user.email || user.phoneNumber || "a guest user"}</strong>, which does not have the required administrative privileges.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => router.push("/")} variant="outline" size="lg" className="font-bold">
            <Home className="w-5 h-5 mr-2" /> Store
          </Button>
          <Button onClick={handleSignOut} variant="destructive" size="lg" className="font-bold">
            <LogOut className="w-5 h-5 mr-2" /> Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
