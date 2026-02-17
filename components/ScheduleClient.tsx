"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PushPressClass } from "@/lib/pushpress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar, ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";

function getDateKey(d: Date): string {
  return d.toISOString().split("T")[0];
}

const CALENDAR_START_HOUR = 6; // 6 AM
const CALENDAR_END_HOUR = 22; // 10 PM
const HOUR_HEIGHT_IN_REM = 4; // Each hour row is 4rem tall

const groupClassesByDate = (classes: PushPressClass[]) => {
  const grouped: Record<string, PushPressClass[]> = {};
  if (!classes) return grouped;
  classes.forEach((cls) => {
    const date = new Date(cls.start * 1000);
    const dateKey = getDateKey(date);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(cls);
  });
  Object.keys(grouped).forEach((key) => {
    grouped[key].sort((a, b) => a.start - b.start);
  });
  return grouped;
};

const getWeekDays = (startDate: Date): Date[] => {
  const days: Date[] = [];
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  // Monday-based
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push(date);
  }
  return days;
};

const getWeekStartMonday = (d: Date): Date => {
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);
  return start;
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatDuration = (start: number, end: number): string => {
  const minutes = Math.round((end - start) / 60);
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
};

type ReservationMap = Record<string, { reservationId: string; status: string } | null>;

