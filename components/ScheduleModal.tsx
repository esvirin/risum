"use client";

import { useEffect } from "react";
import { ScheduleModule } from "@/components/home/ScheduleModule";

type ScheduleModalProps = {
  isOpen: boolean;
  locale: "ru" | "en";
  scheduleLabel: string;
  groupLabel: string;
  privateLabel: string;
  closeLabel: string;
  onClose: () => void;
};

export function ScheduleModal({
  isOpen,
  locale,
  scheduleLabel,
  groupLabel,
  privateLabel,
  closeLabel,
  onClose,
}: ScheduleModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-[rgba(24,20,16,0.48)] p-1 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={scheduleLabel}
        className="relative h-[97dvh] w-full overflow-hidden rounded-[22px] border border-[#e5dbcc] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95)_0%,rgba(248,244,237,0.98)_55%,rgba(241,232,220,0.95)_100%)] shadow-[0_24px_80px_rgba(20,16,12,0.2)] sm:mx-auto sm:h-auto sm:max-h-[92vh] sm:max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent" />

        <div className="relative flex h-full flex-col overflow-hidden p-5 sm:max-h-[92vh] sm:p-8">
          <div className="mb-4 flex justify-end sm:mb-5">
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-[14px] border border-[#e5dbcc] bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.18em] text-zinc-500 shadow-[0_8px_24px_rgba(24,20,16,0.04)] transition hover:bg-white hover:text-zinc-900"
            >
              {closeLabel}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-1">
            <ScheduleModule
              copy={{
                join: scheduleLabel,
                group: groupLabel,
                private: privateLabel,
              }}
              locale={locale}
              id="welcome-schedule"
              className="max-w-none px-0 pb-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
