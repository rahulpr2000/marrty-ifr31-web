"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/students", label: "Students", icon: "🎓" },
    { href: "/faculty", label: "Faculty", icon: "👨‍🏫" },
    { href: "/attendance", label: "Attendance", icon: "📋" },
    { href: "/enrollment", label: "Enrollment", icon: "📸" },
    { href: "/devices", label: "Devices", icon: "📡" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: "var(--gradient-primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                        }}
                    >
                        🎯
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: "1rem" }}>MARRTY</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                            IFR31 ATTENDANCE
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: "16px 0" }}>
                <div
                    style={{
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        padding: "0 24px",
                        marginBottom: "8px",
                    }}
                >
                    Menu
                </div>
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`sidebar-link ${pathname.startsWith(item.href) ? "active" : ""}`}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div
                style={{
                    padding: "16px 20px",
                    borderTop: "1px solid var(--border)",
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                }}
            >
                <div>Holy Grace Polytechnic</div>
                <div>Computer Engineering</div>
                <div style={{ marginTop: "4px", color: "var(--accent-blue)" }}>
                    Developed by Rahul PR
                </div>
            </div>
        </aside>
    );
}
