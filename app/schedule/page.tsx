"use client";

import { useEffect, useMemo, useState } from "react";
import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/components/LanguageProvider";

type ScheduleItem = {
  id: string;
  datetime: string;
  trainer: string;
  service: string;
};

function dayKey(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString().slice(0, 10);
}

function formatDay(value: string, locale: "ru-RU" | "en-US") {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "2-digit",
    month: "short",
  }).format(d);
}

function formatTime(value: string, locale: "ru-RU" | "en-US") {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function SchedulePage() {
  const { locale, t } = useI18n();
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await fetch("/api/altegio/schedule", { cache: "no-store" });
        const json = (await res.json()) as { data?: ScheduleItem[] };
        if (!ignore) setItems(Array.isArray(json.data) ? json.data : []);
      } catch {
        if (!ignore) setItems([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const grouped = useMemo(() => {
    const byDay = new Map<string, ScheduleItem[]>();

    for (const item of items) {
      const key = dayKey(item.datetime);
      byDay.set(key, [...(byDay.get(key) || []), item]);
    }

    return [...byDay.entries()]
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([day, dayItems]) => [
        day,
        dayItems.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()),
      ] as const);
  }, [items]);

  const dtLocale = locale === "ru" ? "ru-RU" : "en-US";

  return (
    <div className="bg-[#f7f4ef] text-zinc-900 min-h-screen">
      <PublicNav />

      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">{t.schedule.badge}</p>
          <h1 className="mt-4 text-5xl sm:text-7xl tracking-tight leading-[0.9]">{t.schedule.title}</h1>
          <p className="mt-4 text-zinc-600 max-w-3xl">{t.schedule.lead}</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          {loading ? (
            <div className="border border-zinc-200 bg-white p-6 text-sm text-zinc-500">{t.home.loading}</div>
          ) : grouped.length === 0 ? (
            <div className="border border-zinc-200 bg-white p-6 text-sm text-zinc-600">{t.home.noData}</div>
          ) : (
            <div className="space-y-6">
              {grouped.map(([day, dayItems]) => (
                <section key={day} className="border border-zinc-200 bg-white overflow-hidden">
                  <div className="border-b border-zinc-200 bg-[#f8f6f1] px-5 py-3 text-xs uppercase tracking-[0.16em] text-zinc-500">
                    {formatDay(day, dtLocale)}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead>
                        <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-zinc-500 border-b border-zinc-100">
                          <th className="px-5 py-3 font-medium">{t.schedule.table.time}</th>
                          <th className="px-5 py-3 font-medium">{t.schedule.table.className}</th>
                          <th className="px-5 py-3 font-medium">{t.schedule.table.trainer}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayItems.map((item) => (
                          <tr key={item.id} className="border-b border-zinc-100 last:border-b-0">
                            <td className="px-5 py-4 font-display text-2xl leading-none text-zinc-900 whitespace-nowrap">
                              {formatTime(item.datetime, dtLocale)}
                            </td>
                            <td className="px-5 py-4 text-zinc-900">{item.service}</td>
                            <td className="px-5 py-4 text-sm uppercase tracking-[0.12em] text-zinc-500">{item.trainer}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
