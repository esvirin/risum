
import { auth } from "@/lib/auth";
import { registerOrder } from "@/lib/jcc-gateway";
import { NextResponse } from "next/server";
import { captureException } from "@sentry/nextjs";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amount, description, planId, type = 'PLAN' } = await req.json();

        if (!amount) {
            return NextResponse.json({ error: "Amount required" }, { status: 400 });
        }

        // Generate a unique order number
        const prefix = type === 'TOPUP' ? 'TOP' : 'PLN';
        const orderNumber = `${prefix}-${planId || 'MISC'}-${Date.now()}`;

        // In a real app, the returnUrl should be a page that handles the successful payment UI
        const returnUrl = `${new URL(req.url).origin}/cabinet/plans?orderNumber=${orderNumber}`;

        const response = await registerOrder({
            amount: Math.round(amount * 100), // convert to cents
            orderNumber,
            returnUrl,
            description: description || (type === 'TOPUP' ? "Wallet Top-up" : "Plan Purchase"),
            jsonParams: JSON.stringify({ type, planId, userId: session.user.id })
        });

        if (response.orderId) {
            return NextResponse.json({
                success: true,
                orderId: response.orderId,
                orderNumber,
                formUrl: response.formUrl,
            });
        } else {
            return NextResponse.json({
                success: false,
                error: response.errorMessage || "Failed to register order",
                errorCode: response.errorCode,
            }, { status: 400 });
        }

    } catch (error) {
        captureException(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
