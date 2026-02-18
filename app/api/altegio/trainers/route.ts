import { NextResponse } from "next/server";
import { getAltegioTrainers } from "@/lib/altegio-api";

export async function GET() {
  try {
    const data = await getAltegioTrainers();
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown booking provider error";
    return NextResponse.json({ data: [], error: message }, { status: 502 });
  }
}
