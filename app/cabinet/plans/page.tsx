import PlansClient from "@/components/PlansClient";
import { mockEnrollments, mockPlans } from "@/lib/mock-data";

export default function PlansPage() {
  const activePlanIds = mockEnrollments.map((e) => e.planId);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Membership Plans</h1>
        <p className="text-muted-foreground">UI preview mode (no purchases or account actions)</p>
      </header>

      <PlansClient plans={mockPlans} activePlanIds={activePlanIds} enrollments={mockEnrollments} customerId="demo-customer" />
    </div>
  );
}
