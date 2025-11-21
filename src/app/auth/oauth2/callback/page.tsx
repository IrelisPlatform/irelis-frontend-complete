// /app/auth/oauth2/callback/page.tsx
"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

export default function OAuthCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useAuth(); // refresh removed

  useEffect(() => {
    (async () => {
      try {
        // Dans ce setup, le backend dépose un cookie HttpOnly, donc rien à faire ici
        // Le AuthProvider chargera automatiquement l'utilisateur après le redirect
      } catch (e) {
        // ignore
      } finally {
        const returnTo = params.get("returnTo") || "/";
        router.replace(returnTo);
      }
    })();
  }, []);

  return <div className="p-8">Connexion en cours...</div>;
}