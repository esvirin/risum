
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
        const planId = bodyPlanId || orderParts[1];

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
            const enrollment = await createEnrollment(user.pushPressId, planId);

            if (enrollment) {
                // Record payment in DB
                const amount = statusResponse.amount / 100;
                await db.payment.create({
                    data: {
                        userId: user.id,
                        amount: amount,
                        status: "COMPLETED",
                        jccOrderId: orderId,
                        jccReference: statusResponse.approvalCode,
                        description: `Plan Purchase: ${planId}`
                    }
                });

                return NextResponse.json({
                    success: true,
                    type: 'PLAN',
                    enrollment
                });
            } else {
                return NextResponse.json({ error: "Enrollment failed after successful payment. Please contact support." }, { status: 500 });
            }
        } else {
            return NextResponse.json({
                success: false,
                error: "Payment not completed",
                status: statusResponse.orderStatus
            }, { status: 400 });
        }

    } catch (error) {
        captureException(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
