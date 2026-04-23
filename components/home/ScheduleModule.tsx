"use client";

import { useEffect, useMemo, useState } from "react";
import { ScheduleSection, type ScheduleSectionCopy } from "@/components/home/ScheduleSection";
import { getStaticSchedule, type StaticScheduleItem } from "@/lib/static-schedule";
import { getLocalDateKey, type Mode } from "@/lib/home-page";

type ScheduleModuleProps = {
  copy: ScheduleSectionCopy;
  locale: "ru" | "en";
  id?: string;
  className?: string;
};

export function ScheduleModule({ copy, locale, id, className }: ScheduleModuleProps) {
  const [scheduleMode, setScheduleMode] = useState<Mode>("group");
  const [schedule] = useState<StaticScheduleItem[]>(() => getStaticSchedule());
  const [nowTs, setNowTs] = useState<number>(() => Date.now());

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

  return (
    <ScheduleSection
      copy={copy}
      locale={locale}
      scheduleMode={scheduleMode}
      onScheduleModeChange={setScheduleMode}
      scheduleByDay={scheduleByDay}
      id={id}
      className={className}
    />
  );
}
