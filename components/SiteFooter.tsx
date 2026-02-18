"use client";

import { useI18n } from "@/components/LanguageProvider";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-zinc-200 bg-[#f7f4ef]">
      <div className="mx-auto max-w-6xl px-4 py-10 text-xs uppercase tracking-[0.14em] text-zinc-500 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>{t.footer.company}</span>
        <span>{t.footer.copy}</span>
      </div>
    </footer>
  );
}
