import { Outlet, useLocation } from "react-router-dom";
import TopHeader from "./TopHeader";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isManagement = user.role === "TEACHER" || user.role === "ADMIN";

  const isChatRoute = ["/forum", "/team-chat"].includes(location.pathname);

  if (isManagement) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex">
        {/* Management Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header for mobile - hidden on desktop via TopHeader's internal logic */}
          <TopHeader isManagement={true} onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="flex-1 pt-16 md:pt-0 md:pl-72 transition-all duration-300">
             <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
                <Outlet />
             </div>
          </main>
        </div>
        <Toaster />
      </div>
    );
  }

  // Student Layout
  return (
    <div className="app-shell min-h-screen bg-[#F9F6F0] relative overflow-hidden">
      {!isChatRoute && <TopHeader />}

      <main className={`
        ${isChatRoute ? "h-screen" : "pb-20 md:pb-8 md:mt-15"}
      `}>
        <Outlet />
      </main>

      {!isChatRoute && <BottomNav />}
      <Toaster />
    </div>
  );
}
