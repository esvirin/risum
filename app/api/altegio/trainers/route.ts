import { NextResponse } from "next/server";
import { getAltegioTrainers } from "@/lib/altegio-api";

export async function GET() {
  try {
    const data = await getAltegioTrainers();
    return NextResponse.json({ data, source: "api" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown booking provider error";
    return NextResponse.json({ data: [], source: "api", error: message }, { status: 502 });
  }
}
