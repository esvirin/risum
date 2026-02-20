import "server-only";

type JsonRecord = Record<string, unknown>;

function envValue(key: string): string {
  const value = process.env[key];
  return typeof value === "string" ? value.trim() : "";
}

function getCompanyId(): string {
  const raw = envValue("ALTEGIO_COMPANY_ID");
  return raw;
}

export type AltegioScheduleItem = {
  id: string;
  datetime: string;
  trainer: string;
  service: string;
  clientsCount?: number;
  capacity?: number;
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

  const companyId = getCompanyId();
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

  const login = envValue("ALTEGIO_USER_LOGIN");
  const password = envValue("ALTEGIO_USER_PASSWORD");

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

  const partnerToken = envValue("ALTEGIO_PARTNER_TOKEN");

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
  const companyId = getCompanyId();
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
  return items
    .slice(0, 30)
    .map((item, idx) => ({
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
      clientsCount: typeof item.clients_count === "number" ? item.clients_count : undefined,
      capacity: typeof item.capacity === "number" ? item.capacity : undefined,
      waitingListCount:
        typeof item.waiting_list_count === "number"
          ? item.waiting_list_count
          : typeof item.waiting_count === "number"
            ? item.waiting_count
            : undefined,
    }))
    .filter((item) => {
      if (!(item.datetime && item.trainer && item.service)) return false;
      const ts = new Date(item.datetime).getTime();
      return Number.isFinite(ts) && ts >= Date.now();
    });
}

function mapTimetableAttendanceToSchedule(payload: unknown): AltegioScheduleItem[] {
  if (!payload || typeof payload !== "object") return [];
  const root = payload as JsonRecord;
  const included = Array.isArray(root.included) ? (root.included as JsonRecord[]) : [];

  const staffMap = new Map<string, string>();
  const serviceMap = new Map<string, string>();

  for (const item of included) {
    const type = asString(item.type);
    const id = String(item.id ?? "");
    const attributes = (item.attributes && typeof item.attributes === "object" ? item.attributes : {}) as JsonRecord;

    if (type === "staff" && id) {
      const name = asString(attributes.name);
      if (name) staffMap.set(id, name);
    }

    if (type === "service" && id) {
      const title = asString(attributes.title);
      if (title) serviceMap.set(id, title);
    }
  }

  const activities = included.filter((item) => asString(item.type) === "activity");

  return activities
    .map((item, idx) => {
      const id = String(item.id ?? `activity-${idx + 1}`);
      const attributes = (item.attributes && typeof item.attributes === "object" ? item.attributes : {}) as JsonRecord;
      const relationships = (item.relationships && typeof item.relationships === "object" ? item.relationships : {}) as JsonRecord;

      const relMaster = (relationships.master && typeof relationships.master === "object" ? (relationships.master as JsonRecord).data : null) as JsonRecord | null;
      const relService = (relationships.service && typeof relationships.service === "object" ? (relationships.service as JsonRecord).data : null) as JsonRecord | null;

      const masterId = String((relMaster && relMaster.id) ?? attributes.master_id ?? attributes.staff_id ?? "");
      const serviceId = String((relService && relService.id) ?? attributes.service_id ?? "");

      const datetime = asString(attributes.date);
      const trainer = staffMap.get(masterId) || "";
      const service = serviceMap.get(serviceId) || "";
      const clientsCount = typeof attributes.clients_count === "number" ? attributes.clients_count : undefined;
      const capacity = typeof attributes.capacity === "number" ? attributes.capacity : undefined;
      const waitingListCount =
        typeof attributes.waiting_list_count === "number"
          ? attributes.waiting_list_count
          : typeof attributes.waiting_count === "number"
            ? attributes.waiting_count
            : undefined;

      return { id, datetime, trainer, service, clientsCount, capacity, waitingListCount };
    })
    .filter((item) => {
      if (!(item.datetime && item.trainer && item.service)) return false;
      const ts = new Date(item.datetime).getTime();
      return Number.isFinite(ts) && ts >= Date.now();
    })
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
    .slice(0, 30);
}

export async function getAltegioSchedule(): Promise<AltegioScheduleItem[]> {
  const endpoint = envValue("ALTEGIO_SCHEDULE_ENDPOINT");

  const today = new Date();
  const dates: string[] = [];
  for (let i = 0; i < 14; i += 1) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }

  const params = new URLSearchParams();
  for (const date of dates) params.append("dates[]", date);
  params.append("attendance_for_week", "1");
  ["activities", "activities.service", "activities.master"].forEach((include) => params.append("include[]", include));

  try {
    const attendancePayload = await altegioFetch(`/company/{companyId}/timetable/attendance_day?${params.toString()}`);
    const fromAttendance = mapTimetableAttendanceToSchedule(attendancePayload);
    if (fromAttendance.length > 0) return fromAttendance;
  } catch {
    // try records fallback below
  }

  try {
    const payload = await altegioFetchFirst([
      ...(endpoint ? [endpoint] : []),
      "/records/{companyId}",
      "/records",
    ]);
    const mapped = mapRecordsToSchedule(toArray(payload));
    if (mapped.length > 0) return mapped;
  } catch {
    // no fallback mocks, real data only
  }

  return [];
}

export async function getAltegioTrainers(): Promise<AltegioTrainerItem[]> {
  const endpoint = envValue("ALTEGIO_TRAINERS_ENDPOINT");
  const payload = await altegioFetchFirst([
    ...(endpoint ? [endpoint] : []),
    "/staff/{companyId}",
    "/staff",
  ]);
  const items = toArray(payload);

  return items
    .slice(0, 12)
    .map((item, idx) => ({
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
    }))
    .filter((item) => item.name);
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

  return services
    .slice(0, 30)
    .map((item, idx) => {
      const categoryId = String(item.category_id ?? "");
      const priceMin = asNumber(item.price_min);
      const priceMax = asNumber(item.price_max);

      return {
        id: String(item.id ?? `service-${idx + 1}`),
        title: asString(item.booking_title) || asString(item.title),
        category: categoryMap.get(categoryId) || "",
        priceFrom: priceMin > 0 ? String(priceMin) : "",
        priceTo: priceMax > 0 ? String(priceMax) : "",
      };
    })
    .filter((item) => item.title);
}
