"use client";

import { createContext, useContext, useMemo } from "react";
import { translator, type Lang, type Translate } from ".";

const LangContext = createContext<{ lang: Lang; t: Translate }>({ lang: "en", t: (s) => s });

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const value = useMemo(() => ({ lang, t: translator(lang) }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
