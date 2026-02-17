import Link from "next/link";
import { Button } from "@/components/ui/button";
import ScheduleClient from "@/components/ScheduleClient";
import { mockClasses } from "@/lib/mock-data";

export default function SchedulePage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
          <p className="text-muted-foreground">UI preview mode (no backend actions)</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/cabinet">Dashboard</Link>
        </Button>
      </header>

      <ScheduleClient initialClasses={mockClasses} />
    </div>
  );
}
