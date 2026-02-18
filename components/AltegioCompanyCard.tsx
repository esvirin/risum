"use client";

import { useEffect, useState } from "react";

type Company = {
  title: string;
  address: string;
  phone: string;
  email: string;
  site: string;
  timezone: string;
  currency: string;
  lat: string;
  lon: string;
};

export function AltegioCompanyCard() {
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/altegio/company", { cache: "no-store" });
        const json = (await res.json()) as { data?: Company | null };
        if (!ignore) setCompany(json.data ?? null);
      } catch {
        if (!ignore) setCompany(null);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  if (!company) return null;

  return (
    <div className="border border-zinc-200 bg-[#f8f6f1] p-5 sm:p-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-4">Altegio · Company profile</p>
      <div className="grid gap-3 sm:grid-cols-2 text-sm">
        <p><span className="text-zinc-500">Address:</span> {company.address || "-"}</p>
        <p><span className="text-zinc-500">Phone:</span> {company.phone || "-"}</p>
        <p><span className="text-zinc-500">Email:</span> {company.email || "-"}</p>
        <p><span className="text-zinc-500">Site:</span> {company.site || "-"}</p>
        <p><span className="text-zinc-500">Timezone:</span> {company.timezone || "-"}</p>
        <p><span className="text-zinc-500">Currency:</span> {company.currency || "-"}</p>
      </div>
    </div>
  );
}
