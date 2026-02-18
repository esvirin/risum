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

function getBaseUrl(): string {
  const raw = process.env.ALTEGIO_API_BASE_URL || "https://api.alteg.io";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

function resolveEndpoint(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http")) return pathOrUrl;

  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  const apiPath = path.startsWith("/api/") ? path : `/api/v1${path}`;
  return `${getBaseUrl()}${apiPath}`;
}

function getHeaders(): Headers {
  const headers = new Headers();
  headers.set("Accept", "application/json");

  const partnerToken =
    process.env.ALTEGIO_PARTNER_TOKEN || process.env.ALTEGIO_API_TOKEN || process.env.ALTEGIO_API_KEY;
  const userToken = process.env.ALTEGIO_USER_TOKEN;

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
    throw new Error(`Altegio request failed: ${res.status}`);
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

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function getAltegioSchedule(): Promise<AltegioScheduleItem[]> {
  const endpoint = process.env.ALTEGIO_SCHEDULE_ENDPOINT || "/bookings";
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
  const endpoint = process.env.ALTEGIO_TRAINERS_ENDPOINT || "/staff";
  const payload = await altegioFetch(endpoint);
  const items = toArray(payload);

  return items.slice(0, 12).map((item, idx) => ({
    id: asString(item.id) || `trainer-${idx + 1}`,
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
