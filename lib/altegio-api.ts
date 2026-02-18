import "server-only";

type JsonRecord = Record<string, unknown>;

function envValue(key: string): string {
  const value = process.env[key];
  return typeof value === "string" ? value.trim() : "";
}

export type AltegioScheduleItem = {
  id: string;
  datetime: string;
  trainer: string;
  service: string;
};

export type AltegioTrainerItem = {
  id: string;
  name: string;
  specialization: string;
};

export type AltegioCompanyProfile = {
  title: string;
  address: string;
  phone: string;
  email: string;
  site: string;
  timezone: string;
  currency: string;
  lat: string;
  lon: string;
};

export type AltegioServiceItem = {
  id: string;
  title: string;
  category: string;
  priceFrom: string;
  priceTo: string;
};

export type AltegioBookformConfig = {
  url: string;
  lang: string;
  primaryPalette: string;
  accentPalette: string;
  mainColor: string;
  steps: Array<{ step: string; title: string; num: string }>;
};

function getBaseUrl(): string {
  const raw = envValue("ALTEGIO_API_BASE_URL") || "https://api.alteg.io";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

function resolveEndpoint(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http")) return pathOrUrl;

  const companyId = envValue("ALTEGIO_COMPANY_ID");
  const withCompany = pathOrUrl.replaceAll("{companyId}", companyId);
  const path = withCompany.startsWith("/") ? withCompany : `/${withCompany}`;
  const apiPath = path.startsWith("/api/") ? path : `/api/v1${path}`;
  return `${getBaseUrl()}${apiPath}`;
}

let cachedUserToken = "";
let cachedUserTokenAt = 0;

async function getUserTokenByLogin(partnerToken: string): Promise<string> {
  const now = Date.now();
  if (cachedUserToken && now - cachedUserTokenAt < 10 * 60 * 1000) {
    return cachedUserToken;
  }

  const login =
    envValue("ALTEGIO_USER_LOGIN") || envValue("ALTEGIO_API_LOGIN") || envValue("API_LOGIN");
  const password =
    envValue("ALTEGIO_USER_PASSWORD") || envValue("ALTEGIO_API_PASSWORD") || envValue("API_PASSWORD");

  if (!login || !password) return "";

  const authUrl = `${getBaseUrl()}/api/v1/auth`;
  const res = await fetch(authUrl, {
    method: "POST",
    headers: {
      Accept: "application/vnd.api.v2+json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${partnerToken}`,
    },
    body: JSON.stringify({ login, password }),
    cache: "no-store",
  });

  if (!res.ok) return "";
  const payload = (await res.json()) as JsonRecord;
  const data = (payload.data && typeof payload.data === "object" ? payload.data : {}) as JsonRecord;
  const token = asString(data.user_token);
  if (token) {
    cachedUserToken = token;
    cachedUserTokenAt = now;
  }
  return token;
}

async function getHeaders(): Promise<Headers> {
  const headers = new Headers();
  headers.set("Accept", "application/vnd.api.v2+json");

  const partnerToken =
    envValue("ALTEGIO_PARTNER_TOKEN") || envValue("ALTEGIO_API_TOKEN") || envValue("ALTEGIO_API_KEY");

  if (partnerToken) {
    const runtimeUserToken = await getUserTokenByLogin(partnerToken);
    const userToken = runtimeUserToken || envValue("ALTEGIO_USER_TOKEN") || "";
    if (userToken) {
      headers.set("Authorization", `Bearer ${partnerToken}, User ${userToken}`);
      return headers;
    }
    headers.set("Authorization", `Bearer ${partnerToken}`);
    headers.set("X-Partner-Token", partnerToken);
    return headers;
  }

  return headers;
}

async function altegioFetch(pathOrUrl: string): Promise<unknown> {
  const companyId = envValue("ALTEGIO_COMPANY_ID");
  const url = new URL(resolveEndpoint(pathOrUrl));
  if (companyId && !url.searchParams.has("company_id")) {
    url.searchParams.set("company_id", companyId);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: await getHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Booking provider request failed: ${res.status}`);
  }

  return res.json();
}

async function altegioFetchFirst(paths: string[]): Promise<unknown> {
  let lastError: Error | null = null;

  for (const p of paths) {
    try {
      return await altegioFetch(p);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown fetch error");
      if (!/404/.test(lastError.message)) {
        throw lastError;
      }
    }
  }

  throw lastError || new Error("Booking provider request failed");
}

function toArray(payload: unknown): JsonRecord[] {
  if (Array.isArray(payload)) return payload as JsonRecord[];
  if (payload && typeof payload === "object") {
    const record = payload as JsonRecord;
    const candidates = [record.data, record.result, record.items, record.records];
    for (const candidate of candidates) {
      if (Array.isArray(candidate)) return candidate as JsonRecord[];
    }
  }
  return [];
}

function toObject(payload: unknown): JsonRecord {
  if (payload && typeof payload === "object") {
    const record = payload as JsonRecord;
    if (record.data && typeof record.data === "object" && !Array.isArray(record.data)) {
      return record.data as JsonRecord;
    }
    return record;
  }
  return {};
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

function mapRecordsToSchedule(items: JsonRecord[]): AltegioScheduleItem[] {
  return items.slice(0, 8).map((item, idx) => ({
    id: asString(item.id) || `schedule-${idx + 1}`,
    datetime:
      asString(item.datetime) ||
      asString(item.start_time) ||
      asString(item.start) ||
      asString(item.date),
    trainer:
      asString(item.staff_name) ||
      asString(item.trainer_name) ||
      asString(item.master_name) ||
      asString(item.employee_name) ||
      asString((item.staff as JsonRecord | undefined)?.name),
    service:
      asString(item.service_name) ||
      asString(item.activity_name) ||
      asString(item.service) ||
      asString(item.title) ||
      asString(((item.services as JsonRecord[] | undefined)?.[0] || {}).title),
  }));
}

async function buildScheduleFromBookingData(): Promise<AltegioScheduleItem[]> {
  const [staffPayload, servicesPayload, datesPayload] = await Promise.all([
    altegioFetch("/book_staff/{companyId}"),
    altegioFetch("/book_services/{companyId}"),
    altegioFetch("/book_dates/{companyId}"),
  ]);

  const staff = toArray(staffPayload);
  const servicesRoot = toObject(servicesPayload);
  const services = Array.isArray(servicesRoot.services) ? (servicesRoot.services as JsonRecord[]) : [];
  const datesRoot = toObject(datesPayload);
  const bookingDays = (datesRoot.booking_days && typeof datesRoot.booking_days === "object" ? datesRoot.booking_days : {}) as JsonRecord;

  const now = new Date();
  const year = now.getFullYear();
  const dateList: Date[] = [];

  for (const [monthKey, daysRaw] of Object.entries(bookingDays)) {
    const month = Number(monthKey);
    if (!month || !Array.isArray(daysRaw)) continue;
    for (const d of daysRaw) {
      const day = Number(d);
      if (!day) continue;
      const date = new Date(year, month - 1, day, 10, 0, 0, 0);
      if (date.getTime() >= now.getTime()) dateList.push(date);
    }
  }

  dateList.sort((a, b) => a.getTime() - b.getTime());
  const times = [10, 13, 18];

  const result: AltegioScheduleItem[] = [];
  for (let i = 0; i < 8; i += 1) {
    const baseDate = dateList[i % Math.max(1, dateList.length)] || new Date(now.getTime() + (i + 1) * 86400000);
    const dt = new Date(baseDate);
    dt.setHours(times[i % times.length], 0, 0, 0);

    const coach = staff[i % Math.max(1, staff.length)] || {};
    const service = services[i % Math.max(1, services.length)] || {};

    result.push({
      id: `slot-${i + 1}`,
      datetime: dt.toISOString(),
      trainer: asString(coach.name) || "Coach",
      service: asString(service.title) || "Class",
    });
  }

  return result;
}

export async function getAltegioSchedule(): Promise<AltegioScheduleItem[]> {
  const endpoint = envValue("ALTEGIO_SCHEDULE_ENDPOINT");

  try {
    const payload = await altegioFetchFirst([
      ...(endpoint ? [endpoint] : []),
      "/records/{companyId}",
      "/records",
    ]);
    const items = toArray(payload);
    const mapped = mapRecordsToSchedule(items);
    if (mapped.length > 0) return mapped;
  } catch {
    // fall through to booking-data generation
  }

  return buildScheduleFromBookingData();
}

export async function getAltegioTrainers(): Promise<AltegioTrainerItem[]> {
  const endpoint = envValue("ALTEGIO_TRAINERS_ENDPOINT");
  const payload = await altegioFetchFirst([
    ...(endpoint ? [endpoint] : []),
    "/staff/{companyId}",
    "/staff",
  ]);
  const items = toArray(payload);

  return items.slice(0, 12).map((item, idx) => ({
    id: String(item.id ?? `trainer-${idx + 1}`),
    name:
      asString(item.name) ||
      asString(item.full_name) ||
      asString(item.title) ||
      asString(item.first_name),
    specialization:
      asString(item.specialization) ||
      asString(item.position) ||
      asString(item.description) ||
      asString(item.role),
  }));
}

export async function getAltegioCompanyProfile(): Promise<AltegioCompanyProfile> {
  const endpoint = envValue("ALTEGIO_COMPANY_ENDPOINT") || "/company/{companyId}";
  const item = toObject(await altegioFetch(endpoint));

  return {
    title: asString(item.public_title) || asString(item.title),
    address: asString(item.address),
    phone: asString(item.phone),
    email: asString(item.email),
    site: asString(item.site),
    timezone: asString(item.timezone_name),
    currency: asString(item.currency_short_title),
    lat: String(item.coordinate_lat ?? ""),
    lon: String(item.coordinate_lon ?? ""),
  };
}

export async function getAltegioBookformConfig(): Promise<AltegioBookformConfig> {
  const endpoint = envValue("ALTEGIO_BOOKFORM_ENDPOINT") || "/bookform/{companyId}";
  const item = toObject(await altegioFetch(endpoint));
  const style = (item.style && typeof item.style === "object" ? item.style : {}) as JsonRecord;
  const rawSteps = Array.isArray(item.steps) ? (item.steps as JsonRecord[]) : [];

  return {
    url: asString(item.url),
    lang: asString(item.lang),
    primaryPalette: asString(style.primaryPalette),
    accentPalette: asString(style.accentPalette),
    mainColor: asString(style.main_color),
    steps: rawSteps.map((s) => ({
      step: asString(s.step),
      title: asString(s.title),
      num: String(s.num ?? ""),
    })),
  };
}

export async function getAltegioServices(): Promise<AltegioServiceItem[]> {
  const categoriesPayload = await altegioFetch(envValue("ALTEGIO_SERVICE_CATEGORIES_ENDPOINT") || "/service_categories/{companyId}");
  const servicesPayload = await altegioFetch(envValue("ALTEGIO_SERVICES_ENDPOINT") || "/services/{companyId}");

  const categories = toArray(categoriesPayload);
  const services = toArray(servicesPayload);

  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const key = String(cat.id ?? "");
    categoryMap.set(key, asString(cat.title));
  }

  return services.slice(0, 30).map((item, idx) => {
    const categoryId = String(item.category_id ?? "");
    const priceMin = asNumber(item.price_min);
    const priceMax = asNumber(item.price_max);

    return {
      id: String(item.id ?? `service-${idx + 1}`),
      title: asString(item.booking_title) || asString(item.title) || `Service ${idx + 1}`,
      category: categoryMap.get(categoryId) || "",
      priceFrom: priceMin > 0 ? String(priceMin) : "",
      priceTo: priceMax > 0 ? String(priceMax) : "",
    };
  });
}
