/**
 * API client for the Marrty IFR31 backend.
 * Handles all HTTP requests to the API Gateway.
 * Attaches Cognito JWT token for authenticated requests.
 */

import { fetchAuthSession } from "aws-amplify/auth";
import awsConfig from "./aws-config";

const BASE_URL = awsConfig.apiUrl;

export interface ApiResponse<T = unknown> {
    data: T | null;
    error: string | null;
    status: number;
}

async function getAuthToken(): Promise<string | null> {
    try {
        const session = await fetchAuthSession();
        return session.tokens?.idToken?.toString() || null;
    } catch {
        return null;
    }
}

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const token = await getAuthToken();
        const url = `${BASE_URL}${path}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: token } : {}),
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                data: null,
                error: data.message || `HTTP ${response.status}`,
                status: response.status,
            };
        }

        return { data, error: null, status: response.status };
    } catch (err) {
        return {
            data: null,
            error: err instanceof Error ? err.message : "Network error",
            status: 0,
        };
    }
}

// ── Student API ──────────────────────────────────────────

export const studentApi = {
    list: (batch?: string) =>
        request<{ students: any[] }>(`/api/students${batch ? `?batch=${batch}` : ""}`),
    get: (id: string) => request(`/api/students/${id}`),
    create: (data: Record<string, string>) =>
        request("/api/students", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, string>) =>
        request(`/api/students/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
        request(`/api/students/${id}`, { method: "DELETE" }),
};

// ── Faculty API ──────────────────────────────────────────

export const facultyApi = {
    list: (role?: string) =>
        request<{ faculty: any[] }>(`/api/faculty${role ? `?role=${role}` : ""}`),
    get: (id: string) => request(`/api/faculty/${id}`),
    create: (data: Record<string, string>) =>
        request("/api/faculty", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, string>) =>
        request(`/api/faculty/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
        request(`/api/faculty/${id}`, { method: "DELETE" }),
};

// ── Attendance API ───────────────────────────────────────

export const attendanceApi = {
    query: (params: { date?: string; batch?: string; person_id?: string }) => {
        const qs = new URLSearchParams(
            Object.fromEntries(Object.entries(params).filter(([, v]) => v)) as Record<string, string>
        ).toString();
        return request<{ records: any[] }>(`/api/attendance${qs ? `?${qs}` : ""}`);
    },
    report: (date: string, batch?: string) =>
        request<{ report: any }>(`/api/attendance/report?date=${date}${batch ? `&batch=${batch}` : ""}`),
};

// ── Enrollment API ───────────────────────────────────────

export const enrollApi = {
    enroll: (personId: string, images: string[]) =>
        request(`/api/enroll/${personId}`, {
            method: "POST",
            body: JSON.stringify({ images }),
        }),
    remove: (personId: string) =>
        request(`/api/enroll/${personId}`, { method: "DELETE" }),
};
