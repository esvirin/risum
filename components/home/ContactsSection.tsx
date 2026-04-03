import { contactPhoneHref, whatsappHref, type HomeLiteCopy } from "@/lib/home-page";

type ContactsSectionProps = {
  copy: HomeLiteCopy;
  openMapLabel: string;
};

export function ContactsSection({ copy, openMapLabel }: ContactsSectionProps) {
  return (
    <section id="contacts" className="mx-auto max-w-6xl px-4 pb-16">
      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Visit us</p>
        <h2 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">{copy.easy}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[20px] border border-[#e5dbcc] bg-white p-6 shadow-[0_10px_28px_rgba(24,20,16,0.05)]">
          <div className="space-y-5">
            <div className="border-b border-[#ece2d5] pb-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{copy.address}</p>
              <p className="font-display mt-3 text-2xl leading-relaxed tracking-tight text-zinc-900">
                1st floor, 58 Kolonakiou Str, Limassol, 4103
              </p>
            </div>

            <div className="grid gap-5 border-b border-[#ece2d5] pb-5 sm:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{copy.phone}</p>
                <a
                  href={contactPhoneHref}
                  className="font-display mt-3 inline-flex text-3xl tracking-tight text-zinc-900 transition hover:text-zinc-700"
                >
                  +357 95505556
                </a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{copy.email}</p>
                <p className="mt-3 text-base text-zinc-700">hello@fitspace.cy</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Quick actions</p>
              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <a
                  href="https://maps.google.com/?q=1st+floor,+58+Kolonakiou+Str,+Limassol,+4103"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-w-[9rem] items-center justify-center rounded-[12px] border border-zinc-900 bg-zinc-900 px-6 py-3 text-xs uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_rgba(24,20,16,0.04)] transition hover:bg-zinc-800"
                >
                  {openMapLabel}
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-w-[9rem] items-center justify-center rounded-[12px] border border-zinc-200 bg-[#f7f4ef] px-6 py-3 text-xs uppercase tracking-[0.18em] text-zinc-500 shadow-[0_8px_24px_rgba(24,20,16,0.04)] transition hover:bg-white hover:text-zinc-900"
                >
                  Написать в WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
        <iframe
          title="Fit Space map"
          className="h-[340px] w-full rounded-[20px] border border-[#e5dbcc] bg-white shadow-[0_10px_28px_rgba(24,20,16,0.05)]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=Kolonakiou%2058%2C%20Limassol&output=embed"
        />
      </div>
    </section>
  );
}
