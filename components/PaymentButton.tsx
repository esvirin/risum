"use client";

import { useState } from "react";

export default function PaymentButton() {
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        setLoading(true);
        try {
            // 1. Init payment on server
            const res = await fetch("/api/payments/init", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 10 }) // Mock 10 EUR
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // 2. Create hidden form and submit to JCC
            const form = document.createElement("form");
            form.method = "POST";
            form.action = data.action;

            Object.entries(data.fields).forEach(([key, val]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = val as string;
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();

        } catch (error) {
            alert("Payment failed initialization");
            setLoading(false);
        }
    };

    return (
        <button onClick={handlePay} className="btn btn-primary full" disabled={loading}>
            {loading ? "Redirecting to JCC..." : "Pay / Top Up"}
        </button>
    );
}
