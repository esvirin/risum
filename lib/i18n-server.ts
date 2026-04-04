import { cookies, headers } from "next/headers";
import { defaultLocale, localeCookieKey, type Locale } from "@/lib/i18n";

function isLocale(value: string | undefined | null): value is Locale {
  return value === "ru" || value === "en";
}

export async function resolveRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookieKey)?.value;

  if (isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language")?.toLowerCase() || "";

  if (acceptLanguage.startsWith("ru")) {
    return "ru";
  }

  if (acceptLanguage.startsWith("en")) {
    return "en";
  }

  return defaultLocale;
}
