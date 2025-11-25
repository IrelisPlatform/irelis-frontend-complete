// app/auth/signin/page.tsx
"use client";

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { checkEmail, requestOtp } from "@/lib/api"
import { Chrome as GoogleIcon, Linkedin } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import Image from "next/image";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const returnTo = params.get("returnTo") || "/";

  // ✅ Redirige vers Google via le backend
  const handleGoogle = () => {
    window.location.href = `${backendUrl}/oauth2/authorization/google?returnTo=${encodeURIComponent(returnTo)}`;
  };

  // ✅ Redirige vers LinkedIn via le backend
  const handleLinkedin = () => {
    window.location.href = `${backendUrl}/oauth2/authorization/linkedin?returnTo=${encodeURIComponent(returnTo)}`;
  };

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleContinue = async () => {

    // Vérification email
    if (!validateEmail(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${backendUrl}/auth/otp/check-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include"
      });

      if (!res.ok) throw new Error(`Erreur ${res.status}: impossible de vérifier l'email`);

      const data = await res.json();
      const url = data.exists && data.mode === "signin"
        ? `/auth/otp?email=${encodeURIComponent(email)}`
        : `/auth/choose-role?email=${encodeURIComponent(email)}`;

      router.push(url);
    }  catch (err: any) {
       console.error("Erreur dans handleContinue:", err);
       setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">

      <AuthHeader />

      <main className="flex justify-center flex-1">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border">

          {/* Texte façon Indeed */}
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Créez un compte ou connectez-vous. En cliquant sur l'option « Continuer » ci-dessous,
            vous acceptez les Conditions d'utilisation et reconnaissez notre politique en matière de cookies et notre politique de confidentialité.
          </p>

          <div className="space-y-3">

           
            {/* Google */}
            <Button variant="outline" className="w-full" onClick={handleGoogle}>
              <Image src="/icons/google-logo.jpg" alt="Google" width={18} height={18} className="mr-2" />
              Continuer avec Google
            </Button>

            {/* LinkedIn */}
            <Button variant="outline" className="w-full" onClick={handleLinkedin}>
              <Image src="/icons/linkedin-logo.jpg" alt="LinkedIn" width={18} height={18} className="mr-2" />
              Continuer avec LinkedIn
            </Button>

            <div className="text-center text-sm text-muted-foreground my-3">ou</div>


            {/* Email */}
            <div>
              <label className="text-sm mb-1 block">Adresse email</label>
              <Input
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
              />

              {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
            </div>


            <Button className="w-full mt-2" onClick={handleContinue} disabled={loading}>
              {loading ? "Chargement..." : "Continuer"}
            </Button>
          </div>
        </div>
      </main>

      <AuthFooter className="mt-10" />
    </div>
  );
}
