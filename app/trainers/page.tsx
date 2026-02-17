import { PublicNav } from "@/components/PublicNav";
import { Card, CardContent } from "@/components/ui/card";
import { SiteFooter } from "@/components/SiteFooter";

const trainers = [
  {
    name: "Анна Королёва",
    role: "Head Coach · Functional Training",
    bio: "8+ лет опыта. Специализация: функциональный тренинг, коррекция техники, восстановление после перерывов.",
  },
  {
    name: "Дмитрий Орлов",
    role: "Strength Coach",
    bio: "Силовая подготовка, работа с новичками и атлетами, индивидуальные программы прогрессии нагрузки.",
  },
  {
    name: "Екатерина Левина",
    role: "Mobility & Recovery",
    bio: "Мобильность, стабилизация, мягкое восстановление. Помогает безопасно повысить качество движений.",
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
                <div className="aspect-[4/5] bg-gradient-to-br from-zinc-200 to-zinc-100" />
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
