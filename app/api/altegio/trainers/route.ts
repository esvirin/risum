import { NextResponse } from "next/server";
import { getAltegioTrainers } from "@/lib/altegio-api";

const mockTrainers = [
  { id: "m1", name: "Анна Королёва", specialization: "Pilates Reformer Coach" },
  { id: "m2", name: "Дмитрий Орлов", specialization: "Strength & Mobility Coach" },
  { id: "m3", name: "Екатерина Левина", specialization: "Stretching & Recovery Coach" },
];

export async function GET() {
  try {
    const data = await getAltegioTrainers();
    if (Array.isArray(data) && data.length > 0) {
      return NextResponse.json({ data, source: "api" });
    }
    return NextResponse.json({ data: mockTrainers, source: "mock" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown booking provider error";
    return NextResponse.json({ data: mockTrainers, source: "mock", warning: message });
  }
}
