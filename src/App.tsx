import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/Students";
import FacultyPage from "./pages/Faculty";
import AttendancePage from "./pages/Attendance";
import EnrollmentPage from "./pages/Enrollment";
import DevicesPage from "./pages/Devices";
import AuthProvider from "./components/AuthProvider";

// Initialize Amplify (must import before any Amplify usage)
import "./lib/aws-config";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="faculty" element={<FacultyPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="enrollment" element={<EnrollmentPage />} />
            <Route path="devices" element={<DevicesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
