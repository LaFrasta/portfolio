import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { COPY, type Copy, type Lang } from './content';

interface LangState {
  lang: Lang;
  t: Copy;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangState | null>(null);

function initialLang(): Lang {
  const saved = localStorage.getItem('lang');
  if (saved === 'it' || saved === 'en') return saved;
  return navigator.language.toLowerCase().startsWith('it') ? 'it' : 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  return <LangContext.Provider value={{ lang, t: COPY[lang], setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang outside LangProvider');
  return ctx;
}
