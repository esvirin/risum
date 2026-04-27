export type ScheduleMode = "group" | "private";

export type StaticScheduleItem = {
  id: string;
  datetime: string;
  trainer: string;
  service: string;
  mode: ScheduleMode;
  clientsCount?: number;
  capacity?: number;
};

export const BOOKING_URL = process.env.BOOKING_WEB_URL || "/"

type ScheduleTemplateItem = {
  id: string;
  weekday: number;
  hour: number;
  minute: number;
  trainer: string;
  service: string;
  mode: ScheduleMode;
  clientsCount?: number;
  capacity?: number;
};

const scheduleTemplate: ScheduleTemplateItem[] = [
  { id: "r1-mon-0705", weekday: 1, hour: 7, minute: 5, trainer: "Konstantina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 8 },
  { id: "r1-mon-0830", weekday: 1, hour: 8, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "r1-mon-0930", weekday: 1, hour: 9, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "r1-mon-1030", weekday: 1, hour: 10, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 10 },
  { id: "r1-mon-1130", weekday: 1, hour: 11, minute: 30, trainer: "Konstantina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r1-mon-1230", weekday: 1, hour: 12, minute: 30, trainer: "Olga · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r1-mon-1330", weekday: 1, hour: 13, minute: 30, trainer: "Olga · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r1-mon-1730", weekday: 1, hour: 17, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "r1-mon-1830", weekday: 1, hour: 18, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "p-mon-1500", weekday: 1, hour: 15, minute: 0, trainer: "Olga · Private Studio", service: "One-on-one training", mode: "private", clientsCount: 1, capacity: 1 },
  { id: "r1-tue-0705", weekday: 2, hour: 7, minute: 5, trainer: "Konstantina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 8 },
  { id: "r1-tue-0830", weekday: 2, hour: 8, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "r1-tue-0930", weekday: 2, hour: 9, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "r1-tue-1030", weekday: 2, hour: 10, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 10 },
  { id: "r1-tue-1130", weekday: 2, hour: 11, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 10 },
  { id: "r1-tue-1230", weekday: 2, hour: 12, minute: 30, trainer: "Kristina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r1-tue-1330", weekday: 2, hour: 13, minute: 30, trainer: "Kristina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r1-tue-1730", weekday: 2, hour: 17, minute: 30, trainer: "Konstantina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 8 },
  { id: "r1-tue-1830", weekday: 2, hour: 18, minute: 30, trainer: "Konstantina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 8 },
  { id: "r1-tue-1930", weekday: 2, hour: 19, minute: 30, trainer: "Konstantina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "p-tue-1500", weekday: 2, hour: 15, minute: 0, trainer: "Christina · Private Studio", service: "Duet training", mode: "private", clientsCount: 2, capacity: 2 },
  { id: "r1-wed-0705", weekday: 3, hour: 7, minute: 5, trainer: "Konstantina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 8 },
  { id: "r1-wed-0830", weekday: 3, hour: 8, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "r1-wed-0930", weekday: 3, hour: 9, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "r1-wed-1030", weekday: 3, hour: 10, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 10 },
  { id: "r1-wed-1130", weekday: 3, hour: 11, minute: 30, trainer: "Konstantina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r1-wed-1230", weekday: 3, hour: 12, minute: 30, trainer: "Olga · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r1-wed-1330", weekday: 3, hour: 13, minute: 30, trainer: "Olga · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r1-wed-1730", weekday: 3, hour: 17, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "r1-wed-1830", weekday: 3, hour: 18, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "p-wed-1500", weekday: 3, hour: 15, minute: 0, trainer: "Konstantina · Private Studio", service: "One-on-one training", mode: "private", clientsCount: 1, capacity: 1 },
  { id: "r1-thu-0705", weekday: 4, hour: 7, minute: 5, trainer: "Konstantina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 8 },
  { id: "r1-thu-0830", weekday: 4, hour: 8, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "r1-thu-0930", weekday: 4, hour: 9, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "r1-thu-1030", weekday: 4, hour: 10, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 10 },
  { id: "r1-thu-1130", weekday: 4, hour: 11, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 10 },
  { id: "r1-thu-1230", weekday: 4, hour: 12, minute: 30, trainer: "Kristina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r1-thu-1330", weekday: 4, hour: 13, minute: 30, trainer: "Kristina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r1-thu-1730", weekday: 4, hour: 17, minute: 30, trainer: "Konstantina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 8 },
  { id: "r1-thu-1830", weekday: 4, hour: 18, minute: 30, trainer: "Konstantina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 8 },
  { id: "r1-thu-1930", weekday: 4, hour: 19, minute: 30, trainer: "Konstantina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "p-thu-1500", weekday: 4, hour: 15, minute: 0, trainer: "Christina · Private Studio", service: "Duet training", mode: "private", clientsCount: 2, capacity: 2 },
  { id: "r1-fri-0705", weekday: 5, hour: 7, minute: 5, trainer: "Konstantina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 8 },
  { id: "r1-fri-0830", weekday: 5, hour: 8, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "r1-fri-0930", weekday: 5, hour: 9, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "r1-fri-1030", weekday: 5, hour: 10, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 10 },
  { id: "r1-fri-1130", weekday: 5, hour: 11, minute: 30, trainer: "Konstantina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r1-fri-1230", weekday: 5, hour: 12, minute: 30, trainer: "Olga · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r1-fri-1330", weekday: 5, hour: 13, minute: 30, trainer: "Olga · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r1-fri-1730", weekday: 5, hour: 17, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "r1-fri-1830", weekday: 5, hour: 18, minute: 30, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "p-fri-1500", weekday: 5, hour: 15, minute: 0, trainer: "Olga · Private Studio", service: "One-on-one training", mode: "private", clientsCount: 1, capacity: 1 },
  { id: "r1-sat-0800", weekday: 6, hour: 8, minute: 0, trainer: "Kristina · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r1-sat-0900", weekday: 6, hour: 9, minute: 0, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 6, capacity: 10 },
  { id: "r1-sat-1000", weekday: 6, hour: 10, minute: 0, trainer: "Svetlana · Room 1", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 10 },
  { id: "r1-sat-1100", weekday: 6, hour: 11, minute: 0, trainer: "Room 1", service: "Stretching", mode: "group", clientsCount: 8, capacity: 12 },
  { id: "p-sat-1200", weekday: 6, hour: 12, minute: 0, trainer: "Svetlana · Private Studio", service: "Duet training", mode: "private", clientsCount: 2, capacity: 2 },
  { id: "r2-mon-0815", weekday: 1, hour: 8, minute: 15, trainer: "Konstantina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r2-mon-0915", weekday: 1, hour: 9, minute: 15, trainer: "Konstantina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 8 },
  { id: "r2-mon-1015", weekday: 1, hour: 10, minute: 15, trainer: "Kristina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r2-mon-1115", weekday: 1, hour: 11, minute: 15, trainer: "Kristina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r2-tue-0815", weekday: 2, hour: 8, minute: 15, trainer: "Konstantina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r2-tue-0915", weekday: 2, hour: 9, minute: 15, trainer: "Konstantina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 8 },
  { id: "r2-wed-0815", weekday: 3, hour: 8, minute: 15, trainer: "Konstantina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r2-wed-0915", weekday: 3, hour: 9, minute: 15, trainer: "Konstantina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 8 },
  { id: "r2-wed-1015", weekday: 3, hour: 10, minute: 15, trainer: "Kristina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r2-wed-1115", weekday: 3, hour: 11, minute: 15, trainer: "Kristina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r2-thu-0815", weekday: 4, hour: 8, minute: 15, trainer: "Konstantina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r2-thu-0915", weekday: 4, hour: 9, minute: 15, trainer: "Konstantina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 8 },
  { id: "r2-fri-0815", weekday: 5, hour: 8, minute: 15, trainer: "Konstantina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r2-fri-0915", weekday: 5, hour: 9, minute: 15, trainer: "Konstantina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 8 },
  { id: "r2-fri-1015", weekday: 5, hour: 10, minute: 15, trainer: "Kristina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r2-fri-1115", weekday: 5, hour: 11, minute: 15, trainer: "Kristina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r2-sat-0900", weekday: 6, hour: 9, minute: 0, trainer: "Konstantina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 5, capacity: 8 },
  { id: "r2-sat-1000", weekday: 6, hour: 10, minute: 0, trainer: "Kristina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
  { id: "r2-sat-1100", weekday: 6, hour: 11, minute: 0, trainer: "Kristina · Room 2", service: "Reformer Pilates", mode: "group", clientsCount: 4, capacity: 8 },
];

function getWeekStart(now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  return start;
}

function buildScheduleForWeek(weekStart: Date) {
  return scheduleTemplate.map((item) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + item.weekday - 1);
    date.setHours(item.hour, item.minute, 0, 0);

    return {
      id: item.id,
      datetime: date.toISOString(),
      trainer: item.trainer,
      service: item.service,
      mode: item.mode,
      clientsCount: item.clientsCount,
      capacity: item.capacity,
    };
  });
}

export function getStaticSchedule(now = new Date()): StaticScheduleItem[] {
  const currentWeek = buildScheduleForWeek(getWeekStart(now));
  const nextWeekStart = getWeekStart(now);
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  const nextWeek = buildScheduleForWeek(nextWeekStart);

  return [...currentWeek, ...nextWeek].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
  );
}

export function getWeeklyStaticSchedule(now = new Date()): StaticScheduleItem[] {
  return buildScheduleForWeek(getWeekStart(now)).sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
  );
}
