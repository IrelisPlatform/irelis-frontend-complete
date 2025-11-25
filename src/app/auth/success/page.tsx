// src/app/auth/success/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

export default function SuccessPage() {
  const router = useRouter();
  const { fetchUser } = useAuth(); // ← on va l'exposer

  useEffect(() => {
    // Force le rechargement de l'utilisateur
    fetchUser().finally(() => {
      router.replace("/"); // ou router.push("/")
    });
  }, [fetchUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Connexion réussie !</p>
    </div>
  );
}
