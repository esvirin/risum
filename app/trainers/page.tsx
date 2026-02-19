"use client";

import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";
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

        <div className="mt-10 flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-10">
          <section className="min-w-0 flex-1">
            <AltegioTrainersGrid />
          </section>

          <section className="w-full lg:w-[600px] lg:flex-none">
            <div className="border border-zinc-200 bg-[#f8f6f1] p-3 overflow-x-hidden">
              <iframe
                title="Trainers"
                src={altegioLinks.trainersWidget}
                className="mx-auto block h-[720px] w-full max-w-[600px] border border-zinc-200 bg-white"
                loading="lazy"
              />
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
