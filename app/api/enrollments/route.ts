import { auth } from "@/lib/auth";
import { getEnrollments } from "@/lib/pushpress";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { captureException } from "@sentry/nextjs";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
            select: { pushPressId: true }
        });

        if (!user?.pushPressId) {
            return NextResponse.json({ error: "Member ID not found" }, { status: 404 });
        }

        const enrollments = await getEnrollments(user.pushPressId, 'active');

        return NextResponse.json({ enrollments });

    } catch (error) {
        captureException(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
