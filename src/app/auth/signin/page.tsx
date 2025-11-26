// src/app/auth/signin/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import Image from "next/image";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://irelis-backend.onrender.com";
  const returnTo = params.get("returnTo") || "/";

  // 🔧 En développement, pré-remplir l'email pour les tests OTP
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setEmail("luqnleng5@gmail.com");
    }
  }, []);

  const handleGoogle = () => {
    window.location.href = `${backendUrl}/auth/oauth2/google?returnTo=${encodeURIComponent(returnTo)}`;
  };

  const handleLinkedin = () => {
    window.location.href = `${backendUrl}/auth/oauth2/linkedin?returnTo=${encodeURIComponent(returnTo)}`;
  };

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleContinue = async () => {
    if (!validateEmail(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/auth/otp/check-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("auth_email", email);
        localStorage.setItem("auth_returnTo", returnTo);

        if (data.mode === "signup") {
          router.push("/auth/choose-role");
        } else {
          router.push("/auth/otp");
        }
      } else {
        setError(data.message || "Une erreur est survenue. Veuillez réessayer.");
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <AuthHeader />
      <main className="flex justify-center flex-1">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border">
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Créez un compte ou connectez-vous...
          </p>

          {/* 🔧 Dev helper */}
          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-orange-500 mb-3 bg-orange-50 p-2 rounded">
              💡 En développement : utilisez luqnleng5@gmail.com (ou un alias) pour recevoir l’OTP.
            </p>
          )}

          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={handleGoogle}>
              <Image src="/icons/google-logo.jpg" alt="Google" width={18} height={18} className="mr-2" />
              Continuer avec Google
            </Button>

            <Button variant="outline" className="w-full" onClick={handleLinkedin}>
              <Image src="/icons/linkedin-logo.jpg" alt="LinkedIn" width={18} height={18} className="mr-2" />
              Continuer avec LinkedIn
            </Button>

            <div className="text-center text-sm text-muted-foreground my-3">ou</div>

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

            <Button className="w-full mt-2" onClick={handleContinue} disabled={!email}>
              Continuer
            </Button>
          </div>
        </div>
      </main>
      <AuthFooter className="mt-10" />
    </div>
  );
}