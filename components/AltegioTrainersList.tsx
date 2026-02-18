"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/LanguageProvider";

type TrainerItem = {
  id: string;
  name: string;
  specialization: string;
};

export function AltegioTrainersList() {
  const { t } = useI18n();
  const [items, setItems] = useState<TrainerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await fetch("/api/altegio/trainers", { cache: "no-store" });
        const json = (await res.json()) as { data?: TrainerItem[] };
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
      <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-4">{t.trainers.altegioApiTitle}</p>
      {loading ? (
        <p className="text-sm text-zinc-500">{t.trainers.loading}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-zinc-500">{t.trainers.noData}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="border-b border-zinc-100 pb-3 last:border-b-0 last:pb-0">
              <p className="text-sm font-medium text-zinc-900">{item.name || "-"}</p>
              <p className="text-xs uppercase tracking-[0.12em] text-zinc-500 mt-1">{item.specialization || "-"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
