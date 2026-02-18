"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/LanguageProvider";

type ScheduleItem = {
  id: string;
  datetime: string;
  trainer: string;
  service: string;
};

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

  return (
    <div className="border border-zinc-200 bg-[#f8f6f1] p-5 sm:p-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-4">{t.home.scheduleApiTitle}</p>
      {loading ? (
        <p className="text-sm text-zinc-500">{t.home.loading}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-zinc-500">{t.home.noData}</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className="border border-zinc-200 bg-white p-4">
              <p className="font-display text-2xl leading-[0.95] tracking-tight text-zinc-900">{item.service || "-"}</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500 mt-2">
                {item.datetime || "-"}
              </p>
              <p className="text-xs text-zinc-700 mt-1">{item.trainer || "-"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
