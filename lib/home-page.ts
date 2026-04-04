import type { StaticScheduleItem } from "@/lib/static-schedule";

export type Mode = "group" | "private";

export type PriceCard = {
  id: string;
  label?: string;
  title: string;
  price: string;
  unitPrice?: string;
  note?: string;
  mode: Mode;
};

export type HomeLiteCopy = {
  title: string;
  lead: string;
  instructors: string;
  join: string;
  group: string;
  private: string;
  pricesTitle: string;
  groupLessons: string;
  privateLessons: string;
  close: string;
  easy: string;
  phone: string;
  address: string;
  email: string;
  priceCards: ReadonlyArray<{
    id: string;
    title: string;
    price: string;
    unitPrice?: string;
    note?: string;
    mode: Mode;
  }>;
};

export type TrainerCard = {
  name: string;
  image: string;
};

export type ScheduleDay = {
  key: string;
  items: StaticScheduleItem[];
};

export const trainers: TrainerCard[] = [
  { name: "Olga", image: "/wfolio/olga.jpg" },
  { name: "Svetlana", image: "/wfolio/svetlana.jpg" },
  { name: "Konstantina", image: "/wfolio/konstantina.jpg" },
  { name: "Christina", image: "/wfolio/christina.jpg" },
];

export const studioSlides = [
  "/instagram/fit-1.jpg",
  "/instagram/fit-2.jpg",
];

export const heroHighlights = [
  "Boutique studio",
  "Private coaching",
  "Small groups",
];

export const privateBookingMessage = "Для бронирования индивидуального занятия свяжитесь с нашим администратором.";
export const privateBookingPhone = "+357 95505556";
export const contactPhoneHref = "tel:+35795505556";
export const whatsappHref = "https://wa.me/35795505556";

export function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatLocalizedDay(value: string, locale: "ru" | "en") {
  const dtLocale = locale === "ru" ? "ru-RU" : "en-US";
  return new Intl.DateTimeFormat(dtLocale, {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function getScheduleHeading() {
  return "Reformer Pilates & Stretching";
}

export function getLocalDateKey(dateValue: string | number | Date) {
  const d = new Date(dateValue);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getTrainerName(value: string) {
  return value.split("·")[0]?.trim() || value;
}

export function getRoomName(value: string) {
  return value.split("·")[1]?.trim() || "Studio";
}

export function getRoomShortLabel(value: string) {
  const room = getRoomName(value).toLowerCase();
  const match = room.match(/room\s+([12])/);
  return match ? `Room ${match[1]}` : null;
}

export function getCardService(service: string) {
  return service === "Reformer Pilates" ? null : service;
}
