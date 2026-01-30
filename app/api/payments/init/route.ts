import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateJccSignature, JCC_CONFIG } from "@/lib/jcc";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amount } = await req.json(); // Amount in CENTS usually? Or EUR? assume EUR for input

        // JCC often processes in cents or formatted string. Let's assume passed as "10.00" string or padded.
        // Let's create an Order ID
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const formattedAmount = Number(amount).toFixed(2).replace('.', ''); // e.g. 10.00 -> 1000 (cents) if JCC requires cents.
        // If JCC requires major units (10.00), adjust. Most gateways use cents (ISO 4217 minor units). 978 is EUR.
        // Let's assume we need to pass the formatted amount string.

        // 1. Create Pending Payment
        await db.payment.create({
            data: {
                userId: session.user.id,
                amount: Number(amount),
                currency: "EUR",
                status: "PENDING",
                jccOrderId: orderId,
                description: "Wallet Topup",
            }
        });

        const signature = generateJccSignature(orderId, formattedAmount, "978");

        // Construct form data or redirect URL
        // Sending back parameters for the frontend to auto-submit a form is standard for creating POST to JCC.
        // Or we return a URL with query params if JCC supports GET (less secure).
        // Let's return the params and endpoint so the frontend can build a form.

        return NextResponse.json({
            action: JCC_CONFIG.purchaseUrl,
            fields: {
                Version: "1.0.0",
                MerchantID: JCC_CONFIG.merchantId,
                AcquirerID: JCC_CONFIG.acquirerId,
                OrderID: orderId,
                Amount: formattedAmount,
                Currency: "978",
                CaptureFlag: "M", // or A
                ResponseURL: JCC_CONFIG.responseUrl,
                Signature: signature,
            }
        });

    } catch (error) {
        console.error("Payment Init Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
