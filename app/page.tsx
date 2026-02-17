import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/PublicNav";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      <PublicNav />

      <section className="text-center py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4">Experience the Premium Fitness Lifestyle</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            UI-only demo build. Explore the member cabinet, schedule, and plans screens.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto text-lg h-12 sm:h-14 px-10 rounded-lg">
              <Link href="/cabinet/schedule">Book a Class</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg h-12 sm:h-14 px-10 rounded-lg">
              <Link href="/cabinet">Open Member Area</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-secondary border-t">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Fit Space. UI Preview.</p>
        </div>
      </footer>
      <PwaInstallPrompt />
    </div>
  );
}
