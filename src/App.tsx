import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/Students";
import FacultyPage from "./pages/Faculty";
import AttendancePage from "./pages/Attendance";
import EnrollmentPage from "./pages/Enrollment";
import DevicesPage from "./pages/Devices";

function App() {
  return (
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
  );
}

export default App;
