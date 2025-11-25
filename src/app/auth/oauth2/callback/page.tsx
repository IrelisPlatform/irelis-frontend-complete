// /app/auth/oauth2/callback/page.tsx
"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { getUser } from "@/lib/api";
import { saveAccessToken } from "@/lib/auth";
import { exchangeOAuthCode } from "@/lib/api";

export default function OAuthCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get("code");
  const returnTo = params.get("returnTo") || "/";


  useEffect(() => {
    const exchangeCode = async () => {
      if (!code) {
        router.replace("/auth/error?reason=missing_code");
        return;
      }

      try {
        // Appelle le nouveau endpoint
        const data = await exchangeOAuthCode(code);
        console.log("Token reçu:", data);
        saveAccessToken(data.accessToken);
        router.replace(returnTo);
      } catch (err) {
        console.error("OAuth exchange failed", err);
        router.replace("/auth/error?reason=oauth_exchange_failed");
      }
    };

    exchangeCode();
  }, [code, returnTo, router]);

  return <div className="p-8">Connexion en cours...</div>;
}