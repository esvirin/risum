"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ContactsSection } from "@/components/home/ContactsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { InstructorsSection } from "@/components/home/InstructorsSection";
import { ScheduleSection } from "@/components/home/ScheduleSection";
import { PricesModalContainer } from "@/components/PricesModalContainer";
import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/components/LanguageProvider";
import { getStaticSchedule, type StaticScheduleItem } from "@/lib/static-schedule";
import { getLocalDateKey, studioSlides, type Mode } from "@/lib/home-page";

export default function HomePage() {
  const { locale, t } = useI18n();
  const copy = t.homeLite;
  const [scheduleMode, setScheduleMode] = useState<Mode>("group");
  const [studioIndex, setStudioIndex] = useState(0);
  const [schedule] = useState<StaticScheduleItem[]>(() => getStaticSchedule());
  const [nowTs, setNowTs] = useState<number>(() => Date.now());
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStudioIndex((prev) => (prev + 1) % studioSlides.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowTs(Date.now());
    }, 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const scheduleDays = useMemo(() => {
    const todayKey = getLocalDateKey(nowTs);
    const upcomingKeys = Array.from(
      new Set(
        schedule
          .filter((item) => item.mode === scheduleMode && getLocalDateKey(item.datetime) >= todayKey)
          .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
          .map((item) => getLocalDateKey(item.datetime)),
      ),
    );

    return upcomingKeys.slice(0, 5);
  }, [nowTs, schedule, scheduleMode]);

  const scheduleByDay = useMemo(
    () =>
      scheduleDays.map((day) => ({
        key: day,
        items: schedule
          .filter((item) => item.mode === scheduleMode && getLocalDateKey(item.datetime) === day)
          .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()),
      })),
    [schedule, scheduleDays, scheduleMode],
  );

  const mobileScheduleByDay = useMemo(() => scheduleByDay.slice(0, 5), [scheduleByDay]);

  return (
    <div className="bg-[#f7f4ef] text-zinc-900">
      <PublicNav />

      <HeroSection
        copy={copy}
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

      <ScheduleSection
        copy={copy}
        locale={locale}
        scheduleMode={scheduleMode}
        onScheduleModeChange={setScheduleMode}
        scheduleByDay={mobileScheduleByDay}
      />

      <ContactsSection copy={copy} openMapLabel={t.contacts.openMap} />

      <PricesModalContainer />

      <SiteFooter />
    </div>
  );
}
