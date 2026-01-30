import { auth } from "@/lib/auth";
import TopNav from "@/components/TopNav";
import { redirect } from "next/navigation";
import styles from "./dashboard.module.scss";

export default async function CabinetLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className={styles.wrap}>
            <TopNav user={session.user} />
            <main className={`container ${styles.main}`}>
                {children}
            </main>
        </div>
    );
}
