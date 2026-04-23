"use client";

import { useEffect, useState } from "react";
import { ScheduleModal } from "@/components/ScheduleModal";

type ScheduleModalContainerProps = {
  locale: "ru" | "en";
  scheduleLabel: string;
  groupLabel: string;
  privateLabel: string;
  closeLabel: string;
  eventName?: string;
  openOnMount?: boolean;
};

export function ScheduleModalContainer({
  locale,
  scheduleLabel,
  groupLabel,
  privateLabel,
  closeLabel,
  eventName = "open-schedule-modal",
  openOnMount = false,
}: ScheduleModalContainerProps) {
  const [isOpen, setIsOpen] = useState(openOnMount);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(eventName, open);

    return () => {
      window.removeEventListener(eventName, open);
    };
  }, [eventName]);

  return (
    <ScheduleModal
      isOpen={isOpen}
      locale={locale}
      scheduleLabel={scheduleLabel}
      groupLabel={groupLabel}
      privateLabel={privateLabel}
      closeLabel={closeLabel}
      onClose={() => setIsOpen(false)}
    />
  );
}
