"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultLocale, localeStorageKey, translations, type Locale } from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  setLocale: (value: Locale) => void;
  t: (typeof translations)[Locale];
};

function getPreferredLocale(): Locale {
  const stored = window.localStorage.getItem(localeStorageKey);
  if (stored === "ru" || stored === "en") return stored;
  return window.navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en";
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const preferredLocale = getPreferredLocale();
    if (preferredLocale === defaultLocale) return;

    const frameId = window.requestAnimationFrame(() => {
      setLocale(preferredLocale);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(localeStorageKey, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    return {
      locale,
      setLocale,
      t: translations[locale],
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return context;
}
