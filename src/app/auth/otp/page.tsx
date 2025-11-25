// src/app/auth/otp/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
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
  const router = useRouter();

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

  const handleVerify = async () => {
  if (!code) return;
  setLoading(true);
  setError(null)

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code, email, userType: role, provider: "otp" })
    });

    if (!res.ok) {
        setError("Code invalide ou expiré.");
        return;
      }

      router.push(returnTo);
    } catch (err: any) {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };


  const handleResend = async () => {
  try {
    const rest = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otp/otp/resend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, userType: role, provider: "otp-resend" })
    });

    toast.success("Code renvoyé !");
    setResendDisabled(true);
    setCountdown(60);
  } catch (err) {
    console.error(err);
    toast.error("Erreur lors du renvoi du code.");
  }
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