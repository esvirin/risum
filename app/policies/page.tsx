"use client";

import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/components/LanguageProvider";

export default function PoliciesPage() {
  const { t } = useI18n();
  const copy = t.policies;

  return (
    <div className="bg-[#f7f4ef] text-zinc-900 min-h-screen">
      <PublicNav />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <h1 className="text-4xl sm:text-5xl tracking-tight">{copy.title}</h1>
        <p className="mt-4 text-zinc-600">{copy.lead}</p>

        <ol className="mt-8 space-y-4 border border-zinc-200 bg-white p-5 sm:p-6 text-sm text-zinc-700">
          {copy.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </main>

      <SiteFooter />
    </div>
  );
}
