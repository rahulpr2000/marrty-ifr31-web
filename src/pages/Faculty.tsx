import { useState, useEffect } from "react";
import { facultyApi } from "../lib/api";
import { Plus, X, Trash2 } from "lucide-react";

interface Faculty {
    faculty_id: string;
    name: string;
    gender: string;
    role: string;
    designation: string;
    assigned_batch: string;
    email: string;
    phone: string;
    status: string;
}

const ROLES = ["All", "hod", "tutor", "teacher"];

export default function FacultyPage() {
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [toast, setToast] = useState<{ type: string; message: string } | null>(null);

    useEffect(() => {
        loadFaculty();
    }, [selectedRole]);

    async function loadFaculty() {
        setLoading(true);
        const role = selectedRole === "All" ? undefined : selectedRole;
        const res = await facultyApi.list(role);
        if (res.data) {
            setFaculty(res.data.faculty || []);
        }
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm(`Delete faculty ${id}?`)) return;
        const res = await facultyApi.delete(id);
        if (!res.error) {
            showToast("success", "Faculty deleted");
            loadFaculty();
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
                    <h1 className="page-title">Faculty</h1>
                    <p className="page-subtitle">Manage faculty members</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? <><X size={18} /> Close</> : <><Plus size={18} /> Add Faculty</>}
                </button>
            </div>

            {/* Role Filter */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                {ROLES.map((role) => (
                    <button
                        key={role}
                        className={`btn ${selectedRole === role ? "btn-primary" : "btn-outline"}`}
                        style={{ padding: "6px 16px", fontSize: "0.8rem", textTransform: "capitalize" }}
                        onClick={() => setSelectedRole(role)}
                    >
                        {role}
                    </button>
                ))}
            </div>

            {/* Add Faculty Form */}
            {showForm && (
                <FacultyForm
                    onSave={() => {
                        setShowForm(false);
                        loadFaculty();
                        showToast("success", "Faculty created successfully");
                    }}
                    onError={(msg) => showToast("error", msg)}
                />
            )}

            {/* Faculty Table */}
            <div className="glass-card" style={{ overflow: "hidden" }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Designation</th>
                            <th>Batch</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                                    Loading faculty...
                                </td>
                            </tr>
                        ) : faculty.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                                    No faculty found.
                                </td>
                            </tr>
                        ) : (
                            faculty.map((f) => (
                                <tr key={f.faculty_id}>
                                    <td style={{ fontWeight: 600 }}>{f.name}</td>
                                    <td>
                                        <span className={`badge ${f.role === "hod" ? "badge-amber" : f.role === "tutor" ? "badge-blue" : "badge-emerald"}`}>
                                            {f.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ color: "var(--text-secondary)" }}>{f.designation}</td>
                                    <td>{f.assigned_batch || "—"}</td>
                                    <td style={{ color: "var(--text-secondary)" }}>{f.email}</td>
                                    <td>
                                        <span className={`badge ${f.status === "active" ? "badge-emerald" : "badge-rose"}`}>
                                            {f.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            style={{ padding: "6px", fontSize: "0.75rem" }}
                                            onClick={() => handleDelete(f.faculty_id)}
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
        </div>
    );
}

function FacultyForm({
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

        const res = await facultyApi.create(data);
        setSaving(false);

        if (res.error) {
            onError(res.error);
        } else {
            onSave();
        }
    }

    return (
        <div className="glass-card" style={{ padding: "24px", marginBottom: "24px" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "20px" }}>Add New Faculty</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    <div>
                        <label className="form-label">Full Name</label>
                        <input name="name" className="form-input" placeholder="Full Name" required />
                    </div>
                    <div>
                        <label className="form-label">Gender</label>
                        <select name="gender" className="form-select" required>
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Date of Birth</label>
                        <input name="dob" type="date" className="form-input" required />
                    </div>
                    <div>
                        <label className="form-label">Blood Group</label>
                        <select name="blood_group" className="form-select" required>
                            <option value="">Select</option>
                            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Role</label>
                        <select name="role" className="form-select" required>
                            <option value="">Select</option>
                            <option value="hod">HOD</option>
                            <option value="tutor">Tutor</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Designation</label>
                        <input name="designation" className="form-input" placeholder="e.g. Assistant Professor" required />
                    </div>
                    <div>
                        <label className="form-label">Assigned Batch (Tutor)</label>
                        <select name="assigned_batch" className="form-select">
                            <option value="">None</option>
                            {["S1", "S2", "S3", "S4", "S5", "S6"].map((b) => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Email</label>
                        <input name="email" type="email" className="form-input" placeholder="email@example.com" required />
                    </div>
                    <div>
                        <label className="form-label">Phone</label>
                        <input name="phone" type="tel" className="form-input" placeholder="9876543210" required />
                    </div>
                    <div>
                        <label className="form-label">Address</label>
                        <input name="address" className="form-input" placeholder="Address" required />
                    </div>
                    <div>
                        <label className="form-label">Place</label>
                        <input name="place" className="form-input" placeholder="Place" required />
                    </div>
                    <div>
                        <label className="form-label">District</label>
                        <input name="district" className="form-input" placeholder="District" required />
                    </div>
                    <div>
                        <label className="form-label">Pincode</label>
                        <input name="pincode" className="form-input" placeholder="680000" required />
                    </div>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                    <button type="submit" className="btn btn-success" disabled={saving}>
                        {saving ? "Saving..." : "✓ Save Faculty"}
                    </button>
                </div>
            </form>
        </div>
    );
}
