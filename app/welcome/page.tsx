import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import {
  Apple,
  CalendarDays,
  CircleDollarSign,
  Globe,
  MapPinned,
  MessageCircle,
  Play,
  Send,
} from "lucide-react";
import { OpenPricesButton } from "@/components/OpenPricesButton";
import { PricesModalContainer } from "@/components/PricesModalContainer";
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
const MAPS_HREF = "https://maps.google.com/?q=1st+floor,+58+Kolonakiou+Str,+Limassol,+4103";

export const metadata: Metadata = {
  title: "Welcome | Fit Space",
  description: "Quick links for Fit Space booking and contact channels.",
};

export const dynamic = "force-dynamic";

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
    <main className="min-h-screen bg-[#e7e7e7] px-4 py-7 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-[560px] items-center justify-center sm:min-h-[calc(100vh-5rem)]">
        <section className="relative w-full overflow-hidden rounded-[28px] border border-[#d7d7d7] bg-[#f8f8f8] px-6 py-8 shadow-[0_22px_70px_rgba(24,20,16,0.08)] sm:px-9 sm:py-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(circle at 12% 22%, rgba(170, 182, 180, 0.13) 0, transparent 26%), radial-gradient(circle at 84% 18%, rgba(170, 182, 180, 0.12) 0, transparent 28%), radial-gradient(circle at 22% 78%, rgba(170, 182, 180, 0.1) 0, transparent 27%), radial-gradient(circle at 80% 82%, rgba(170, 182, 180, 0.11) 0, transparent 28%)",
            }}
          />

          <div className="relative z-10">
            <div className="mx-auto flex w-fit items-center justify-center rounded-[18px] border border-[#dbd3ce] bg-white/80 px-4 py-3">
              <Image
                src="/logo-fitspace.svg"
                alt="Fit Space"
                width={220}
                height={52}
                className="h-10 w-auto sm:h-11"
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
                  <MessageCircle className="h-6 w-6" />
                </a>
                {TELEGRAM_HREF ? (
                  <a
                    href={TELEGRAM_HREF}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Telegram"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#28a8ea] text-white shadow-[0_8px_20px_rgba(23,105,168,0.25)] transition hover:-translate-y-0.5"
                  >
                    <Send className="h-6 w-6" />
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
                <div className="flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-[22px] border-2 border-zinc-900 bg-[#efecf1] text-[2.5rem] font-black lowercase text-zinc-900">
                  fs
                </div>
                <div>
                  <p className="text-3xl font-semibold leading-tight text-zinc-900 sm:text-[2.1rem]">FitSpace Cy</p>
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
                <Link
                  href="/#schedule"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#bbb4ae] bg-[#efedeb] px-4 py-3 text-center text-lg font-medium text-zinc-900 transition hover:bg-white sm:text-xl"
                >
                  <CalendarDays className="h-5 w-5" />
                  {copy.schedule}
                </Link>
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
      <PricesModalContainer />
    </main>
  );
}
