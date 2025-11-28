// src/app/auth/success/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthSuccessPage() {
  const { t } = useLanguage();
  const params = useSearchParams();
  const router = useRouter();
  const code = params.get("code");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim() || "https://irelis-backend.onrender.com";

  useEffect(() => {
    if (!code) {
      router.replace("/");
      return;
    }

    const exchangeAndFetchUser = async () => {
      try {
        // 1. Échanger le code OAuth contre les tokens
        const tokenRes = await fetch(`${backendUrl}/auth/otp/oauth2/exchange?code=${encodeURIComponent(code)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const tokenData = await tokenRes.json();

        if (!tokenRes.ok || !tokenData.accessToken || !tokenData.refreshToken) {
          console.error("Échec de l'échange OAuth:", tokenData);
          router.replace("/auth/signin?error=oauth_failed");
          return;
        }

        // 2. Récupérer l'email via l'endpoint dédié /auth/otp/user
        const userRes = await fetch(`${backendUrl}/auth/otp/user`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${tokenData.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const userData = await userRes.json();

        if (!userRes.ok || !userData.email) {
          console.error("Impossible de récupérer l'email via /auth/otp/user:", userData);
          router.replace("/auth/signin?error=missing_email");
          return;
        }

        // 3. Sauvegarder et rediriger
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_email", userData.email);
          localStorage.setItem("accessToken", tokenData.accessToken);
          localStorage.setItem("refreshToken", tokenData.refreshToken);

          const returnTo = localStorage.getItem("auth_returnTo") || "/";
          window.location.href = returnTo; // Full page reload pour rafraîchir l'état d'auth
        }
      } catch (err) {
        console.error("Erreur réseau dans /auth/success:", err);
        router.replace("/auth/signin?error=network");
      }
    };

    exchangeAndFetchUser();
  }, [code, router, backendUrl]);

  return (
    <div className="flex items-center justify-center h-screen text-lg font-semibold">
      {t.auth.success.connecting}
    </div>
  );
}