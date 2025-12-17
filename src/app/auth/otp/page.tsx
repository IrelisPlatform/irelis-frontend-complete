// src/app/auth/otp/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export default function OtpPage() {
  const { t } = useLanguage();
  const router = useRouter();

  let email = "";
  let returnTo = "/";
  if (typeof window !== "undefined") {
    email = localStorage.getItem("auth_email") || "";
    returnTo = localStorage.getItem("auth_returnTo") || "/";
  }

  useEffect(() => {
    if (!email) {
      router.push("/auth/signin");
    }
  }, [email, router]);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [otpExpiry, setOtpExpiry] = useState(600);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendCountdown, setResendCountdown] = useState(60);

  useEffect(() => {
    if (otpExpiry <= 0) return;
    const timer = setInterval(() => {
      setOtpExpiry((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (resendCountdown <= 0) {
      setResendDisabled(false);
    } else {
      const timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  useEffect(() => {
    const requestOtp = async () => {
      if (!email) return;
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://api-irelis.us-east-2.elasticbeanstalk.com";
        const role = typeof window !== "undefined" ? localStorage.getItem("auth_role") : "CANDIDATE";
        const res = await fetch(`${backendUrl}/auth/otp/request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, userType: role }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          toast.error(err.message || t.auth.signin.unknownError);
          router.push("/auth/signin");
        }
        setResendDisabled(true);
        setResendCountdown(60);
      } catch (err) {
        console.error(err);
        toast.error(t.auth.signin.serverError);
        router.push("/auth/signin");
      }
    };

    requestOtp();
  }, [email, router, t]);

  const handleVerify = async () => {
    if (!code) return;
    setLoading(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://api-irelis.us-east-2.elasticbeanstalk.com";
      const res = await fetch(`${backendUrl}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok && data.accessToken && data.refreshToken) {

        localStorage.setItem("accessToken", data.accessToken);

        // Nouveau : utiliser la redirection préférée si elle existe
        const preferredRedirect = localStorage.getItem("auth_preferred_redirect");
        const finalRedirect = preferredRedirect || returnTo;

        // Optionnel : nettoyer la redirection après usage
        if (preferredRedirect) {
          localStorage.removeItem("auth_preferred_redirect");
        }

        window.location.href = finalRedirect;
      } else {
        setError(data.message || t.auth.signin.unknownError);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || t.auth.signin.serverError);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://api-irelis.us-east-2.elasticbeanstalk.com";
      const role = typeof window !== "undefined" ? localStorage.getItem("auth_role") : "CANDIDATE";
      const res = await fetch(`${backendUrl}/auth/otp/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userType: role }),
      });

      if (res.ok) {
        toast.success(t.auth.otp.resendSuccess);
        setOtpExpiry(600);
        setResendDisabled(true);
        setResendCountdown(60);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || t.auth.signin.unknownError);
      }
    } catch (err) {
      console.error(err);
      toast.error(t.auth.signin.serverError);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!email) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <AuthHeader />
      <main className="flex justify-center flex-1">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border">
          <h1 className="text-lg font-semibold mb-2">{t.auth.otp.title}</h1>
          <p
            className="text-sm text-muted-foreground mb-4"
            dangerouslySetInnerHTML={{
              __html: t.auth.otp.sentTo(email),
            }}
          />
          <p className="text-sm text-muted-foreground mb-4">
            {t.auth.otp.validFor(formatTime(otpExpiry))}
          </p>

          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="------"
            className="tracking-widest text-center"
          />

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <Button
            className="w-full mt-4"
            onClick={handleVerify}
            disabled={loading || !code}
          >
            {loading ? t.auth.otp.verifying : t.auth.otp.verify}
          </Button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendDisabled}
              className={`text-sm ${resendDisabled ? "text-gray-400" : "text-blue-600 hover:underline"}`}
            >
              {resendDisabled
                ? t.auth.otp.resend(resendCountdown)
                : t.auth.otp.resendNow}
            </button>
          </div>
        </div>
      </main>
      <AuthFooter className="mt-10" />
    </div>
  );
}