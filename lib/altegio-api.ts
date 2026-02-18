import "server-only";

type JsonRecord = Record<string, unknown>;

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
  const raw = process.env.ALTEGIO_API_BASE_URL || "https://api.alteg.io";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

function resolveEndpoint(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http")) return pathOrUrl;

  const companyId = process.env.ALTEGIO_COMPANY_ID || "";
  const withCompany = pathOrUrl.replaceAll("{companyId}", companyId);
  const path = withCompany.startsWith("/") ? withCompany : `/${withCompany}`;
  const apiPath = path.startsWith("/api/") ? path : `/api/v1${path}`;
  return `${getBaseUrl()}${apiPath}`;
}

function getHeaders(): Headers {
  const headers = new Headers();
  headers.set("Accept", "application/vnd.api.v2+json");

  const partnerToken =
    process.env.ALTEGIO_PARTNER_TOKEN || process.env.ALTEGIO_API_TOKEN || process.env.ALTEGIO_API_KEY;
  const userToken = process.env.ALTEGIO_USER_TOKEN;

  if (partnerToken && userToken) {
    headers.set("Authorization", `Bearer ${partnerToken}, User ${userToken}`);
    return headers;
  }

  if (partnerToken) {
    headers.set("Authorization", `Bearer ${partnerToken}`);
    headers.set("X-Partner-Token", partnerToken);
  }
  if (userToken) {
    headers.set("X-User-Token", userToken);
  }
  if (partnerToken || userToken) return headers;

  const login =
    process.env.ALTEGIO_USER_LOGIN || process.env.ALTEGIO_API_LOGIN || process.env.API_LOGIN;
  const password =
    process.env.ALTEGIO_USER_PASSWORD || process.env.ALTEGIO_API_PASSWORD || process.env.API_PASSWORD;
  if (login && password) {
    const basic = Buffer.from(`${login}:${password}`).toString("base64");
    headers.set("Authorization", `Basic ${basic}`);
  }

  return headers;
}

async function altegioFetch(pathOrUrl: string): Promise<unknown> {
  const companyId = process.env.ALTEGIO_COMPANY_ID;
  const url = new URL(resolveEndpoint(pathOrUrl));
  if (companyId && !url.searchParams.has("company_id")) {
    url.searchParams.set("company_id", companyId);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Booking provider request failed: ${res.status}`);
  }

  return res.json();
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

export async function getAltegioSchedule(): Promise<AltegioScheduleItem[]> {
  const endpoint = process.env.ALTEGIO_SCHEDULE_ENDPOINT || "/records/{companyId}";
  const payload = await altegioFetch(endpoint);
  const items = toArray(payload);

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
      asString(item.employee_name),
    service:
      asString(item.service_name) ||
      asString(item.activity_name) ||
      asString(item.service) ||
      asString(item.title),
  }));
}

export async function getAltegioTrainers(): Promise<AltegioTrainerItem[]> {
  const endpoint = process.env.ALTEGIO_TRAINERS_ENDPOINT || "/staff/{companyId}";
  const payload = await altegioFetch(endpoint);
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
  const endpoint = process.env.ALTEGIO_COMPANY_ENDPOINT || "/company/{companyId}";
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
  const endpoint = process.env.ALTEGIO_BOOKFORM_ENDPOINT || "/bookform/{companyId}";
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
  const categoriesPayload = await altegioFetch(process.env.ALTEGIO_SERVICE_CATEGORIES_ENDPOINT || "/service_categories/{companyId}");
  const servicesPayload = await altegioFetch(process.env.ALTEGIO_SERVICES_ENDPOINT || "/services/{companyId}");

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
