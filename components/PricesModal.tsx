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
            className="flex h-full flex-col overflow-hidden rounded-[20px] border border-[#e5dbcc] bg-white/92 px-4 py-4 shadow-[0_10px_24px_rgba(24,20,16,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(24,20,16,0.08)] sm:px-5 sm:py-5"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-3">
              <div className="min-w-0">
                {item.label ? (
                  <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                    {item.label}
                  </p>
                ) : null}
                <p className="font-display text-[1.55rem] font-normal leading-[0.98] tracking-tight text-zinc-900 sm:text-[2rem]">
                  {item.title}
                </p>
                {item.unitPrice ? (
                  <p className="mt-2 text-base leading-none tracking-tight text-zinc-500 sm:text-[1.15rem]">
                    {item.unitPrice}
                  </p>
                ) : null}
              </div>

              <p className="font-display rounded-[14px] border border-[#ece2d5] bg-[#fcfaf6] px-3 py-2 text-right text-[2rem] font-normal leading-none tracking-tight text-zinc-900 sm:text-[2.5rem]">
                {item.price}
              </p>
            </div>

            {item.note ? (
              <p className="mt-4 text-base leading-tight tracking-tight text-zinc-700 sm:mt-auto sm:text-lg">
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
      className="fixed inset-0 z-50 flex items-end bg-[rgba(24,20,16,0.48)] p-1 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative h-[97dvh] w-full overflow-hidden rounded-[22px] border border-[#e5dbcc] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95)_0%,rgba(248,244,237,0.98)_55%,rgba(241,232,220,0.95)_100%)] shadow-[0_24px_80px_rgba(20,16,12,0.2)] sm:mx-auto sm:h-auto sm:max-h-[92vh] sm:max-w-5xl xl:max-w-6xl 2xl:max-w-[96rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent" />

        <div className="relative flex h-full flex-col overflow-hidden p-5 sm:max-h-[92vh] sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">PilatesSpace Limassol</p>
              <h3 id={titleId} className="font-display text-3xl tracking-tight sm:text-5xl">
                {copy.pricesTitle}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-base">
                Choose a format that fits your pace and book your next session.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-[14px] border border-[#e5dbcc] bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.18em] text-zinc-500 shadow-[0_8px_24px_rgba(24,20,16,0.04)] transition hover:bg-white hover:text-zinc-900"
            >
              {copy.close}
            </button>
          </div>

          <div className="mb-5 grid w-full grid-cols-2 rounded-[14px] border border-zinc-200 bg-white p-1 text-xs uppercase tracking-[0.12em] shadow-[0_8px_24px_rgba(24,20,16,0.04)] sm:hidden">
            <button
              type="button"
              onClick={() => onModeChange("group")}
              className={`rounded-[10px] px-4 py-2 text-center transition ${
                mode === "group" ? "border border-zinc-900 bg-zinc-900 text-white" : "text-zinc-500 hover:bg-[#f7f4ef] hover:text-zinc-900"
              }`}
            >
              {copy.groupLessons}
            </button>
            <button
              type="button"
              onClick={() => onModeChange("private")}
              className={`rounded-[10px] px-4 py-2 text-center transition ${
                mode === "private" ? "border border-zinc-900 bg-zinc-900 text-white" : "text-zinc-500 hover:bg-[#f7f4ef] hover:text-zinc-900"
              }`}
            >
              {copy.privateLessons}
            </button>
          </div>

          <div className="hidden flex-1 overflow-y-auto pb-1 sm:block">
            <section>
              <div className="mb-4 flex items-center gap-3">
                <h4 className="text-base uppercase tracking-[0.16em] text-zinc-500">
                  {copy.groupLessons}
                </h4>
                <div className="h-px flex-1 bg-zinc-300" />
              </div>
              {renderCards(groupPrices)}
            </section>

            <section className="mt-8">
              <div className="mb-4 flex items-center gap-3">
                <h4 className="text-base uppercase tracking-[0.16em] text-zinc-500">
                  {copy.privateLessons}
                </h4>
                <div className="h-px flex-1 bg-zinc-300" />
              </div>
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
