import { auth } from "@/lib/auth";
import { bookClass, getPushPressMemberByEmail } from "@/lib/pushpress";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { captureException } from "@sentry/nextjs";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { classId } = await req.json();
        if (!classId) return NextResponse.json({ error: "Class ID required" }, { status: 400 });

        // We need the PushPress Member ID to book
        // Optimization: Store PushPress ID in session or DB
        const user = await db.user.findUnique({
            where: { email: session.user.email },
            select: { pushPressId: true }
        });

        if (!user?.pushPressId) {
            return NextResponse.json({ error: "Member ID not found" }, { status: 404 });
        }

        const success = await bookClass(classId, user.pushPressId);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: "Booking failed" }, { status: 500 });
        }

    } catch (error) {
        captureException(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
