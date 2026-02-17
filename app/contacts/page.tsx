import { PublicNav } from "@/components/PublicNav";
import { Button } from "@/components/ui/button";

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-zinc-900">
      <PublicNav />
      <main className="container mx-auto max-w-6xl px-4 py-16 space-y-12">
        <div>
          <p className="uppercase tracking-[0.2em] text-xs text-zinc-500 mb-4">Contacts</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Контакты и локация</h1>
          <p className="text-zinc-600 mt-4 max-w-2xl">Свяжитесь с нами любым удобным способом или приезжайте в студию.</p>
        </div>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-sm uppercase text-zinc-500 tracking-wider">Телефон</p>
              <a href="tel:+35700000000" className="text-xl font-medium hover:underline">+357 00 000 000</a>
            </div>
            <div>
              <p className="text-sm uppercase text-zinc-500 tracking-wider">Email</p>
              <a href="mailto:hello@fitspace.cy" className="text-xl font-medium hover:underline">hello@fitspace.cy</a>
            </div>
            <div>
              <p className="text-sm uppercase text-zinc-500 tracking-wider">Адрес</p>
              <p className="text-xl font-medium">Limassol, Cyprus</p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button asChild className="rounded-none bg-zinc-900 hover:bg-zinc-800">
                <a href="https://maps.google.com" target="_blank" rel="noreferrer">Открыть в Google Maps</a>
              </Button>
              <Button asChild variant="outline" className="rounded-none border-zinc-300">
                <a href="https://wa.me/35700000000" target="_blank" rel="noreferrer">WhatsApp</a>
              </Button>
            </div>
          </div>

          <div className="aspect-[4/3] border border-zinc-200 bg-gradient-to-br from-zinc-200 to-zinc-100 flex items-center justify-center text-zinc-600">
            Map placeholder
          </div>
        </section>
      </main>
    </div>
  );
}
