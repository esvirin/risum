import { NextResponse } from "next/server";
import { getAltegioBookformConfig } from "@/lib/altegio-api";

export async function GET() {
  try {
    const data = await getAltegioBookformConfig();
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Altegio error";
    return NextResponse.json({ data: null, error: message }, { status: 502 });
  }
}
