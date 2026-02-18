import { NextResponse } from "next/server";
import { getAltegioSchedule } from "@/lib/altegio-api";

export async function GET() {
  try {
    const data = await getAltegioSchedule();
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Altegio error";
    return NextResponse.json({ data: [], error: message }, { status: 502 });
  }
}
