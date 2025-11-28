// src/app/auth/success/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseJwt } from "@/lib/jwt";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthSuccessPage() {
  const { t } = useLanguage();
  const params = useSearchParams();
  const router = useRouter();
  const code = params.get("code");

  useEffect(() => {
    if (!code) {
      router.replace("/");
      return;
    }

    const exchange = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://irelis-backend.onrender.com";
        const res = await fetch(`${backendUrl}/auth/otp/oauth2/exchange?code=${encodeURIComponent(code)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (res.ok && data.accessToken && data.refreshToken) {
          if (typeof window !== "undefined") {
            const payload = parseJwt(data.accessToken);
            const userEmail = payload?.email;
            if (!userEmail) {
              console.error("JWT ne contient pas d'email");
              router.replace("/auth/signin?error=missing_email");
              return;
            }
            localStorage.setItem("auth_email", userEmail);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            const returnTo = localStorage.getItem("auth_returnTo") || "/";
            window.location.href = returnTo;
          }
        } else {
          console.error("Échange OAuth2 échoué:", data);
          router.replace("/auth/signin?error=oauth_failed");
        }
      } catch (err) {
        console.error("Erreur réseau:", err);
        router.replace("/auth/signin?error=network");
      }
    };

    exchange();
  }, [code, router]);

  return (
    <div className="flex items-center justify-center h-screen text-lg font-semibold">
      {t.auth.success.connecting}
    </div>
  );
}