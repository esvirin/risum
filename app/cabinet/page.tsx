"use client";

import { useEffect, useState } from "react";
import { getPushPressUser, PushPressUser, getUpcomingClasses, PushPressClass } from "@/lib/pushpress";
import { initiateJCCPayment } from "@/lib/jcc";
import {
    User,
    Calendar,
    CreditCard,
    CheckCircle,
    Clock,
    MapPin,
    UserCircle,
    PlusCircle,
    LogOut,
    ChevronRight
} from "lucide-react";

export default function CabinetPage() {
    const [user, setUser] = useState<PushPressUser | null>(null);
    const [classes, setClasses] = useState<PushPressClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const [userData, classesData] = await Promise.all([
                    getPushPressUser("me"),
                    getUpcomingClasses(),
                ]);
                setUser(userData);
                setClasses(classesData);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const handlePayment = async (amount: number, description: string) => {
        if (!user) return;
        setPaying(true);
        try {
            const resp = await initiateJCCPayment({
                amount,
                currency: "EUR",
                orderId: `order_${Date.now()}`,
                description,
                customerEmail: user.email,
            });
            window.alert(`Redirecting to JCC Payment Gateway Secure Page...\n\nTransaction: ${resp.transactionId}\nRedirect To: ${resp.paymentUrl}`);
        } catch (error) {
            console.error("Payment failed", error);
        } finally {
            setPaying(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '10rem' }}>
                <div className="loading-spinner"></div>
                <p className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '2rem' }}>
                    Preparing your Pilates space...
                </p>
            </div>
        );
    }

    if (!user) return <div>User not found.</div>;

    return (
        <div className="container">
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <UserCircle size={24} style={{ margin: 'auto' }} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>PILATES SPACE</span>
                </div>
                <button style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LogOut size={18} /> Logout
                </button>
            </nav>

            <header style={{ marginBottom: '4rem' }}>
                <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                    Member Cabinet
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Welcome back, <strong>{user.firstName}</strong>. Ready for your next session?
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                {/* Profile Card */}
                <section className="card glass">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <User size={20} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.25rem' }}>Membership Info</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Member Name</p>
                            <p style={{ fontWeight: 600 }}>{user.firstName} {user.lastName}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Active Plan</p>
                            <p style={{ fontWeight: 600 }}>{user.planName}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Status</p>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    backgroundColor: user.membershipStatus === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: user.membershipStatus === 'active' ? 'var(--success)' : 'var(--error)',
                                    border: '1px solid currentColor'
                                }}>
                                    {user.membershipStatus.toUpperCase()}
                                </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Remaining</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user.classesRemaining}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Payment Card */}
                <section className="card" style={{ border: 'none', background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <CreditCard size={20} color="white" />
                        <h2 style={{ fontSize: '1.25rem' }}>Reload Balance</h2>
                    </div>
                    <p style={{ marginBottom: '2rem', opacity: 0.9 }}>Choose a package to continue your journey with JCC Secured Payments.</p>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <button
                            className="pay-btn"
                            onClick={() => handlePayment(50, "5 Classes Pack")}
                            disabled={paying}
                        >
                            <span>5 Classes Pack</span>
                            <span style={{ fontWeight: 800 }}>€50.00</span>
                        </button>
                        <button
                            className="pay-btn"
                            onClick={() => handlePayment(90, "10 Classes Pack")}
                            disabled={paying}
                            style={{ background: 'rgba(255,255,255,0.15)' }}
                        >
                            <span>10 Classes Pack</span>
                            <span style={{ fontWeight: 800 }}>€90.00</span>
                        </button>
                    </div>
                </section>

                {/* Upcoming Classes Card */}
                <section className="card glass" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Calendar size={20} color="var(--primary)" />
                            <h2 style={{ fontSize: '1.25rem' }}>Your Schedule</h2>
                        </div>
                        <button style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            Book New <PlusCircle size={16} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {classes.length > 0 ? classes.map(cls => (
                            <div key={cls.id} className="class-item">
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ textAlign: 'center', minWidth: '60px', paddingRight: '1.5rem', borderRight: '1px solid var(--card-border)' }}>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                            {new Date(cls.startTime).toLocaleDateString([], { month: 'short' })}
                                        </p>
                                        <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                                            {new Date(cls.startTime).getDate()}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{cls.name}</h3>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Clock size={14} /> {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <User size={14} /> {cls.instructor}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <MapPin size={14} /> {cls.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight size={20} color="var(--card-border)" />
                            </div>
                        )) : (
                            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No upcoming classes found.</p>
                        )}
                    </div>
                </section>
            </div>

            <footer style={{ marginTop: '5rem', padding: '2rem 0', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <p>&copy; 2024 Pilates Space. Integrated with PushPress Platinum & JCC Smart Gateway.</p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                    <span>Support</span>
                </div>
            </footer>

            <style jsx>{`
        .container {
          padding-top: 2rem;
          padding-bottom: 4rem;
          max-width: 1100px;
        }
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(139, 92, 246, 0.1);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          margin: 0 auto;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .pay-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 1.25rem;
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s ease;
          font-weight: 500;
        }
        .pay-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.4);
        }
        .class-item {
          padding: 1.25rem;
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .class-item:hover {
          background: rgba(255,255,255,0.06);
          border-color: var(--card-border);
          transform: translateX(4px);
        }
      `}</style>
        </div>
    );
}
