//app/context/AuthProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveAccessToken, getAccessToken, clearAccessToken } from "@/lib/auth";

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
  signInWithGoogle: () => void;
  requestOtp: (email: string, userType?: string) => Promise<boolean>;
  verifyOtp: (email: string, code: string) => Promise<boolean>;
  setUserType: (type: string) => void;
  logout: () => void;
}

/* -------------------- CONTEXT -------------------- */
const AuthContext = createContext<AuthContextType | null>(null);


/* -------------------- API WRAPPER -------------------- */
async function api(path: string, options: RequestInit = {}) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  console.log("Backend URL:", backendUrl);

  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
  }

  return fetch(`${backendUrl}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
}

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
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      console.log("Backend URL:", backendUrl);
      if (!backendUrl) return;

      let res = await fetch(`${backendUrl}/auth/otp/user`, {
        credentials: "include",
      });

      if (!res.ok && res.status === 401) {
        const tokenMatch = document.cookie.match(/(^| )accessToken=([^;]+)/);
        const token = tokenMatch ? decodeURIComponent(tokenMatch[2]) : null;

        if (token) {
          res = await fetch(`${backendUrl}/auth/otp/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      }

      if (res.ok) {
        const data = await res.json();
        setUser(data);

        if (!userType && data.role) {
          setUserType(data.role);
        }
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
    const loadToken = () => {
      const token = getAccessToken(); // ou localStorage
      if (token) {
        // Optionnel : appelle /auth/otp/user pour vérifier le token
        fetchUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  /* ---------------- GOOGLE OAUTH -------------- */
  const signInWithGoogle = () => {
    const returnTo = params.get("returnTo") || "/";
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log("Backend URL:", backendUrl);
    if (!backendUrl) return;

    window.location.href = `${backendUrl}/oauth2/authorization/google?returnTo=${encodeURIComponent(returnTo)}`;
  };

  /* ---------------- OTP REQUEST -------------- */
  const requestOtp = async (
    email: string,
    userTypeArg = "CANDIDATE"
  ): Promise<boolean> => {
    setUserType(userTypeArg); // ← sauvegarde le rôle choisi
    const res = await api("/auth/otp/request", {
      method: "POST",
      body: JSON.stringify({ email, userType: userTypeArg }),
    });

    return res.status === 204;
  };

  /* ---------------- OTP VERIFY -------------- */
  const verifyOtp = async (email: string, code: string): Promise<boolean> => {
    const currentType = userType || "CANDIDATE";
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log("Backend URL:", backendUrl);
    if (!backendUrl) return false;

    const res = await fetch(`${backendUrl}/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, code, userType: currentType }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    saveAccessToken(data.accessToken);

    // Met à jour l'utilisateur
    setUser({ email, role: currentType });
    setLoading(false);

    const returnTo = params.get("returnTo") || "/";
    router.push(returnTo);

    return true;
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = async () => {
    await api("/auth/logout", { method: "POST" }).catch(() => {});
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
        signInWithGoogle,
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
