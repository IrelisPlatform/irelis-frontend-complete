// src/app/auth/signin/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function SigninPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://irelis-backend.onrender.com";
  const returnTo = 
    process.env.NODE_ENV === 'development'
      ? "/"
      : params.get("returnTo") || "/";

  useEffect(() => {
    if ((process.env.NODE_ENV || 'production') === 'development') {
      setEmail("luqnleng5@gmail.com");
    }
  }, []);

  const handleGoogle = () => {
    window.location.href = `${backendUrl}/oauth2/authorization/google?state=google&returnTo=${encodeURIComponent(returnTo)}`;
  };

  const handleLinkedin = () => {
    window.location.href = `${backendUrl}/oauth2/authorization/linkedin?state=linkedin&returnTo=${encodeURIComponent(returnTo)}`;
  };

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const [isChecking, setIsChecking] = useState(false);

  const handleContinue = async () => {
    if (!validateEmail(email)) {
      setError(t.auth.signin.invalidEmail);
      return;
    }

    setIsChecking(true);
    setError("");

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
        setError(data.message || t.auth.signin.unknownError);
      }
    } catch (err) {
      console.error(err);
      setError(t.auth.signin.serverError);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <AuthHeader />
      <main className="flex justify-center flex-1">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border">
          <span className="text-2xl font-bold text-[#1e3a8a]">{t.auth.signin.title}</span>

          <h2 className="mt-6 w-full text-muted-foreground">
            {t.auth.signin.subtitle}
          </h2>

          <p className="mt-6 text-xs text-muted-foreground mb-6 leading-relaxed">
            {t.auth.signin.consent}
          </p>

          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-orange-500 mb-3 bg-orange-50 p-2 rounded">
              {t.auth.signin.devNote}
            </p>
          )}

          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={handleGoogle}>
              <Image src="/icons/google-logo.jpg" alt="Google" width={18} height={18} className="mr-2" />
              {t.auth.signin.google}
            </Button>

            <Button variant="outline" className="w-full" onClick={handleLinkedin}>
              <Image src="/icons/linkedin-logo.jpg" alt="LinkedIn" width={18} height={18} className="mr-2" />
              {t.auth.signin.linkedin}
            </Button>

            <div className="text-center text-sm text-muted-foreground my-3">{t.auth.signin.or}</div>

            <div>
              <label className="text-sm mb-1 block">{t.auth.signin.emailLabel}</label>
              <Input
                type="email"
                placeholder={t.auth.signin.emailPlaceholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
              />
              {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
            </div>

            <Button 
              className="w-full mt-2" 
              onClick={handleContinue} 
              disabled={!email || isChecking}
            >
              {isChecking ? t.auth.signin.verifying : t.auth.signin.continue}
            </Button>
          </div>
        </div>
      </main>
      <AuthFooter className="mt-10" />
    </div>
  );
}