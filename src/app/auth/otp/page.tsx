// src/app/auth/otp/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { toast } from "sonner";

export default function OtpPage() {
  const router = useRouter();

  // Récupère les données depuis localStorage (stockées dans signin/choose-role)
  let email = "";
  let returnTo = "/";
  if (typeof window !== "undefined") {
    email = localStorage.getItem("auth_email") || "";
    returnTo = localStorage.getItem("auth_returnTo") || "/";
  }

  // Redirection sécurisée si email manquant
  useEffect(() => {
    if (!email) {
      router.push("/auth/signin");
    }
  }, [email, router]);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compteur de renvoi (60s)
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendCountdown, setResendCountdown] = useState(60);

  // Durée de validité OTP (10 min = 600s)
  const [otpExpiry, setOtpExpiry] = useState(600);

  // Timer pour l'expiration OTP
  useEffect(() => {
    if (otpExpiry <= 0) return;
    const timer = setInterval(() => {
      setOtpExpiry((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Timer pour le renvoi
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [resendCountdown]);

  // Demande initiale de l'OTP (au premier chargement)
  useEffect(() => {
    const requestOtp = async () => {
      if (!email) return;
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://irelis-backend.onrender.com";
        const res = await fetch(${backendUrl}/auth/otp/request, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          toast.error(err.message || "Impossible d’envoyer le code.");
          router.push("/auth/signin");
        }
        // Active le bouton "Renvoyer" après 60s
        setResendDisabled(true);
        setResendCountdown(60);
      } catch (err) {
        console.error(err);
        toast.error("Erreur réseau lors de l’envoi du code.");
        router.push("/auth/signin");
      }
    };

    requestOtp();
  }, [email, router]);

  const handleVerify = async () => {
    if (!code) return;
    setLoading(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://irelis-backend.onrender.com";
      const res = await fetch(${backendUrl}/auth/otp/verify, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok && data.accessToken && data.refreshToken) {
        // ✅ Stocke les tokens
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        // ✅ Redirige vers la page demandée
        window.location.href = returnTo;
      } else {
        setError(data.message || "Code invalide ou expiré.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendDisabled) return;
    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://irelis-backend.onrender.com";
      const res = await fetch(${backendUrl}/auth/otp/request, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success("Code renvoyé !");
        setResendDisabled(true);
        setResendCountdown(60);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Impossible de renvoyer le code.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur réseau lors du renvoi.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return ${mins}:${secs.toString().padStart(2, "0")};
  };

  if (!email) {
    return <div>Chargement...</div>;
  }

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
              className={text-sm ${resendDisabled ? "text-gray-400" : "text-blue-600 hover:underline"}}
            >
              {resendDisabled ? Renvoyer (${resendCountdown}s) : "Renvoyer le code"}
            </button>
          </div>
        </div>
      </main>
      <AuthFooter className="mt-10" />
    </div>
  );
}