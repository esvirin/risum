"use client";

import { useState } from "react";
import { PushPressClass } from "@/lib/pushpress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

// --- Calendar Constants ---
const CALENDAR_START_HOUR = 7; // 7 AM
const CALENDAR_END_HOUR = 21; // 9 PM
const HOUR_HEIGHT_IN_REM = 5; // Each hour row is 5rem tall

// --- Helper Functions ---
const groupClassesByDate = (classes: PushPressClass[]) => {
    const grouped: Record<string, PushPressClass[]> = {};
    if (!classes) return grouped;
    classes.forEach(cls => {
        const date = new Date(cls.start);
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(cls);
    });
    return grouped;
};

// --- Mobile View Component (Unchanged) ---
function MobileScheduleView({ groupedClasses, handleBook, bookingState }: { groupedClasses: Record<string, PushPressClass[]>, handleBook: (classId: string) => void, bookingState: Record<string, boolean> }) {
     if (Object.keys(groupedClasses).length === 0) {
        return <p className="text-muted-foreground text-center py-10">No upcoming classes found.</p>;
    }
    const sortedDates = Object.keys(groupedClasses).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return (
        <div className="space-y-6 md:hidden">
            {sortedDates.map(dateKey => {
                const classes = groupedClasses[dateKey];
                const displayDate = new Date(dateKey + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                return (
                    <div key={dateKey} className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary sticky top-[65px] bg-background/95 backdrop-blur py-2 z-10">{displayDate}</h3>
                        {classes.map(cls => {
                            const isBooking = bookingState[cls.id];
                            return (
                                <Card key={cls.id} className="overflow-hidden">
                                    <CardContent className="p-4 flex justify-between items-center gap-4">
                                        <div className="flex-1 space-y-1">
                                            <p className="font-semibold">{cls.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(cls.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                <span className="mx-2">•</span>
                                                {cls.assistantCoachUuid || 'TBA'}
                                            </p>
                                        </div>
                                        <Button onClick={() => handleBook(cls.id)} disabled={isBooking} className="w-24">
                                            {isBooking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Book"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )
            })}
        </div>
    );
}

// --- New Desktop Day-View Timetable ---
function DesktopScheduleView({ classesForDay, handleBook, bookingState }: { classesForDay: PushPressClass[], handleBook: (classId: string) => void, bookingState: Record<string, boolean> }) {
    const timeLabels = Array.from({ length: CALENDAR_END_HOUR - CALENDAR_START_HOUR }, (_, i) => i + CALENDAR_START_HOUR);

    return (
        <div className="hidden md:block border rounded-lg bg-card relative" style={{ minHeight: `${(CALENDAR_END_HOUR - CALENDAR_START_HOUR) * HOUR_HEIGHT_IN_REM}rem`}}>
            <div className="grid" style={{ gridTemplateColumns: `auto 1fr` }}>
                {/* Time labels */}
                 <div className="row-start-1" style={{ gridColumn: '1 / 2' }}>
                    {timeLabels.map(hour => (
                        <div key={hour} className="text-right text-xs pr-2 text-muted-foreground border-t" style={{ height: `${HOUR_HEIGHT_IN_REM}rem` }}>
                           {hour}:00
                        </div>
                    ))}
                </div>

                {/* Class column */}
                <div className="relative border-l" style={{ gridColumn: `2 / span 1`, gridRow: '1 / span 1' }}>
                    {/* Background lines for hours */}
                    {timeLabels.map(hour => <div key={hour} className="border-t" style={{ height: `${HOUR_HEIGHT_IN_REM}rem` }}></div>)}

                    {/* Positioned classes */}
                    {(classesForDay || []).map(cls => {
                        const startDate = new Date(cls.start);
                        const top = (startDate.getHours() + startDate.getMinutes() / 60 - CALENDAR_START_HOUR) * HOUR_HEIGHT_IN_REM;
                        const durationMinutes = (cls.end - cls.start) / 60000;
                        const height = (durationMinutes / 60) * HOUR_HEIGHT_IN_REM;
                        const isBooking = bookingState[cls.id];

                        return (
                            <div
                                key={cls.id}
                                className="absolute w-full p-1"
                                style={{ top: `${top}rem`, height: `${height}rem` }}
                            >
                                <div className="bg-primary text-primary-foreground rounded-lg p-3 h-full flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow">
                                    <div>
                                        <p className="font-bold">{cls.title}</p>
                                        <p className="text-primary-foreground/80 text-xs">{cls.assistantCoachUuid || 'TBA'}</p>
                                    </div>
                                    <Button variant="secondary" size="sm" className="w-full mt-1" onClick={() => handleBook(cls.id)} disabled={isBooking}>
                                            {isBooking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Book"}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function ScheduleClient({ initialClasses }: { initialClasses: PushPressClass[] }) {
    const [bookingState, setBookingState] = useState<Record<string, boolean>>({});
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const groupedClasses = groupClassesByDate(initialClasses);
    const availableDays = Object.keys(groupedClasses).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());

    // Set initial selected date
    useState(() => {
        if (availableDays.length > 0) {
            setSelectedDate(availableDays[0]);
        }
    });

    const handleBook = async (classId: string) => {
        setBookingState(prev => ({ ...prev, [classId]: true }));
        const toastId = toast.loading("Booking class...");
        try {
            const response = await fetch('/api/classes/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classId }),
            });
            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || "Booking failed.");
            }
            toast.success("Class booked successfully!", { id: toastId });
        } catch (error: any) {
            toast.error(error.message || "An error occurred.", { id: toastId });
        } finally {
            setBookingState(prev => ({ ...prev, [classId]: false }));
        }
    };

    const changeDay = (direction: 'prev' | 'next') => {
        if (!selectedDate) return;
        const currentIndex = availableDays.indexOf(selectedDate);
        const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (newIndex >= 0 && newIndex < availableDays.length) {
            setSelectedDate(availableDays[newIndex]);
        }
    };
    
    const selectedDateIndex = selectedDate ? availableDays.indexOf(selectedDate) : -1;
    const displayDate = selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : "No classes";

    return (
        <>
            {/* --- Header for Desktop Day View --- */}
            <div className="hidden md:flex items-center justify-between pb-4">
                 <Button variant="outline" onClick={() => changeDay('prev')} disabled={selectedDateIndex <= 0}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous Day
                </Button>
                <h2 className="text-xl font-semibold text-center">{displayDate}</h2>
                <Button variant="outline" onClick={() => changeDay('next')} disabled={selectedDateIndex >= availableDays.length - 1}>
                    Next Day
                    <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>

            <MobileScheduleView groupedClasses={groupedClasses} handleBook={handleBook} bookingState={bookingState} />
            <DesktopScheduleView classesForDay={selectedDate ? groupedClasses[selectedDate] : []} handleBook={handleBook} bookingState={bookingState} />
        </>
    );
}