import Link from "next/link";
import { PublicNav } from "@/components/PublicNav";
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
    <div className="bg-[#f7f4ef] text-zinc-900">
      <PublicNav />

      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 grid gap-10 lg:grid-cols-[1.4fr_1fr] items-end">
          <div className="space-y-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Risum Pilates Studio · Limassol</p>
            <h1 className="font-display text-5xl sm:text-7xl leading-[0.95] tracking-tight max-w-4xl">
              Experience the premium Pilates lifestyle
            </h1>
            <p className="text-zinc-600 text-base sm:text-lg max-w-2xl">
              Functional and reformer classes in an elegant studio space. Book online in seconds and manage your visits in the app.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://example.com/booking" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center border border-zinc-900 bg-zinc-900 px-8 py-3 text-xs uppercase tracking-[0.18em] text-white hover:bg-zinc-800">
                Book online
              </a>
              <a href="https://apps.apple.com" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center border border-zinc-300 px-8 py-3 text-xs uppercase tracking-[0.18em] text-zinc-800 hover:border-zinc-900">
                Mobile app
              </a>
            </div>
          </div>

          <div className="aspect-[3/4] border border-zinc-200 bg-cover bg-center" style={{ backgroundImage: `url(${gallery[0].image})` }} />
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">About studio</p>
              <h2 className="font-display text-4xl sm:text-5xl mt-4 leading-[0.95] tracking-tight">Designed around your progress</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8 text-zinc-700">
              <div>
                <h3 className="uppercase text-xs tracking-[0.16em] text-zinc-500 mb-3">Personal approach</h3>
                <p>Programs adapted to your goal: strength, mobility, posture and recovery.</p>
              </div>
              <div>
                <h3 className="uppercase text-xs tracking-[0.16em] text-zinc-500 mb-3">Expert coaches</h3>
                <p>Certified trainers with practical experience in reformer and functional training.</p>
              </div>
              <div>
                <h3 className="uppercase text-xs tracking-[0.16em] text-zinc-500 mb-3">Elegant atmosphere</h3>
                <p>Light interior, premium equipment, calm energy and thoughtful class flow.</p>
              </div>
              <div>
                <h3 className="uppercase text-xs tracking-[0.16em] text-zinc-500 mb-3">Flexible schedule</h3>
                <p>Morning, daytime and evening groups with easy online booking.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Studio gallery</p>
              <h2 className="font-display text-4xl sm:text-5xl mt-3 leading-[0.95] tracking-tight">Interior & classes</h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item, idx) => (
              <article key={item.title} className="group">
                <div className="aspect-[4/5] border border-zinc-200 bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-zinc-500 group-hover:text-zinc-800 transition">
                  {String(idx + 1).padStart(2, "0")} · {item.title}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20 grid gap-4 sm:grid-cols-2">
          <Link href="/trainers" className="border border-zinc-300 px-6 py-6 text-sm uppercase tracking-[0.14em] text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 flex items-center justify-between">
            Trainers <span>→</span>
          </Link>
          <Link href="/contacts" className="border border-zinc-300 px-6 py-6 text-sm uppercase tracking-[0.14em] text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 flex items-center justify-between">
            Contacts / Location <span>→</span>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
