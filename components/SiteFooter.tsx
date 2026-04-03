"use client";

import Link from "next/link";
import { useI18n } from "@/components/LanguageProvider";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-[#e5dbcc] bg-[#f4eee5]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 text-xs uppercase tracking-[0.14em] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <span>{t.footer.company}</span>
        <div className="flex items-center gap-4">
          <Link href="/policies" className="hover:text-zinc-800">
            {t.footer.policies}
          </Link>
          <span>{t.footer.copy}</span>
        </div>
      </div>
    </footer>
  );
}
