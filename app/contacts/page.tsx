import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] text-zinc-900">
      <PublicNav />
      <main className="mx-auto max-w-6xl px-4 py-14 sm:py-20 space-y-12">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Contacts</p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[0.95] tracking-tight mt-4">Studio location</h1>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1fr_1.2fr] items-start">
          <div className="space-y-7">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-2">Phone</p>
              <a href="tel:+35795505556" className="text-2xl tracking-tight hover:underline">+357 95505556</a>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-2">Address</p>
              <p className="text-xl leading-relaxed">1st floor, 58 Kolonakiou Str,<br />Limassol, 4103</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-2">Email</p>
              <a href="mailto:hello@fitspace.cy" className="text-lg hover:underline">hello@fitspace.cy</a>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a href="https://maps.google.com/?q=1st+floor,+58+Kolonakiou+Str,+Limassol,+4103" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center border border-zinc-900 bg-zinc-900 px-6 py-3 text-xs uppercase tracking-[0.18em] text-white hover:bg-zinc-800">
                Open map
              </a>
              <a href="https://wa.me/35795505556" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center border border-zinc-300 px-6 py-3 text-xs uppercase tracking-[0.18em] text-zinc-800 hover:border-zinc-900">
                WhatsApp
              </a>
            </div>
          </div>

          <iframe
            title="Fit Space location"
            src="https://maps.google.com/maps?q=1st%20floor,%2058%20Kolonakiou%20Str,%20Limassol,%204103&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full aspect-[4/3] border border-zinc-200"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
