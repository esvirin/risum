"use client";

import { useEffect, useId } from "react";

type Mode = "group" | "private";

type PriceCard = {
  id: string;
  label?: string;
  title: string;
  price: string;
  unitPrice?: string;
  note?: string;
  mode: Mode;
};

type PricesCopy = {
  pricesTitle: string;
  groupLessons: string;
  privateLessons: string;
  close: string;
};

type PricesModalProps = {
  isOpen: boolean;
  mode: Mode;
  prices: PriceCard[];
  allPrices: PriceCard[];
  copy: PricesCopy;
  onClose: () => void;
  onModeChange: (mode: Mode) => void;
};

export function PricesModal({
  isOpen,
  mode,
  prices,
  allPrices,
  copy,
  onClose,
  onModeChange,
}: PricesModalProps) {
  const titleId = useId();
  const groupPrices = allPrices.filter((item) => item.mode === "group");
  const privatePrices = allPrices.filter((item) => item.mode === "private");

  function renderCards(items: PriceCard[]) {
    return (
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex h-full flex-col border border-zinc-900 bg-white px-4 py-4 sm:px-5 sm:py-5"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-3">
              <div className="min-w-0">
                <p className="text-[1.6rem] font-normal leading-[0.95] tracking-tight text-zinc-900 sm:text-[2.2rem]">
                  {item.title}
                </p>
                {item.unitPrice ? (
                  <p className="mt-2 text-lg leading-none tracking-tight text-zinc-400 sm:text-[1.4rem]">
                    {item.unitPrice}
                  </p>
                ) : null}
              </div>

              <p className="row-span-2 self-center text-right text-[2.8rem] font-normal leading-none tracking-tight text-zinc-900 sm:text-[3.1rem]">
                {item.price}
              </p>
            </div>

            {item.note ? (
              <p className="mt-auto border-t border-zinc-200 pt-4 text-lg leading-none tracking-tight text-zinc-900 sm:pt-4 sm:text-[1.6rem]">
                {item.note}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    );
  }

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
      className="fixed inset-0 z-50 flex items-end bg-[rgba(29,24,20,0.55)] p-1 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative h-[97dvh] w-full overflow-hidden rounded-[24px] border border-[rgba(90,74,58,0.18)] bg-[#f4ede4] shadow-[0_30px_100px_rgba(20,16,12,0.28)] sm:mx-auto sm:h-auto sm:max-h-[92vh] sm:max-w-5xl xl:max-w-6xl 2xl:max-w-[96rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/55 to-transparent" />

        <div className="relative flex h-full flex-col overflow-hidden p-5 sm:max-h-[92vh] sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
            <div>
              <h3 id={titleId} className="text-3xl tracking-tight sm:text-5xl">
                {copy.pricesTitle}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full border border-zinc-400/80 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.16em] text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
            >
              {copy.close}
            </button>
          </div>

          <div className="mb-5 grid w-full grid-cols-2 rounded-full border border-zinc-300 p-1 text-xs uppercase tracking-[0.12em] sm:hidden">
            <button
              type="button"
              onClick={() => onModeChange("group")}
              className={`rounded-full px-4 py-2 text-center ${
                mode === "group" ? "bg-zinc-900 text-white" : "text-zinc-700"
              }`}
            >
              {copy.groupLessons}
            </button>
            <button
              type="button"
              onClick={() => onModeChange("private")}
              className={`rounded-full px-4 py-2 text-center ${
                mode === "private" ? "bg-zinc-900 text-white" : "text-zinc-700"
              }`}
            >
              {copy.privateLessons}
            </button>
          </div>

          <div className="hidden flex-1 overflow-y-auto pb-1 sm:block">
            <section>
              <h4 className="mb-4 text-xl uppercase tracking-[0.12em] text-zinc-500">
                {copy.groupLessons}
              </h4>
              {renderCards(groupPrices)}
            </section>

            <section className="mt-8">
              <h4 className="mb-4 text-xl uppercase tracking-[0.12em] text-zinc-500">
                {copy.privateLessons}
              </h4>
              {renderCards(privatePrices)}
            </section>
          </div>

          <div className="flex-1 overflow-y-auto pb-1 sm:hidden">
            {renderCards(prices)}
          </div>
        </div>
      </div>
    </div>
  );
}
