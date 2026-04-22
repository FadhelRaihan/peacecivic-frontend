import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, BookOpen, BarChart, Settings, 
  Users2, ClipboardCheck, LogOut, X, ShieldCheck, Trophy
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const adminMenu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Kelola Badge", icon: Trophy, path: "/admin/badges" },
    { label: "Manajemen User", icon: Users, path: "/admin/users" },
    { label: "Konten Modul", icon: BookOpen, path: "/admin/modules" },
    { label: "Laporan Statistik", icon: BarChart, path: "/admin/reports" },
    { label: "Pengaturan", icon: Settings, path: "/admin/settings" },
  ];

  const teacherMenu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Kelola Siswa", icon: Users, path: "/teacher/kelola-siswa" },
    { label: "Manajemen Tim", icon: Users2, path: "/teacher/manajemen-tim" },
    { label: "Penilaian Proyek", icon: ClipboardCheck, path: "/teacher/review-proyek" },
  ];

  const menuItems = role === "ADMIN" ? adminMenu : teacherMenu;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-all"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 h-full w-72 bg-[#1a1a1a] text-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 flex flex-col
        `}
      >
        {/* Header/Logo */}
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#800000] to-[#600000] flex items-center justify-center shadow-lg shadow-[#800000]/20">
                <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
             </div>
             <div>
                <h2 className="text-lg font-black tracking-tighter leading-none">PEACE CIVIC</h2>
                <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-[0.2em]">Management</span>
             </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden p-2 hover:bg-white/5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Summary */}
        <div className="p-6 pb-2">
            <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/5">
                <Avatar className="w-10 h-10 border border-[#D4AF37]/30">
                  <AvatarImage src={user.avatar_url || "/images/avatar-placeholder.png"} />
                  <AvatarFallback className="bg-[#D4AF37] text-[#800000] text-xs font-black">
                    {user.full_name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate leading-none mb-1">{user.full_name}</p>
                    <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest opacity-80">{role}</p>
                </div>
            </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group cursor-pointer
                  ${isActive 
                    ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-black" : "text-gray-500 group-hover:text-white"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer group"
          >
            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-500" />
            Keluar Dashboard
          </button>
        </div>
      </aside>
    </>
  );
}
