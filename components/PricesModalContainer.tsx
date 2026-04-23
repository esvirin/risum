"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/LanguageProvider";
import { PricesModal } from "@/components/PricesModal";
import { buildPriceCards, type Mode } from "@/lib/home-page";

type PricesModalContainerProps = {
  eventName?: string;
  openOnMount?: boolean;
};

export function PricesModalContainer({
  eventName = "open-prices-modal",
  openOnMount = false,
}: PricesModalContainerProps) {
  const { t } = useI18n();
  const copy = t.homeLite;
  const allPrices = useMemo(() => buildPriceCards(copy), [copy]);
  const [mode, setMode] = useState<Mode>("group");
  const [isOpen, setIsOpen] = useState(openOnMount);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(eventName, open);

    return () => {
      window.removeEventListener(eventName, open);
    };
  }, [eventName]);

  const prices = useMemo(
    () => allPrices.filter((item) => item.mode === mode),
    [allPrices, mode],
  );

  return (
    <PricesModal
      isOpen={isOpen}
      mode={mode}
      prices={prices}
      allPrices={allPrices}
      copy={copy}
      onClose={() => setIsOpen(false)}
      onModeChange={setMode}
    />
  );
}
