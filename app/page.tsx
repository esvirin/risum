import Link from "next/link";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={`container ${styles.container}`}>
      <h1 className={styles.title}>
        Fit Space
      </h1>
      <p className={styles.description}>
        Experience the premium fitness lifestyle. Manage your membership, book classes, and track your progress.
      </p>

      <div className={styles.buttons}>
        <Link href="/login" className="btn btn-primary">
          Sign In
        </Link>
        <Link href="/register" className="btn btn-secondary">
          Join Now
        </Link>
      </div>

      <div className={styles.footer}>
        &copy; {new Date().getFullYear()} Fit Space. Powered by PushPress.
      </div>
    </div>
  );
}
