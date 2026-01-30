"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import styles from "./TopNav.module.scss";

export default function TopNav({ user }: { user: any }) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className={styles.nav}>
            <div className={styles.brand}>
                <div className={styles.logo}>Fit Space</div>

                <div className={styles.links}>
                    <Link href="/cabinet"
                        className={`${styles.link} ${isActive("/cabinet") ? styles.active : ""}`}>
                        Dashboard
                    </Link>
                    <Link href="/cabinet/schedule"
                        className={`${styles.link} ${isActive("/cabinet/schedule") ? styles.active : ""}`}>
                        Schedule
                    </Link>
                </div>
            </div>

            <div className={styles.profile}>
                <span>{user.name}</span>
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="btn btn-secondary"
                >
                    Sign Out
                </button>
            </div>
        </nav>
    );
}
