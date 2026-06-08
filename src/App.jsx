import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./Layout/DashboardLayout";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Overview from "./Pages/admin/Overview";
import ExportLogs from "./Pages/admin/ExportLogs";
import StudentLayout from "./Layout/StudentLayout";
import StudentHome from "./Pages/Student/StudentHome";
import Chatbot from "./Pages/Student/Chatbot";
import Student404 from "./Pages/Student/Student404";
import Admin404 from "./Pages/admin/Admin404";
import AdminUnderDev from "./Pages/admin/AdminUnderDev";
import StudentComingSoon from "./Pages/Student/StudentComingSoon";

export default function App() {
  return (
    <div>
      <Routes>
        {/* 1. Pure Student Front-Face */}
        <Route
          path="/"
          element={
            <StudentLayout>
              <StudentHome />
            </StudentLayout>
          }
        />
        <Route
          path="*"
          element={
            <StudentLayout>
              <Student404 />
            </StudentLayout>
          }
        />
        <Route path="/chat" element={<Chatbot />} />
        <Route
          path="/pagecomingsoon"
          element={
            <StudentLayout>
              <StudentComingSoon />
            </StudentLayout>
          }
        />

        <Route path="/administration" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Overview />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/export"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ExportLogs />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Global Fallback Redirect to Student Face */}

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Admin404 />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/adminunderdev"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AdminUnderDev />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
