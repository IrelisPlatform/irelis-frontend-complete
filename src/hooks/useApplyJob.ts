// /src/hooks/useApplyJob.ts

"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useApplyJob = (jobId: string) => {
  const { user } = useAuth();
  const router = useRouter();

  const handleApply = () => {
    if (!user) {
      // 🔑 Redirige vers l'auth avec returnTo = page du job
      const currentPath = `/jobs/${jobId}`;
      router.push(`/auth/signin?returnTo=${encodeURIComponent(currentPath)}`);
      return;
    }

    // ✅ Si l'utilisateur est connecté
    // 🔜 Plus tard : appel API pour postuler
    // 🚧 Pour l'instant : simule l'envoi ou redirige vers /jobs/:id/apply si la page existe

    // ⚠️ Si tu n'as PAS encore créé `/jobs/[id]/apply`, utilise un toast
    toast.success("✅ Candidature envoyée avec succès !");
    
    // ❌ Décommente la ligne ci-dessous SEULEMENT quand tu auras créé la page apply
    // router.push(`/jobs/${jobId}/apply`);
  };

  return { handleApply };
};