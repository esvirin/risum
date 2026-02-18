"use client";

import { useEffect, useState } from "react";

type ServiceItem = {
  id: string;
  title: string;
  category: string;
  priceFrom: string;
  priceTo: string;
};

export function AltegioServicesList() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await fetch("/api/altegio/services", { cache: "no-store" });
        const json = (await res.json()) as { data?: ServiceItem[] };
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

  return (
    <div className="border border-zinc-200 bg-[#f8f6f1] p-5 sm:p-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-4">Altegio · Services</p>
      {loading ? (
        <p className="text-sm text-zinc-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-zinc-500">No services from API yet</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className="border border-zinc-200 bg-white p-4">
              <p className="font-display text-2xl leading-[0.95] tracking-tight text-zinc-900">{item.title}</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500 mt-2">{item.category || "General"}</p>
              <p className="text-sm text-zinc-700 mt-1">
                {item.priceFrom || item.priceTo
                  ? `${item.priceFrom ? `from ${item.priceFrom}` : ""}${item.priceFrom && item.priceTo ? " · " : ""}${item.priceTo ? `to ${item.priceTo}` : ""}`
                  : "Price on request"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
