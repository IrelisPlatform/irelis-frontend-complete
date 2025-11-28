// src/components/auth/AuthFooter.tsx
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function AuthFooter({ className = "" }) {
  const { t } = useLanguage();
  return (
    <footer className={`py-4 text-center text-sm text-gray-500 ${className}`}>
      © {new Date().getFullYear()} Irelis ·{" "}
      <Link href="/legal/terms" className="hover:underline">{t.auth.footer.terms}</Link> ·{" "}
      <Link href="/legal/privacy" className="hover:underline">{t.auth.footer.privacy}</Link> ·{" "}
      <Link href="/legal/cookies" className="hover:underline">{t.auth.footer.cookies}</Link>
    </footer>
  );
}