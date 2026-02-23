"use client";

import { useEffect, useMemo, useState } from "react";
import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";
import { altegioLinks } from "@/lib/altegio";

type ScheduleItem = {
  id: string;
  datetime: string;
  trainer: string;
  service: string;
  clientsCount?: number;
  capacity?: number;
};

type ServiceItem = {
  id: string;
  title: string;
  category: string;
  priceFrom: string;
  priceTo: string;
};

type Mode = "group" | "private";

const trainerSlides = [
  { name: "Olga", image: "/wfolio/olga.jpg" },
  { name: "Svetlana", image: "/wfolio/svetlana.jpg" },
  { name: "Konstantina", image: "/wfolio/konstantina.jpg" },
  { name: "Christina", image: "/wfolio/christina.jpg" },
  { name: "Team", image: "/instagram/fit-2.jpg" },
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
  const [activeTrainer, setActiveTrainer] = useState(0);
  const [mode, setMode] = useState<Mode>("group");
  const [priceMode, setPriceMode] = useState<Mode>("group");
  const [pricesOpen, setPricesOpen] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [nowTs] = useState<number>(() => Date.now());

  useEffect(() => {
    fetch("/api/altegio/schedule", { cache: "no-store" })
      .then((r) => r.json())
      .then((r) => setSchedule(Array.isArray(r?.data) ? r.data : []))
      .catch(() => setSchedule([]));

    fetch("/api/altegio/services", { cache: "no-store" })
      .then((r) => r.json())
      .then((r) => setServices(Array.isArray(r?.data) ? r.data : []))
      .catch(() => setServices([]));
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

    return Array.from(map.entries()).slice(0, 7);
  }, [schedule, mode, nowTs]);

  const pricedServices = useMemo(
    () => services.filter((item) => detectMode(`${item.title} ${item.category}`) === priceMode),
    [services, priceMode],
  );

  return (
    <div className="bg-[#f7f4ef] text-zinc-900">
      <PublicNav />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="mb-8 flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.2em]">
          <span>Kolonakiou 58, 1st Floor</span>
          <div className="flex items-center gap-2">
            <a
              href={altegioLinks.booking}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-zinc-700 px-4 py-2 text-[10px] hover:bg-zinc-900 hover:text-white"
            >
              Book now
            </a>
            <button
              onClick={() => setPricesOpen(true)}
              className="rounded-full border border-zinc-700 px-4 py-2 text-[10px] hover:bg-zinc-900 hover:text-white"
            >
              Prices
            </button>
          </div>
        </div>

        <h1 className="text-center text-4xl sm:text-5xl tracking-tight">Reformer Pilates Studio</h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[180px_1fr_220px] items-start">
          <div className="text-4xl leading-tight tracking-tight">
            <p>Meet</p>
            <p>Our</p>
            <p>Team</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <img src={trainerSlides[activeTrainer].image} alt={trainerSlides[activeTrainer].name} className="h-full w-full object-cover" />
          </div>

          <div>
            <h2 className="text-4xl leading-[1.1]">Best Reformer Pilates</h2>
            <p className="mt-4 text-zinc-600">Personal approach, clean studio, and experienced team for private and group training.</p>
            <p className="mt-6 text-3xl tracking-tight">{trainerSlides[activeTrainer].name}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {trainerSlides.map((slide, index) => (
            <button
              key={slide.name}
              onClick={() => setActiveTrainer(index)}
              className={`h-14 w-14 overflow-hidden rounded-full border ${activeTrainer === index ? "border-zinc-900" : "border-zinc-300"}`}
            >
              <img src={slide.image} alt={slide.name} className="h-full w-full object-cover" />
            </button>
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

      {pricesOpen ? (
        <div className="fixed inset-0 z-50 bg-black/45 p-4" onClick={() => setPricesOpen(false)}>
          <div
            className="mx-auto mt-10 w-full max-w-4xl rounded-lg bg-[#f7f4ef] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-4xl tracking-tight">Our Prices</h3>
              <button onClick={() => setPricesOpen(false)} className="rounded-full border border-zinc-400 px-3 py-1 text-sm">
                Close
              </button>
            </div>

            <div className="mb-5 inline-flex rounded-full border border-zinc-300 p-1 text-xs uppercase tracking-[0.12em]">
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

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {pricedServices.map((item) => (
                <article key={item.id} className="border border-zinc-200 bg-white p-4">
                  <p className="text-lg leading-tight">{item.title}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-zinc-500">{item.category}</p>
                  <p className="mt-3 text-sm text-zinc-700">
                    {item.priceFrom ? `from ${item.priceFrom}` : ""}
                    {item.priceFrom && item.priceTo ? " · " : ""}
                    {item.priceTo ? `to ${item.priceTo}` : ""}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
