import { NextResponse } from "next/server";
import { getAltegioServices } from "@/lib/altegio-api";

export async function GET() {
  try {
    const data = await getAltegioServices();
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown booking provider error";
    return NextResponse.json({ data: [], error: message }, { status: 502 });
  }
}
