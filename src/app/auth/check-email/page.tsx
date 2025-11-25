//app/auth/check-email/page.tsx
"use client";

import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <AuthHeader />

      <main className="flex justify-center flex-1">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border">
          <p className="text-center text-sm text-muted-foreground">
            Vérification de votre email en cours…
          </p>
        </div>
      </main>

      <AuthFooter className="mt-10" />
    </div>
  );
}
