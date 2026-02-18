"use client";

import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";
import { AltegioTrainersList } from "@/components/AltegioTrainersList";
import { AltegioTrainersGrid } from "@/components/AltegioTrainersGrid";
import { altegioLinks } from "@/lib/altegio";
import { useI18n } from "@/components/LanguageProvider";

export default function TrainersPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-zinc-900">
      <PublicNav />
      <main className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">{t.trainers.badge}</p>
        <h1 className="mt-4 text-5xl sm:text-7xl leading-[0.9] tracking-tight">{t.trainers.title}</h1>
        <p className="mt-5 text-zinc-600 max-w-2xl">{t.trainers.lead}</p>

        <AltegioTrainersGrid />

        <section className="mt-16 border-t border-zinc-200 pt-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">{t.trainers.altegioBadge}</p>
          <h2 className="font-display text-4xl sm:text-6xl leading-[0.9] tracking-tight">{t.trainers.altegioTitle}</h2>
          <p className="text-zinc-600 max-w-2xl mt-3">{t.trainers.altegioLead}</p>

          <div className="mt-8 border border-zinc-200 bg-[#f8f6f1] p-3 sm:p-4 overflow-x-hidden">
            <div className="mx-auto w-full max-w-[600px]">
              <iframe
                title="Trainers"
                src={altegioLinks.trainersWidget}
                className="mx-auto block h-[720px] w-full max-w-[600px] border border-zinc-200 bg-white"
                loading="lazy"
              />
            </div>
          </div>

          <div className="mt-4">
            <AltegioTrainersList />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
