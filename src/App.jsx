// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./Layout/DashboardLayout";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Overview from "./Pages/admin/Overview";
import ExportLogs from "./Pages/admin/ExportLogs";
import StudentLayout from "./Layout/StudentLayout";
import StudentHome from "./Pages/Student/StudentHome";
import Chatbot from "./Pages/Student/Chatbot";
// import StudentChatbot from "./pages/student/StudentChatbot"; // Future student app

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

        {/* 2. The Hidden Backdoor Entry */}
        <Route path="/administration" element={<Login />} />

        {/* 3. The Guarded Admin Dashboard Face */}
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
        <Route path="/chat" element={<Chatbot />} />

        {/* Global Fallback Redirect to Student Face */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
