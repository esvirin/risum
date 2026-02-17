"use client";

import Link from "next/link";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-50 bg-[#f7f4ef]/95 backdrop-blur border-b border-zinc-200">
      <div className="border-b border-zinc-200/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>1st floor, 58 Kolonakiou Str, Limassol, 4103</p>
          <a href="tel:+35795505556" className="text-zinc-800 hover:text-black">
            +357 95505556
          </a>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="inline-flex items-center">
          <img src="/logo-fitspace.svg" alt="Fit Space" className="h-7 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide text-zinc-700">
          <Link href="/" className="hover:text-black">Studio</Link>
          <Link href="/trainers" className="hover:text-black">Trainers</Link>
          <Link href="/contacts" className="hover:text-black">Contacts</Link>
        </nav>

        <a
          href="https://example.com/booking"
          target="_blank"
          rel="noreferrer"
          className="border border-zinc-300 px-4 py-2 text-xs uppercase tracking-[0.18em] text-zinc-800 transition hover:bg-zinc-900 hover:text-white"
        >
          Book
        </a>
      </div>
    </header>
  );
}
