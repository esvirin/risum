import { NextResponse } from "next/server";
import { getAltegioCompanyProfile } from "@/lib/altegio-api";

export async function GET() {
  try {
    const data = await getAltegioCompanyProfile();
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown booking provider error";
    return NextResponse.json({ data: null, error: message }, { status: 502 });
  }
}
