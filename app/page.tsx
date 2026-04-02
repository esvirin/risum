"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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

type Mode = "group" | "private";

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

function formatDay(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));
}

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

  const [mode, setMode] = useState<Mode>("group");
  const [priceMode, setPriceMode] = useState<Mode>("group");
  const [pricesOpen, setPricesOpen] = useState(false);
  const [studioIndex, setStudioIndex] = useState(0);
  const [schedule] = useState<StaticScheduleItem[]>(() => getStaticSchedule());
  const [nowTs] = useState<number>(() => Date.now());

  useEffect(() => {
    const open = () => setPricesOpen(true);
    window.addEventListener("open-prices-modal", open);
    return () => window.removeEventListener("open-prices-modal", open);
  }, []);

  const scheduleDays = useMemo(() => {
    const now = nowTs;
    const max = now + 7 * 24 * 60 * 60 * 1000;

    const filtered = schedule
      .filter((item) => {
        const ts = new Date(item.datetime).getTime();
        if (!Number.isFinite(ts)) return false;
        return ts >= now && ts <= max && item.mode === mode;
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
  }, [schedule, mode, nowTs]);

  const pricedServices = useMemo(
    () => manualPrices.filter((item) => item.mode === priceMode),
    [manualPrices, priceMode],
  );

  return (
    <div className="bg-[#f7f4ef] text-zinc-900">
      <PublicNav />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95)_0%,rgba(248,244,237,0.98)_52%,rgba(241,232,220,0.95)_100%)] shadow-[0_18px_50px_rgba(24,20,16,0.06)]">
          <div className="grid gap-8 px-6 py-8 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,1.2fr)_20rem] lg:items-end">
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

              <div className="mt-8 flex flex-wrap gap-3">
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

            <div className="grid gap-px overflow-hidden rounded-[18px] border border-zinc-200 bg-zinc-200">
              <div className="bg-[#fcfaf6] px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Practice</p>
                <p className="mt-2 text-xl tracking-tight text-zinc-900">Reformer Pilates</p>
              </div>
              <div className="bg-[#fcfaf6] px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Movement</p>
                <p className="mt-2 text-xl tracking-tight text-zinc-900">Stretching</p>
              </div>
              <div className="bg-[#fcfaf6] px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Format</p>
                <p className="mt-2 text-xl tracking-tight text-zinc-900">{copy.private}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-3xl tracking-tight">{copy.studio}</h2>
          <div className="inline-flex gap-2">
            <button
              onClick={() => setStudioIndex((prev) => (prev - 1 + studioSlides.length) % studioSlides.length)}
              className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-sm transition hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
            >
              ←
            </button>
            <button
              onClick={() => setStudioIndex((prev) => (prev + 1) % studioSlides.length)}
              className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-sm transition hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
            >
              →
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white">
          <div className="relative h-[320px] w-full sm:h-[360px] lg:h-[380px]">
            <Image
              src={studioSlides[studioIndex]}
              alt="Studio"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 896px, 1152px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-3 flex justify-center gap-2">
          {studioSlides.map((slide, index) => (
            <button
              key={slide}
              onClick={() => setStudioIndex(index)}
              className={`h-2.5 w-2.5 rounded-full ${studioIndex === index ? "bg-zinc-900" : "bg-zinc-300"}`}
              aria-label={`Studio slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section id="instructors" className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-3xl tracking-tight">{copy.instructors}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trainers.map((trainer) => (
            <article key={trainer.name} className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white">
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
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Weekly schedule</p>
            <h2 className="mt-2 text-4xl tracking-tight sm:text-5xl">{getScheduleHeading()}</h2>
          </div>
          <div className="inline-flex rounded-full border border-zinc-300 bg-white p-1 text-xs uppercase tracking-[0.12em]">
            <button
              onClick={() => setMode("group")}
              className={`rounded-full px-4 py-2 transition ${mode === "group" ? "bg-zinc-900 text-white" : "text-zinc-700"}`}
            >
              {copy.group}
            </button>
            <button
              onClick={() => setMode("private")}
              className={`rounded-full px-4 py-2 transition ${mode === "private" ? "bg-zinc-900 text-white" : "text-zinc-700"}`}
            >
              {copy.private}
            </button>
          </div>
        </div>

        <div className="md:overflow-x-auto md:rounded-[24px] md:border md:border-zinc-200 md:bg-[linear-gradient(180deg,#fbf8f3_0%,#f4efe7_100%)] md:shadow-[0_16px_44px_rgba(24,20,16,0.05)]">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x md:hidden">
            {scheduleDays.map(([day, items]) => (
              <section
                key={day}
                className="flex h-[26.5rem] w-[calc(100vw-3.4rem)] shrink-0 snap-center flex-col overflow-hidden rounded-[24px] border border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8f3eb_100%)] shadow-[0_12px_28px_rgba(24,20,16,0.05)] first:ml-0 last:mr-0 sm:w-[22rem]"
              >
                <div className="border-b border-zinc-200 bg-[linear-gradient(180deg,#fdfaf5_0%,#f3ece3_100%)] px-4 py-4">
                  <p className="text-[1.35rem] leading-tight tracking-tight text-zinc-900">
                    {formatLocalizedDay(day, locale)}
                  </p>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto p-2.5">
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
                          className="block rounded-[14px] border border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbf8f3_100%)] px-4 py-4 shadow-[0_8px_18px_rgba(24,20,16,0.035)] transition hover:border-zinc-900"
                        >
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                              {getTrainerName(item.trainer)}
                            </p>
                            {cardService ? (
                              <p className="mt-2 text-[1.08rem] leading-tight tracking-tight text-zinc-900">
                                {cardService}
                              </p>
                            ) : null}
                            <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-200 pt-3">
                              <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                                {getRoomName(item.trainer)}
                              </span>
                              <span className="text-[1.2rem] leading-none tracking-tight text-zinc-900">
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

          <div className="hidden min-w-[900px] grid-cols-7 gap-px bg-zinc-200 md:grid">
            {scheduleDays.map(([day, items]) => (
              <div key={day} className="bg-[#f8f6f1]">
                <div className="border-b border-zinc-200 bg-[#fcfaf6] px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                  {formatDay(day)}
                </div>
                <div className="space-y-2 p-2">
                  {items.map((item) => {
                    const cardService = getCardService(item.service);
                    return (
                      <a
                        key={item.id}
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-[14px] border border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbf8f3_100%)] px-4 py-4 shadow-[0_8px_18px_rgba(24,20,16,0.03)] transition hover:-translate-y-px hover:border-zinc-900 hover:shadow-[0_12px_26px_rgba(24,20,16,0.06)]"
                      >
                        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                          {getTrainerName(item.trainer)}
                        </p>
                        {cardService ? (
                          <p className="mt-2 text-[1rem] leading-tight tracking-tight text-zinc-900">{cardService}</p>
                        ) : null}
                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-200 pt-3">
                          <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                            {getRoomName(item.trainer)}
                          </span>
                          <span className="text-[1.18rem] leading-none tracking-tight text-zinc-900">
                            {formatTime(item.datetime)}
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
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
          <div className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-[0_10px_28px_rgba(24,20,16,0.05)]">
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
            className="h-[340px] w-full rounded-[24px] border border-zinc-200 bg-white shadow-[0_10px_28px_rgba(24,20,16,0.05)]"
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
