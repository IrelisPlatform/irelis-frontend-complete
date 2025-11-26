// src/context/AuthContext.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  email: string;
  role: string; // "candidate" | "recruiter"
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifie si un token existe (connexion persistante)
    const initializeAuth = () => {
      if (typeof window === "undefined") return;

      const accessToken = localStorage.getItem("accessToken");
      const email = localStorage.getItem("auth_email");
      const role = localStorage.getItem("auth_role"); // stocké dans choose-role

      if (accessToken && email) {
        setUser({
          email,
          role: role || "candidate", // fallback raisonnable
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("auth_email");
      localStorage.removeItem("auth_role");
      localStorage.removeItem("auth_returnTo");
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}