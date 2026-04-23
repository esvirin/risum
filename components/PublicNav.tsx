"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { OpenPricesButton } from "@/components/OpenPricesButton";
import { useI18n } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { BOOKING_PAGE_PATH } from "@/lib/booking";

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
    <header className="sticky top-0 z-50 border-b border-[#e4d9ca] bg-[#f7f4ef]/88 backdrop-blur-xl">
      <div
        className={`overflow-hidden border-b border-[#e8dece]/90 transition-all duration-300 ${
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

      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
        <Link href="/" className="inline-flex items-center">
          <Image src="/logo-fitspace.svg" alt="Fit Space" width={120} height={28} className="h-6 w-auto opacity-95 sm:h-7" priority />
        </Link>

        <div className="flex items-center gap-2">
          <OpenPricesButton
            className="inline-flex items-center justify-center rounded-[14px] border border-[#e5dbcc] bg-white/82 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-zinc-600 shadow-[0_8px_24px_rgba(24,20,16,0.04)] transition hover:-translate-y-0.5 hover:bg-white hover:text-zinc-900 sm:px-4 sm:text-xs"
          >
            {t.nav.prices}
          </OpenPricesButton>
          <Link
            href={BOOKING_PAGE_PATH}
            className="inline-flex items-center justify-center rounded-[14px] border border-zinc-900 bg-zinc-900 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_rgba(24,20,16,0.07)] transition hover:-translate-y-0.5 hover:bg-zinc-800 sm:px-4 sm:text-xs"
          >
            {t.nav.book}
          </Link>
        </div>
      </div>
    </header>
  );
}
