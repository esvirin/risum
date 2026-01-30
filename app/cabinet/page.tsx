import { auth } from "@/lib/auth";
import { getPushPressMemberByEmail, getUpcomingClasses } from "@/lib/pushpress";
import Link from "next/link";
import PaymentButton from "@/components/PaymentButton";
import styles from "./dashboard.module.scss";

export default async function CabinetPage() {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) return <div>Error loading profile</div>;

    const [member, upcomingClasses] = await Promise.all([
        getPushPressMemberByEmail(email),
        getUpcomingClasses(),
    ]);

    const myClasses = upcomingClasses.slice(0, 2);

    if (!member) {
        return (
            <div className="card">
                <h2>Profile Not Found</h2>
                <p>Could not retrieve PushPress data.</p>
            </div>
        );
    }

    return (
        <div>
            <header className={styles.header}>
                <h1>Hello, {member.firstName}</h1>
                <p>Welcome to your personal dashboard</p>
            </header>

            <div className={styles.grid}>
                {/* Membership Status Card */}
                <div className="card">
                    <h3 className={styles.cardHeader}>Membership</h3>
                    <div className={styles.planName}>{member.planName}</div>
                    <div className={styles.statusRow}>
                        <span className={`${styles.status} ${member.membershipStatus === 'active' ? styles.active : styles.inactive}`}>
                            {member.membershipStatus.toUpperCase()}
                        </span>
                        <span className={styles.credits}>
                            {member.classesRemaining > 1000 ? "Unlimited" : `${member.classesRemaining} credits left`}
                        </span>
                    </div>
                </div>

                {/* Quick Actions / Payment */}
                <div className={`card ${styles.balanceCard}`}>
                    <div>
                        <h3 className={styles.cardHeader}>Balance</h3>
                        <div className={styles.balance}>€0.00</div>
                        <p className={styles.balanceMeta}>Next billing cycle: 01 Feb</p>
                    </div>
                    <div className={styles.actions}>
                        <PaymentButton />
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Upcoming Classes</h2>
                    <Link href="/cabinet/schedule" className="btn btn-secondary">View Full Schedule</Link>
                </div>

                {myClasses.length === 0 ? (
                    <div className={`card ${styles.emptyState}`}>
                        No upcoming classes booked.
                    </div>
                ) : (
                    <div className={styles.classList}>
                        {myClasses.map((cls) => (
                            <div key={cls.id} className={`card ${styles.classItem}`}>
                                <div>
                                    <div className={styles.className}>{cls.name}</div>
                                    <div className={styles.classMeta}>
                                        {new Date(cls.startTime).toLocaleDateString()} at {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {cls.instructor}
                                    </div>
                                </div>
                                <button className={`btn btn-secondary ${styles.cancelBtn}`}>Cancel</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
