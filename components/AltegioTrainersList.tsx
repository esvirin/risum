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
    <div className="border border-zinc-200 bg-[#f8f6f1] p-5 sm:p-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-4">{t.trainers.altegioApiTitle}</p>
      {loading ? (
        <p className="text-sm text-zinc-500">{t.trainers.loading}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-zinc-500">{t.trainers.noData}</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className="border border-zinc-200 bg-white p-4">
              <p className="font-display text-2xl leading-[0.95] tracking-tight text-zinc-900">{item.name || "-"}</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500 mt-2">{item.specialization || "-"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
