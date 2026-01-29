import Link from "next/link";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className="container" style={{ textAlign: 'center', marginTop: '15vh' }}>
        <h1 className="gradient-text" style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1rem' }}>
          Pilates Space
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Manage your classes and balance in one place.
        </p>
        <Link href="/cabinet" className="btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}>
          Go to Personal Account
        </Link>
      </div>
    </main>
  );
}
