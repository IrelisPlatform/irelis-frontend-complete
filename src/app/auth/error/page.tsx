// src/app/auth/error/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthErrorPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "unknown";

  const getErrorMessage = () => {
    switch (reason) {
      case "oauth_failed":
        return t.auth.error.oauth_failed;
      case "otp_invalid":
        return t.auth.error.otp_invalid;
      case "network":
        return t.auth.error.network;
      default:
        return t.auth.error.unknown;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <AuthHeader />

      <main className="flex justify-center flex-1">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-4">{t.auth.error.title}</h1>
          <p className="text-gray-700 mb-6">{getErrorMessage()}</p>

          <Button asChild className="w-full">
            <Link href="/auth/signin">{t.auth.error.backToLogin}</Link>
          </Button>
        </div>
      </main>

      <AuthFooter className="mt-10" />
    </div>
  );
}