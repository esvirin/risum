"use client";

import { useEffect, useMemo, useState } from "react";
import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";

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
  title: string;
  price: string;
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
  { id: "g1", title: "Single class", price: "€40", mode: "group" },
  { id: "g5", title: "5 classes", price: "€160", note: "€32 each · valid 1 month", mode: "group" },
  { id: "g10", title: "10 classes", price: "€280", note: "€28 each · valid 2 months", mode: "group" },
  { id: "g20", title: "20 classes", price: "€520", note: "€26 each · valid 3 months", mode: "group" },
  { id: "g30", title: "30 classes", price: "€720", note: "€24 each · valid 3 months", mode: "group" },
  { id: "p1", title: "One-on-one training", price: "€100", note: "1 session", mode: "private" },
  { id: "p2", title: "Duet training", price: "€120", note: "1 session", mode: "private" },
  { id: "p3", title: "Stretching", price: "€25", note: "1 class", mode: "private" },
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

export default function HomePage() {
  const [mode, setMode] = useState<Mode>("group");
  const [priceMode, setPriceMode] = useState<Mode>("group");
  const [studioIndex, setStudioIndex] = useState(0);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [nowTs] = useState<number>(() => Date.now());

  useEffect(() => {
    fetch("/api/altegio/schedule", { cache: "no-store" })
      .then((r) => r.json())
      .then((r) => setSchedule(Array.isArray(r?.data) ? r.data : []))
      .catch(() => setSchedule([]));

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
      const key = new Date(item.datetime).toISOString().slice(0, 10);
      map.set(key, [...(map.get(key) ?? []), item]);
    }

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      const key = day.toISOString().slice(0, 10);
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
        <h1 className="text-center text-4xl sm:text-5xl tracking-tight">Reformer Pilates Studio</h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-600">
          Personal approach, clean studio, and experienced team for private and group training.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-3xl tracking-tight">Studio</h2>
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
          <img src={studioSlides[studioIndex]} alt="Studio" className="h-[320px] w-full object-cover sm:h-[360px] lg:h-[380px]" />
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

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-3xl tracking-tight">Instructors</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trainers.map((trainer) => (
            <article key={trainer.name} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <img src={trainer.image} alt={trainer.name} className="aspect-[3/4] w-full object-cover" />
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
          <h2 className="text-5xl tracking-tight">Join the training</h2>
          <div className="inline-flex rounded-full border border-zinc-300 p-1 text-xs uppercase tracking-[0.12em]">
            <button
              onClick={() => setMode("group")}
              className={`rounded-full px-4 py-2 ${mode === "group" ? "bg-zinc-900 text-white" : "text-zinc-700"}`}
            >
              Group
            </button>
            <button
              onClick={() => setMode("private")}
              className={`rounded-full px-4 py-2 ${mode === "private" ? "bg-zinc-900 text-white" : "text-zinc-700"}`}
            >
              Private
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
                        {spots !== null ? <p className="mt-2 text-xs text-zinc-600">{spots} spots left</p> : null}
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="prices" className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-5xl tracking-tight">Our Prices</h2>
          <div className="inline-flex rounded-full border border-zinc-300 p-1 text-xs uppercase tracking-[0.12em]">
            <button
              onClick={() => setPriceMode("group")}
              className={`rounded-full px-4 py-2 ${priceMode === "group" ? "bg-zinc-900 text-white" : "text-zinc-700"}`}
            >
              Group Reformer Pilates
            </button>
            <button
              onClick={() => setPriceMode("private")}
              className={`rounded-full px-4 py-2 ${priceMode === "private" ? "bg-zinc-900 text-white" : "text-zinc-700"}`}
            >
              Private Reformer Pilates
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {pricedServices.map((item) => (
            <article key={item.id} className="border border-zinc-200 bg-white p-4">
              <p className="text-lg leading-tight">{item.title}</p>
              <p className="mt-3 text-sm font-medium text-zinc-900">{item.price}</p>
              {item.note ? <p className="mt-1 text-xs text-zinc-600">{item.note}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-5 text-5xl tracking-tight">Easy to find</h2>
        <div className="grid gap-4 border border-zinc-200 bg-white p-5 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Phone</p>
              <p className="text-3xl tracking-tight">+357 95505556</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Address</p>
              <p>1st floor, 58 Kolonakiou Str, Limassol, 4103</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Email</p>
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

      <SiteFooter />
    </div>
  );
}
