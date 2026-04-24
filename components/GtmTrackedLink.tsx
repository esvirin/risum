"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

type GtmEventPayload = Record<string, string>;

type GtmTrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  eventName: string;
  eventPayload: GtmEventPayload;
};

type GtmWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

export function GtmTrackedLink({
  children,
  eventName,
  eventPayload,
  onClick,
  ...props
}: GtmTrackedLinkProps) {
  const handleClick: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"] = (event) => {
    onClick?.(event);

    if (event.defaultPrevented || typeof window === "undefined") {
      return;
    }

    const gtmWindow = window as GtmWindow;
    gtmWindow.dataLayer = gtmWindow.dataLayer || [];
    gtmWindow.dataLayer.push({
      event: eventName,
      ...eventPayload,
    });
  };

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
