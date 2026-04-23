import Image from "next/image";
import Link from "next/link";
import { OpenPricesButton } from "@/components/OpenPricesButton";
import { BOOKING_PAGE_PATH } from "@/lib/booking";
import { heroHighlights, studioSlides, type HomeLiteCopy } from "@/lib/home-page";

type HeroSectionProps = {
  copy: HomeLiteCopy;
  studioIndex: number;
  onTouchStart: (clientX: number | null) => void;
  onTouchEnd: (clientX: number | null) => void;
};

export function HeroSection({ copy, studioIndex, onTouchStart, onTouchEnd }: HeroSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <div className="overflow-hidden rounded-[28px] border border-[#ddd2c2] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.98)_0%,rgba(248,244,237,0.98)_45%,rgba(240,230,214,0.96)_100%)] shadow-[0_22px_70px_rgba(24,20,16,0.08)]">
        <div
          className="relative overflow-hidden border-b border-[#ddd2c2] bg-[#e8ddcd]"
          onTouchStart={(event) => {
            onTouchStart(event.touches[0]?.clientX ?? null);
          }}
          onTouchEnd={(event) => {
            onTouchEnd(event.changedTouches[0]?.clientX ?? null);
          }}
        >
          <div className="relative aspect-[16/11] w-full sm:aspect-[16/9]">
            <div className="absolute inset-0 z-10 bg-[linear-gradient(115deg,rgba(42,34,27,0.12)_0%,rgba(42,34,27,0.03)_38%,rgba(255,255,255,0)_70%)]" />
            <Image
              src={studioSlides[studioIndex]}
              alt="Fit Space Studio"
              fill
              sizes="(max-width: 1280px) 100vw, 1152px"
              className="object-cover"
            />
          </div>
          <div className="absolute left-6 top-6 z-20 rounded-full border border-white/45 bg-white/14 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur sm:left-10 sm:top-10">
            Limassol reformer studio
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(24,20,16,0)_0%,rgba(24,20,16,0.76)_100%)] px-6 pb-6 pt-16 sm:px-10 sm:pb-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/70">Fit Space Limassol</p>
                <p className="font-display mt-2 max-w-[26rem] text-3xl leading-[0.95] tracking-tight text-white sm:text-4xl">
                  Reformer Pilates and stretching in Limassol
                </p>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                {studioSlides.map((slide, index) => (
                  <span
                    key={slide}
                    className={`h-2.5 rounded-full transition-all ${
                      studioIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/45"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">Fit Space Limassol</p>
              <h1 className="font-display mt-4 max-w-4xl text-5xl leading-[0.92] tracking-tight sm:text-7xl">
                {copy.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
                {copy.lead}
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {heroHighlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#ddd2c2] bg-white/80 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-zinc-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <OpenPricesButton
                className="inline-flex items-center justify-center rounded-[14px] border border-zinc-200 bg-[#f7f4ef] px-5 py-3 text-xs uppercase tracking-[0.18em] text-zinc-600 shadow-[0_8px_24px_rgba(24,20,16,0.04)] transition hover:-translate-y-0.5 hover:bg-white hover:text-zinc-900"
              >
                Цены
              </OpenPricesButton>
              <Link
                href={BOOKING_PAGE_PATH}
                className="inline-flex items-center justify-center rounded-[14px] border border-zinc-900 bg-zinc-900 px-5 py-3 text-xs uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_rgba(24,20,16,0.08)] transition hover:-translate-y-0.5 hover:bg-zinc-800"
              >
                Запись
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
