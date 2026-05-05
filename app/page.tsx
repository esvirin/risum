"use client";

import { useEffect, useRef, useState } from "react";
import { ContactsSection } from "@/components/home/ContactsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { InstructorsSection } from "@/components/home/InstructorsSection";
import { ScheduleModule } from "@/components/home/ScheduleModule";
import { PricesModalContainer } from "@/components/PricesModalContainer";
import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/components/LanguageProvider";
import { studioSlides } from "@/lib/home-page";

export default function HomePage() {
  const { locale, t } = useI18n();
  const copy = t.homeLite;
  const [studioIndex, setStudioIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStudioIndex((prev) => (prev + 1) % studioSlides.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-[#f7f4ef] text-zinc-900">
      <PublicNav />

      <HeroSection
        copy={copy}
        pricesLabel={t.nav.prices}
        bookLabel={t.nav.book}
        studioIndex={studioIndex}
        onTouchStart={(clientX) => {
          touchStartX.current = clientX;
        }}
        onTouchEnd={(clientX) => {
          const startX = touchStartX.current;
          touchStartX.current = null;

          if (startX === null || clientX === null) return;

          const deltaX = clientX - startX;
          if (Math.abs(deltaX) < 40) return;

          setStudioIndex((prev) =>
            deltaX < 0
              ? (prev + 1) % studioSlides.length
              : (prev - 1 + studioSlides.length) % studioSlides.length,
          );
        }}
      />

      <InstructorsSection copy={copy} />

      <ScheduleModule copy={copy} locale={locale} />

      <ContactsSection copy={copy} openMapLabel={t.contacts.openMap} />

      <PricesModalContainer />

      <SiteFooter />
    </div>
  );
}
