"use client";

import { useEffect, useState } from "react";

type BookformConfig = {
  url: string;
  lang: string;
  primaryPalette: string;
  accentPalette: string;
  mainColor: string;
  steps: Array<{ step: string; title: string; num: string }>;
};

export function AltegioBookformCard() {
  const [config, setConfig] = useState<BookformConfig | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/altegio/bookform", { cache: "no-store" });
        const json = (await res.json()) as { data?: BookformConfig | null };
        if (!ignore) setConfig(json.data ?? null);
      } catch {
        if (!ignore) setConfig(null);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  if (!config) return null;

  return (
    <div className="border border-zinc-200 bg-[#f8f6f1] p-5 sm:p-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-4">Altegio · Booking form config</p>
      <div className="grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
        <p><span className="text-zinc-500">Language:</span> {config.lang || "-"}</p>
        <p><span className="text-zinc-500">Primary:</span> {config.primaryPalette || "-"}</p>
        <p><span className="text-zinc-500">Accent:</span> {config.accentPalette || "-"}</p>
        <p><span className="text-zinc-500">Main color:</span> {config.mainColor || "-"}</p>
      </div>
      <div className="mt-4">
        <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-2">Booking steps</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {config.steps.map((step) => (
            <li key={`${step.step}-${step.num}`} className="border border-zinc-200 bg-white px-3 py-2 text-sm">
              <span className="text-zinc-500">{step.num || "•"}.</span> {step.title || step.step || "Step"}
            </li>
          ))}
        </ul>
      </div>
      {config.url ? (
        <a href={config.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex border border-zinc-300 px-4 py-2 text-xs uppercase tracking-[0.16em] text-zinc-700 hover:border-zinc-900 hover:text-zinc-900">
          Open form URL
        </a>
      ) : null}
    </div>
  );
}
