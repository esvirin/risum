"use client";

import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";
import { AltegioTrainersList } from "@/components/AltegioTrainersList";
import { altegioLinks } from "@/lib/altegio";
import { useI18n } from "@/components/LanguageProvider";

const trainerImages = [
  "https://www.pilates.com/static/dbc535bc14700a1cc6713302f8887557/c5b8c/625037434_18556832902028993_451375174682439636_n.jpg",
  "https://www.pilates.com/static/353013b8e6b4f6ae30c4dcef9458a140/c8b3d/629027366_18559860538028993_2090505257232915944_n.jpg",
  "https://www.pilates.com/static/f9f5b5a2ad455651b3516e1e7d4c970e/c837f/631813996_18558960850028993_396610038566277266_n.jpg",
];

export default function TrainersPage() {
  const { t } = useI18n();
  const trainers = t.trainers.cards.map((trainer, idx) => ({
    ...trainer,
    image: trainerImages[idx],
  }));

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-zinc-900">
      <PublicNav />
      <main className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">{t.trainers.badge}</p>
        <h1 className="mt-4 font-display text-5xl sm:text-7xl leading-[0.9] tracking-tight">{t.trainers.title}</h1>
        <p className="mt-5 text-zinc-600 max-w-2xl">{t.trainers.lead}</p>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {trainers.map((trainer, idx) => (
            <article key={trainer.name} className="space-y-4">
              <div className="aspect-[4/5] border border-zinc-200 bg-cover bg-center" style={{ backgroundImage: `url(${trainer.image})` }} />
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">0{idx + 1}</p>
              <div className="space-y-2">
                <h2 className="font-display text-4xl leading-[0.9] tracking-tight">{trainer.name}</h2>
                <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{trainer.role}</p>
                <p className="text-zinc-700 text-sm leading-relaxed">{trainer.bio}</p>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-16 space-y-6 border-t border-zinc-200 pt-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">{t.trainers.altegioBadge}</p>
          <h2 className="font-display text-4xl sm:text-6xl leading-[0.9] tracking-tight">{t.trainers.altegioTitle}</h2>
          <p className="text-zinc-600 max-w-2xl">{t.trainers.altegioLead}</p>

          <iframe
            title="Altegio trainers"
            src={altegioLinks.trainersWidget}
            className="w-full min-h-[620px] border border-zinc-200 bg-white"
            loading="lazy"
          />
          <AltegioTrainersList />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
