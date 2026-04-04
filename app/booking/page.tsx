import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BOOKING_ANDROID_APP_URL,
  BOOKING_IOS_APP_URL,
  BOOKING_WEB_URL,
} from "@/lib/booking";
import { detectBookingDevice } from "@/lib/booking-server";
import { translations } from "@/lib/i18n";
import { resolveRequestLocale } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const locale = await resolveRequestLocale();
  const copy = translations[locale].booking;
  const deviceType = await detectBookingDevice();
  const appLinks = [
    {
      id: "ios",
      title: copy.iosTitle,
      label: copy.iosLabel,
      lead: copy.iosLead,
      href: BOOKING_IOS_APP_URL,
    },
    {
      id: "android",
      title: copy.androidTitle,
      label: copy.androidLabel,
      lead: copy.androidLead,
      href: BOOKING_ANDROID_APP_URL,
    },
  ];

  if (deviceType === "desktop") {
    redirect(BOOKING_WEB_URL);
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-zinc-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-[32px] border border-[#ddd2c2] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.98)_0%,rgba(248,244,237,0.98)_45%,rgba(240,230,214,0.96)_100%)] shadow-[0_22px_70px_rgba(24,20,16,0.08)]">
          <div className="border-b border-[#ddd2c2] bg-[#e8ddcd] px-6 py-5 sm:px-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-600">{copy.eyebrow}</p>
            <h1 className="font-display mt-3 text-4xl leading-[0.95] tracking-tight sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-700 sm:text-base">
              {copy.lead}
            </p>
          </div>

          <div className="grid gap-4 px-6 py-6 sm:px-8 sm:py-8">
            <a
              href={BOOKING_WEB_URL}
              className="group rounded-[24px] border border-zinc-900 bg-zinc-900 px-5 py-5 text-white shadow-[0_12px_30px_rgba(24,20,16,0.12)] transition hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/65">{copy.webLabel}</p>
              <p className="font-display mt-2 text-3xl tracking-tight">{copy.webTitle}</p>
              <p className="mt-2 text-sm text-white/72">{copy.webLead}</p>
            </a>

            <div className="grid gap-4 sm:grid-cols-2">
              {appLinks.map((item) =>
                item.href ? (
                  <a
                    key={item.id}
                    href={item.href}
                    className="rounded-[24px] border border-[#ddd2c2] bg-white/90 px-5 py-5 shadow-[0_10px_26px_rgba(24,20,16,0.05)] transition hover:-translate-y-0.5 hover:border-zinc-900"
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
                    <p className="font-display mt-2 text-3xl tracking-tight text-zinc-900">{item.title}</p>
                    <p className="mt-2 text-sm text-zinc-600">{item.lead}</p>
                  </a>
                ) : (
                  <div
                    key={item.id}
                    className="rounded-[24px] border border-dashed border-[#d8cbb9] bg-[#fcfaf6] px-5 py-5 text-zinc-500"
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em]">{item.label}</p>
                    <p className="font-display mt-2 text-3xl tracking-tight text-zinc-900">{item.title}</p>
                    <p className="mt-2 text-sm">{copy.appFallback}</p>
                  </div>
                ),
              )}
            </div>

            <Link
              href="/"
              className="inline-flex w-fit items-center justify-center rounded-[14px] border border-[#ddd2c2] bg-white/80 px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-zinc-600 transition hover:bg-white hover:text-zinc-900"
            >
              {copy.back}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
