"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../auth.module.scss";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
                return;
            }

            // Success
            router.push("/login?registered=true");
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={`card ${styles.card}`}>
                <h1 className={styles.title}>Claim Account</h1>
                <p className={styles.subtitle}>
                    Enter your email to verify membership
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    <div className={styles.field}>
                        <label className={styles.label}>PushPress Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Your email on file"
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Create Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Min. 6 characters"
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary full" disabled={loading}>
                        {loading ? "Verifying..." : "Register"}
                    </button>
                </form>

                <div className={styles.footer}>
                    Already have an account? <Link href="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
