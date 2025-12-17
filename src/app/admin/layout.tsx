// src/app/admin/layout.tsx
"use client"; // ← Obligatoire car AdminUserMenu utilise useState/useRouter

import { useRouter, usePathname } from "next/navigation";
import AdminUserMenu from "@/components/admin/AdminUserMenu";
import { useEffect } from "react";
import Image from 'next/image';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login" || pathname === "/admin/register") {
      return;
    }

    const adminToken = localStorage.getItem("accessToken");
    if (!adminToken) {
      router.push("/admin/login");
    }
  }, [router, pathname]);

  // Affiche le header seulement hors login/register
  const showHeader = pathname !== "/admin/login" && pathname !== "/admin/register";

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      {showHeader && (
        <header className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* 🔷 Logo + Texte */}
            <div className="flex items-center gap-2">
              <Image
                src="/icons/logo.png"
                alt="Irelis"
                width={32}
                height={32}
                loading="eager"
                className="h-8 w-auto"
              />
            </div>

            {/* 🔷 Menu utilisateur */}
            <AdminUserMenu />
          </div>
        </header>
      )}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}