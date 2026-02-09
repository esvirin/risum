'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Calendar, Infinity } from 'lucide-react';
import type { PushPressPlan, PushPressEnrollment } from '@/lib/pushpress';

interface PlansClientProps {
  plans: PushPressPlan[];
  activePlanIds: (string | null)[];
  enrollments?: PushPressEnrollment[];
  customerId: string;
}

export default function PlansClient({ plans, activePlanIds, enrollments = [] }: PlansClientProps) {
  const getPlanTypeLabel = (plan: PushPressPlan) => {
    switch (plan.recurrenceDetails.type) {
      case 'recurring':
        return 'Recurring Membership';
      case 'session-pack':
        return `${plan.recurrenceDetails.occurrences || 0} Session Pack`;
      case 'limited-recurring':
        return `${plan.recurrenceDetails.occurrences || 0} Payments`;
      case 'non-recurring':
        return 'One-Time';
      default:
        return 'Membership';
    }
  };

  const getPlanIcon = (plan: PushPressPlan) => {
    if (plan.policies.allow24HourAccess) return <Infinity className="h-5 w-5" />;
    if (plan.recurrenceDetails.type === 'session-pack') return <Zap className="h-5 w-5" />;
    return <Calendar className="h-5 w-5" />;
  };

  if (plans.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed bg-muted/5">
        <p className="text-muted-foreground">No membership plans available at this time.</p>
      </Card>
    );
  }

  const plansByCategory = plans.reduce((acc, plan) => {
    const category = plan.category?.name || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(plan);
    return acc;
  }, {} as Record<string, PushPressPlan[]>);

  return (
    <div className="space-y-12">
      {enrollments.length > 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Active Memberships</h2>
            <p className="text-sm text-muted-foreground mt-1">Your current active plans and subscriptions</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {enrollments.map((enrol) => {
              const plan = plans.find((p) => p.id === enrol.planId);
              const usageText = (() => {
                if (enrol.checkinDetails?.limit === -1) return `${enrol.checkinDetails.checkins} check-ins`;
                if (typeof enrol.checkinDetails?.limit === 'number') {
                  const remaining = Math.max(enrol.checkinDetails.limit - (enrol.checkinDetails.checkins || 0), 0);
                  return `${remaining} remaining`;
                }
                return '—';
              })();

              return (
                <Card key={enrol.id} className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan?.name || 'Active Membership'}</CardTitle>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <CardDescription>
                      Enrolled on {enrol.startDate ? new Date(enrol.startDate).toLocaleDateString() : 'N/A'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Next Charge</p>
                        <p className="font-medium text-foreground">
                          {enrol.nextCharge ? new Date(enrol.nextCharge).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Usage</p>
                        <p className="font-medium text-foreground">{usageText}</p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <p className="text-xs text-muted-foreground">Status: {enrol.status.toUpperCase()}</p>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {Object.entries(plansByCategory).map(([category, categoryPlans]) => (
        <div key={category} className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{category}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {categoryPlans.length} {categoryPlans.length === 1 ? 'plan' : 'plans'} available
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categoryPlans.map((plan) => {
              const isActive = activePlanIds.includes(plan.id);
              const isRecurring = plan.recurrenceDetails.type === 'recurring';

              return (
                <Card
                  key={plan.id}
                  className={`overflow-hidden transition-all hover:shadow-lg ${isActive ? 'ring-2 ring-primary' : ''}`}
                >
                  <CardHeader className="bg-primary/5 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getPlanIcon(plan)}
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                      </div>
                      {isActive && (
                        <Badge variant="default" className="bg-primary">
                          Active
                        </Badge>
                      )}
                    </div>

                    {/* PushPress Plan schema does not expose price in this API tier */}
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-sm text-muted-foreground">Price:</span>
                      <span className="text-sm font-medium">See at checkout</span>
                      <span className="text-xs text-muted-foreground">{isRecurring ? ' / month' : ''}</span>
                    </div>

                    <CardDescription className="mt-1">{getPlanTypeLabel(plan)}</CardDescription>

                    {plan.description && (
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
                    )}
                  </CardHeader>

                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase">Includes</h3>
                      <ul className="space-y-2">
                        {plan.policies.allowClassCheckins && (
                          <li className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                            <span>Class access</span>
                          </li>
                        )}
                        {plan.policies.allowOpenGymCheckins && (
                          <li className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                            <span>Open gym access</span>
                          </li>
                        )}
                        {plan.policies.allow24HourAccess && (
                          <li className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                            <span>24-hour access</span>
                          </li>
                        )}
                        {isRecurring && (
                          <li className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                            <span>Unlimited duration</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button className="w-full" disabled>
                      {isActive ? 'Current Plan' : 'Purchase in PushPress'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
