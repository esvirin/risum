import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center relative py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent break-words">
          Fit Space
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground md:text-2xl lg:text-3xl leading-relaxed max-w-4xl mx-auto">
          Experience the premium fitness lifestyle.
          <span className="block sm:inline"> Manage your membership, book classes, and track your progress.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 w-full sm:w-auto">
          <Button asChild size="lg" className="w-full sm:w-auto text-lg h-12 sm:h-14 px-10 shadow-lg">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg h-12 sm:h-14 px-10">
            <Link href="/register">Join Now</Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 text-xs sm:text-sm text-muted-foreground/60 w-full text-center px-4">
        &copy; {new Date().getFullYear()} Fit Space. Powered by PushPress.
      </div>
    </div>
  );
}
