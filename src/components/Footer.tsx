// /src/components/Footer.tsx

import logo from "@/../public/icons/logo.png";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext"; // ← ajout

export function Footer() {
  const { t } = useLanguage(); // ← ajout

  return (
    <footer className="bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo et description */}
          <div className="md:col-span-1 flex flex-col items-start pt-0.5">
            <img 
              src={logo.src} 
              alt={t.footer.logoAlt} 
              className="h-12 mb-5 brightness-0 invert"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
            />
            <p className="text-sm text-gray-400 mb-6 leading-relaxed max-w-[200px]">
              {t.footer.description}
            </p>
          </div>

          {/* Candidats */}
          <div className="flex flex-col items-start mt-3">
            <h4 className="text-white mb-5">{t.footer.candidates}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">{t.footer.searchJob}</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">{t.footer.createCv}</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">{t.footer.support}</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">{t.footer.careerAdvice}</a></li>
            </ul>
          </div>

          {/* Entreprises */}
          <div className="flex flex-col items-start mt-3">
            <h4 className="text-white mb-5">{t.footer.companies}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">{t.footer.postOffer}</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">{t.footer.hrSolutions}</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">{t.footer.pricing}</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">{t.footer.recruiterSpace}</a></li>
            </ul>
          </div>

          {/* Contact + Réseaux sociaux */}
          <div className="flex flex-col items-start mt-3">
            <h4 className="text-white mb-5">{t.footer.contact}</h4>
            <ul className="space-y-4 text-sm mb-6">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#1e3a8a]" />
                <span>{t.footer.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-[#1e3a8a]" />
                <span>{t.footer.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-[#1e3a8a]" />
                <span>{t.footer.email}</span>
              </li>
            </ul>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#1e3a8a] hover:scale-110 transition-all duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#1e3a8a] hover:scale-110 transition-all duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#1e3a8a] hover:scale-110 transition-all duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#1e3a8a] hover:scale-110 transition-all duration-200">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700/50 pt-8 pb-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-gray-400">{t.footer.copyright}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/legal/terms" className="hover:text-white transition-all duration-200">{t.footer.legal}</Link>
            <Link href="/legal/privacy" className="hover:text-white transition-all duration-200">{t.footer.privacy}</Link>
            <Link href="/legal/cgu" className="hover:text-white transition-all duration-200">{t.footer.cgu}</Link>
            <Link href="/legal/faq" className="hover:text-white transition-all duration-200">{t.footer.faq}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}