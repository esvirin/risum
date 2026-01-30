"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PaymentButton() {
    const [loading, setLoading] = useState(false);

    const handlePayment = async (amount: string) => {
        setLoading(true);
        try {
            const res = await fetch("/api/payments/init", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });
            const data = await res.json();
            if (data.redirectUrl) {
                // Create a hidden form and submit it to JCC
                const form = document.createElement("form");
                form.method = "POST";
                form.action = data.redirectUrl;

                // Add all parameters required by JCC
                Object.keys(data.params).forEach(key => {
                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.name = key;
                    input.value = data.params[key];
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();
            } else {
                alert("Payment initiation failed");
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert("Error");
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Button
                onClick={() => handlePayment("10.00")}
                disabled={loading}
            >
                {loading ? "Processing..." : "Top Up €10"}
            </Button>
            <Button
                variant="outline"
                onClick={() => handlePayment("50.00")}
                disabled={loading}
            >
                {loading ? "Processing..." : "Top Up €50"}
            </Button>
        </div>
    );
}
