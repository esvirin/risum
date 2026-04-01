"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { BOOKING_URL } from "@/lib/static-schedule";

export function PublicNav() {
  const { t } = useI18n();
  const [showTopBar, setShowTopBar] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBar(window.scrollY < 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-[#f7f4ef]/95 backdrop-blur">
      <div
        className={`overflow-hidden border-b border-zinc-200/80 transition-all duration-300 ${
          showTopBar ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>1st floor, 58 Kolonakiou Str, Limassol, 4103</p>
          <div className="ml-auto flex items-center gap-4 self-end sm:gap-6 sm:self-auto">
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new Event("open-prices-modal"))}
            className="border border-zinc-300 px-4 py-2 text-xs uppercase tracking-[0.18em] text-zinc-800 transition hover:bg-zinc-900 hover:text-white"
          >
            {t.nav.prices}
          </button>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className="border border-zinc-300 px-4 py-2 text-xs uppercase tracking-[0.18em] text-zinc-800 transition hover:bg-zinc-900 hover:text-white"
          >
            {t.nav.book}
          </a>
        </div>
      </div>
    </header>
  );
}
