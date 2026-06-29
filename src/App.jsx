import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./Layout/DashboardLayout";
import Login from "./Pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Overview from "./Pages/admin/Overview";
import RunTestSuite from "./Pages/admin/RunTestSuite";
import ExportLogs from "./Pages/admin/ExportLogs";
import StudentLayout from "./Layout/StudentLayout";
import StudentHome from "./Pages/Student/StudentHome";
import Chatbot from "./Pages/Student/Chatbot";
import Student404 from "./Pages/Student/Student404";
import Admin404 from "./Pages/admin/Admin404";
import AdminUnderDev from "./Pages/admin/AdminUnderDev";
import StudentComingSoon from "./Pages/Student/StudentComingSoon";
import AddFAQ from "./Pages/admin/AddFaq";
import QueryLogs from "./Pages/admin/QueryLogs";
import FAQManager from "./Pages/admin/FAQManager";

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
        <Route
          path="/dashboard/test-suite"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <RunTestSuite />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/add-faq"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AddFAQ />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/logs"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AddFAQ />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/faqs"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <FAQManager />
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
