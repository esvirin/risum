import Link from "next/link";
import { BOOKING_PAGE_PATH } from "@/lib/booking";
import {
  formatLocalizedDay,
  formatTime,
  getCardService,
  getRoomShortLabel,
  getScheduleHeading,
  getTrainerName,
  privateBookingMessage,
  privateBookingPhone,
  whatsappHref,
  contactPhoneHref,
  type HomeLiteCopy,
  type Mode,
  type ScheduleDay,
} from "@/lib/home-page";

type ScheduleSectionProps = {
  copy: HomeLiteCopy;
  locale: "ru" | "en";
  scheduleMode: Mode;
  onScheduleModeChange: (mode: Mode) => void;
  scheduleByDay: ScheduleDay[];
};

function ScheduleCard({ day, locale }: { day: ScheduleDay; locale: "ru" | "en" }) {
  return (
    <section className="flex min-w-[13.5rem] shrink-0 snap-center flex-col overflow-hidden rounded-[16px] border border-zinc-200 bg-white shadow-[0_10px_28px_rgba(24,20,16,0.05)] md:min-w-0 md:shadow-[0_10px_24px_rgba(24,20,16,0.05)]">
      <div className="border-b border-zinc-200 bg-[#fcfaf6] px-3.5 py-3.5 md:px-3 md:py-3">
        <p className="text-[1.05rem] leading-tight tracking-tight text-zinc-900 md:text-[0.96rem]">
          {formatLocalizedDay(day.key, locale)}
        </p>
      </div>
      <div className="space-y-2 bg-[#f7f4ef] p-2.5 md:p-2">
        {day.items.length === 0 ? (
          <p className="rounded-[14px] border border-dashed border-zinc-200 bg-white px-4 py-5 text-sm text-zinc-400 md:rounded-[12px] md:px-3 md:py-4">
            No classes
          </p>
        ) : (
          day.items.map((item) => {
            const cardService = getCardService(item.service) ?? item.service;
            return (
              <Link
                key={item.id}
                href={BOOKING_PAGE_PATH}
                className="relative block rounded-[14px] border border-zinc-200 bg-white px-3 py-3 shadow-[0_6px_18px_rgba(24,20,16,0.04)] transition hover:border-zinc-900 hover:shadow-[0_10px_24px_rgba(24,20,16,0.06)] md:rounded-[12px] md:shadow-[0_4px_14px_rgba(24,20,16,0.04)] md:hover:shadow-[0_8px_20px_rgba(24,20,16,0.06)]"
              >
                <div className="flex items-center justify-between gap-3 md:gap-2">
                  <p className="inline-flex rounded-[8px] bg-[#f7f4ef] px-2 py-1 text-[0.72rem] font-medium uppercase tracking-[0.08em] text-zinc-700 md:text-[0.68rem]">
                    {formatTime(item.datetime)}
                  </p>
                  {getRoomShortLabel(item.trainer) ? (
                    <p className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-zinc-400 md:text-[9px] md:tracking-[0.1em]">
                      {getRoomShortLabel(item.trainer)}
                    </p>
                  ) : null}
                </div>
                <p className="mt-1.5 text-[1rem] leading-tight tracking-tight text-zinc-900 md:text-[0.9rem]">
                  {cardService}
                </p>
                <p className="mt-2 min-w-0 break-words text-[0.76rem] uppercase tracking-[0.05em] text-zinc-500 md:mt-1.5 md:text-[0.68rem] md:tracking-[0.04em]">
                  {getTrainerName(item.trainer)}
                </p>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}

export function ScheduleSection({
  copy,
  locale,
  scheduleMode,
  onScheduleModeChange,
  scheduleByDay,
}: ScheduleSectionProps) {
  return (
    <section id="schedule" className="mx-auto max-w-6xl px-4 pb-14">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Weekly schedule</p>
          <h2 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">{copy.join}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">
            {getScheduleHeading()}
          </p>
        </div>

        <div className="inline-flex w-full rounded-[14px] border border-zinc-200 bg-white p-1 shadow-[0_8px_24px_rgba(24,20,16,0.04)] md:w-auto">
          {(["group", "private"] as const).map((mode) => {
            const active = scheduleMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => onScheduleModeChange(mode)}
                className={`flex-1 rounded-[10px] px-6 py-2.5 text-sm font-medium uppercase tracking-[0.12em] transition md:flex-none ${
                  active ? "border border-zinc-900 bg-zinc-900 text-white" : "text-zinc-500 hover:bg-[#f7f4ef] hover:text-zinc-900"
                }`}
              >
                {mode === "group" ? copy.group : copy.private}
              </button>
            );
          })}
        </div>
      </div>

      {scheduleMode === "private" ? (
        <div className="overflow-hidden rounded-[24px] border border-[#ddd2c2] bg-[linear-gradient(135deg,#fffdfa_0%,#f4ede2_100%)] shadow-[0_12px_34px_rgba(24,20,16,0.06)]">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Персональные занятия</p>
              <p className="font-display mt-3 text-3xl leading-tight tracking-tight text-zinc-900 sm:text-4xl">
                Один контакт, одно персональное занятие, простая запись.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-700 sm:text-lg">
                {privateBookingMessage}
              </p>
            </div>
            <div className="rounded-[20px] border border-white/70 bg-white/85 p-5 shadow-[0_10px_24px_rgba(24,20,16,0.04)]">
              <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Телефон администратора</p>
              <a
                href={contactPhoneHref}
                className="font-display mt-3 inline-flex text-4xl leading-none tracking-tight text-zinc-900 transition hover:text-zinc-700"
              >
                {privateBookingPhone}
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center rounded-[14px] border border-zinc-900 bg-zinc-900 px-6 py-3 text-xs uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_rgba(24,20,16,0.06)] transition hover:-translate-y-0.5 hover:bg-zinc-800"
              >
                Написать в WhatsApp
              </a>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="md:hidden">
            <div className="flex gap-3 overflow-x-auto snap-x">
              {scheduleByDay.map((day) => (
                <ScheduleCard key={day.key} day={day} locale={locale} />
              ))}
            </div>
          </div>

          <div className="hidden grid-cols-5 gap-3 md:grid">
            {scheduleByDay.map((day) => (
              <ScheduleCard key={day.key} day={day} locale={locale} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
