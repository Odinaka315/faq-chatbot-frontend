import { useState } from "react";
import Sidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg text-text font-sans">
      {/* The Sidebar receives the state */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-[240px] min-w-0 transition-all duration-300">
        {/* The Topbar receives the toggle function */}
        <AdminTopbar toggleSidebar={() => setIsSidebarOpen(true)} />

        {/* The pages render here */}
        <main className="flex-1 p-5 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
