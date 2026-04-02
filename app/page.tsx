"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { PricesModal } from "@/components/PricesModal";
import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/components/LanguageProvider";
import { BOOKING_URL, getStaticSchedule, type StaticScheduleItem } from "@/lib/static-schedule";

type PriceCard = {
  id: string;
  label?: string;
  title: string;
  price: string;
  unitPrice?: string;
  note?: string;
  mode: Mode;
};

const trainers = [
  { name: "Olga", role: "Instructor", image: "/wfolio/olga.jpg" },
  { name: "Svetlana", role: "Instructor", image: "/wfolio/svetlana.jpg" },
  { name: "Konstantina", role: "Instructor", image: "/wfolio/konstantina.jpg" },
  { name: "Christina", role: "Instructor", image: "/wfolio/christina.jpg" },
];

const studioSlides = [
  "/instagram/fit-1.jpg",
  "/instagram/fit-2.jpg",
];

function formatLocalizedDay(value: string, locale: "ru" | "en") {
  const dtLocale = locale === "ru" ? "ru-RU" : "en-US";
  return new Intl.DateTimeFormat(dtLocale, {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getScheduleHeading() {
  return "Reformer Pilates & Stretching";
}

function getLocalDateKey(dateValue: string | number | Date) {
  const d = new Date(dateValue);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getTrainerName(value: string) {
  return value.split("·")[0]?.trim() || value;
}

function getRoomName(value: string) {
  return value.split("·")[1]?.trim() || "Studio";
}

function getCardService(service: string) {
  return service === "Reformer Pilates" ? null : service;
}

function getWeekdayNumber(value: string) {
  const day = new Date(value).getDay();
  return day === 0 ? 7 : day;
}

function getTimeKey(value: string) {
  const date = new Date(value);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export default function HomePage() {
  const { locale, t } = useI18n();
  const copy = t.homeLite;
  const manualPrices: PriceCard[] = useMemo(
    () =>
      copy.priceCards.map((item) => ({
        ...item,
        label: item.mode === "group" ? copy.groupLessons : copy.privateLessons,
      })),
    [copy],
  );

  const [priceMode, setPriceMode] = useState<Mode>("group");
  const [pricesOpen, setPricesOpen] = useState(false);
  const [studioIndex, setStudioIndex] = useState(0);
  const [schedule] = useState<StaticScheduleItem[]>(() => getStaticSchedule());
  const [nowTs, setNowTs] = useState<number>(() => Date.now());
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const open = () => setPricesOpen(true);
    window.addEventListener("open-prices-modal", open);
    return () => window.removeEventListener("open-prices-modal", open);
  }, []);

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
    const now = nowTs;
    const max = now + 7 * 24 * 60 * 60 * 1000;
    const todayKey = getLocalDateKey(now);

    const filtered = schedule
      .filter((item) => {
        const ts = new Date(item.datetime).getTime();
        if (!Number.isFinite(ts)) return false;
        const itemDayKey = getLocalDateKey(item.datetime);
        if (item.mode !== "group") return false;
        if (itemDayKey === todayKey) return ts <= max;
        return ts >= now && ts <= max;
      })
      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

    const map = new Map<string, StaticScheduleItem[]>();
    for (const item of filtered) {
      const key = getLocalDateKey(item.datetime);
      map.set(key, [...(map.get(key) ?? []), item]);
    }

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      const key = getLocalDateKey(day);
      return [key, map.get(key) ?? []] as [string, StaticScheduleItem[]];
    });
  }, [schedule, nowTs]);

  const pricedServices = useMemo(
    () => manualPrices.filter((item) => item.mode === priceMode),
    [manualPrices, priceMode],
  );

  const scheduleDayHeaders = useMemo(() => {
    const dtLocale = locale === "ru" ? "ru-RU" : "en-US";
    return Array.from({ length: 6 }, (_, index) => {
      const day = new Date(nowTs);
      const weekday = day.getDay();
      const diffToMonday = weekday === 0 ? -6 : 1 - weekday;
      day.setDate(day.getDate() + diffToMonday + index);
      return new Intl.DateTimeFormat(dtLocale, { weekday: "long" }).format(day);
    });
  }, [locale, nowTs]);

  const roomTables = useMemo(() => {
    const rooms = ["Room 1", "Room 2"];

    return rooms.map((room) => {
      const roomItems = scheduleDays.flatMap(([, items]) =>
        items.filter((item) => item.mode === "group" && getRoomName(item.trainer) === room),
      );
      const timeKeys = Array.from(new Set(roomItems.map((item) => getTimeKey(item.datetime)))).sort();

      return {
        room,
        rows: timeKeys.map((timeKey) => ({
          timeKey,
          cells: Array.from({ length: 6 }, (_, weekdayIndex) => {
            const weekday = weekdayIndex + 1;
            return (
              roomItems.find(
                (item) => getWeekdayNumber(item.datetime) === weekday && getTimeKey(item.datetime) === timeKey,
              ) ?? null
            );
          }),
        })),
      };
    });
  }, [scheduleDays]);

  const roomDaySections = useMemo(() => {
    const rooms = ["Room 1", "Room 2"];

    return rooms.map((room) => ({
      room,
      days: scheduleDays.map(([day, items]) => [
        day,
        items.filter((item) => getRoomName(item.trainer) === room),
      ] as [string, StaticScheduleItem[]]),
    }));
  }, [scheduleDays]);

  return (
    <div className="bg-[#f7f4ef] text-zinc-900">
      <PublicNav />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="overflow-hidden rounded-[16px] border border-zinc-200 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95)_0%,rgba(248,244,237,0.98)_52%,rgba(241,232,220,0.95)_100%)] shadow-[0_18px_50px_rgba(24,20,16,0.06)]">
          <div
            className="relative overflow-hidden border-b border-zinc-200 bg-[#efe7dc]"
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const startX = touchStartX.current;
              const endX = event.changedTouches[0]?.clientX ?? null;
              touchStartX.current = null;

              if (startX === null || endX === null) return;

              const deltaX = endX - startX;
              if (Math.abs(deltaX) < 40) return;

              setStudioIndex((prev) =>
                deltaX < 0
                  ? (prev + 1) % studioSlides.length
                  : (prev - 1 + studioSlides.length) % studioSlides.length,
              );
            }}
          >
            <div className="relative aspect-[16/11] w-full sm:aspect-[16/9]">
              <Image
                src={studioSlides[studioIndex]}
                alt="Fit Space Studio"
                fill
                sizes="(max-width: 1280px) 100vw, 1152px"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(24,20,16,0)_0%,rgba(24,20,16,0.72)_100%)] px-6 pb-6 pt-16 sm:px-10 sm:pb-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/70">Fit Space Limassol</p>
                  <p className="mt-2 max-w-[24rem] text-2xl leading-tight tracking-tight text-white sm:text-3xl">
                    Reformer Pilates and stretching in Limassol
                  </p>
                </div>
                <div className="hidden gap-2 sm:inline-flex">
                  <button
                    onClick={() => setStudioIndex((prev) => (prev - 1 + studioSlides.length) % studioSlides.length)}
                    className="rounded-[10px] border border-white/35 bg-white/10 px-3 py-1 text-sm text-white transition hover:bg-white hover:text-zinc-900"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setStudioIndex((prev) => (prev + 1) % studioSlides.length)}
                    className="rounded-[10px] border border-white/35 bg-white/10 px-3 py-1 text-sm text-white transition hover:bg-white hover:text-zinc-900"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  Fit Space Limassol
                </p>
                <h1 className="mt-4 max-w-4xl text-4xl leading-[0.92] tracking-tight sm:text-6xl">
                  {copy.title}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
                  {copy.lead}
                </p>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                  <span>Reformer Pilates</span>
                  <span>Stretching</span>
                  <span>{copy.private}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <button
                    onClick={() => window.dispatchEvent(new Event("open-prices-modal"))}
                    className="border border-zinc-900 bg-zinc-900 px-5 py-3 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-zinc-800"
                  >
                    {t.nav.prices}
                  </button>
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-zinc-300 bg-white/90 px-5 py-3 text-xs uppercase tracking-[0.18em] text-zinc-900 transition hover:border-zinc-900"
                  >
                    {t.nav.book}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="instructors" className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-3xl tracking-tight">{copy.instructors}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trainers.map((trainer) => (
            <article key={trainer.name} className="overflow-hidden rounded-[16px] border border-zinc-200 bg-white">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={trainer.image}
                  alt={trainer.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-xl tracking-tight">{trainer.name}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-zinc-500">{trainer.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="schedule" className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Weekly schedule</p>
            <h2 className="mt-2 text-4xl tracking-tight sm:text-5xl">{getScheduleHeading()}</h2>
          </div>
        </div>

        <div>
          <div className="space-y-8 xl:hidden">
            {roomDaySections.map((section) => (
              <div key={section.room} className="space-y-4">
                <div className="rounded-[16px] border border-zinc-200 bg-[linear-gradient(180deg,#fcfaf6_0%,#f3ece3_100%)] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Schedule</p>
                  <h3 className="mt-2 text-lg tracking-tight text-zinc-900">
                    {section.room === "Room 1" ? "Room 1: Reformer Pilates & Stretching" : "Room 2: Reformer Pilates"}
                  </h3>
                </div>

                <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x">
                  {section.days.map(([day, items]) => (
                    <section
                      key={`${section.room}-${day}`}
                      className="flex h-[26.5rem] w-fit min-w-[16.5rem] max-w-[20rem] shrink-0 snap-center flex-col overflow-hidden rounded-[16px] border border-zinc-200 bg-white shadow-[0_10px_24px_rgba(24,20,16,0.04)] first:ml-0 last:mr-0 md:h-[calc(100dvh-14rem)] md:min-h-[44rem] md:w-[26rem]"
                    >
                      <div className="border-b border-zinc-200 bg-[#fcfaf6] px-4 py-4">
                        <p className="text-[1.2rem] leading-tight tracking-tight text-zinc-900">
                          {formatLocalizedDay(day, locale)}
                        </p>
                      </div>
                      <div className="flex-1 space-y-1.5 overflow-y-auto p-2 md:space-y-2 md:p-2.5">
                        {items.length === 0 ? (
                          <p className="rounded-[14px] border border-dashed border-zinc-200 bg-[#fbf8f3] px-4 py-5 text-sm text-zinc-400">
                            No classes
                          </p>
                        ) : (
                          items.map((item) => {
                            const cardService = getCardService(item.service);
                            return (
                              <a
                                key={item.id}
                                href={BOOKING_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-[14px] border border-zinc-200 bg-[#fcfaf6] px-3 py-3 transition hover:border-zinc-900 md:px-4 md:py-4"
                              >
                                <div className="min-w-0">
                                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                                    {getTrainerName(item.trainer)}
                                  </p>
                                  {cardService ? (
                                    <p className="mt-1.5 text-[0.95rem] leading-tight tracking-tight text-zinc-900 md:mt-2 md:text-[1rem]">
                                      {cardService}
                                    </p>
                                  ) : null}
                                  <div className="mt-3 flex items-center justify-end gap-3 border-t border-zinc-200 pt-2.5 md:mt-4 md:pt-3">
                                    <span className="shrink-0 whitespace-nowrap text-[1.05rem] leading-none tracking-tight text-zinc-900 md:text-[1.2rem]">
                                      {formatTime(item.datetime)}
                                    </span>
                                  </div>
                                </div>
                              </a>
                            );
                          })
                        )}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden space-y-10 xl:block">
            {roomTables.map((table) => (
              <section
                key={table.room}
                className="overflow-hidden rounded-[16px] border border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8f3eb_100%)] shadow-[0_10px_28px_rgba(24,20,16,0.04)]"
              >
                <div className="border-b border-zinc-200 bg-[#fcfaf6] px-5 py-5 text-center">
                  <h3 className="text-2xl tracking-tight text-zinc-900">
                    {table.room === "Room 1" ? "Room 1: Reformer Pilates & Stretching" : "Room 2: Reformer Pilates"}
                  </h3>
                </div>

                <div className="grid grid-cols-6 border-b border-zinc-200 bg-[#f7f3ec]">
                  {scheduleDayHeaders.map((label) => (
                    <div
                      key={label}
                      className="border-r border-zinc-200 px-3 py-4 text-center text-[0.95rem] capitalize tracking-tight text-zinc-900 last:border-r-0"
                    >
                      {label}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-6">
                  {scheduleDayHeaders.map((label, dayIndex) => (
                    <div key={`${table.room}-${label}`} className="border-r border-zinc-200 last:border-r-0">
                      {table.rows.map((row) => {
                        const item = row.cells[dayIndex];

                        if (!item) {
                          return <div key={`${table.room}-${label}-${row.timeKey}`} className="h-[92px] border-b border-zinc-100 bg-white" />;
                        }

                        const trainerName = getTrainerName(item.trainer);

                        return (
                          <a
                            key={item.id}
                            href={BOOKING_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-[92px] flex-col justify-between border-b border-zinc-100 bg-white px-4 py-3 transition hover:bg-[#fbf8f3]"
                          >
                            <p className="text-[1.85rem] leading-none tracking-tight text-zinc-900">
                              {formatTime(item.datetime)}
                            </p>
                            <div>
                              {item.service !== "Reformer Pilates" ? (
                                <p className="text-[1.1rem] leading-tight tracking-tight text-zinc-900">
                                  {item.service}
                                </p>
                              ) : null}
                              <p
                                className={`text-right text-[11px] uppercase tracking-[0.14em] text-zinc-500 ${
                                  item.service !== "Reformer Pilates" ? "mt-1" : ""
                                }`}
                              >
                                {trainerName}
                              </p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Visit us</p>
          <h2 className="mt-2 text-4xl tracking-tight sm:text-5xl">{copy.easy}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[16px] border border-zinc-200 bg-white p-5 shadow-[0_10px_28px_rgba(24,20,16,0.05)]">
            <div className="space-y-5">
              <div className="border-b border-zinc-200 pb-5">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{copy.address}</p>
                <p className="mt-3 text-xl leading-relaxed tracking-tight text-zinc-900">
                  1st floor, 58 Kolonakiou Str, Limassol, 4103
                </p>
              </div>

              <div className="grid gap-5 border-b border-zinc-200 pb-5 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{copy.phone}</p>
                  <p className="mt-3 text-2xl tracking-tight text-zinc-900">+357 95505556</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{copy.email}</p>
                  <p className="mt-3 text-base text-zinc-700">hello@fitspace.cy</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Quick actions</p>
                <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                  <a
                    href="https://maps.google.com/?q=1st+floor,+58+Kolonakiou+Str,+Limassol,+4103"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 px-6 py-3 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-zinc-800"
                  >
                    {t.contacts.openMap}
                  </a>
                  <a
                    href="tel:+35795505556"
                    className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-[#f8f4ed] px-6 py-3 text-xs uppercase tracking-[0.18em] text-zinc-800 transition hover:border-zinc-900"
                  >
                    {t.contacts.call}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <iframe
            title="Fit Space map"
            className="h-[340px] w-full rounded-[16px] border border-zinc-200 bg-white shadow-[0_10px_28px_rgba(24,20,16,0.05)]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Kolonakiou%2058%2C%20Limassol&output=embed"
          />
        </div>
      </section>

      <PricesModal
        isOpen={pricesOpen}
        mode={priceMode}
        prices={pricedServices}
        allPrices={manualPrices}
        copy={copy}
        onClose={() => setPricesOpen(false)}
        onModeChange={setPriceMode}
      />

      <SiteFooter />
    </div>
  );
}
