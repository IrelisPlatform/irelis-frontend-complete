// src/app/auth/error/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "unknown_error";

  const getErrorMessage = () => {
    switch (reason) {
      case "oauth_failed":
        return "La connexion avec Google a échoué. Veuillez réessayer.";
      case "otp_invalid":
        return "Le code saisi est invalide ou expiré.";
      case "network":
        return "Une erreur réseau est survenue. Veuillez vérifier votre connexion.";
      default:
        return "Une erreur inattendue s'est produite.";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <AuthHeader />

      <main className="flex justify-center flex-1">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-4">Erreur d’authentification</h1>
          <p className="text-gray-700 mb-6">{getErrorMessage()}</p>

          <Button asChild className="w-full">
            <Link href="/auth/signin">Retour à la connexion</Link>
          </Button>
        </div>
      </main>

      <AuthFooter className="mt-10" />
    </div>
  );
}