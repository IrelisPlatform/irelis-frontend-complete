// app/auth/onboarding/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function OnboardingPage() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const returnTo = params.get("returnTo") || "/";
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!email) {
    // sécurité : rediriger sur signin si pas d'email
    if (typeof window !== "undefined") router.push("/auth/signin");
    return null;
  }

  const handleChoose = (userType: "CANDIDATE" | "RECRUITER") => {
    setLoading(true);
    // 🔁 Le backend gère l’envoi de l’OTP
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otp/start?email=${encodeURIComponent(email)}&userType=${userType}&returnTo=${encodeURIComponent(returnTo)}`;
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">Je suis candidat</h3>
          <p className="mt-3 text-sm text-muted-foreground">Postuler aux offres, recevoir des alertes, gérer mon profil.</p>
          <div className="mt-6">
            <Button onClick={() => handleChoose("CANDIDATE")} disabled={loading}>Continuer en tant que candidat</Button>
          </div>
        </div>

        <div className="p-8 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">Je suis recruteur</h3>
          <p className="mt-3 text-sm text-muted-foreground">Publier des offres et contacter des candidats.</p>
          <div className="mt-6">
            <Button onClick={() => handleChoose("RECRUITER")} disabled={loading}>Continuer en tant que recruteur</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
