import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import {
  Apple,
  CircleDollarSign,
  Globe,
  MapPinned,
  Play,
} from "lucide-react";
import { OpenScheduleButton } from "@/components/OpenScheduleButton";
import { OpenPricesButton } from "@/components/OpenPricesButton";
import { PricesModalContainer } from "@/components/PricesModalContainer";
import { ScheduleModalContainer } from "@/components/ScheduleModalContainer";
import {
  BOOKING_ANDROID_APP_URL,
  BOOKING_IOS_APP_URL,
  BOOKING_WEB_URL,
} from "@/lib/booking";
import { resolveRequestLocale } from "@/lib/i18n-server";

type Platform = "ios" | "android" | "mobile" | "desktop";
type AppId = "web" | "ios" | "android";

const PHONE = "+357 955 05 556";
const PHONE_HREF = "tel:+35795505556";
const WHATSAPP_HREF = "https://wa.me/35795505556";
const TELEGRAM_HREF = process.env.NEXT_PUBLIC_TELEGRAM_URL?.trim() || "";
const MAPS_HREF = "https://maps.app.goo.gl/73izTMWrueWUpKYN6";

export const metadata: Metadata = {
  title: "Welcome | Fit Space",
  description: "Quick links for Fit Space booking and contact channels.",
};

export const dynamic = "force-dynamic";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 fill-current">
      <path d="M19.05 4.94A9.9 9.9 0 0 0 12 2C6.48 2 2 6.47 2 12c0 1.76.46 3.48 1.33 5L2 22l5.14-1.3A9.95 9.95 0 0 0 12 22c5.52 0 10-4.47 10-10 0-2.67-1.04-5.18-2.95-7.06Zm-7.05 15.39a8.3 8.3 0 0 1-4.24-1.16l-.3-.18-3.05.77.82-2.97-.2-.31A8.27 8.27 0 0 1 3.72 12 8.29 8.29 0 0 1 12 3.67 8.3 8.3 0 0 1 20.28 12 8.29 8.29 0 0 1 12 20.33Zm4.54-6.2c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.2-.73-.65-1.22-1.44-1.37-1.69-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.42 1.02 2.58c.12.17 1.77 2.7 4.28 3.79.6.26 1.07.42 1.43.54.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.17.21-.58.21-1.07.14-1.17-.06-.1-.23-.17-.48-.29Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 fill-current">
      <path d="M21.43 4.57a1.5 1.5 0 0 0-1.63-.24L3.87 10.8a1.25 1.25 0 0 0 .08 2.34l4.14 1.42 1.59 5.08a1.25 1.25 0 0 0 2.12.5l2.32-2.4 4.56 3.34a1.5 1.5 0 0 0 2.37-.9l2.18-13.88a1.5 1.5 0 0 0-.8-1.73ZM10.6 17.3l-.95-3.04 7.8-6.88-6.85 8.1Zm1.76.33-.63-.46 5.66-6.69-4.88 7.15Z" />
    </svg>
  );
}

function detectPlatform(userAgent: string): Platform {
  const ua = userAgent.toLowerCase();

  const isIosDevice =
    /iphone|ipad|ipod/.test(ua) || (ua.includes("macintosh") && ua.includes("mobile"));

  if (isIosDevice) {
    return "ios";
  }

  if (ua.includes("android")) {
    return "android";
  }

  if (/mobile|tablet|opera mini|iemobile|webos|blackberry/.test(ua)) {
    return "mobile";
  }

  return "desktop";
}

