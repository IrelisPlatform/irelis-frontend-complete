// src/app/admin/page.tsx

"use client"

import { AdminJobsTable } from "@/components/admin/AdminJobsTable";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminJobs } from "@/hooks/admin/useAdminJobs";

export default function AdminDashboardPage() {
  const { getAuthToken } = useAdminJobs();
  const router = useRouter();

  useEffect(() => {
    const validateSession = async () => {
      const token = getAuthToken(); // cette fonction doit retourner le token OU null
      if (!token) {
        router.push("/admin/login");
        return;
      }

      // Optionnel : faire un petit appel pour vérifier si le token est valide
      try {
        const res = await fetch("/admin/jobs?page=0&size=1", { // endpoint admin léger
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          localStorage.removeItem("accessToken");
          router.push("/admin/login");
        }
      } catch (err) {
        // ignore (offline, etc.)
      }
    };
    
    validateSession();
  }, [router]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e3a8a]">Tableau de bord administrateur</h1>
        <p className="text-muted-foreground">Gérez toutes les offres d’emploi de la plateforme.</p>
      </div>
      <AdminJobsTable />
    </div>
  );
}