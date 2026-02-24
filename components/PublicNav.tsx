"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { altegioLinks } from "@/lib/altegio";
import { useI18n } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function PublicNav() {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#f7f4ef]/95 backdrop-blur border-b border-zinc-200">
      <div className="border-b border-zinc-200/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>1st floor, 58 Kolonakiou Str, Limassol, 4103</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="tel:+35795505556" className="text-zinc-800 hover:text-black">
              +357 95505556
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="inline-flex items-center">
          <Image src="/logo-fitspace.svg" alt="Fit Space" width={120} height={28} className="h-7 w-auto" priority />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide text-zinc-700">
          <Link href="/" className="hover:text-black">{t.nav.studio}</Link>
          <Link href="/trainers" className="hover:text-black">{t.nav.trainers}</Link>
          <Link href="/schedule" className="hover:text-black">{t.nav.schedule}</Link>
          <Link href="/contacts" className="hover:text-black">{t.nav.contacts}</Link>
          <a href={altegioLinks.cabinet} target="_blank" rel="noreferrer" className="hover:text-black">
            {t.nav.cabinet}
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new Event("open-prices-modal"))}
            className="border border-zinc-300 px-4 py-2 text-xs uppercase tracking-[0.18em] text-zinc-800 transition hover:bg-zinc-900 hover:text-white"
          >
            {t.nav.prices}
          </button>
          <a
            href={altegioLinks.booking}
            target="_blank"
            rel="noreferrer"
            className="border border-zinc-300 px-4 py-2 text-xs uppercase tracking-[0.18em] text-zinc-800 transition hover:bg-zinc-900 hover:text-white"
          >
            {t.nav.book}
          </a>
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden border border-zinc-300 px-3 py-2 text-xs uppercase tracking-[0.14em] text-zinc-800"
        >
          {mobileOpen ? t.nav.close : t.nav.menu}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-zinc-200 bg-[#f7f4ef] md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-sm text-zinc-800">
            <Link href="/" onClick={() => setMobileOpen(false)}>{t.nav.studio}</Link>
            <Link href="/trainers" onClick={() => setMobileOpen(false)}>{t.nav.trainers}</Link>
            <Link href="/schedule" onClick={() => setMobileOpen(false)}>{t.nav.schedule}</Link>
            <Link href="/contacts" onClick={() => setMobileOpen(false)}>{t.nav.contacts}</Link>
            <a href={altegioLinks.cabinet} target="_blank" rel="noreferrer">{t.nav.cabinet}</a>

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  window.dispatchEvent(new Event("open-prices-modal"));
                }}
                className="border border-zinc-300 px-4 py-2 text-xs uppercase tracking-[0.18em]"
              >
                {t.nav.prices}
              </button>
              <a
                href={altegioLinks.booking}
                target="_blank"
                rel="noreferrer"
                className="border border-zinc-300 px-4 py-2 text-xs uppercase tracking-[0.18em]"
              >
                {t.nav.book}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
