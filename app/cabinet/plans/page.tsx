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
        select: { pushPressId: true }
    });

    const [plans, enrollments] = await Promise.all([
        getPlans(),
        user?.pushPressId ? getEnrollments(user.pushPressId, 'active') : Promise.resolve([])
    ]);

    // Fetch local payments to cover gaps in PushPress API
    const localPayments = await db.payment.findMany({
        where: {
            userId: user?.id,
            status: 'COMPLETED',
            description: { contains: 'Plan Purchase' },
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        },
        orderBy: { createdAt: 'desc' }
    });

    // Merge payments into enrollments if not already present
    const enrollmentPlanIds = new Set(enrollments.map(e => e.planId));

    localPayments.forEach(payment => {
        // Extract planId from description: "Plan Purchase: plan_id..."
        const match = payment.description?.match(/Plan Purchase: ([^\s-]+(?:-[^\s-]+)*)/);
        const planId = match ? match[1] : null;

        if (planId && !enrollmentPlanIds.has(planId)) {
            // Create a mock enrollment for display
            // We assume it's active since it was paid recently
            enrollments.push({
                id: `local_payment_${payment.id}`,
                customerId: user?.pushPressId || '',
                companyId: '',
                planId: planId,
                status: 'active',
                startDate: payment.createdAt.toISOString(),
                endDate: null,
                lastCharge: payment.createdAt.toISOString(),
                nextCharge: null,
                paidUntil: null,
                billingSchedule: { period: 'month', interval: 1 }, // assumption
                checkinDetails: { checkins: 0, limit: -1 },
                entitlements: []
            });
            enrollmentPlanIds.add(planId);
        }
    });

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
            />
        </div>
    );
}