export default async function WelcomePage() {
  const locale = await resolveRequestLocale();
  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent") || "";
  const platform = detectPlatform(userAgent);

  const copy =
    locale === "ru"
      ? {
          title: "Готовы забронировать класс Reformer Pilates?",
          lead: "Позвоните или напишите нам:",
          download: "или скачайте приложение:",
          info: "Информация:",
          maps: "Google Maps",
          schedule: "Расписание",
          prices: "Цены",
          appSubtitle: "Health & Fitness",
          platformPrefix: "Под ваше устройство:",
          backHome: "На главную",
          close: "Закрыть",
          group: "Группа",
          private: "Персонально",
          channels: {
            ios: "iOS",
            android: "Android",
            mobile: "Мобильный браузер",
            desktop: "Desktop / Web",
          },
          appButtons: {
            web: "Web",
            ios: "iOS",
            android: "Android",
          },
          primaryHint: "Рекомендуемая ссылка",
        }
      : {
          title: "Ready to book your Reformer Pilates class?",
          lead: "Call or message us:",
          download: "or download the app:",
          info: "Information:",
          maps: "Google Maps",
          schedule: "Schedule",
          prices: "Prices",
          appSubtitle: "Health & Fitness",
          platformPrefix: "Detected platform:",
          backHome: "Back to website",
          close: "Close",
          group: "Group",
          private: "Private",
          channels: {
            ios: "iOS",
            android: "Android",
            mobile: "Mobile browser",
            desktop: "Desktop / Web",
          },
          appButtons: {
            web: "Web",
            ios: "iOS",
            android: "Android",
          },
          primaryHint: "Recommended link",
        };

  const appLinks = [
    { id: "web" as const, label: copy.appButtons.web, href: BOOKING_WEB_URL },
    { id: "ios" as const, label: copy.appButtons.ios, href: BOOKING_IOS_APP_URL },
    { id: "android" as const, label: copy.appButtons.android, href: BOOKING_ANDROID_APP_URL },
  ];

  const preferredOrder: Record<Platform, AppId[]> = {
    ios: ["ios", "web", "android"],
    android: ["android", "web", "ios"],
    mobile: ["web", "ios", "android"],
    desktop: ["web", "ios", "android"],
  };

  const preferredLink =
    preferredOrder[platform]
      .map((id) => appLinks.find((item) => item.id === id))
      .find((item) => item?.href)
      || appLinks[0];

  return (
    <main className="min-h-screen bg-[#efeeeb] px-0 py-0 sm:px-4 sm:py-6">
      <div className="mx-auto flex min-h-screen w-full max-w-[560px] items-center justify-center sm:min-h-[calc(100vh-3rem)]">
        <section className="relative w-full overflow-hidden border border-[#d9d4ce] bg-[#f8f6f2] px-6 py-8 shadow-[0_18px_60px_rgba(24,20,16,0.08)] sm:rounded-[28px] sm:px-8 sm:py-10">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Image
              src="/background.png"
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 560px"
              className="object-cover object-center opacity-[0.88]"
              priority
            />
            <div className="absolute inset-0 bg-white/38" />
          </div>

          <div className="relative z-10">
            <div className="mx-auto flex w-fit items-center justify-center">
              <Image
                src="/logo.png"
                alt="Pilates Space by Olga Brovko"
                width={438}
                height={248}
                className="h-auto w-[210px] sm:w-[240px]"
                priority
              />
            </div>

            <h1 className="mt-8 text-center font-sans text-3xl font-semibold leading-tight text-zinc-900 sm:text-[2.15rem]">
              {copy.title}
            </h1>

            <div className="mt-7 border-t border-zinc-400/60 pt-5 text-center">
              <p className="text-xl text-zinc-700 sm:text-2xl">{copy.lead}</p>
              <a href={PHONE_HREF} className="mt-2 inline-block text-4xl font-semibold tracking-tight text-zinc-900 sm:text-[2.75rem]">
                {PHONE}
              </a>
              <div className="mt-5 flex items-center justify-center gap-3">
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#30cc59] text-white shadow-[0_8px_20px_rgba(27,136,58,0.32)] transition hover:-translate-y-0.5"
                >
                  <WhatsAppIcon />
                </a>
                {TELEGRAM_HREF ? (
                  <a
                    href={TELEGRAM_HREF}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Telegram"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#28a8ea] text-white shadow-[0_8px_20px_rgba(23,105,168,0.25)] transition hover:-translate-y-0.5"
                  >
                    <TelegramIcon />
                  </a>
                ) : null}
              </div>
            </div>

            <div className="mt-8 border-t border-zinc-400/60 pt-5">
              <p className="text-center text-3xl font-medium text-zinc-900 sm:text-[2rem]">{copy.download}</p>

              <a
                href={preferredLink.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center gap-4 rounded-[22px] border border-[#d7cfc9] bg-white/85 p-4 shadow-[0_10px_28px_rgba(24,20,16,0.06)] transition hover:-translate-y-0.5"
              >
                <div className="flex h-[96px] w-[96px] shrink-0 flex-col items-start justify-center rounded-[26px] border-[3px] border-zinc-900 bg-[#efecf1] px-3 text-zinc-900">
                  <span className="block text-[1.15rem] font-black lowercase leading-none">fit</span>
                  <span className="mt-0.5 block text-[1.15rem] font-black lowercase leading-none">space</span>
                </div>
                <div>
                  <p className="text-3xl font-semibold leading-tight text-zinc-900 sm:text-[2.1rem]">FitSpace Cyprus</p>
                  <p className="text-lg text-zinc-500 sm:text-xl">{copy.appSubtitle}</p>
                  <p className="mt-1 text-sm font-medium uppercase tracking-[0.16em] text-zinc-700">
                    {copy.platformPrefix} {copy.channels[platform]}
                  </p>
                </div>
              </a>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {appLinks.map((item) => {
                  const isPrimary = item.id === preferredLink.id;

                  const icon =
                    item.id === "ios" ? (
                      <Apple className="h-4 w-4" />
                    ) : item.id === "android" ? (
                      <Play className="h-4 w-4" />
                    ) : (
                      <Globe className="h-4 w-4" />
                    );

                  if (!item.href) {
                    return (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#d9d0c8] bg-[#faf8f5] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-zinc-400"
                      >
                        {icon}
                        {item.label}
                      </span>
                    );
                  }

                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                        isPrimary
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-[#ddd2c2] bg-[#f8f5f1] text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
                      }`}
                    >
                      {icon}
                      {item.label}
                    </a>
                  );
                })}
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.15em] text-zinc-500">{copy.primaryHint}</p>
            </div>

            <div className="mt-8 border-t border-zinc-400/60 pt-6">
              <p className="mb-4 text-center text-3xl font-medium text-zinc-900 sm:text-[2rem]">{copy.info}</p>
              <div className="space-y-3">
                <a
                  href={MAPS_HREF}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#bbb4ae] bg-[#efedeb] px-4 py-3 text-center text-lg font-medium text-zinc-900 transition hover:bg-white sm:text-xl"
                >
                  <MapPinned className="h-5 w-5" />
                  {copy.maps}
                </a>
                <OpenScheduleButton className="inline-flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#bbb4ae] bg-[#efedeb] px-4 py-3 text-center text-lg font-medium text-zinc-900 transition hover:bg-white sm:text-xl">
                  {copy.schedule}
                </OpenScheduleButton>
                <OpenPricesButton
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#bbb4ae] bg-[#efedeb] px-4 py-3 text-center text-lg font-medium text-zinc-900 transition hover:bg-white sm:text-xl"
                >
                  <CircleDollarSign className="h-5 w-5" />
                  {copy.prices}
                </OpenPricesButton>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                href="/"
                className="inline-flex rounded-full border border-[#d2c8bc] bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.16em] text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900"
              >
                {copy.backHome}
              </Link>
            </div>
          </div>
        </section>
      </div>
      <ScheduleModalContainer
        locale={locale}
        scheduleLabel={copy.schedule}
        groupLabel={copy.group}
        privateLabel={copy.private}
        closeLabel={copy.close}
      />
      <PricesModalContainer />
    </main>
  );
}
