import { PublicNav } from "@/components/PublicNav";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="min-h-screen bg-[#faf8f5] text-zinc-900">
      <PublicNav />
      <main className="container mx-auto max-w-6xl px-4 py-16">
        <p className="uppercase tracking-[0.2em] text-xs text-zinc-500 mb-4">Team</p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Тренеры</h1>
        <p className="text-zinc-600 mt-4 max-w-2xl">
          Команда Fit Space помогает достигать результата безопасно и системно.
        </p>

        <div className="grid gap-6 md:grid-cols-3 mt-10">
          {trainers.map((trainer) => (
            <Card key={trainer.name} className="rounded-none border-zinc-200 shadow-none bg-white">
              <CardContent className="p-0">
                <div
                  className="aspect-[4/5] bg-cover bg-center"
                  style={{ backgroundImage: `url(${trainer.image})` }}
                />
                <div className="p-6 space-y-2">
                  <h2 className="text-xl font-medium">{trainer.name}</h2>
                  <p className="text-sm text-zinc-500">{trainer.role}</p>
                  <p className="text-zinc-600 text-sm leading-relaxed">{trainer.bio}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
