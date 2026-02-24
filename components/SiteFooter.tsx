"use client";

import Link from "next/link";
import { useI18n } from "@/components/LanguageProvider";

export function SiteFooter() {
  const { t, locale } = useI18n();

  return (
    <footer className="border-t border-zinc-200 bg-[#f7f4ef]">
      <div className="mx-auto max-w-6xl px-4 py-10 text-xs uppercase tracking-[0.14em] text-zinc-500 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>{t.footer.company}</span>
        <div className="flex items-center gap-4">
          <Link href="/policies" className="hover:text-zinc-800">
            {locale === "ru" ? "Правила студии" : "Studio Policies"}
          </Link>
          <span>{t.footer.copy}</span>
        </div>
      </div>
    </footer>
  );
}
