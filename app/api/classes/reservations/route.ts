import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getReservationsForClass } from "@/lib/pushpress";
import { NextResponse } from "next/server";
import { captureException } from "@sentry/nextjs";

type ReservationMap = Record<string, { reservationId: string; status: string } | null>;

function uniqStrings(xs: unknown): string[] {
  if (!Array.isArray(xs)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of xs) {
    if (typeof x !== "string") continue;
    const s = x.trim();
    if (!s) continue;
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

async function asyncPool<T>(poolLimit: number, tasks: Array<() => Promise<T>>): Promise<T[]> {
  const ret: T[] = [];
  const executing = new Set<Promise<void>>();

  for (const task of tasks) {
    const p = (async () => {
      const r = await task();
      ret.push(r);
    })();

    const e: Promise<void> = p.then(() => void executing.delete(e)).catch(() => void executing.delete(e));
    executing.add(e);

    if (executing.size >= poolLimit) {
      await Promise.race(executing);
    }
  }

  await Promise.allSettled(Array.from(executing));
  return ret;
}

export async function POST(req: Request) {
  const out: ReservationMap = {};

  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const classIds = uniqStrings((body as any)?.classIds);

    if (classIds.length === 0) {
      return NextResponse.json({ success: true, reservations: out });
    }

    // Hard cap to protect the server (avoid OOM / signal 9)
    const capped = classIds.slice(0, 30);

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { pushPressId: true },
    });

    if (!user?.pushPressId) {
      // Don't 500 here; caller can still render schedule with no booked state.
      return NextResponse.json({ success: true, reservations: out });
    }

    // Initialize all to null so we always return a full map.
    for (const id of capped) out[id] = null;

    // Limit concurrency to reduce PushPress load and avoid killing the dev server.
    const tasks = capped.map((classId) => async () => {
      try {
        const reservations = await getReservationsForClass(classId, 1, 50);
        const mine = reservations.find((r) => r.customerId === user.pushPressId);
        out[classId] = mine ? { reservationId: mine.id, status: mine.status } : null;
      } catch {
        out[classId] = null;
      }
      return true;
    });

    await asyncPool(3, tasks);

    return NextResponse.json({ success: true, reservations: out });
  } catch (error) {
    // Stabilize: never return 500 to the client for this endpoint.
    captureException(error);
    return NextResponse.json({ success: true, reservations: out });
  }
}
