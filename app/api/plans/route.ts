import { auth } from "@/lib/auth";
import { getPlans } from "@/lib/pushpress";
import { NextResponse } from "next/server";
import { captureException } from "@sentry/nextjs";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const plans = await getPlans();

        return NextResponse.json({ plans });

    } catch (error) {
        captureException(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
