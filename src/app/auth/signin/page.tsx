// src/app/auth/signin/page.tsx

"use client";

import { useState, useEffect } from "react";
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
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://irelis-backend.onrender.com";
  const returnTo = 
    process.env.NODE_ENV === 'development'
      ? "/"
      : params.get("returnTo") || "/";

  // 🔧 En développement, pré-remplir l'email pour les tests OTP
  useEffect(() => {
    if ((process.env.NODE_ENV || 'production') === 'development') {
      setEmail("luqnleng5@gmail.com");
    }
  }, []);
  
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "OAUTH_SUCCESS") {
        const { code } = event.data;
        // Échange le code contre les tokens
        exchangeOAuth2Code(code);
      } else if (event.data?.type === "OAUTH_ERROR") {
        setError("Échec de la connexion OAuth2.");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const exchangeOAuth2Code = async (tempCode: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://irelis-backend.onrender.com";
      const res = await fetch(`${backendUrl}/auth/otp/oauth2/exchange?code=${encodeURIComponent(tempCode)}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
      const data = await res.json();

      if (res.ok && data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        const returnTo = localStorage.getItem("auth_returnTo") || "/";
        window.location.href = returnTo;
      } else {
        setError("Échec de l’échange OAuth2.");
      }
    } catch (err) {
      setError("Erreur réseau lors de l’échange OAuth2.");
    }
  };

  const openOAuthPopup = (provider: "google" | "linkedin") => {
     const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://irelis-backend.onrender.com";
    const returnTo = params.get("returnTo") || "/";
    // URL de la popup vers le backend, qui redirigera vers Google/LinkedIn
    const authUrl = `${backendUrl}/oauth2/authorization/${provider}?state=${provider}&returnTo=${encodeURIComponent(returnTo)}`;
  
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
  
    window.open(
      authUrl,
      `${provider}_auth`,
      `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`
    );
  };

  // Dans les boutons :
  const handleGoogle = () => openOAuthPopup("google");
  const handleLinkedin = () => openOAuthPopup("linkedin");

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const [isChecking, setIsChecking] = useState(false);

  const handleContinue = async () => {
    if (!validateEmail(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    setIsChecking(true); // ✅ Démarrer le chargement
    setError("") 

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
        setError(data.message || "Une erreur est survenue. Veuillez réessayer.");
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <AuthHeader />
      <main className="flex justify-center flex-1">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border">
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Créez un compte ou connectez-vous...
          </p>

          {/* 🔧 Dev helper */}
          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-orange-500 mb-3 bg-orange-50 p-2 rounded">
              💡 En développement : utilisez luqnleng5@gmail.com (ou un alias) pour recevoir l’OTP.
            </p>
          )}

          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={handleGoogle}>
              <Image src="/icons/google-logo.jpg" alt="Google" width={18} height={18} className="mr-2" />
              Continuer avec Google
            </Button>

            <Button variant="outline" className="w-full" onClick={handleLinkedin}>
              <Image src="/icons/linkedin-logo.jpg" alt="LinkedIn" width={18} height={18} className="mr-2" />
              Continuer avec LinkedIn
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

            <Button 
              className="w-full mt-2" 
              onClick={handleContinue} 
              disabled={!email || isChecking}
            >
              {isChecking ? "Vérification..." : "Continuer"}
            </Button>
          </div>
        </div>
      </main>
      <AuthFooter className="mt-10" />
    </div>
  );
}