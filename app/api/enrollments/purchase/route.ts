import { auth } from "@/lib/auth";
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

        const { planId, paymentMethodId } = await req.json();
        if (!planId) {
            return NextResponse.json({ error: "Plan ID required" }, { status: 400 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
            select: { pushPressId: true }
        });

        if (!user?.pushPressId) {
            return NextResponse.json({ error: "Member ID not found" }, { status: 404 });
        }

        const enrollment = await createEnrollment(user.pushPressId, planId, paymentMethodId);

        if (enrollment) {
            return NextResponse.json({
                success: true,
                enrollment: {
                    id: enrollment.id,
                    status: enrollment.status,
                    planId: enrollment.planId
                }
            });
        } else {
            return NextResponse.json({ error: "Enrollment failed" }, { status: 500 });
        }

    } catch (error) {
        captureException(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
