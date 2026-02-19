"use client";

import { useState, useEffect } from "react";
import { studentApi } from "@/lib/api";

interface Student {
    student_id: string;
    name: string;
    gender: string;
    roll_number: string;
    batch: string;
    email: string;
    phone: string;
    status: string;
}

const BATCHES = ["All", "S1", "S2", "S3", "S4", "S5", "S6"];

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBatch, setSelectedBatch] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [toast, setToast] = useState<{ type: string; message: string } | null>(null);

    useEffect(() => {
        loadStudents();
    }, [selectedBatch]);

    async function loadStudents() {
        setLoading(true);
        const batch = selectedBatch === "All" ? undefined : selectedBatch;
        const res = await studentApi.list(batch);
        if (res.data) {
            setStudents((res.data as { students: Student[] }).students || []);
        }
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm(`Delete student ${id}?`)) return;
        const res = await studentApi.delete(id);
        if (!res.error) {
            showToast("success", "Student deleted successfully");
            loadStudents();
        } else {
            showToast("error", res.error);
        }
    }

    function showToast(type: string, message: string) {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Students</h1>
                    <p className="page-subtitle">Manage student records</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "✕ Close" : "＋ Add Student"}
                </button>
            </div>

            {/* Batch Filter */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                {BATCHES.map((batch) => (
                    <button
                        key={batch}
                        className={`btn ${selectedBatch === batch ? "btn-primary" : "btn-outline"}`}
                        style={{ padding: "6px 16px", fontSize: "0.8rem" }}
                        onClick={() => setSelectedBatch(batch)}
                    >
                        {batch}
                    </button>
                ))}
            </div>

            {/* Add Student Form */}
            {showForm && (
                <StudentForm
                    onSave={() => {
                        setShowForm(false);
                        loadStudents();
                        showToast("success", "Student created successfully");
                    }}
                    onError={(msg) => showToast("error", msg)}
                />
            )}

            {/* Students Table */}
            <div className="glass-card" style={{ overflow: "hidden" }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Roll No.</th>
                            <th>Batch</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                                    Loading students...
                                </td>
                            </tr>
                        ) : students.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                                    No students found. Click &quot;Add Student&quot; to get started.
                                </td>
                            </tr>
                        ) : (
                            students.map((s) => (
                                <tr key={s.student_id}>
                                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                                    <td>{s.roll_number}</td>
                                    <td><span className="badge badge-blue">{s.batch}</span></td>
                                    <td style={{ color: "var(--text-secondary)" }}>{s.email}</td>
                                    <td style={{ color: "var(--text-secondary)" }}>{s.phone}</td>
                                    <td>
                                        <span className={`badge ${s.status === "active" ? "badge-emerald" : "badge-rose"}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            style={{ padding: "4px 12px", fontSize: "0.75rem" }}
                                            onClick={() => handleDelete(s.student_id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Toast */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>{toast.message}</div>
            )}
        </div>
    );
}

function StudentForm({
    onSave,
    onError,
}: {
    onSave: () => void;
    onError: (msg: string) => void;
}) {
    const [saving, setSaving] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData(e.currentTarget);
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        const res = await studentApi.create(data);
        setSaving(false);

        if (res.error) {
            onError(res.error);
        } else {
            onSave();
        }
    }

    const fields = [
        { name: "name", label: "Full Name", type: "text", required: true },
        { name: "gender", label: "Gender", type: "select", options: ["male", "female", "other"], required: true },
        { name: "dob", label: "Date of Birth", type: "date", required: true },
        { name: "blood_group", label: "Blood Group", type: "select", options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], required: true },
        { name: "roll_number", label: "Roll Number", type: "text", required: true },
        { name: "batch", label: "Batch", type: "select", options: ["S1", "S2", "S3", "S4", "S5", "S6"], required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone", type: "tel", required: true },
        { name: "address", label: "Address", type: "text", required: true },
        { name: "place", label: "Place", type: "text", required: true },
        { name: "district", label: "District", type: "text", required: true },
        { name: "pincode", label: "Pincode", type: "text", required: true },
        { name: "admission_year", label: "Admission Year", type: "text", required: true },
    ];

    return (
        <div className="glass-card" style={{ padding: "24px", marginBottom: "24px" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "20px" }}>Add New Student</h3>
            <form onSubmit={handleSubmit}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "16px",
                    }}
                >
                    {fields.map((field) => (
                        <div key={field.name}>
                            <label className="form-label">{field.label}</label>
                            {field.type === "select" ? (
                                <select name={field.name} className="form-select" required={field.required}>
                                    <option value="">Select</option>
                                    {field.options?.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    name={field.name}
                                    type={field.type}
                                    className="form-input"
                                    placeholder={field.label}
                                    required={field.required}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                    <button type="submit" className="btn btn-success" disabled={saving}>
                        {saving ? "Saving..." : "✓ Save Student"}
                    </button>
                </div>
            </form>
        </div>
    );
}
