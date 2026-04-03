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

type Mode = "group" | "private";

const trainers = [
  { name: "Olga", image: "/wfolio/olga.jpg" },
  { name: "Svetlana", image: "/wfolio/svetlana.jpg" },
  { name: "Konstantina", image: "/wfolio/konstantina.jpg" },
  { name: "Christina", image: "/wfolio/christina.jpg" },
];

const studioSlides = [
  "/instagram/fit-1.jpg",
  "/instagram/fit-2.jpg",
];

const heroHighlights = [
  "Boutique studio",
  "Private coaching",
  "Small groups",
];

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
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

function getScheduleHeading() {
  return "Reformer Pilates & Stretching";
}

const privateBookingMessage = "Для бронирования индивидуального занятия свяжитесь с нашим администратором.";
const privateBookingPhone = "+357 95505556";

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

function getRoomShortLabel(value: string) {
  const room = getRoomName(value).toLowerCase();
  const match = room.match(/room\s+([12])/);
  return match ? `Room ${match[1]}` : null;
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

  const [priceMode, setPriceMode] = useState<Mode>("group");
  const [scheduleMode, setScheduleMode] = useState<Mode>("group");
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

  const pricedServices = useMemo(
    () => manualPrices.filter((item) => item.mode === priceMode),
    [manualPrices, priceMode],
  );

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

      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="overflow-hidden rounded-[28px] border border-[#ddd2c2] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.98)_0%,rgba(248,244,237,0.98)_45%,rgba(240,230,214,0.96)_100%)] shadow-[0_22px_70px_rgba(24,20,16,0.08)]">
          <div
            className="relative overflow-hidden border-b border-[#ddd2c2] bg-[#e8ddcd]"
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
              <div className="absolute inset-0 z-10 bg-[linear-gradient(115deg,rgba(42,34,27,0.12)_0%,rgba(42,34,27,0.03)_38%,rgba(255,255,255,0)_70%)]" />
              <Image
                src={studioSlides[studioIndex]}
                alt="Fit Space Studio"
                fill
                sizes="(max-width: 1280px) 100vw, 1152px"
                className="object-cover"
              />
            </div>
            <div className="absolute left-6 top-6 z-20 rounded-full border border-white/45 bg-white/14 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur sm:left-10 sm:top-10">
              Limassol reformer studio
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(24,20,16,0)_0%,rgba(24,20,16,0.76)_100%)] px-6 pb-6 pt-16 sm:px-10 sm:pb-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/70">Fit Space Limassol</p>
                  <p className="font-display mt-2 max-w-[26rem] text-3xl leading-[0.95] tracking-tight text-white sm:text-4xl">
                    Reformer Pilates and stretching in Limassol
                  </p>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  {studioSlides.map((slide, index) => (
                    <span
                      key={slide}
                      className={`h-2.5 rounded-full transition-all ${
                        studioIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/45"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  Fit Space Limassol
                </p>
                <h1 className="font-display mt-4 max-w-4xl text-5xl leading-[0.92] tracking-tight sm:text-7xl">
                  {copy.title}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
                  {copy.lead}
                </p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {heroHighlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#ddd2c2] bg-white/80 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-zinc-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  <button
                    onClick={() => window.dispatchEvent(new Event("open-prices-modal"))}
                    className="inline-flex items-center justify-center rounded-[14px] border border-zinc-200 bg-[#f7f4ef] px-5 py-3 text-xs uppercase tracking-[0.18em] text-zinc-600 shadow-[0_8px_24px_rgba(24,20,16,0.04)] transition hover:-translate-y-0.5 hover:bg-white hover:text-zinc-900"
                  >
                    {t.nav.prices}
                  </button>
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-[14px] border border-zinc-900 bg-zinc-900 px-5 py-3 text-xs uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_rgba(24,20,16,0.08)] transition hover:-translate-y-0.5 hover:bg-zinc-800"
                  >
                    {t.nav.book}
                  </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="instructors" className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Studio team</p>
            <h2 className="font-display mt-2 text-4xl tracking-tight">{copy.instructors}</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {trainers.map((trainer) => (
            <article
              key={trainer.name}
              className="group overflow-hidden rounded-[20px] border border-[#e5dbcc] bg-white shadow-[0_10px_28px_rgba(24,20,16,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(24,20,16,0.08)]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={trainer.image}
                  alt={trainer.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-3.5 sm:p-5">
                <p className="font-display text-[1.1rem] tracking-tight sm:text-2xl">{trainer.name}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="schedule" className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Weekly schedule</p>
            <h2 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">{copy.join}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">
              {getScheduleHeading()}
            </p>
          </div>

          <div className="inline-flex w-full rounded-[14px] border border-zinc-200 bg-white p-1 shadow-[0_8px_24px_rgba(24,20,16,0.04)] md:w-auto">
            {(["group", "private"] as const).map((mode) => {
              const active = scheduleMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setScheduleMode(mode)}
                  className={`flex-1 rounded-[10px] px-6 py-2.5 text-sm font-medium uppercase tracking-[0.12em] transition md:flex-none ${
                    active ? "border border-zinc-900 bg-zinc-900 text-white" : "text-zinc-500 hover:bg-[#f7f4ef] hover:text-zinc-900"
                  }`}
                >
                  {mode === "group" ? copy.group : copy.private}
                </button>
              );
            })}
          </div>
        </div>

        {scheduleMode === "private" ? (
          <div className="overflow-hidden rounded-[24px] border border-[#ddd2c2] bg-[linear-gradient(135deg,#fffdfa_0%,#f4ede2_100%)] shadow-[0_12px_34px_rgba(24,20,16,0.06)]">
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Персональные занятия</p>
                <p className="font-display mt-3 text-3xl leading-tight tracking-tight text-zinc-900 sm:text-4xl">
                  Один контакт, одно персональное занятие, простая запись.
                </p>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-700 sm:text-lg">{privateBookingMessage}</p>
              </div>
              <div className="rounded-[20px] border border-white/70 bg-white/85 p-5 shadow-[0_10px_24px_rgba(24,20,16,0.04)]">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Телефон администратора</p>
                <a
                  href="tel:+35795505556"
                  className="font-display mt-3 inline-flex text-4xl leading-none tracking-tight text-zinc-900 transition hover:text-zinc-700"
                >
                  {privateBookingPhone}
                </a>
                <a
                  href="https://wa.me/35795505556"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-[14px] border border-zinc-900 bg-zinc-900 px-6 py-3 text-xs uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_rgba(24,20,16,0.06)] transition hover:-translate-y-0.5 hover:bg-zinc-800"
                >
                  Написать в WhatsApp
                </a>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="md:hidden">
              <div className="flex gap-3 overflow-x-auto snap-x">
                {mobileScheduleByDay.map((day) => (
                  <section
                    key={day.key}
                    className="flex min-w-[13.5rem] shrink-0 snap-center flex-col overflow-hidden rounded-[16px] border border-zinc-200 bg-white shadow-[0_10px_28px_rgba(24,20,16,0.05)]"
                  >
                    <div className="border-b border-zinc-200 bg-[#fcfaf6] px-3.5 py-3.5">
                      <p className="text-[1.05rem] leading-tight tracking-tight text-zinc-900">
                        {formatLocalizedDay(day.key, locale)}
                      </p>
                    </div>
                    <div className="space-y-2 bg-[#f7f4ef] p-2.5">
                      {day.items.length === 0 ? (
                        <p className="rounded-[14px] border border-dashed border-zinc-200 bg-white px-4 py-5 text-sm text-zinc-400">
                          No classes
                        </p>
                      ) : (
                        day.items.map((item) => {
                          const cardService = getCardService(item.service) ?? item.service;
                          return (
                            <a
                              key={item.id}
                              href={BOOKING_URL}
                              target="_blank"
                              rel="noreferrer"
                              className="relative block rounded-[14px] border border-zinc-200 bg-white px-3 py-3 shadow-[0_6px_18px_rgba(24,20,16,0.04)] transition hover:border-zinc-900 hover:shadow-[0_10px_24px_rgba(24,20,16,0.06)]"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <p className="inline-flex rounded-[8px] bg-[#f7f4ef] px-2 py-1 text-[0.72rem] font-medium uppercase tracking-[0.08em] text-zinc-700">
                                  {formatTime(item.datetime)}
                                </p>
                                {getRoomShortLabel(item.trainer) ? (
                                  <p className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-zinc-400">
                                    {getRoomShortLabel(item.trainer)}
                                  </p>
                                ) : null}
                              </div>
                              <p className="mt-1.5 text-[1rem] leading-tight tracking-tight text-zinc-900">
                                {cardService}
                              </p>
                              <p className="mt-2 min-w-0 break-words text-[0.76rem] uppercase tracking-[0.05em] text-zinc-500">
                                {getTrainerName(item.trainer)}
                              </p>
                            </a>
                          );
                        })
                      )}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            <div className="hidden grid-cols-5 gap-3 md:grid">
              {mobileScheduleByDay.map((day) => (
                <section
                  key={day.key}
                  className="flex min-w-0 flex-col overflow-hidden rounded-[16px] border border-zinc-200 bg-white shadow-[0_10px_24px_rgba(24,20,16,0.05)]"
                >
                  <div className="border-b border-zinc-200 bg-[#fcfaf6] px-3 py-3">
                    <p className="text-[0.96rem] leading-tight tracking-tight text-zinc-900">
                      {formatLocalizedDay(day.key, locale)}
                    </p>
                  </div>
                  <div className="space-y-2 bg-[#f7f4ef] p-2">
                    {day.items.length === 0 ? (
                      <p className="rounded-[12px] border border-dashed border-zinc-200 bg-white px-3 py-4 text-sm text-zinc-400">
                        No classes
                      </p>
                    ) : (
                      day.items.map((item) => {
                        const cardService = getCardService(item.service) ?? item.service;
                        return (
                          <a
                            key={item.id}
                            href={BOOKING_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="relative block rounded-[12px] border border-zinc-200 bg-white px-3 py-3 shadow-[0_4px_14px_rgba(24,20,16,0.04)] transition hover:border-zinc-900 hover:shadow-[0_8px_20px_rgba(24,20,16,0.06)]"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="inline-flex rounded-[8px] bg-[#f7f4ef] px-2 py-1 text-[0.68rem] font-medium uppercase tracking-[0.08em] text-zinc-700">
                                {formatTime(item.datetime)}
                              </p>
                              {getRoomShortLabel(item.trainer) ? (
                                <p className="shrink-0 text-[9px] uppercase tracking-[0.1em] text-zinc-400">
                                  {getRoomShortLabel(item.trainer)}
                                </p>
                              ) : null}
                            </div>
                            <p className="mt-1.5 text-[0.9rem] leading-tight tracking-tight text-zinc-900">
                              {cardService}
                            </p>
                            <p className="mt-1.5 min-w-0 break-words text-[0.68rem] uppercase tracking-[0.04em] text-zinc-500">
                              {getTrainerName(item.trainer)}
                            </p>
                          </a>
                        );
                      })
                    )}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </section>

      <section id="contacts" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Visit us</p>
          <h2 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">{copy.easy}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[20px] border border-[#e5dbcc] bg-white p-6 shadow-[0_10px_28px_rgba(24,20,16,0.05)]">
            <div className="space-y-5">
              <div className="border-b border-[#ece2d5] pb-5">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{copy.address}</p>
                <p className="font-display mt-3 text-2xl leading-relaxed tracking-tight text-zinc-900">
                  1st floor, 58 Kolonakiou Str, Limassol, 4103
                </p>
              </div>

              <div className="grid gap-5 border-b border-[#ece2d5] pb-5 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{copy.phone}</p>
                  <a
                    href="tel:+35795505556"
                    className="font-display mt-3 inline-flex text-3xl tracking-tight text-zinc-900 transition hover:text-zinc-700"
                  >
                    +357 95505556
                  </a>
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
                    className="inline-flex min-w-[9rem] items-center justify-center rounded-[12px] border border-zinc-900 bg-zinc-900 px-6 py-3 text-xs uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_rgba(24,20,16,0.04)] transition hover:bg-zinc-800"
                  >
                    {t.contacts.openMap}
                  </a>
                  <a
                    href="https://wa.me/35795505556"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-w-[9rem] items-center justify-center rounded-[12px] border border-zinc-200 bg-[#f7f4ef] px-6 py-3 text-xs uppercase tracking-[0.18em] text-zinc-500 shadow-[0_8px_24px_rgba(24,20,16,0.04)] transition hover:bg-white hover:text-zinc-900"
                  >
                    Написать в WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
          <iframe
            title="Fit Space map"
            className="h-[340px] w-full rounded-[20px] border border-[#e5dbcc] bg-white shadow-[0_10px_28px_rgba(24,20,16,0.05)]"
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
