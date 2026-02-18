"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/LanguageProvider";

type ScheduleItem = {
  id: string;
  datetime: string;
  trainer: string;
  service: string;
};

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    weekday: "short",
  }).format(date);
}

function formatTime(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function AltegioScheduleList() {
  const { t } = useI18n();
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await fetch("/api/altegio/schedule", { cache: "no-store" });
        const json = (await res.json()) as { data?: ScheduleItem[] };
        if (!ignore) {
          setItems(Array.isArray(json.data) ? json.data : []);
        }
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
    const map = new Map<string, ScheduleItem[]>();
    for (const item of items) {
      const key = formatDate(item.datetime);
      map.set(key, [...(map.get(key) || []), item]);
    }
    return [...map.entries()];
  }, [items]);

  return (
    <div className="border border-zinc-200 bg-[#f8f6f1] p-5 sm:p-6">
      <div className="mb-5 flex items-end justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{t.home.scheduleTitle}</p>
        <p className="text-xs text-zinc-500">{items.length ? `${items.length} classes` : ""}</p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">{t.home.loading}</p>
      ) : items.length === 0 ? (
        <div className="border border-zinc-200 bg-white p-5 text-sm text-zinc-600">
          {t.home.noData}
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(([day, dayItems]) => (
            <section key={day} className="border border-zinc-200 bg-white">
              <div className="border-b border-zinc-200 px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                {day}
              </div>
              <ul>
                {dayItems.map((item) => (
                  <li key={item.id} className="grid grid-cols-[88px_1fr] gap-4 border-b border-zinc-100 px-4 py-4 last:border-b-0">
                    <div>
                      <p className="font-display text-3xl leading-none text-zinc-900">{formatTime(item.datetime)}</p>
                    </div>
                    <div>
                      <p className="text-base font-medium text-zinc-900">{item.service || "Class"}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-zinc-500">{item.trainer || "Coach"}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
