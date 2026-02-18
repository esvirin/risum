"use client";

import { useI18n } from "@/components/LanguageProvider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const baseClass =
    "inline-flex items-center justify-center border px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] transition";
  const activeClass = "border-zinc-900 bg-zinc-900 text-white";
  const idleClass = "border-zinc-300 text-zinc-700 hover:border-zinc-900 hover:text-zinc-900";

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={() => setLocale("ru")}
        className={`${baseClass} ${locale === "ru" ? activeClass : idleClass}`}
        aria-label="Switch language to Russian"
      >
        RU
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`${baseClass} ${locale === "en" ? activeClass : idleClass}`}
        aria-label="Switch language to English"
      >
        EN
      </button>
    </div>
  );
}
