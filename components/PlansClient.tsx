'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Calendar, Infinity } from 'lucide-react';
import { toast } from 'sonner';
import type { PushPressPlan } from '@/lib/pushpress';

interface PlansClientProps {
    plans: PushPressPlan[];
    activePlanIds: (string | null)[];
    customerId: string;
}

export default function PlansClient({ plans, activePlanIds, customerId }: PlansClientProps) {
    const [purchasing, setPurchasing] = useState<string | null>(null);

    const handlePurchase = async (planId: string) => {
        if (!customerId) {
            toast.error('Customer ID not found');
            return;
        }

        setPurchasing(planId);
        try {
            const response = await fetch('/api/enrollments/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('Plan purchased successfully!');
                // Refresh the page to show updated enrollments
                window.location.reload();
            } else {
                toast.error(data.error || 'Purchase failed');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            toast.error('An error occurred while purchasing the plan');
        } finally {
            setPurchasing(null);
        }
    };

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
                <p className="text-muted-foreground">
                    No membership plans available at this time.
                </p>
            </Card>
        );
    }

    // Group plans by category
    const plansByCategory = plans.reduce((acc, plan) => {
        const category = plan.category?.name || 'General';
        if (!acc[category]) acc[category] = [];
        acc[category].push(plan);
        return acc;
    }, {} as Record<string, PushPressPlan[]>);

    return (
        <div className="space-y-12">
            {Object.entries(plansByCategory).map(([category, categoryPlans]) => (
                <div key={category} className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            {category}
                        </h2>
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
                                    className={`overflow-hidden transition-all hover:shadow-lg ${isActive ? 'ring-2 ring-primary' : ''
                                        }`}
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
                                        <CardDescription className="mt-2">
                                            {getPlanTypeLabel(plan)}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="pt-6 space-y-4">
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                                                Includes
                                            </h3>
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
                                        <Button
                                            className="w-full"
                                            disabled={isActive || purchasing === plan.id}
                                            onClick={() => handlePurchase(plan.id)}
                                            variant={isActive ? 'secondary' : 'default'}
                                        >
                                            {purchasing === plan.id
                                                ? 'Processing...'
                                                : isActive
                                                    ? 'Current Plan'
                                                    : 'Purchase Plan'}
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
