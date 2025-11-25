// /app/auth/oauth2/callback/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function OAuthCallback() {
  const params = useSearchParams();
  const code = params.get("code");
  const provider = params.get("state");

  useEffect(() => {
    if (!code) return;

    async function exchangeCode() {
      try {
        await axios.post(`${API_URL}/auth/otp/oauth2/exchange`, {
          code,
          provider: provider ?? "google",
        }, { withCredentials: true });

        window.location.href = "/";
      } catch (err) {
        console.error("Exchange failed:", err);
      }
    }

    exchangeCode();
  }, [code, provider]);

  return <p>Connexion en cours...</p>;
}
