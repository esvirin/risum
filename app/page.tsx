"use client";

import Link from "next/link";
import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";
import { AltegioScheduleList } from "@/components/AltegioScheduleList";
import { AltegioServicesList } from "@/components/AltegioServicesList";
import { AltegioBookformCard } from "@/components/AltegioBookformCard";
import { altegioLinks } from "@/lib/altegio";
import { useI18n } from "@/components/LanguageProvider";

const gallery = [
  {
    titleKey: 0,
    image: "/instagram/fit-1.jpg",
  },
  {
    titleKey: 1,
    image: "/instagram/fit-2.jpg",
  },
  {
    titleKey: 2,
    image: "/instagram/fit-3.jpg",
  },
  {
    titleKey: 3,
    image: "/instagram/fit-4.jpg",
  },
  {
    titleKey: 4,
    image: "/instagram/fit-5.jpg",
  },
  {
    titleKey: 5,
    image: "/instagram/fit-6.jpg",
  },
];

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="bg-[#f7f4ef] text-zinc-900">
      <PublicNav />

      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20 grid gap-10 lg:grid-cols-[1.35fr_1fr] items-end">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">{t.home.badge}</p>
            <h1 className="mt-6 text-[54px] leading-[0.9] tracking-tight sm:text-[86px] max-w-4xl">
              {t.home.title}
            </h1>
            <p className="mt-7 text-zinc-600 text-base sm:text-lg max-w-2xl leading-relaxed">{t.home.lead}</p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <a href={altegioLinks.booking} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center border border-zinc-900 bg-zinc-900 px-8 py-3 text-xs uppercase tracking-[0.18em] text-white hover:bg-zinc-800">
                {t.home.bookOnline}
              </a>
              <a href={altegioLinks.cabinet} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center border border-zinc-300 px-8 py-3 text-xs uppercase tracking-[0.18em] text-zinc-800 hover:border-zinc-900">
                {t.home.personalCabinet}
              </a>
            </div>
          </div>

          <div className="aspect-[3/4] border border-zinc-200 bg-contain bg-center bg-no-repeat bg-white" style={{ backgroundImage: `url(${gallery[0].image})` }} />
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_2fr]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">{t.home.aboutBadge}</p>
              <h2 className="mt-4 font-display text-4xl sm:text-6xl leading-[0.9] tracking-tight">{t.home.aboutTitle}</h2>
            </div>

            <div className="grid sm:grid-cols-2 border border-zinc-200 bg-[#f8f6f1]">
              <div className="p-7 border-b sm:border-b-0 sm:border-r border-zinc-200">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-3">01 · {t.home.featurePersonalTitle}</p>
                <p className="text-zinc-700 leading-relaxed">{t.home.featurePersonalText}</p>
              </div>
              <div className="p-7 border-b sm:border-b-0 border-zinc-200">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-3">02 · {t.home.featureCoachesTitle}</p>
                <p className="text-zinc-700 leading-relaxed">{t.home.featureCoachesText}</p>
              </div>
              <div className="p-7 border-t border-zinc-200 sm:border-r">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-3">03 · {t.home.featureAtmosphereTitle}</p>
                <p className="text-zinc-700 leading-relaxed">{t.home.featureAtmosphereText}</p>
              </div>
              <div className="p-7 border-t border-zinc-200">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-3">04 · {t.home.featureScheduleTitle}</p>
                <p className="text-zinc-700 leading-relaxed">{t.home.featureScheduleText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">{t.home.galleryBadge}</p>
          <h2 className="mt-3 font-display text-4xl sm:text-6xl leading-[0.9] tracking-tight">{t.home.galleryTitle}</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {gallery.map((item, idx) => (
              <article key={item.titleKey} className={`group ${idx === 0 ? "md:col-span-2" : ""}`}>
                <div className={`border border-zinc-200 bg-contain bg-center bg-no-repeat bg-white ${idx === 0 ? "aspect-[16/8]" : "aspect-[4/5]"}`} style={{ backgroundImage: `url(${item.image})` }} />
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-zinc-500 group-hover:text-zinc-900 transition">
                  {String(idx + 1).padStart(2, "0")} · {t.home.galleryTitles[item.titleKey]}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">{t.home.scheduleBadge}</p>
          <h2 className="font-display text-4xl sm:text-6xl leading-[0.9] tracking-tight">{t.home.scheduleTitle}</h2>
          <p className="text-zinc-600 max-w-3xl mt-3">{t.home.scheduleLead}</p>

          <div className="mt-8">
            <AltegioScheduleList />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Online booking</p>
            <h2 className="mt-3 font-display text-4xl sm:text-6xl leading-[0.9] tracking-tight">Services & prices</h2>
            <p className="text-zinc-600 mt-3 max-w-3xl">Live catalog from service categories and pricing.</p>

            <div className="mt-8">
              <AltegioServicesList />
            </div>
          </div>

          <div className="lg:pt-[52px]">
            <AltegioBookformCard />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">{t.home.accountBadge}</p>
          <h2 className="mt-3 font-display text-4xl sm:text-6xl leading-[0.9] tracking-tight">{t.home.accountTitle}</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {altegioLinks.iosApp ? (
              <a href={altegioLinks.iosApp} target="_blank" rel="noreferrer" className="border border-zinc-300 px-6 py-6 text-sm uppercase tracking-[0.14em] text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 flex items-center justify-between">
                {t.home.iosApp} <span>→</span>
              </a>
            ) : null}
            {altegioLinks.androidApp ? (
              <a href={altegioLinks.androidApp} target="_blank" rel="noreferrer" className="border border-zinc-300 px-6 py-6 text-sm uppercase tracking-[0.14em] text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 flex items-center justify-between">
                {t.home.androidApp} <span>→</span>
              </a>
            ) : null}
            <a href={altegioLinks.cabinet} target="_blank" rel="noreferrer" className="border border-zinc-300 px-6 py-6 text-sm uppercase tracking-[0.14em] text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 flex items-center justify-between">
              {t.home.personalCabinet} <span>→</span>
            </a>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20 grid gap-4 sm:grid-cols-2">
          <Link href="/trainers" className="border border-zinc-300 px-6 py-6 text-sm uppercase tracking-[0.14em] text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 flex items-center justify-between">
            {t.home.trainersLink} <span>→</span>
          </Link>
          <Link href="/contacts" className="border border-zinc-300 px-6 py-6 text-sm uppercase tracking-[0.14em] text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 flex items-center justify-between">
            {t.home.contactsLink} <span>→</span>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
