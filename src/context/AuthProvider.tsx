//app/context/AuthProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveAccessToken, getAccessToken } from "@/lib/auth";

/* -------------------- TYPES -------------------- */
interface User {
  email: string;
  role: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userType: string | null;
  requestOtp: (email: string, userType?: string) => Promise<boolean>;
  verifyOtp: (email: string, code: string) => Promise<boolean>;
  setUserType: (type: string) => void;
  logout: () => void;
}

/* -------------------- CONTEXT -------------------- */
const AuthContext = createContext<AuthContextType | null>(null);

// -------------------- UTILS --------------------
const getBackendUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!url) throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
  return url;
};

/* -------------------- PROVIDER -------------------- */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useSearchParams();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);

  /* ---- AUTO-LOGIN via cookie HttpOnly ou accessToken client-side ---- */
  const fetchUser = async () => {
    try {
      const backendUrl = getBackendUrl();

      let res = await fetch(`${backendUrl}/auth/otp/user`, {
        credentials: "include",
      });

      if (!res.ok && res.status === 401) {
        const token = getAccessToken();
        if (token) {
          res = await fetch(`${backendUrl}/auth/otp/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        if (!userType && data.role) setUserType(data.role);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Erreur lors du fetchUser:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getAccessToken(); // ou localStorage
    if (token) {
        // Optionnel : appelle /auth/otp/user pour vérifier le token
        fetchUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  /* ---------------- OTP REQUEST -------------- */
  const requestOtp = async (email: string, userTypeArg = "CANDIDATE"): Promise<boolean> => {
    setUserType(userTypeArg); // ← sauvegarde le rôle choisi
    const res = await fetch(`${getBackendUrl()}/auth/otp/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, userType: userTypeArg }),
    });
    return res.status === 204;
  };

  /* ---------------- OTP VERIFY -------------- */
  const verifyOtp = async (email: string, code: string): Promise<boolean> => {
    const currentType = userType || "CANDIDATE";
    const res = await fetch(`${getBackendUrl}/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, code, userType: currentType }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    saveAccessToken(data.accessToken);
    setUser({ email, role: currentType });
    setLoading(false);

    const returnTo = params.get("returnTo") || "/";
    router.push(returnTo);

    return true;
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = async () => {
    try {
      await fetch(`${getBackendUrl()}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // ignore
    }
    setUser(null);
    setUserType(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userType,
        requestOtp,
        verifyOtp,
        setUserType,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* -------------------- HOOK -------------------- */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
}
