import { headers } from "next/headers";

export type BookingDeviceType = "desktop" | "mobile";

const MOBILE_USER_AGENT_RE =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i;

export async function detectBookingDevice(): Promise<BookingDeviceType> {
  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent") || "";

  return MOBILE_USER_AGENT_RE.test(userAgent) ? "mobile" : "desktop";
}
