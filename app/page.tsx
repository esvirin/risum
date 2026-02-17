import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/PublicNav";
import { Card, CardContent } from "@/components/ui/card";

const gallery = [
  "Main training zone",
  "Functional area",
  "Recovery corner",
  "Group class studio",
  "Strength equipment",
  "Reception & lounge",
];

export default function HomePage() {
  return (
    <div className="bg-[#faf8f5] text-zinc-900">
      <PublicNav />

      <section className="py-20 sm:py-28 border-b border-zinc-200/80">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="uppercase tracking-[0.2em] text-xs text-zinc-500 mb-4">Fit Space Studio</p>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-tight max-w-4xl">
            Пространство для тренировок, восстановления и сильного тела
          </h1>
          <p className="text-zinc-600 text-lg mt-6 max-w-2xl">
            Современная фитнес-студия с групповыми и персональными тренировками. Записывайтесь онлайн или через приложение.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button asChild className="h-11 px-7 rounded-none bg-zinc-900 hover:bg-zinc-800">
              <Link href="/cabinet/schedule">Онлайн запись</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-7 rounded-none border-zinc-300">
              <a href="https://apps.apple.com" target="_blank" rel="noreferrer">Скачать приложение</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-zinc-200/80">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-tight">О студии</h2>
          <div className="grid gap-6 md:grid-cols-3 mt-8">
            <Card className="rounded-none border-zinc-200 bg-white shadow-none">
              <CardContent className="p-6">
                <h3 className="font-medium text-lg">Персональный подход</h3>
                <p className="text-zinc-600 mt-2">Планы тренировок под вашу цель: сила, выносливость, снижение веса, восстановление.</p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-zinc-200 bg-white shadow-none">
              <CardContent className="p-6">
                <h3 className="font-medium text-lg">Тренеры-практики</h3>
                <p className="text-zinc-600 mt-2">Команда сертифицированных тренеров с опытом в функциональном и силовом тренинге.</p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-zinc-200 bg-white shadow-none">
              <CardContent className="p-6">
                <h3 className="font-medium text-lg">Комфортная среда</h3>
                <p className="text-zinc-600 mt-2">Чистое пространство, современное оборудование, удобная локация и понятное расписание.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-zinc-200/80">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-tight">Фотографии студии</h2>
          <p className="text-zinc-600 mt-2">Подборка ключевых зон Fit Space</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {gallery.map((item, idx) => (
              <div key={item} className="aspect-[4/3] bg-gradient-to-br from-zinc-200 to-zinc-100 border border-zinc-200 flex items-end p-4">
                <span className="text-sm uppercase tracking-wider text-zinc-700">{String(idx + 1).padStart(2, "0")} — {item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl grid gap-4 sm:grid-cols-2">
          <Button asChild variant="outline" className="h-14 rounded-none border-zinc-300 justify-between px-6">
            <Link href="/trainers">Страница тренеров <span>→</span></Link>
          </Button>
          <Button asChild variant="outline" className="h-14 rounded-none border-zinc-300 justify-between px-6">
            <Link href="/contacts">Контакты и локация <span>→</span></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
