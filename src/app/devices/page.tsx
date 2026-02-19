"use client";

export default function DevicesPage() {
    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Devices</h1>
                    <p className="page-subtitle">Manage ESP32-S3 attendance devices</p>
                </div>
            </div>

            <div className="glass-card" style={{ padding: "24px" }}>
                <h3 style={{ fontWeight: 700, marginBottom: "16px" }}>🔧 Device Setup Guide</h3>

                <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                    <div style={{ marginBottom: "16px" }}>
                        <strong style={{ color: "var(--text-primary)" }}>1. Create IoT Certificate</strong>
                        <div>Go to AWS IoT Core → Security → Certificates → Create certificate</div>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                        <strong style={{ color: "var(--text-primary)" }}>2. Download Certificates</strong>
                        <div>Download the device cert, private key, and Amazon Root CA 1</div>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                        <strong style={{ color: "var(--text-primary)" }}>3. Attach Policy</strong>
                        <div>
                            Attach the <code style={{ background: "var(--bg-primary)", padding: "2px 6px", borderRadius: "4px" }}>
                                marrty-ifr31-device-policy-dev
                            </code> policy
                        </div>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                        <strong style={{ color: "var(--text-primary)" }}>4. Flash ESP32-S3</strong>
                        <div>Upload the firmware with certificates embedded</div>
                    </div>
                    <div>
                        <strong style={{ color: "var(--text-primary)" }}>5. MQTT Topics</strong>
                        <div style={{ marginTop: "8px" }}>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                                <span className="badge badge-emerald">PUBLISH</span>
                                <code style={{ fontSize: "0.8rem" }}>marrty/DEVICE_ID/recognize</code>
                            </div>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                                <span className="badge badge-blue">SUBSCRIBE</span>
                                <code style={{ fontSize: "0.8rem" }}>marrty/DEVICE_ID/result</code>
                            </div>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <span className="badge badge-amber">STATUS</span>
                                <code style={{ fontSize: "0.8rem" }}>marrty/DEVICE_ID/status</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
