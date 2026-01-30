import { auth } from "@/lib/auth";
import { getUpcomingClasses } from "@/lib/pushpress";
import BookingButton from "@/components/BookingButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function SchedulePage() {
    const session = await auth();
    const classes = await getUpcomingClasses();

    // Group by Date
    const groupedClasses: Record<string, typeof classes> = {};
    classes.forEach(cls => {
        const date = new Date(cls.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        if (!groupedClasses[date]) groupedClasses[date] = [];
        groupedClasses[date].push(cls);
    });

    return (
        <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Class Schedule</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">Book your next session</p>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                    <Link href="/cabinet">Back to Dashboard</Link>
                </Button>
            </header>

            <div className="space-y-8">
                {Object.entries(groupedClasses).length === 0 ? (
                    <Card className="p-8 sm:p-12 text-center text-muted-foreground border-dashed">
                        No classes available at the moment.
                    </Card>
                ) : (
                    Object.entries(groupedClasses).map(([date, dateClasses]) => (
                        <div key={date} className="space-y-4">
                            <h3 className="text-base sm:text-lg font-semibold text-primary sticky top-[65px] bg-background/95 backdrop-blur py-3 z-10 border-b shadow-sm">
                                {date}
                            </h3>
                            <div className="grid gap-4">
                                {dateClasses.map((cls) => (
                                    <div key={cls.id}>
                                        <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/50 group">
                                            <CardContent className="p-0 flex flex-col sm:flex-row">
                                                {/* Time Column */}
                                                <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center p-4 sm:p-6 bg-muted/20 sm:min-w-[120px] sm:border-r border-b sm:border-b-0">
                                                    <div className="flex items-baseline gap-2 sm:flex-col sm:gap-0 text-center">
                                                        <span className="text-lg sm:text-xl font-bold leading-none">
                                                            {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground uppercase font-medium">
                                                            60 min
                                                        </span>
                                                    </div>
                                                    {/* Mobile only spots indicator for compactness */}
                                                    <Badge variant={cls.spotsTotal < 5 ? "destructive" : "secondary"} className="sm:hidden text-[10px] h-5">
                                                        {cls.spotsTotal} left
                                                    </Badge>
                                                </div>

                                                {/* Details Column */}
                                                <div className="flex-1 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="space-y-2 sm:space-y-1">
                                                        <div className="font-semibold text-base sm:text-lg leading-tight">{cls.name}</div>
                                                        <div className="text-sm text-muted-foreground flex flex-col sm:block">
                                                            <span>with <span className="text-foreground font-medium">{cls.instructor}</span></span>
                                                            <span className="hidden sm:inline"> • </span>
                                                            <span>{cls.location}</span>
                                                        </div>
                                                        <div className="hidden sm:block pt-1">
                                                            <Badge variant={cls.spotsTotal < 5 ? "destructive" : "secondary"}
                                                                className={cls.spotsTotal < 5 ? "" : "bg-green-100 text-green-700 hover:bg-green-200"}>
                                                                {cls.spotsTotal} spots left
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <div className="w-full sm:w-auto pt-2 sm:pt-0">
                                                        <div className="w-full sm:w-auto [&>button]:w-full sm:[&>button]:w-auto">
                                                            <BookingButton classId={cls.id} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
