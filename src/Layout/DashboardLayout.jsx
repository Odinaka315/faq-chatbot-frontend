// src/components/Layout.jsx
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen text-sm font-sans bg-bg text-text">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen overflow-hidden ml-sidebar ml-[240px]">
        <Topbar />
        <main className="flex-1 px-7 py-7 pb-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
