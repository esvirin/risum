import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getReservationsForClass } from "@/lib/pushpress";
import { NextResponse } from "next/server";
import { captureException } from "@sentry/nextjs";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const classIds: string[] = body?.classIds;
    if (!Array.isArray(classIds) || classIds.length === 0) {
      return NextResponse.json({ error: "classIds required" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { pushPressId: true },
    });

    if (!user?.pushPressId) {
      return NextResponse.json({ error: "Member ID not found" }, { status: 404 });
    }

    // For this API, listing reservations requires calendarItemId (classId).
    // We query each class and filter by current customerId.
    const out: Record<string, { reservationId: string; status: string } | null> = {};

    await Promise.all(
      classIds.map(async (classId) => {
        try {
          const reservations = await getReservationsForClass(classId, 1, 50);
          const mine = reservations.find((r) => r.customerId === user.pushPressId);
          out[classId] = mine ? { reservationId: mine.id, status: mine.status } : null;
        } catch {
          out[classId] = null;
        }
      })
    );

    return NextResponse.json({ success: true, reservations: out });
  } catch (error) {
    captureException(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
