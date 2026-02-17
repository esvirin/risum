"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-[#faf8f5]/95 backdrop-blur">
      <div className="w-full border-b border-zinc-200/80 text-xs text-zinc-600">
        <div className="container mx-auto flex max-w-6xl flex-col gap-1 px-4 py-2 sm:flex-row sm:items-center sm:justify-between">
          <p>1st floor, 58 Kolonakiou Str, Limassol, 4103</p>
          <a href="tel:+35795505556" className="font-medium text-zinc-800 hover:underline">
            +357 95505556
          </a>
        </div>
      </div>

      <div className="container flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
          Fit Space
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-zinc-700">
          <Link href="/" className="hover:text-zinc-900">О студии</Link>
          <Link href="/trainers" className="hover:text-zinc-900">Тренеры</Link>
          <Link href="/contacts" className="hover:text-zinc-900">Контакты</Link>
        </div>
        <Button asChild className="rounded-none bg-zinc-900 hover:bg-zinc-800">
          <a href="https://example.com/booking" target="_blank" rel="noreferrer">Записаться</a>
        </Button>
      </div>
    </header>
  );
}
