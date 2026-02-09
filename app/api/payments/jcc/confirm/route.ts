
import { auth } from "@/lib/auth";
import { getOrderStatus } from "@/lib/jcc-gateway";
import { createEnrollment } from "@/lib/pushpress";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { captureException } from "@sentry/nextjs";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { orderId, planId: bodyPlanId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ error: "Order ID required" }, { status: 400 });
        }

        const statusResponse = await getOrderStatus(orderId);

        // Extract planId from orderNumber if not provided or to be sure
        // OrderNumber format: PLN-planId-timestamp or TOP-TOPUP-timestamp
        const orderParts = statusResponse.orderNumber?.split('-') || [];
        const planId = bodyPlanId || (orderParts.length > 2 ? orderParts.slice(1, -1).join('-') : orderParts[1]);

        if (!planId) {
            return NextResponse.json({ error: "Could not determine Plan ID" }, { status: 400 });
        }

        // JCC ResponseCode 0 usually means success
        // statusResponse.orderStatus: 2 means deposited/completed
        if (statusResponse.orderStatus === 2 || statusResponse.orderStatus === 1) {
            // Find user
            const user = await db.user.findUnique({
                where: { email: session.user.email },
                select: { id: true, pushPressId: true }
            });

            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            if (!user.pushPressId) {
                return NextResponse.json({ error: "Member ID not found" }, { status: 404 });
            }

            // Create enrollment in PushPress
            let enrollment = null;
            try {
                enrollment = await createEnrollment(user.pushPressId, planId);
            } catch (err) {
                console.error("PushPress Enrollment Failed:", err);
                // We continue to record payment because the user has already paid via JCC
            }

            // Record payment in DB
            const amount = statusResponse.amount / 100;
            await db.payment.create({
                data: {
                    userId: user.id,
                    amount: amount,
                    status: "COMPLETED",
                    jccOrderId: orderId,
                    jccReference: statusResponse.approvalCode,
                    description: `Plan Purchase: ${planId}${enrollment ? '' : ' - Auto-Enrollment Failed'}`
                }
            });

            return NextResponse.json({
                success: true,
                type: 'PLAN',
                enrollment,
                warning: !enrollment ? "Payment successful but automatic enrollment failed. Please contact support." : undefined
            });
        } else {
            // Log the failure reason for debugging but don't spam
            console.warn(`[CONFIRM] Payment declined/failed. Status: ${statusResponse.orderStatus}, Code: ${statusResponse.actionCode}, Message: ${statusResponse.displayErrorMessage}`);

            return NextResponse.json({
                success: false,
                error: statusResponse.displayErrorMessage || "Payment not completed or declined",
                status: statusResponse.orderStatus,
                details: statusResponse.actionCodeDescription
            }, { status: 200 });
        }

    } catch (error) {
        console.error("Confirmation Error:", error);
        captureException(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
