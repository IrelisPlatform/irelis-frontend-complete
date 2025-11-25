// app/auth/otp/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";
import { resendOtp } from "@/lib/api";
import { toast } from "sonner";

export default function OtpPage() {
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const router = useRouter();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compteur de renvoi
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);

  // Timer 10 min (600 secondes)
  const [otpExpiry, setOtpExpiry] = useState(600); // 10 min

  const { verifyOtp, requestOtp, userType } = useAuth();


  useEffect(() => {
    const timer = setInterval(() => {
      setOtpExpiry((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  
  // ⏰ Démarre le compteur au chargement
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
    setError(null);

    try {
      const ok = await verifyOtp(email, code);
      if (!ok) {
        setError("Code invalide ou expiré.");
      }
      // → verifyOtp redirige automatiquement vers "/" si succès
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userType || !email) return;
    setLoading(true);
    setError(null);

    try {
      await resendOtp(email, userType);

      // 🔊 Joue le son
      const audio = new Audio("/sounds/notification.mp3");
      audio.play().catch(() => {}); // ignore si autoplay bloqué

      // ✅ Affiche le toast
      toast.success("Nouveau code envoyé !");

      // 🔁 Réinitialise le compteur après envoi
      setResendDisabled(true);
      setCountdown(60);
    } catch (err: any) {
      toast.error(err.message || "Impossible de renvoyer le code.");
    } finally {
      setLoading(false);
    }
  };

  // Formatte le temps restant
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

          <Button className="w-full mt-4" onClick={handleVerify} disabled={loading}>
            {loading ? "Connexion..." : "Vérifier et me connecter"}
          </Button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendDisabled || loading}
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
