import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";

const trainers = [
  {
    name: "Анна Королёва",
    role: "Head Coach · Functional Training",
    bio: "8+ лет опыта. Специализация: функциональный тренинг, коррекция техники, восстановление после перерывов.",
    image: "https://www.pilates.com/static/dbc535bc14700a1cc6713302f8887557/c5b8c/625037434_18556832902028993_451375174682439636_n.jpg",
  },
  {
    name: "Дмитрий Орлов",
    role: "Strength Coach",
    bio: "Силовая подготовка, работа с новичками и атлетами, индивидуальные программы прогрессии нагрузки.",
    image: "https://www.pilates.com/static/353013b8e6b4f6ae30c4dcef9458a140/c8b3d/629027366_18559860538028993_2090505257232915944_n.jpg",
  },
  {
    name: "Екатерина Левина",
    role: "Mobility & Recovery",
    bio: "Мобильность, стабилизация, мягкое восстановление. Помогает безопасно повысить качество движений.",
    image: "https://www.pilates.com/static/f9f5b5a2ad455651b3516e1e7d4c970e/c837f/631813996_18558960850028993_396610038566277266_n.jpg",
  },
];

export default function TrainersPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] text-zinc-900">
      <PublicNav />
      <main className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Team</p>
        <h1 className="text-4xl sm:text-5xl tracking-tight mt-4">Trainers</h1>
        <p className="text-zinc-600 mt-4 max-w-2xl">Команда Fit Space помогает достигать результата безопасно, системно и в комфортном темпе.</p>

        <div className="grid gap-8 md:grid-cols-3 mt-12">
          {trainers.map((trainer) => (
            <article key={trainer.name} className="space-y-4">
              <div className="aspect-[4/5] border border-zinc-200 bg-cover bg-center" style={{ backgroundImage: `url(${trainer.image})` }} />
              <div className="space-y-2">
                <h2 className="text-2xl tracking-tight">{trainer.name}</h2>
                <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{trainer.role}</p>
                <p className="text-zinc-700 text-sm leading-relaxed">{trainer.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
