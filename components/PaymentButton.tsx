"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PaymentButton() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleTopUp = async (amount: string) => {
    setLoading(amount);
    await new Promise((r) => setTimeout(r, 500));
    toast.success(`UI demo: top-up €${amount} prepared`);
    setLoading(null);
  };

  return (
    <div className="flex gap-2">
      <Button onClick={() => handleTopUp("10.00")} disabled={loading !== null} className="flex-1">
        {loading === "10.00" ? "..." : "Top Up €10"}
      </Button>
      <Button variant="outline" onClick={() => handleTopUp("50.00")} disabled={loading !== null} className="flex-1">
        {loading === "50.00" ? "..." : "Top Up €50"}
      </Button>
    </div>
  );
}
