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
    <div className="border border-zinc-200 bg-white p-5">
      <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-4">{t.home.scheduleApiTitle}</p>
      {loading ? (
        <p className="text-sm text-zinc-500">{t.home.loading}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-zinc-500">{t.home.noData}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="border-b border-zinc-100 pb-3 last:border-b-0 last:pb-0">
              <p className="text-sm font-medium text-zinc-900">{item.service || "-"}</p>
              <p className="text-xs uppercase tracking-[0.12em] text-zinc-500 mt-1">
                {item.datetime || "-"} · {item.trainer || "-"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
