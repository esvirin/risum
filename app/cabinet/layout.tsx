import TopNav from "@/components/TopNav";
import { Toaster } from "@/components/ui/sonner";
import { mockUser } from "@/lib/mock-data";

export default function CabinetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/10">
      <TopNav user={mockUser} />
      <main className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      <Toaster />
    </div>
  );
}
