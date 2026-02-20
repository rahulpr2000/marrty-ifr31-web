import { NavLink } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    ClipboardCheck,
    Camera,
    Radio,
    LogOut
} from "lucide-react";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/students", label: "Students", icon: GraduationCap },
    { href: "/faculty", label: "Faculty", icon: Users },
    { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
    { href: "/enrollment", label: "Enrollment", icon: Camera },
    { href: "/devices", label: "Devices", icon: Radio },
];

export default function Sidebar() {
    async function handleSignOut() {
        try {
            await signOut();
        } catch (err) {
            console.error("Sign out error:", err);
        }
    }

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
                            color: "white"
                        }}
                    >
                        <Camera size={20} />
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
                    <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                    >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div
                style={{
                    padding: "16px 20px",
                    borderTop: "1px solid var(--border)",
                }}
            >
                <button
                    onClick={handleSignOut}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        width: "100%",
                        padding: "10px 12px",
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        borderRadius: "var(--radius)",
                        color: "#ef4444",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                    }}
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "12px", lineHeight: 1.5 }}>
                    Holy Grace Polytechnic<br />
                    Computer Engineering<br />
                    <span style={{ color: "var(--accent-blue)" }}>Developed by Rahul PR</span>
                </div>
            </div>
        </aside>
    );
}
