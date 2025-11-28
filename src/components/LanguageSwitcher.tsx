// /src/components/LanguageSwitcher.tsx

"use client";

import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button'; // ajuste le chemin si besoin
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const toggleLang = () => {
    setLang(lang === 'fr' ? 'en' : 'fr');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLang}
      className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
      aria-label={`Changer la langue (actuellement en ${lang === 'fr' ? 'français' : 'anglais'})`}
    >
      <Globe className="w-4 h-4 mr-1" />
      {lang === 'fr' ? 'FR' : 'EN'}
    </Button>
  );
}