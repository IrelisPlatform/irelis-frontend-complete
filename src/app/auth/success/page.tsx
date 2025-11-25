"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  const code = params.get("code");

  useEffect(() => {
    if (!code) return;

    async function exchange() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otp/oauth2/exchange`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ code }),
          }
        );

        if (!res.ok) {
          console.error("Exchange failed");
          return;
        }

        router.push("/"); // dashboard
      } catch (err) {
        console.error("OAuth2 exchange error:", err);
      }
    }

    exchange();
  }, [code, router]);

  return (
    <div className="flex items-center justify-center h-screen text-lg font-semibold">
      Connexion en cours...
    </div>
  );
}
