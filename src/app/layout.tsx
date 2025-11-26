// /app/layout.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { FloatingContact } from "@/components/FloatingContact";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Irelis Jobs",
  description: "Plateforme d’offres d’emploi premium",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${GeistSans.className} min-h-screen bg-background text-foreground`}>
        {/* AuthProvider et FloatingContact sont des composants client */}
        <Suspense fallback={null}>
          <AuthProvider>
            <FloatingContact />
            {children}
            <Toaster 
              position="bottom-center"
              theme="light"
              richColors
            />
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}

