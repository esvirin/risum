"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PaymentButton() {
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

            if (data.success && data.formUrl) {
                // Redirect to JCC Payment Page
                window.location.href = data.formUrl;
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
