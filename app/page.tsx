"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { PricesModal } from "@/components/PricesModal";
import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/components/LanguageProvider";

type ScheduleItem = {
  id: string;
  datetime: string;
  trainer: string;
  service: string;
  clientsCount?: number;
  capacity?: number;
};

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

const manualPrices: PriceCard[] = [
  { id: "g1", label: "Group lessons", title: "Single class", price: "€40", note: "Valid 1 visit", mode: "group" },
  { id: "g5", label: "Group lessons", title: "5 classes", price: "€160", unitPrice: "€32 each", note: "Valid 1 month", mode: "group" },
  { id: "g10", label: "Group lessons", title: "10 classes", price: "€280", unitPrice: "€28 each", note: "Valid 2 months", mode: "group" },
  { id: "g20", label: "Group lessons", title: "20 classes", price: "€520", unitPrice: "€26 each", note: "Valid 3 months", mode: "group" },
  { id: "g30", label: "Group lessons", title: "30 classes", price: "€720", unitPrice: "€24 each", note: "Valid 3 months", mode: "group" },
  { id: "g-stretch", label: "Group lessons", title: "Stretching", price: "€25", note: "Valid 1 class", mode: "group" },
  { id: "p1", label: "Private Lessons", title: "One-on-one training", price: "€100", note: "Valid 1 session", mode: "private" },
  { id: "p2", label: "Private Lessons", title: "Duet training", price: "€120", note: "Valid 1 session", mode: "private" },
];

function detectMode(value: string): Mode {
  return /private|индив|персон|personal/i.test(value) ? "private" : "group";
}

function formatDay(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getLocalDateKey(dateValue: string | number | Date) {
  const d = new Date(dateValue);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function HomePage() {
  const { t } = useI18n();
  const copy = t.homeLite;

  const [mode, setMode] = useState<Mode>("group");
  const [priceMode, setPriceMode] = useState<Mode>("group");
  const [pricesOpen, setPricesOpen] = useState(false);
  const [studioIndex, setStudioIndex] = useState(0);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [nowTs] = useState<number>(() => Date.now());

  useEffect(() => {
    fetch("/api/altegio/schedule", { cache: "no-store" })
      .then((r) => r.json())
      .then((r) => setSchedule(Array.isArray(r?.data) ? r.data : []))
      .catch(() => setSchedule([]));

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
        return ts >= now && ts <= max && detectMode(item.service) === mode;
      })
      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

    const map = new Map<string, ScheduleItem[]>();
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
      return [key, map.get(key) ?? []] as [string, ScheduleItem[]];
    });
  }, [schedule, mode, nowTs]);

  const pricedServices = useMemo(
    () => manualPrices.filter((item) => item.mode === priceMode),
    [priceMode],
  );

  return (
    <div className="bg-[#f7f4ef] text-zinc-900">
      <PublicNav />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h1 className="text-center text-4xl sm:text-5xl tracking-tight">{copy.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-600">
          {copy.lead}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-3xl tracking-tight">{copy.studio}</h2>
          <div className="inline-flex gap-2">
            <button
              onClick={() => setStudioIndex((prev) => (prev - 1 + studioSlides.length) % studioSlides.length)}
              className="rounded-full border border-zinc-300 px-3 py-1 text-sm hover:border-zinc-900"
            >
              ←
            </button>
            <button
              onClick={() => setStudioIndex((prev) => (prev + 1) % studioSlides.length)}
              className="rounded-full border border-zinc-300 px-3 py-1 text-sm hover:border-zinc-900"
            >
              →
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
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
            <article key={trainer.name} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
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

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-5xl tracking-tight">{copy.join}</h2>
          <div className="inline-flex rounded-full border border-zinc-300 p-1 text-xs uppercase tracking-[0.12em]">
            <button
              onClick={() => setMode("group")}
              className={`rounded-full px-4 py-2 ${mode === "group" ? "bg-zinc-900 text-white" : "text-zinc-700"}`}
            >
              {copy.group}
            </button>
            <button
              onClick={() => setMode("private")}
              className={`rounded-full px-4 py-2 ${mode === "private" ? "bg-zinc-900 text-white" : "text-zinc-700"}`}
            >
              {copy.private}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-zinc-200 bg-white">
          <div className="grid min-w-[900px] grid-cols-7 gap-px bg-zinc-200">
            {scheduleDays.map(([day, items]) => (
              <div key={day} className="bg-[#f8f6f1]">
                <div className="border-b border-zinc-200 px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-zinc-500">{formatDay(day)}</div>
                <div className="space-y-2 p-2">
                  {items.map((item) => {
                    const spots =
                      typeof item.capacity === "number" && typeof item.clientsCount === "number"
                        ? Math.max(item.capacity - item.clientsCount, 0)
                        : null;
                    return (
                      <article key={item.id} className="rounded-md border border-zinc-200 bg-white p-3">
                        <p className="text-xl tracking-tight">{formatTime(item.datetime)}</p>
                        <p className="mt-1 text-sm leading-tight">{item.service}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-zinc-500">{item.trainer}</p>
                        {spots !== null ? <p className="mt-2 text-xs text-zinc-600">{spots} {copy.spotsLeft}</p> : null}
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-5 text-5xl tracking-tight">{copy.easy}</h2>
        <div className="grid gap-4 border border-zinc-200 bg-white p-5 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{copy.phone}</p>
              <p className="text-3xl tracking-tight">+357 95505556</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{copy.address}</p>
              <p>1st floor, 58 Kolonakiou Str, Limassol, 4103</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{copy.email}</p>
              <p>hello@fitspace.cy</p>
            </div>
          </div>
          <iframe
            title="Fit Space map"
            className="h-[280px] w-full border border-zinc-200"
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
