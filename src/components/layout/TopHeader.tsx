import { Home, Trophy, MessageSquare, User, LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { label: "Beranda", icon: Home, path: "/" },
  { label: "Leaderboard", icon: Trophy, path: "/leaderboard" },
  { label: "Forum", icon: MessageSquare, path: "/forum" },
  { label: "Profil", icon: User, path: "/profil" },
];

interface TopHeaderProps {
  isManagement?: boolean;
  onMenuClick?: () => void;
}

export default function TopHeader({ isManagement, onMenuClick }: TopHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header 
      className={`
        sticky md:fixed w-full top-0 z-40 bg-[#800000] px-4 md:px-8 py-3 flex items-center justify-between shadow-md transition-all
        ${isManagement ? "md:hidden" : ""}
      `}
    >
      {/* Left: Brand / Sidebar Toggle */}
      <div className="flex items-center gap-3">
        {isManagement && (
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <span className="text-white text-xl font-bold tracking-tight">
          PeaceCivic
        </span>
      </div>

      {/* Center: Desktop Navigation (Hidden in Management) */}
      {!isManagement && (
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                  ${isActive
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/8"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      )}

      {/* Right: User Profile with Dropdown */}
      <div className="flex items-center gap-3 relative">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 focus:outline-none cursor-pointer group"
        >
          <div className="hidden md:flex flex-col text-right mr-1">
             <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest leading-none mb-1">
                {user.role || 'GUEST'}
             </p>
             <p className="text-xs font-bold text-white leading-none">
                {user.full_name?.split(' ')[0] || 'User'}
             </p>
          </div>
          <Avatar className="w-9 h-9 ring-2 ring-white/20 group-hover:ring-[#D4AF37]/50 transition-all">
            <AvatarImage src={user.avatar_url || "/images/avatar-placeholder.png"} alt="User Avatar" />
            <AvatarFallback className="bg-[#D4AF37] text-[#800000] text-xs font-black">
              {user.full_name?.substring(0, 2).toUpperCase() || 'PC'}
            </AvatarFallback>
          </Avatar>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
            <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-2xl py-2 z-20 animate-in fade-in zoom-in-95 slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs font-black text-[#800000] uppercase tracking-tighter">
                  {user.full_name || 'User'}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase truncate">
                  {user.role}
                </p>
              </div>

              <div className="px-2 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar Dashboard
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
