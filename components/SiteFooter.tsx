"use client";

import { Instagram } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/LanguageProvider";
import { instagramHref } from "@/lib/home-page";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-[#e5dbcc] bg-[#f4eee5]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 text-xs uppercase tracking-[0.14em] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span>{t.footer.company}</span>
          <span className="text-[0.65rem] text-zinc-400">{t.footer.registration}</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={instagramHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-zinc-800"
            aria-label="Instagram"
          >
            <Instagram className="h-4 w-4" />
            <span>Instagram</span>
          </a>
          <Link href="/policies" className="hover:text-zinc-800">
            {t.footer.policies}
          </Link>
          <span>{t.footer.copy}</span>
        </div>
      </div>
    </footer>
  );
}
