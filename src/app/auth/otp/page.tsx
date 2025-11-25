// src/app/auth/otp/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { toast } from "sonner";

export default function OtpPage() {
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const role = params.get("role") ?? "CANDIDATE";
  const returnTo = params.get("returnTo") ?? "/";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compteur de renvoi
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);

  // Timer 10 min
  const [otpExpiry, setOtpExpiry] = useState(600);

  useEffect(() => {
    const timer = setInterval(() => setOtpExpiry(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);

  const handleVerify = () => {
    if (!code) return;
    // 🔁 Le backend gère la vérification
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otp/verify?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}&userType=${role}&returnTo=${encodeURIComponent(returnTo)}`;
  };

  const handleResend = () => {
    // 🔁 Le backend gère le renvoi
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otp/resend?email=${encodeURIComponent(email)}&userType=${role}&returnTo=${encodeURIComponent(returnTo)}`;
    toast.success("Demande de renvoi envoyée !");
    setResendDisabled(true);
    setCountdown(60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <AuthHeader />
      <main className="flex justify-center flex-1">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border">
          <h1 className="text-lg font-semibold mb-2">Saisissez le code</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Un code a été envoyé à <strong>{email}</strong>.  
            Valide pendant {formatTime(otpExpiry)}.
          </p>

          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="------"
            className="tracking-widest text-center"
          />

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <Button className="w-full mt-4" onClick={handleVerify} disabled={loading || !code}>
            {loading ? "Connexion..." : "Vérifier et me connecter"}
          </Button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendDisabled}
              className={`text-sm ${resendDisabled ? "text-gray-400" : "text-blue-600 hover:underline"}`}
            >
              {resendDisabled ? `Renvoyer (${countdown}s)` : "Renvoyer le code"}
            </button>
          </div>
        </div>
      </main>
      <AuthFooter className="mt-10" />
    </div>
  );
}