
'use client';

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface JCCPaymentFormProps {
    orderId: string;
    amount: number;
    onSuccess: (result: any) => void;
    onCancel: () => void;
}

declare global {
    interface Window {
        PaymentForm: any;
    }
}

function addScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.setAttribute("src", src);
        script.addEventListener("load", () => resolve());
        script.addEventListener("error", reject);
        document.body.appendChild(script);
    });
}

export default function JCCPaymentForm({ orderId, amount, onSuccess, onCancel }: JCCPaymentFormProps) {
    const panRef = useRef<HTMLDivElement>(null);
    const expiryRef = useRef<HTMLDivElement>(null);
    const cvcRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const paymentFormRef = useRef<any>(null);

    useEffect(() => {
        const init = async () => {
            try {
                // Determine script URL based on environment
                const isTest = orderId.startsWith('TEST') || true; // Currently assuming test as per env
                const scriptUrl = "https://gateway-test.jcc.com.cy/payment/modules/multiframe/main.js";

                await addScript(scriptUrl);
                setSdkLoaded(true);

                if (!window.PaymentForm) {
                    throw new Error("JCC SDK failed to load");
                }

                paymentFormRef.current = new window.PaymentForm({
                    mdOrder: orderId,
                    containerClassName: "jcc-field-container",
                    apiContext: "/payment",
                    language: "en",
                    autoFocus: true,
                    showPanIcon: true,
                    panIconStyle: {
                        height: "16px",
                        top: "calc(50% - 8px)",
                        right: "8px",
                    },
                    fields: {
                        pan: {
                            container: panRef.current,
                        },
                        expiry: {
                            container: expiryRef.current,
                        },
                        cvc: {
                            container: cvcRef.current,
                        },
                    },
                    styles: {
                        base: {
                            padding: "8px 12px",
                            color: "#000",
                            fontSize: "16px",
                            fontFamily: "inherit",
                        },
                        invalid: {
                            color: "#ef4444",
                        },
                        placeholder: {
                            base: {
                                color: "#9ca3af",
                            }
                        }
                    },
                });

                await paymentFormRef.current.init();
                setLoading(false);
            } catch (err) {
                console.error("JCC Init Error:", err);
                toast.error("Failed to initialize payment form");
                setLoading(false);
            }
        };

        init();

        return () => {
            if (paymentFormRef.current) {
                paymentFormRef.current.destroy();
            }
        };
    }, [orderId]);

    const handlePay = async () => {
        if (!paymentFormRef.current) return;

        setPaying(true);
        try {
            const result = await paymentFormRef.current.doPayment({});
            onSuccess(result);
        } catch (err: any) {
            console.error("Payment Error:", err);
            toast.error(err.message || "Payment failed");
        } finally {
            setPaying(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Complete Payment</CardTitle>
                <div className="text-2xl font-bold">€{amount.toFixed(2)}</div>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Initializing secure payment...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Card Number</label>
                            <div ref={panRef} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Expiry Date</label>
                                <div ref={expiryRef} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">CVC</label>
                                <div ref={cvcRef} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" />
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
                <Button
                    className="w-full"
                    onClick={handlePay}
                    disabled={loading || paying}
                >
                    {paying ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        `Pay €${amount.toFixed(2)}`
                    )}
                </Button>
                <Button
                    variant="ghost"
                    className="w-full"
                    onClick={onCancel}
                    disabled={paying}
                >
                    Cancel
                </Button>
            </CardFooter>
            <style jsx global>{`
                .jcc-field-container iframe {
                    width: 100% !important;
                    height: 100% !important;
                }
            `}</style>
        </Card>
    );
}
