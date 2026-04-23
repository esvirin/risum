"use client";

import { CalendarDays } from "lucide-react";
import type { ButtonHTMLAttributes, MouseEvent } from "react";

type OpenScheduleButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  eventName?: string;
};

export function OpenScheduleButton({
  eventName = "open-schedule-modal",
  onClick,
  children,
  ...rest
}: OpenScheduleButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    window.dispatchEvent(new Event(eventName));
  };

  return (
    <button type="button" onClick={handleClick} {...rest}>
      <CalendarDays className="h-5 w-5" />
      {children}
    </button>
  );
}
