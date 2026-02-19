"use client";

import { useState, useRef } from "react";
import { enrollApi } from "@/lib/api";

export default function EnrollmentPage() {
    const [personId, setPersonId] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files) return;

        const newImages: string[] = [];
        const newPreviews: string[] = [];

        Array.from(files).forEach((file) => {
            if (images.length + newImages.length >= 10) return;

            const reader = new FileReader();
            reader.onload = () => {
                const base64 = (reader.result as string).split(",")[1];
                newImages.push(base64);
                newPreviews.push(reader.result as string);

                if (newImages.length === Math.min(files.length, 10 - images.length)) {
                    setImages([...images, ...newImages]);
                    setPreviews([...previews, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
    }

    function removeImage(index: number) {
        setImages(images.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    }

    async function handleEnroll() {
        if (!personId.trim()) {
            setResult({ success: false, message: "Person ID is required (e.g., STU-ABC123 or FAC-DEF456)" });
            return;
        }
        if (images.length === 0) {
            setResult({ success: false, message: "At least 1 photo is required" });
            return;
        }

        setLoading(true);
        const res = await enrollApi.enroll(personId.trim(), images);
        setLoading(false);

        if (res.error) {
            setResult({ success: false, message: res.error });
        } else {
            setResult({ success: true, message: "Face enrollment completed successfully!" });
            setImages([]);
            setPreviews([]);
            setPersonId("");
        }
    }

    async function handleRemoveFaces() {
        if (!personId.trim()) {
            setResult({ success: false, message: "Person ID is required" });
            return;
        }
        if (!confirm(`Remove all enrolled faces for ${personId}?`)) return;

        setLoading(true);
        const res = await enrollApi.remove(personId.trim());
        setLoading(false);

        if (res.error) {
            setResult({ success: false, message: res.error });
        } else {
            setResult({ success: true, message: "All faces removed successfully" });
        }
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Face Enrollment</h1>
                    <p className="page-subtitle">Upload photos to register faces for recognition</p>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* Upload Section */}
                <div className="glass-card" style={{ padding: "24px" }}>
                    <h3 style={{ fontWeight: 700, marginBottom: "20px" }}>📸 Upload Photos</h3>

                    <div style={{ marginBottom: "16px" }}>
                        <label className="form-label">Person ID</label>
                        <input
                            className="form-input"
                            placeholder="e.g. STU-ABC123 or FAC-DEF456"
                            value={personId}
                            onChange={(e) => setPersonId(e.target.value)}
                        />
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <label className="form-label">Face Photos (1-10)</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                border: "2px dashed var(--border)",
                                borderRadius: "var(--radius)",
                                padding: "40px",
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "border-color 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent-blue)")}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                        >
                            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📷</div>
                            <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                                Click to upload photos
                            </div>
                            <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "4px" }}>
                                JPEG/PNG · Max 10 photos
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: "none" }}
                            onChange={handleFileSelect}
                        />
                    </div>

                    {/* Image Previews */}
                    {previews.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", marginBottom: "16px" }}>
                            {previews.map((src, i) => (
                                <div
                                    key={i}
                                    style={{ position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: "1" }}
                                >
                                    <img src={src} alt={`Photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    <button
                                        onClick={() => removeImage(i)}
                                        style={{
                                            position: "absolute",
                                            top: "4px",
                                            right: "4px",
                                            background: "rgba(0,0,0,0.6)",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: "20px",
                                            height: "20px",
                                            cursor: "pointer",
                                            fontSize: "0.7rem",
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "16px" }}>
                        {images.length} / 10 photos selected
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="btn btn-success" onClick={handleEnroll} disabled={loading}>
                            {loading ? "Enrolling..." : "✓ Enroll Faces"}
                        </button>
                        <button className="btn btn-danger" onClick={handleRemoveFaces} disabled={loading}>
                            🗑 Remove Faces
                        </button>
                    </div>
                </div>

                {/* Instructions + Result */}
                <div>
                    <div className="glass-card" style={{ padding: "24px", marginBottom: "20px" }}>
                        <h3 style={{ fontWeight: 700, marginBottom: "16px" }}>📋 Instructions</h3>
                        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                            <div>1. Enter the <strong>Student ID</strong> (STU-xxx) or <strong>Faculty ID</strong> (FAC-xxx)</div>
                            <div>2. Upload <strong>1-10 clear face photos</strong></div>
                            <div>3. Photos should have <strong>good lighting</strong> and <strong>clear face visibility</strong></div>
                            <div>4. Include photos from <strong>different angles</strong> for better accuracy</div>
                            <div>5. Click <strong>Enroll Faces</strong> to upload and index</div>
                            <div style={{ marginTop: "12px", color: "var(--accent-amber)" }}>
                                ⚠️ More photos = better recognition accuracy
                            </div>
                        </div>
                    </div>

                    {/* Result */}
                    {result && (
                        <div
                            className="glass-card"
                            style={{
                                padding: "20px",
                                borderLeft: `3px solid ${result.success ? "var(--accent-emerald)" : "var(--accent-rose)"}`,
                            }}
                        >
                            <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                                {result.success ? "✅ Success" : "❌ Error"}
                            </div>
                            <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                                {result.message}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
