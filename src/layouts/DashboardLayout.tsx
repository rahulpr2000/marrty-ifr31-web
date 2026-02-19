import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <main className="main-content" style={{ flex: 1 }}>
                <Outlet />
            </main>
        </div>
    );
}
