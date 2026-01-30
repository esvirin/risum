import { auth } from "@/lib/auth";
import { getUpcomingClasses } from "@/lib/pushpress";
import BookingButton from "@/components/BookingButton";
import Link from "next/link";
import styles from "./schedule.module.scss";

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
        <div>
            <header className={styles.header}>
                <div>
                    <h1>Class Schedule</h1>
                    <p>Book your next session</p>
                </div>
                <Link href="/cabinet" className="btn btn-secondary">Back to Dashboard</Link>
            </header>

            <div className={styles.list}>
                {Object.entries(groupedClasses).length === 0 ? (
                    <div className={`card ${styles.empty}`}>
                        No classes available at the moment.
                    </div>
                ) : (
                    Object.entries(groupedClasses).map(([date, dateClasses]) => (
                        <div key={date}>
                            <h3 className={styles.dateHeader}>
                                {date}
                            </h3>
                            <div className={styles.dayGrid}>
                                {dateClasses.map((cls) => (
                                    <div key={cls.id} className={`card ${styles.classItem}`}>
                                        <div className={styles.classInfo}>
                                            <div className={styles.timeBox}>
                                                <span>
                                                    {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className={styles.duration}>
                                                    60 min
                                                </span>
                                            </div>
                                            <div className={styles.details}>
                                                <div className={styles.name}>{cls.name}</div>
                                                <div className={styles.instructor}>
                                                    with <span>{cls.instructor}</span> • {cls.location}
                                                </div>
                                                <div className={`${styles.spots} ${cls.spotsTotal < 5 ? styles.red : styles.green}`}>
                                                    {cls.spotsTotal} spots left
                                                </div>
                                            </div>
                                        </div>

                                        <BookingButton classId={cls.id} />
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