function MobileScheduleView({
  groupedClasses,
  bookingState,
  onBook,
  onCancel,
  selectedDate,
  setSelectedDate,
  availableDays,
  nextClass,
  onJumpToNextClass,
  nowMs,
  reservations,
}: {
  groupedClasses: Record<string, PushPressClass[]>;
  bookingState: Record<string, boolean>;
  onBook: (classId: string) => void;
  onCancel: (reservationId: string, classId: string) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
  availableDays: string[];
  nextClass: PushPressClass | null;
  onJumpToNextClass: () => void;
  nowMs: number;
  reservations: ReservationMap;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDate && scrollRef.current) {
      const element = document.getElementById(`mobile-date-${selectedDate}`);
      if (element) element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedDate]);

  if (availableDays.length === 0) {
    return (
      <div className="md:hidden flex flex-col items-center justify-center py-20 px-4">
        <Calendar className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground text-center">No upcoming classes found.</p>
      </div>
    );
  }

  const currentDate = selectedDate || availableDays[0];
  const classes = groupedClasses[currentDate] || [];
  const displayDate = new Date(currentDate + "T00:00:00");

  return (
    <div className="md:hidden space-y-4">
      {classes.length === 0 && nextClass && (
        <Card className="border-dashed">
          <CardContent className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold">No classes for this day</div>
              <div className="text-sm text-muted-foreground">Jump to the next available class.</div>
            </div>
            <Button onClick={onJumpToNextClass}>Next class</Button>
          </CardContent>
        </Card>
      )}

      <div className="relative -mx-4 px-4">
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" } as any}
        >
          {availableDays.map((dateKey) => {
            const date = new Date(dateKey + "T00:00:00");
            const isSelected = dateKey === currentDate;
            const classCount = groupedClasses[dateKey]?.length || 0;

            return (
              <button
                key={dateKey}
                id={`mobile-date-${dateKey}`}
                onClick={() => setSelectedDate(dateKey)}
                className={`flex-shrink-0 snap-center px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                    : "border-border bg-card hover:border-primary/50 hover:scale-102"
                }`}
              >
                <div className="text-xs font-medium opacity-80">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                <div className="text-xl font-bold">{date.getDate()}</div>
                <div className="text-xs opacity-70">{classCount} {classCount === 1 ? "class" : "classes"}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between px-1 py-2">
        <h3 className="text-lg font-semibold">
          {displayDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </h3>
        <span className="text-sm text-muted-foreground">
          {classes.length} {classes.length === 1 ? "class" : "classes"}
        </span>
      </div>

      <div className="space-y-3">
        {classes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">No classes scheduled for this day</p>
            </CardContent>
          </Card>
        ) : (
          classes.map((cls) => {
            const startDate = new Date(cls.start * 1000);
            const isPast = startDate.getTime() < nowMs;
            const isBusy = bookingState[cls.id];
            const r = reservations[cls.id];

            const action = r ? (
              <Button
                onClick={() => onCancel(r.reservationId, cls.id)}
                disabled={isBusy || isPast}
                variant="outline"
                className="w-full mt-3"
                size="sm"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Working...
                  </>
                ) : isPast ? (
                  "Class Ended"
                ) : (
                  "Cancel"
                )}
              </Button>
            ) : (
              <Button
                onClick={() => onBook(cls.id)}
                disabled={isBusy || isPast}
                className="w-full mt-3"
                size="sm"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Booking...
                  </>
                ) : isPast ? (
                  "Class Ended"
                ) : (
                  "Book Class"
                )}
              </Button>
            );

            return (
              <Card
                key={cls.id}
                id={`class-${cls.id}`}
                className={`overflow-hidden transition-all hover:shadow-md ${isPast ? "opacity-60" : ""}`}
              >
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="flex-shrink-0 w-20 bg-primary/10 flex flex-col items-center justify-center p-3 border-r-2 border-primary/20">
                      <Clock className="h-4 w-4 text-primary mb-1" />
                      <div className="text-sm font-bold text-primary">{formatTime(startDate)}</div>
                      <div className="text-xs text-muted-foreground">{formatDuration(cls.start, cls.end)}</div>
                    </div>

                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-base leading-tight mb-1">{cls.title}</h4>
                          <p className="text-sm text-muted-foreground">{cls.assistantCoachUuid || "Instructor TBA"}</p>
                          {r && !isPast && (
                            <p className="text-xs text-muted-foreground mt-1">Booked</p>
                          )}
                        </div>
                      </div>

                      {action}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

function DesktopScheduleView({
  groupedClasses,
  bookingState,
  onBook,
  onCancel,
  weekStart,
  setWeekStart,
  nextClass,
  onJumpToNextClass,
  onJumpToNextWeekWithClasses,
  weekHasClasses,
  nowMs,
  reservations,
}: {
  groupedClasses: Record<string, PushPressClass[]>;
  bookingState: Record<string, boolean>;
  onBook: (classId: string) => void;
  onCancel: (reservationId: string, classId: string) => void;
  weekStart: Date;
  setWeekStart: (date: Date) => void;
  nextClass: PushPressClass | null;
  onJumpToNextClass: () => void;
  onJumpToNextWeekWithClasses: () => void;
  weekHasClasses: boolean;
  nowMs: number;
  reservations: ReservationMap;
}) {
  const weekDays = getWeekDays(weekStart);
  const timeLabels = Array.from({ length: CALENDAR_END_HOUR - CALENDAR_START_HOUR }, (_, i) => i + CALENDAR_START_HOUR);

  const goToPreviousWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() - 7);
    setWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() + 7);
    setWeekStart(newDate);
  };

  const goToToday = () => {
    setWeekStart(new Date());
  };

  const isCurrentWeek = () => {
    const today = new Date();
    return weekDays.some((day) => day.toDateString() === today.toDateString());
  };

  return (
    <div className="hidden md:block space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          {!isCurrentWeek() && (
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
          )}
          {nextClass && (
            <Button variant="default" size="sm" onClick={onJumpToNextClass}>
              Next class
            </Button>
          )}
        </div>
        <h3 className="text-lg font-semibold">
          {weekDays[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })} - {weekDays[6].toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </h3>
        <div className="w-32"></div>
      </div>

      {!weekHasClasses && nextClass && (
        <Card className="border-dashed">
          <CardContent className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold">No classes this week</div>
              <div className="text-sm text-muted-foreground">Jump to the next available class.</div>
            </div>
            <div className="flex gap-2">
              <Button variant="default" onClick={onJumpToNextClass}>
                Go to next class
              </Button>
              <Button variant="outline" onClick={onJumpToNextWeekWithClasses}>
                Next week with classes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="border rounded-lg bg-card overflow-hidden">
        <div className="grid grid-cols-8 gap-0">
          <div className="col-span-1 border-r bg-muted/30 p-3">
            <div className="text-xs font-medium text-muted-foreground">Time</div>
          </div>

          {weekDays.map((day, idx) => {
            const dateKey = getDateKey(day);
            const classCount = groupedClasses[dateKey]?.length || 0;
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <div key={idx} className={`border-r last:border-r-0 p-3 ${isToday ? "bg-primary/5" : "bg-muted/30"}`}>
                <div className={`text-xs font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className={`text-lg font-bold ${isToday ? "text-primary" : ""}`}>{day.getDate()}</div>
                <div className="text-xs text-muted-foreground">
                  {classCount} {classCount === 1 ? "class" : "classes"}
                </div>
              </div>
            );
          })}

          <div className="col-span-8 grid grid-cols-8">
            <div className="col-span-1 border-r bg-muted/10">
              {timeLabels.map((hour) => (
                <div
                  key={hour}
                  className="border-t text-right pr-2 text-xs text-muted-foreground flex items-start pt-1"
                  style={{ height: `${HOUR_HEIGHT_IN_REM}rem` }}
                >
                  {hour}:00
                </div>
              ))}
            </div>

            {weekDays.map((day, dayIdx) => {
              const dateKey = getDateKey(day);
              const dayClasses = groupedClasses[dateKey] || [];
              const isToday = day.toDateString() === new Date().toDateString();

              return (
                <div key={dayIdx} className={`relative border-r last:border-r-0 ${isToday ? "bg-primary/[0.02]" : ""}`}>
                  {timeLabels.map((hour) => (
                    <div key={hour} className="border-t" style={{ height: `${HOUR_HEIGHT_IN_REM}rem` }}></div>
                  ))}

                  {dayClasses.map((cls) => {
                    const startDate = new Date(cls.start * 1000);
                    const top = (startDate.getHours() + startDate.getMinutes() / 60 - CALENDAR_START_HOUR) * HOUR_HEIGHT_IN_REM;
                    const durationHours = (cls.end - cls.start) / 3600;
                    const height = Math.max(durationHours * HOUR_HEIGHT_IN_REM, 3);
                    const isBusy = bookingState[cls.id];
                    const isPast = startDate.getTime() < nowMs;
                    const r = reservations[cls.id];

                    const canShowButton = height >= 4;

                    const actionBtn = r ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full h-6 text-xs mt-1"
                        onClick={() => onCancel(r.reservationId, cls.id)}
                        disabled={isBusy || isPast}
                      >
                        {isBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : isPast ? "Ended" : "Cancel"}
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full h-6 text-xs mt-1"
                        onClick={() => onBook(cls.id)}
                        disabled={isBusy || isPast}
                      >
                        {isBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : isPast ? "Ended" : "Book"}
                      </Button>
                    );

                    return (
                      <div key={cls.id} id={`class-${cls.id}`} className="absolute inset-x-1" style={{ top: `${top}rem`, height: `${height}rem` }}>
                        <div
                          className={`h-full rounded-md p-2 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 border border-primary/20 flex flex-col justify-between overflow-hidden ${
                            isPast ? "opacity-50" : "hover:scale-[1.02]"
                          }`}
                        >
                          <div className="flex-1 min-h-0">
                            <div className="text-xs font-bold leading-tight mb-0.5 line-clamp-2">{cls.title}</div>
                            <div className="text-[10px] opacity-80 line-clamp-1">{formatTime(startDate)}</div>
                            <div className="text-[10px] opacity-70 line-clamp-1">{cls.assistantCoachUuid || "TBA"}</div>
                            {r && !isPast && <div className="text-[10px] opacity-90">Booked</div>}
                          </div>

                          {canShowButton && actionBtn}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScheduleClient({ initialClasses }: { initialClasses: PushPressClass[] }) {
  const [bookingState, setBookingState] = useState<Record<string, boolean>>({});
  const [reservations, setReservations] = useState<ReservationMap>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState<Date>(new Date());
  const [nowMs, setNowMs] = useState<number>(0);

  useEffect(() => {
    setNowMs(Date.now());
  }, []);

  const groupedClasses = useMemo(() => groupClassesByDate(initialClasses), [initialClasses]);
  const availableDays = useMemo(
    () => Object.keys(groupedClasses).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()),
    [groupedClasses]
  );

  const nextClass = useMemo(() => {
    return (
      (initialClasses || [])
        .filter((c) => c.start * 1000 > nowMs)
        .sort((a, b) => a.start - b.start)[0] || null
    );
  }, [initialClasses, nowMs]);

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const weekHasClasses = useMemo(() => {
    return weekDays.some((d) => (groupedClasses[getDateKey(d)]?.length || 0) > 0);
  }, [groupedClasses, weekDays]);

  const scrollToClass = (classId: string) => {
    setTimeout(() => {
      const el = document.getElementById(`class-${classId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-primary");
        setTimeout(() => el.classList.remove("ring-2", "ring-primary"), 2500);
      }
    }, 50);
  };

  const jumpToClass = (cls: PushPressClass) => {
    const d = new Date(cls.start * 1000);
    setWeekStart(getWeekStartMonday(d));
    setSelectedDate(getDateKey(d));
    scrollToClass(cls.id);
  };

  const jumpToNextClass = () => {
    if (!nextClass) return;
    jumpToClass(nextClass);
  };

  const jumpToNextWeekWithClasses = () => {
    if (!nextClass) return;
    setWeekStart(getWeekStartMonday(new Date(nextClass.start * 1000)));
  };

  // default selected day for mobile
  useEffect(() => {
    if (availableDays.length > 0 && !selectedDate) {
      const today = getDateKey(new Date());
      setSelectedDate(availableDays.includes(today) ? today : availableDays[0]);
    }
  }, [availableDays, selectedDate]);

  // auto jump once on mount if current week is empty
  useEffect(() => {
    if (!weekHasClasses && nextClass) {
      setWeekStart(getWeekStartMonday(new Date(nextClass.start * 1000)));
      setSelectedDate(getDateKey(new Date(nextClass.start * 1000)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBook = async (classId: string) => {
    setBookingState((prev) => ({ ...prev, [classId]: true }));
    const toastId = toast.loading("Booking (UI demo)...");

    await new Promise((r) => setTimeout(r, 500));
    setReservations((prev) => ({ ...prev, [classId]: { reservationId: `demo-${classId}`, status: "reserved" } }));

    toast.success("Booked in UI demo mode", { id: toastId });
    setBookingState((prev) => ({ ...prev, [classId]: false }));
  };

  const onCancel = async (_reservationId: string, classId: string) => {
    setBookingState((prev) => ({ ...prev, [classId]: true }));
    const toastId = toast.loading("Canceling (UI demo)...");

    await new Promise((r) => setTimeout(r, 400));
    setReservations((prev) => ({ ...prev, [classId]: null }));

    toast.success("Canceled in UI demo mode", { id: toastId });
    setBookingState((prev) => ({ ...prev, [classId]: false }));
  };

  return (
    <>
      <MobileScheduleView
        groupedClasses={groupedClasses}
        bookingState={bookingState}
        onBook={onBook}
        onCancel={onCancel}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        availableDays={availableDays}
        nextClass={nextClass}
        onJumpToNextClass={jumpToNextClass}
        nowMs={nowMs}
        reservations={reservations}
      />

      <DesktopScheduleView
        groupedClasses={groupedClasses}
        bookingState={bookingState}
        onBook={onBook}
        onCancel={onCancel}
        weekStart={weekStart}
        setWeekStart={setWeekStart}
        nextClass={nextClass}
        onJumpToNextClass={jumpToNextClass}
        onJumpToNextWeekWithClasses={jumpToNextWeekWithClasses}
        weekHasClasses={weekHasClasses}
        nowMs={nowMs}
        reservations={reservations}
      />
    </>
  );
}
