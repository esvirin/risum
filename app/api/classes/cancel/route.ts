import { auth } from "@/lib/auth";
import { cancelReservation } from "@/lib/pushpress";
import { NextResponse } from "next/server";
import { captureException } from "@sentry/nextjs";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { reservationId } = await req.json();
        if (!reservationId) {
            return NextResponse.json({ error: "Reservation ID required" }, { status: 400 });
        }

        const success = await cancelReservation(reservationId);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: "Cancellation failed" }, { status: 500 });
        }

    } catch (error) {
        captureException(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
