import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/PublicNav";
import { Card, CardContent } from "@/components/ui/card";
import { SiteFooter } from "@/components/SiteFooter";

const gallery = [
  {
    title: "Main training zone",
    image: "https://www.pilates.com/static/8fc3ce7eeb458d0cd82f31e714fc5a73/f2fae/banner1.jpg",
  },
  {
    title: "Functional area",
    image: "https://www.pilates.com/static/f61896851f0508b569a82a48a2b05f07/ab438/banner2.jpg",
  },
  {
    title: "Reformer studio",
    image: "https://www.pilates.com/static/e8eee38f6523156190cada91d33e6fba/ab438/2404_web-banner_1490x1064.jpg",
  },
  {
    title: "Movement class",
    image: "https://www.pilates.com/static/38e1023fac3b5b5c8329bfac34d1f665/97ce3/pilates-1.jpg",
  },
  {
    title: "Core training",
    image: "https://www.pilates.com/static/55b104e7f0747900592b7fd937e12641/97ce3/corealign.jpg",
  },
  {
    title: "Studio atmosphere",
    image: "https://www.pilates.com/static/bbe03475b8502a7e90aada7bab99dc99/ac7a2/desktop-2.jpg",
  },
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
              <a href="https://example.com/booking" target="_blank" rel="noreferrer">Онлайн запись</a>
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
              <div
                key={item.title}
                className="aspect-[4/3] border border-zinc-200 bg-cover bg-center flex items-end p-4"
                style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.08)), url(${item.image})` }}
              >
                <span className="text-sm uppercase tracking-wider text-white">{String(idx + 1).padStart(2, "0")} — {item.title}</span>
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

      <SiteFooter />
    </div>
  );
}
