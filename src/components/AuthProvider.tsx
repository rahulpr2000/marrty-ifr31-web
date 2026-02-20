/**
 * Cognito Auth Provider — wraps the app with Amplify Authenticator.
 * Shows a login screen for unauthenticated users.
 */

import { Authenticator, ThemeProvider } from "@aws-amplify/ui-react";
import type { Theme } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

// Dark theme matching the app's design system
const theme: Theme = {
    name: "marrty-dark",
    tokens: {
        colors: {
            background: {
                primary: { value: "#0a0e1a" },
                secondary: { value: "#111827" },
            },
            font: {
                interactive: { value: "#60a5fa" },
            },
            brand: {
                primary: {
                    10: { value: "#1e3a5f" },
                    20: { value: "#1e40af" },
                    40: { value: "#2563eb" },
                    60: { value: "#3b82f6" },
                    80: { value: "#60a5fa" },
                    90: { value: "#93bbfd" },
                    100: { value: "#dbeafe" },
                },
            },
        },
        components: {
            authenticator: {
                router: {
                    borderWidth: { value: "0" },
                    backgroundColor: { value: "#111827" },
                    boxShadow: { value: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" },
                },
            },
            button: {
                primary: {
                    backgroundColor: { value: "#2563eb" },
                    _hover: {
                        backgroundColor: { value: "#1d4ed8" },
                    },
                },
            },
            fieldcontrol: {
                borderColor: { value: "#374151" },
                color: { value: "#e5e7eb" },
                _focus: {
                    borderColor: { value: "#3b82f6" },
                },
            },
            tabs: {
                item: {
                    color: { value: "#9ca3af" },
                    _active: {
                        color: { value: "#60a5fa" },
                        borderColor: { value: "#3b82f6" },
                    },
                },
            },
        },
    },
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg-primary, #0a0e1a)",
                }}
            >
                <Authenticator
                    hideSignUp={true}
                    components={{
                        Header() {
                            return (
                                <div style={{ textAlign: "center", padding: "24px 0 8px" }}>
                                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#e5e7eb" }}>
                                        MARRTY IFR31
                                    </div>
                                    <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "4px" }}>
                                        Face Attendance System
                                    </div>
                                </div>
                            );
                        },
                    }}
                >
                    {children}
                </Authenticator>
            </div>
        </ThemeProvider>
    );
}
