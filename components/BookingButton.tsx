"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BookingButtonProps {
    classId: string;
}

export default function BookingButton({ classId }: BookingButtonProps) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "booked">("idle");

    const handleBook = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/classes/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classId }),
            });

            if (res.ok) {
                setStatus("booked");
            } else {
                alert("Booking failed");
            }
        } catch (e) {
            alert("Error booking class");
        } finally {
            setLoading(false);
        }
    };

    if (status === "booked") {
        return (
            <Button disabled variant="outline" className="text-green-600 border-green-200 bg-green-50">
                Booked ✓
            </Button>
        );
    }

    return (
        <Button
            onClick={handleBook}
            disabled={loading}
            className="min-w-[100px]"
        >
            {loading ? "..." : "Book"}
        </Button>
    );
}
