import { NextResponse } from "next/server";
import { getAltegioSchedule } from "@/lib/altegio-api";

const mockSchedule = [
  { id: "s1", datetime: "2026-02-19T10:00:00+02:00", trainer: "Анна Королёва", service: "Pilates Reformer Intro" },
  { id: "s2", datetime: "2026-02-19T13:00:00+02:00", trainer: "Дмитрий Орлов", service: "Functional Core" },
  { id: "s3", datetime: "2026-02-19T18:00:00+02:00", trainer: "Екатерина Левина", service: "Stretching Class" },
  { id: "s4", datetime: "2026-02-20T10:00:00+02:00", trainer: "Анна Королёва", service: "Pilates Reformer Flow" },
  { id: "s5", datetime: "2026-02-20T17:00:00+02:00", trainer: "Дмитрий Орлов", service: "Personal Training" },
];

export async function GET() {
  try {
    const data = await getAltegioSchedule();
    if (Array.isArray(data) && data.length > 0) {
      return NextResponse.json({ data, source: "api" });
    }
    return NextResponse.json({ data: mockSchedule, source: "mock" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown booking provider error";
    return NextResponse.json({ data: mockSchedule, source: "mock", warning: message });
  }
}
