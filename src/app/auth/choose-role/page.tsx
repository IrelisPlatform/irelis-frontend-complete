// src/app/auth/choose-role/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { useLanguage } from "@/context/LanguageContext";

export default function ChooseRolePage() {
  const { t } = useLanguage();
  const router = useRouter();
  let email = "";

  if (typeof window !== "undefined") {
    email = localStorage.getItem("auth_email") || "";
  }

  useEffect(() => {
    if (!email) {
      router.push("/auth/signin");
    }
  }, [email, router]);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const choose = (role: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_role", role);
    }
    router.push("/auth/otp");
  };

  if (!email) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <AuthHeader />
      <main className="flex flex-1 justify-center mt-4">
        <div className="flex flex-col gap-6 w-full max-w-md">
          <div className="text-center">
            <h1 className="mt-6 w-full text-muted-foreground mb-8">{t.auth.chooseRole.title}</h1>
            <h2 className="text-lg font-semibold mb-4">
              {t.auth.chooseRole.subtitle}
            </h2>
          </div>

          <div 
            className={`p-6 rounded-xl border cursor-pointer ${selectedRole === "CANDIDATE" ? "border-[#1e3a8a] bg-blue-50" : "border-gray-200"}`}
            onClick={() => setSelectedRole("CANDIDATE")}
          >
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full border-2 border-[#1e3a8a] flex items-center justify-center">
                {selectedRole === "CANDIDATE" && <div className="w-3 h-3 rounded-full bg-[#1e3a8a]" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">{t.auth.chooseRole.candidate.title}</h3>
                <p className="text-sm text-gray-600">{t.auth.chooseRole.candidate.description}</p>
              </div>
            </div>
          </div>

          <div 
            className={`p-6 rounded-xl border cursor-pointer ${selectedRole === "RECRUITER" ? "border-[#1e3a8a] bg-blue-50" : "border-gray-200"}`}
            onClick={() => setSelectedRole("RECRUITER")}
          >
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full border-2 border-[#1e3a8a] flex items-center justify-center">
                {selectedRole === "RECRUITER" && <div className="w-3 h-3 rounded-full bg-[#1e3a8a]" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">{t.auth.chooseRole.recruiter.title}</h3>
                <p className="text-sm text-gray-600">{t.auth.chooseRole.recruiter.description}</p>
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-6 bg-[#1e3a8a] hover:bg-[#1e40af] text-white shadow-md"
            disabled={!selectedRole}
            onClick={() => selectedRole && choose(selectedRole)}
          >
            {t.auth.chooseRole.continue}
          </Button>
        </div>
      </main>
      <AuthFooter className="mt-10" />
    </div>
  );
}