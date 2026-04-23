"use client";

import type { ButtonHTMLAttributes, MouseEvent } from "react";

type OpenPricesButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  eventName?: string;
};

export function OpenPricesButton({
  eventName = "open-prices-modal",
  onClick,
  ...rest
}: OpenPricesButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    window.dispatchEvent(new Event(eventName));
  };

  return <button type="button" onClick={handleClick} {...rest} />;
}
