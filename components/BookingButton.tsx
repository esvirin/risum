"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingButton({ classId }: { classId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleBook = async () => {
        setLoading(true);
        setStatus('idle');

        try {
            const res = await fetch("/api/classes/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classId }),
            });

            if (!res.ok) throw new Error("Failed");

            setStatus('success');
            router.refresh(); // Refresh server data
        } catch (e) {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'success') {
        return <button className="btn btn-secondary" disabled>Booked ✓</button>;
    }

    return (
        <button
            onClick={handleBook}
            className="btn btn-primary"
            disabled={loading}
        >
            {loading ? "..." : "Book"}
        </button>
    );
}
