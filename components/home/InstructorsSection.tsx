import Image from "next/image";
import { trainers, type HomeLiteCopy } from "@/lib/home-page";

type InstructorsSectionProps = {
  copy: HomeLiteCopy;
};

export function InstructorsSection({ copy }: InstructorsSectionProps) {
  return (
    <section id="instructors" className="mx-auto max-w-6xl px-4 pb-12">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Studio team</p>
          <h2 className="font-display mt-2 text-4xl tracking-tight">{copy.instructors}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {trainers.map((trainer) => (
          <article
            key={trainer.name}
            className="group overflow-hidden rounded-[20px] border border-[#e5dbcc] bg-white shadow-[0_10px_28px_rgba(24,20,16,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(24,20,16,0.08)]"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src={trainer.image}
                alt={trainer.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="p-3.5 sm:p-5">
              <p className="font-display text-[1.1rem] tracking-tight sm:text-2xl">{trainer.name}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
