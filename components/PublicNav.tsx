"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
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
    <header className="sticky top-0 z-50 border-b border-[#e4d9ca] bg-[rgba(247,244,239,0.86)] backdrop-blur-xl">
      <div
        className={`overflow-hidden border-b border-[#e8dece]/80 transition-all duration-300 ${
          showTopBar ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:py-3">
          <div className="hidden items-center gap-2 md:flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e5dbcc] bg-white/72 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-zinc-500 shadow-[0_6px_18px_rgba(24,20,16,0.03)]">
              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
              1st floor, 58 Kolonakiou Str, Limassol, 4103
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2 self-end sm:self-auto">
            <a
              href="tel:+35795505556"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e5dbcc] bg-white/72 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-zinc-700 shadow-[0_6px_18px_rgba(24,20,16,0.03)] transition hover:border-zinc-900 hover:text-zinc-900 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.18em]"
            >
              <Phone className="h-3 w-3 text-zinc-400 sm:h-3.5 sm:w-3.5" />
              +357 95505556
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-4 sm:h-[5.25rem] sm:gap-4">
        <Link href="/" className="inline-flex shrink-0 items-center justify-center overflow-visible rounded-[18px] pr-1 sm:pr-0">
          <>
            <Image
              src="/logo.png"
              alt="Pilates Space"
              width={188}
              height={188}
              className="h-[2.75rem] w-auto opacity-95 sm:hidden"
              priority
            />
            <Image
              src="/brand.png"
              alt="Pilates Space"
              width={340}
              height={83}
              className="relative top-0.5 hidden h-[3.25rem] w-auto opacity-95 sm:block lg:h-[3.55rem]"
              priority
            />
          </>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <OpenPricesButton
            className="inline-flex min-w-[6.1rem] items-center justify-center rounded-full border border-[#e5dbcc] bg-white/88 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-600 shadow-[0_10px_24px_rgba(24,20,16,0.04)] transition hover:-translate-y-0.5 hover:bg-white hover:text-zinc-900 sm:min-w-[7.2rem] sm:px-5 sm:text-[11px]"
          >
            {t.nav.prices}
          </OpenPricesButton>
          <Link
            href={BOOKING_PAGE_PATH}
            className="inline-flex min-w-[6.1rem] items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white shadow-[0_10px_24px_rgba(24,20,16,0.07)] transition hover:-translate-y-0.5 hover:bg-zinc-800 sm:min-w-[7.2rem] sm:px-5 sm:text-[11px]"
          >
            {t.nav.book}
          </Link>
        </div>
      </div>
    </header>
  );
}
