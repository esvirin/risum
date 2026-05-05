"use client";

import { useI18n } from "@/components/LanguageProvider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const baseClass =
    "inline-flex min-w-[2.7rem] items-center justify-center rounded-[9px] px-2 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] transition sm:min-w-[3.4rem] sm:rounded-[10px] sm:px-2.5 sm:py-2 sm:text-[10px]";
  const activeClass = "bg-zinc-900 text-white shadow-[0_6px_16px_rgba(24,20,16,0.12)]";
  const idleClass = "text-zinc-500 hover:bg-white hover:text-zinc-900";

  return (
    <div className="inline-flex items-center rounded-[12px] border border-[#e4d9ca] bg-[#f7f2eb]/92 p-1 shadow-[0_8px_20px_rgba(24,20,16,0.04)]">
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
