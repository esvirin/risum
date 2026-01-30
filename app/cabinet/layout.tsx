import { auth } from "@/lib/auth";
import TopNav from "@/components/TopNav";
import { redirect } from "next/navigation";

export default async function CabinetLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-muted/10">
            <TopNav user={session.user} />
            <main className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
