// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Représente un utilisateur authentifié.
 * Le rôle est fourni par le backend et doit correspondre exactement aux valeurs :
 * "CANDIDATE", "RECRUITER", ou "ADMIN".
 */
interface User {
  email: string;
  role: string;
}

/**
 * Contrat exposé aux composants via useAuth().
 * ⚠️ getValidToken() est la seule façon fiable d'obtenir un token pour les appels API.
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  /**
   * Renvoie un accessToken valide ou null.
   * Si le token local est expiré, tente un refresh silencieux.
   * À utiliser dans tous les appels API métier.
   */
  getValidToken: () => Promise<string | null>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Fonction utilitaire : tente de rafraîchir l'accessToken via le refreshToken.
 * Le backend lit le refreshToken depuis un cookie HttpOnly (cf. Swagger).
 * Ne manipule jamais le refreshToken côté client → sécurité.
 */
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const res = await fetch("/auth/otp/refresh", {
      method: "POST",
      // credentials: 'include' est CRUCIAL : le backend attend le refreshToken dans un cookie HttpOnly
      credentials: "include",
      // Pas de body : le backend ne lit que le cookie
    });

    if (res.ok) {
      const data = await res.json();
      const newToken = data.accessToken;
      if (newToken && typeof newToken === "string") {
        // Stockage en localStorage : acceptable car accessToken est court (15 min)
        // Le refreshToken reste en HttpOnly → sécurité préservée
        localStorage.setItem("accessToken", newToken);
        return newToken;
      }
    }
    // Si le backend répond 401, le refreshToken est expiré → déconnexion nécessaire
  } catch (error) {
    console.error("Échec du rafraîchissement du token — déconnexion requise", error);
  }
  return null;
};


/**
 * Provider d'authentification global.
 * Gère :
 * - La persistance de session via localStorage (accessToken) et cookies HttpOnly (refreshToken)
 * - La validation initiale de la session au chargement
 * - Le rafraîchissement automatique en cas de token expiré
 * - La synchronisation du rôle avec le backend (pas de confiance en localStorage seul)
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Déconnexion complète : nettoyage localStorage + reset état.
   * ⚠️ Ne supprime pas le refreshToken (HttpOnly), mais il devient inutilisable côté backend.
   */
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken"); // redondant si HttpOnly, mais cohérent
      localStorage.removeItem("auth_email");
      localStorage.removeItem("auth_role");
      localStorage.removeItem("auth_returnTo");
    }
    setUser(null);
  };

  /**
   * Point d'entrée pour les API métier : garantit un token valide ou null.
   * Cette fonction est la seule autorisée à accéder à localStorage["accessToken"].
   */
  /**
   * Renvoie un accessToken valide ou null.
   * - Si absent → null
   * - Si présent et non expiré → retourne le token
   * - Si présent mais expiré → tente un refresh
   */
  const getValidToken = async (): Promise<string | null> => {
    if (typeof window === "undefined") return null;

    const currentToken = localStorage.getItem("accessToken");
    if (!currentToken) return null;

    // 🔍 Décoder le payload du JWT (partie du milieu)
    try {
      const payloadBase64 = currentToken.split('.')[1];
      if (!payloadBase64) return null;

      // Remettre le padding manquant (base64url → base64)
      const padded = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const payloadJson = atob(padded);
      const payload = JSON.parse(payloadJson);

      // Vérifier l'expiration (exp en secondes)
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp > now) {
        // Token encore valide
        return currentToken;
      }
    } catch (e) {
      console.warn("Impossible de décoder le JWT → token traité comme invalide", e);
    }

    // Token expiré ou invalide → tente de rafraîchir
    const newToken = await refreshAccessToken();
    return newToken;
  };

  const deleteAccount = async () => {
    const token = await getValidToken();
    if (!token) {
      logout();
      return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim() || 'http://api-irelis.us-east-2.elasticbeanstalk.com';
      const res = await fetch(`${backendUrl}/auth/otp/users/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Votre compte a été supprimé définitivement.");
        logout();
      } else {
        throw new Error("Échec de la suppression");
      }
    } catch (err) {
      console.error("Erreur suppression compte", err);
      toast.error("Impossible de supprimer votre compte. Veuillez réessayer.");
    }
  };

  /**
   * Validation de la session au démarrage de l'application.
   * 1. Si pas de token → accès anonyme
   * 2. Si token présent → validation via /auth/otp/user
   * 3. Si 401 → tentative de refresh → sinon déconnexion
   */
  useEffect(() => {
    const validateSession = async () => {
      if (typeof window !== "undefined") {
        if (window.location.pathname.startsWith("/admin")) {
          setLoading(false);
          return;
        }
      }
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        // Première tentative avec le token existant
        const res = await fetch("/auth/otp/user", {
          headers: { Authorization: `Bearer ${accessToken}` },
          credentials: "include",
        });

        if (res.ok) {
          const userData: User = await res.json();
          // On fait confiance au backend, PAS à localStorage
          localStorage.setItem("auth_email", userData.email);
          localStorage.setItem("auth_role", userData.role);
          setUser(userData);
        } else if (res.status === 401) {
          // Token expiré ou invalide → tente de rafraîchir
          const newToken = await refreshAccessToken();
          if (newToken) {
            // Deuxième tentative avec le nouveau token
            const retryRes = await fetch("/auth/otp/user", {
              headers: { Authorization: `Bearer ${newToken}` },
              credentials: "include",
            });
            if (retryRes.ok) {
              const userData: User = await retryRes.json();
              localStorage.setItem("auth_email", userData.email);
              localStorage.setItem("auth_role", userData.role);
              setUser(userData);
            } else {
              // Même après refresh, échec → déconnexion
              logout();
            }
          } else {
            logout();
          }
        } else {
          // Erreur non liée à l'auth (ex: 500) → on ne déconnecte pas, mais on ne charge pas l'user
          console.warn("Erreur non critique lors de la validation de session", res.status);
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur critique lors de la validation de session", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  /**
   * Synchronisation cross-onglets : si un autre onglet se déconnecte, on suit.
   * Ne pas surcharger avec des appels API ici → risque de flood.
   */
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "accessToken" && !event.newValue) {
        logout();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      logout, 
      getValidToken,
      deleteAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook custom pour accéder au contexte d'authentification.
 * ⚠️ Doit être utilisé dans un composant enfant de <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}