import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    GraduationCap,
    Users,
    CheckCircle,
    TrendingUp,
    UserPlus,
    Users as UsersIcon,
    Camera,
    ClipboardList
} from "lucide-react";
import { studentApi, facultyApi, attendanceApi } from "../lib/api";

interface Stats {
    students: number;
    faculty: number;
    todayAttendance: number;
    attendancePercent: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats>({
        students: 0,
        faculty: 0,
        todayAttendance: 0,
        attendancePercent: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const today = new Date().toISOString().split("T")[0];

                const [studentsRes, facultyRes, attendanceRes] = await Promise.allSettled([
                    studentApi.list(),
                    facultyApi.list(),
                    attendanceApi.report(today),
                ]);

                const studentCount =
                    studentsRes.status === "fulfilled" && studentsRes.value.data
                        ? (studentsRes.value.data.students || []).length
                        : 0;

                const facultyCount =
                    facultyRes.status === "fulfilled" && facultyRes.value.data
                        ? (facultyRes.value.data.faculty || []).length
                        : 0;

                const report =
                    attendanceRes.status === "fulfilled" && attendanceRes.value.data
                        ? attendanceRes.value.data.report
                        : null;

                setStats({
                    students: studentCount,
                    faculty: facultyCount,
                    todayAttendance: report?.total_present || 0,
                    attendancePercent: report?.attendance_percentage || 0,
                });
            } catch {
                // Silently fail — stats will show 0
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, []);

    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">
                        Welcome back — Holy Grace Polytechnic College, Mala
                    </p>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {new Date().toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>
            </div>

            {/* Stats Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                    marginBottom: "32px",
                }}
            >
                <StatCard
                    color="blue"
                    value={loading ? "..." : String(stats.students)}
                    label="Total Students"
                    icon={<GraduationCap size={32} />}
                />
                <StatCard
                    color="purple"
                    value={loading ? "..." : String(stats.faculty)}
                    label="Faculty Members"
                    icon={<Users size={32} />}
                />
                <StatCard
                    color="emerald"
                    value={loading ? "..." : String(stats.todayAttendance)}
                    label="Present Today"
                    icon={<CheckCircle size={32} />}
                />
                <StatCard
                    color="amber"
                    value={loading ? "..." : `${stats.attendancePercent}%`}
                    label="Attendance Rate"
                    icon={<TrendingUp size={32} />}
                />
            </div>

            {/* Info Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                <div className="glass-card" style={{ padding: "24px" }}>
                    <h3 style={{ fontWeight: 700, marginBottom: "16px", fontSize: "1rem" }}>
                        🏫 System Overview
                    </h3>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                        <div>
                            <strong>College:</strong> Holy Grace Polytechnic College, Mala
                        </div>
                        <div>
                            <strong>Department:</strong> Computer Engineering
                        </div>
                        <div>
                            <strong>System:</strong> Marrty IFR31 Face Attendance
                        </div>
                        <div>
                            <strong>Device:</strong> ESP32-S3 with Camera Module
                        </div>
                        <div>
                            <strong>Developed by:</strong>{" "}
                            <span style={{ color: "var(--accent-blue)" }}>Rahul PR</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: "24px" }}>
                    <h3 style={{ fontWeight: 700, marginBottom: "16px", fontSize: "1rem" }}>
                        🔧 Quick Actions
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <Link to="/students" className="btn btn-outline" style={{ justifyContent: "center" }}>
                            <UserPlus size={16} /> Manage Students
                        </Link>
                        <Link to="/faculty" className="btn btn-outline" style={{ justifyContent: "center" }}>
                            <UsersIcon size={16} /> Manage Faculty
                        </Link>
                        <Link to="/enrollment" className="btn btn-outline" style={{ justifyContent: "center" }}>
                            <Camera size={16} /> Face Enrollment
                        </Link>
                        <Link to="/attendance" className="btn btn-outline" style={{ justifyContent: "center" }}>
                            <ClipboardList size={16} /> View Attendance
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({
    color,
    value,
    label,
    icon,
}: {
    color: string;
    value: string;
    label: string;
    icon: React.ReactNode;
}) {
    return (
        <div className={`stat-card ${color}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <div className="stat-value">{value}</div>
                    <div className="stat-label">{label}</div>
                </div>
                <span style={{ opacity: 0.6 }}>{icon}</span>
            </div>
        </div>
    );
}
