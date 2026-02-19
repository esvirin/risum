"use client";

import { useEffect, useState } from "react";

type Trainer = {
  id: string;
  name: string;
  specialization: string;
};

export function AltegioTrainersGrid() {
  const [items, setItems] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/altegio/trainers", { cache: "no-store" });
        const json = (await res.json()) as { data?: Trainer[] };
        if (!ignore) setItems(Array.isArray(json.data) ? json.data : []);
      } catch {
        if (!ignore) setItems([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <p className="text-zinc-500 text-sm mt-8">Loading trainers...</p>;
  }

  if (!items.length) {
    return <p className="text-zinc-500 text-sm mt-8">No trainers from API yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((trainer) => (
        <article key={trainer.id} className="border border-zinc-200 bg-[#f8f6f1] p-6 space-y-3">
          <h2 className="font-display text-4xl leading-[0.9] tracking-tight text-zinc-900">{trainer.name || "-"}</h2>
          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{trainer.specialization || "-"}</p>
        </article>
      ))}
    </div>
  );
}
