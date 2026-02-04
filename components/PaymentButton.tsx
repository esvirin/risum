
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import JCCPaymentForm from "./JCCPaymentForm";

export default function PaymentButton() {
    const [jccOrder, setJccOrder] = useState<{ orderId: string; amount: number } | null>(null);
    const [loading, setLoading] = useState<string | null>(null);

    const handleTopUp = async (amount: string) => {
        setLoading(amount);
        try {
            const res = await fetch("/api/payments/jcc/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    type: 'TOPUP',
                    description: `Wallet Top-up: €${amount}`
                }),
            });
            const data = await res.json();

            if (data.success && data.orderId) {
                setJccOrder({
                    orderId: data.orderId,
                    amount: parseFloat(amount)
                });
            } else {
                toast.error(data.error || "Failed to initiate top-up");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setLoading(null);
        }
    };

    const handlePaymentSuccess = async (result: any) => {
        if (!jccOrder) return;

        const loadingToast = toast.loading('Confirming payment and updating balance...');

        try {
            const response = await fetch('/api/payments/jcc/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: jccOrder.orderId,
                    planId: 'TOPUP' // Sent as dummy if needed by API
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success(`Success! New balance: €${data.newBalance.toFixed(2)}`, { id: loadingToast });
                setJccOrder(null);
                // Refresh page or update state if parent provides it
                window.location.reload();
            } else {
                toast.error(data.error || 'Failed to confirm payment', { id: loadingToast });
            }
        } catch (error) {
            console.error('Payment confirmation error:', error);
            toast.error('An error occurred while confirming payment', { id: loadingToast });
        }
    };

    if (jccOrder) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                <div className="w-full max-w-md">
                    <JCCPaymentForm
                        orderId={jccOrder.orderId}
                        amount={jccOrder.amount}
                        onSuccess={handlePaymentSuccess}
                        onCancel={() => setJccOrder(null)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <Button
                onClick={() => handleTopUp("10.00")}
                disabled={loading !== null}
                className="flex-1"
            >
                {loading === "10.00" ? "..." : "Top Up €10"}
            </Button>
            <Button
                variant="outline"
                onClick={() => handleTopUp("50.00")}
                disabled={loading !== null}
                className="flex-1"
            >
                {loading === "50.00" ? "..." : "Top Up €50"}
            </Button>
        </div>
    );
}
