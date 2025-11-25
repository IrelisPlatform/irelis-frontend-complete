"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function OAuthSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = params.get("code");

    if (!code) {
      router.replace("/"); // si pas de code → home
      return;
    }

    const exchange = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otp/oauth2/exchange`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
            credentials: "include",
          }
        );

        if (!res.ok) {
          console.error("Erreur OAuth2 backend", await res.text());
          router.replace("/"); 
          return;
        }

        // tu peux stocker le token si le backend le renvoie
        const data = await res.json();
        console.log("OAuth tokens:", data);

        // Redirige vers l’accueil ou le dashboard
        router.replace("/");
      } catch (err) {
        console.error(err);
        router.replace("/");
      }
    };

    exchange();
  }, [params, router]);

  return <p>Connexion…</p>;
}
