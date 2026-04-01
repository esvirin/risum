"use client";

import { useMemo, useState } from "react";
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

function timeKey(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function formatDay(value: string, locale: "ru-RU" | "en-US") {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(d);
}

export default function SchedulePage() {
  const { locale, t } = useI18n();
  const [items] = useState<ScheduleItem[]>([]);

  const dtLocale = locale === "ru" ? "ru-RU" : "en-US";

  const grid = useMemo(() => {
    const sorted = [...items].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

    const days = [...new Set(sorted.map((item) => dayKey(item.datetime)))];
    const times = [...new Set(sorted.map((item) => timeKey(item.datetime)).filter(Boolean))];

    const byCell = new Map<string, ScheduleItem[]>();
    for (const item of sorted) {
      const d = dayKey(item.datetime);
      const t = timeKey(item.datetime);
      const key = `${d}|${t}`;
      byCell.set(key, [...(byCell.get(key) || []), item]);
    }

    return { days, times, byCell };
  }, [items]);

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
          {grid.days.length === 0 || grid.times.length === 0 ? (
            <div className="border border-zinc-200 bg-white p-6 text-sm text-zinc-600">{t.home.noData}</div>
          ) : (
            <div className="border border-zinc-200 bg-white overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-r border-zinc-200 bg-[#f8f6f1] px-4 py-3 text-left text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                      {t.schedule.table.time}
                    </th>
                    {grid.days.map((day, dayIdx) => (
                      <th
                        key={day}
                        className={`border-b border-zinc-200 px-4 py-3 text-left text-[11px] uppercase tracking-[0.14em] text-zinc-500 ${dayIdx % 2 === 0 ? "bg-white" : "bg-[#faf9f6]"}`}
                      >
                        {formatDay(day, dtLocale)}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {grid.times.map((time, rowIdx) => (
                    <tr key={time}>
                      <td className={`border-r border-zinc-200 px-4 py-4 font-display text-2xl leading-none text-zinc-900 align-top ${rowIdx % 2 === 0 ? "bg-[#f8f6f1]" : "bg-[#f3f1ec]"}`}>
                        {time}
                      </td>

                      {grid.days.map((day, colIdx) => {
                        const cellItems = grid.byCell.get(`${day}|${time}`) || [];
                        const chessBg = (rowIdx + colIdx) % 2 === 0 ? "bg-white" : "bg-[#faf9f6]";

                        return (
                          <td key={`${day}-${time}`} className={`border-l border-t border-zinc-100 px-3 py-3 align-top ${chessBg}`}>
                            {cellItems.length === 0 ? (
                              <span className="text-zinc-300">—</span>
                            ) : (
                              <div className="space-y-2">
                                {cellItems.map((item) => (
                                  <div key={item.id} className="rounded border border-zinc-200 bg-[#f8f6f1] px-3 py-2">
                                    <p className="text-sm text-zinc-900 leading-snug">{item.service}</p>
                                    <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-zinc-500">{item.trainer}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
