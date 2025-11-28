// /src/context/LanguageContext.tsx

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, DEFAULT_LANG } from '@/lib/i18n';

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations[Language];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(DEFAULT_LANG);

  // Récupère la langue sauvegardée au montage
  useEffect(() => {
    const savedLang = typeof window !== 'undefined'
      ? (localStorage.getItem('irelis-lang') as Language | null)
      : null;
    if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
      setLangState(savedLang);
    }
  }, []);

  // Sauvegarde la langue quand elle change
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('irelis-lang', newLang);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t: translations[lang],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}