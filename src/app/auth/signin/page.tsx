// src/app/auth/signin/page.tsx
"use client";

import { useState } from "react";
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
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const returnTo = params.get("returnTo") || "/";

  const handleGoogle = () => {
    window.location.href = `${backendUrl}/oauth2/authorization/google?returnTo=${encodeURIComponent(returnTo)}`;
  };

  const handleLinkedin = () => {
    window.location.href = `${backendUrl}/oauth2/authorization/linkedin?returnTo=${encodeURIComponent(returnTo)}`;
  };

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleContinue = async () => {
    if (!validateEmail(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    // 🔁 Le backend gère TOUT : envoi OTP, vérification, session
    window.location.href = `${backendUrl}/auth/otp/start?email=${encodeURIComponent(email)}&returnTo=${encodeURIComponent(returnTo)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <AuthHeader />
      <main className="flex justify-center flex-1">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border">
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Créez un compte ou connectez-vous...
          </p>

          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={handleGoogle}>
              <Image src="/icons/google-logo.jpg" alt="Google" width={18} height={18} className="mr-2" />
              Continuer avec Google
            </Button>

            <Button variant="outline" className="w-full" onClick={handleLinkedin} disabled>
              <Image src="/icons/linkedin-logo.jpg" alt="LinkedIn" width={18} height={18} className="mr-2" />
              Continuer avec LinkedIn (bientôt)
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