"use client";

import { useState } from "react";
import { attendanceApi } from "@/lib/api";

interface AttendanceRecord {
    person_id: string;
    name: string;
    person_type: string;
    batch: string;
    timestamp: string;
    confidence: number;
    device_id: string;
}

interface Report {
    date: string;
    batch: string | null;
    total_enrolled: number;
    total_present: number;
    total_absent: number;
    attendance_percentage: number;
    present: { person_id: string; name: string; batch: string; first_seen: string; scan_count: number }[];
}

export default function AttendancePage() {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [batch, setBatch] = useState("");
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"records" | "report">("report");

    async function handleSearch() {
        setLoading(true);
        if (mode === "report") {
            const res = await attendanceApi.report(date, batch || undefined);
            if (res.data) {
                setReport((res.data as { report: Report }).report || null);
                setRecords([]);
            }
        } else {
            const res = await attendanceApi.query({ date, batch: batch || undefined });
            if (res.data) {
                setRecords((res.data as { records: AttendanceRecord[] }).records || []);
                setReport(null);
            }
        }
        setLoading(false);
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Attendance</h1>
                    <p className="page-subtitle">View attendance records and reports</p>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card" style={{ padding: "20px", marginBottom: "24px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-end", flexWrap: "wrap" }}>
                    <div>
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={{ width: "180px" }}
                        />
                    </div>
                    <div>
                        <label className="form-label">Batch</label>
                        <select className="form-select" value={batch} onChange={(e) => setBatch(e.target.value)} style={{ width: "120px" }}>
                            <option value="">All</option>
                            {["S1", "S2", "S3", "S4", "S5", "S6"].map((b) => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="form-label">View</label>
                        <div style={{ display: "flex", gap: "4px" }}>
                            <button
                                className={`btn ${mode === "report" ? "btn-primary" : "btn-outline"}`}
                                style={{ padding: "8px 16px", fontSize: "0.8rem" }}
                                onClick={() => setMode("report")}
                            >
                                📊 Report
                            </button>
                            <button
                                className={`btn ${mode === "records" ? "btn-primary" : "btn-outline"}`}
                                style={{ padding: "8px 16px", fontSize: "0.8rem" }}
                                onClick={() => setMode("records")}
                            >
                                📋 Records
                            </button>
                        </div>
                    </div>
                    <button className="btn btn-success" onClick={handleSearch} disabled={loading}>
                        {loading ? "Loading..." : "🔍 Search"}
                    </button>
                </div>
            </div>

            {/* Report View */}
            {report && (
                <div style={{ marginBottom: "24px" }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: "16px",
                            marginBottom: "24px",
                        }}
                    >
                        <div className="stat-card emerald">
                            <div className="stat-value">{report.total_present}</div>
                            <div className="stat-label">Present</div>
                        </div>
                        <div className="stat-card amber">
                            <div className="stat-value">{report.total_absent}</div>
                            <div className="stat-label">Absent</div>
                        </div>
                        <div className="stat-card blue">
                            <div className="stat-value">{report.total_enrolled}</div>
                            <div className="stat-label">Total Enrolled</div>
                        </div>
                        <div className="stat-card purple">
                            <div className="stat-value">{report.attendance_percentage}%</div>
                            <div className="stat-label">Attendance Rate</div>
                        </div>
                    </div>

                    {/* Present List */}
                    <div className="glass-card" style={{ overflow: "hidden" }}>
                        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
                            <h3 style={{ fontWeight: 700, fontSize: "0.95rem" }}>Present Students — {report.date}</h3>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>ID</th>
                                    <th>Batch</th>
                                    <th>First Seen</th>
                                    <th>Scans</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.present.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                                            No attendance data for this date.
                                        </td>
                                    </tr>
                                ) : (
                                    report.present.map((p) => (
                                        <tr key={p.person_id}>
                                            <td style={{ fontWeight: 600 }}>{p.name}</td>
                                            <td style={{ color: "var(--text-secondary)" }}>{p.person_id}</td>
                                            <td><span className="badge badge-blue">{p.batch}</span></td>
                                            <td style={{ color: "var(--text-secondary)" }}>
                                                {new Date(p.first_seen).toLocaleTimeString("en-IN")}
                                            </td>
                                            <td>{p.scan_count}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Raw Records View */}
            {records.length > 0 && (
                <div className="glass-card" style={{ overflow: "hidden" }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Batch</th>
                                <th>Time</th>
                                <th>Confidence</th>
                                <th>Device</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((r, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: 600 }}>{r.name}</td>
                                    <td style={{ color: "var(--text-secondary)" }}>{r.person_id}</td>
                                    <td><span className="badge badge-emerald">{r.person_type}</span></td>
                                    <td><span className="badge badge-blue">{r.batch}</span></td>
                                    <td style={{ color: "var(--text-secondary)" }}>
                                        {new Date(r.timestamp).toLocaleTimeString("en-IN")}
                                    </td>
                                    <td>{r.confidence}%</td>
                                    <td style={{ color: "var(--text-muted)" }}>{r.device_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
