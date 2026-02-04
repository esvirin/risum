import { auth } from "@/lib/auth";
import { getPlans, getEnrollments } from "@/lib/pushpress";
import { db } from "@/lib/db";
import PlansClient from "@/components/PlansClient";
import { Card } from "@/components/ui/card";

export default async function PlansPage() {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
        return (
            <div className="container py-8">
                <Card className="max-w-md mx-auto p-8 text-center">
                    <h2 className="text-xl font-semibold mb-2">Not Authenticated</h2>
                    <p className="text-muted-foreground">
                        Please sign in to view membership plans.
                    </p>
                </Card>
            </div>
        );
    }

    const user = await db.user.findUnique({
        where: { email },
        select: { pushPressId: true, balance: true }
    });

    const [plans, enrollments] = await Promise.all([
        getPlans(),
        user?.pushPressId ? getEnrollments(user.pushPressId, 'active') : Promise.resolve([])
    ]);

    const activePlanIds = enrollments.map(e => e.planId).filter(Boolean);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Membership Plans
                </h1>
                <p className="text-muted-foreground">
                    Choose the perfect plan for your fitness journey
                </p>
            </header>

            <PlansClient
                plans={plans}
                activePlanIds={activePlanIds}
                enrollments={enrollments}
                customerId={user?.pushPressId || ''}
                balance={user?.balance || 0}
            />
        </div>
    );
}
