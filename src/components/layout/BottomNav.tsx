import { Home, Trophy, MessageSquare, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Beranda", icon: Home, path: "/" },
  { label: "Leaderboard", icon: Trophy, path: "/leaderboard" },
  { label: "Forum", icon: MessageSquare, path: "/forum" },
  { label: "Profil", icon: User, path: "/profil" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-50 md:hidden">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[60px]
                ${isActive
                  ? "text-[#800000] bg-[#800000]/8 scale-105"
                  : "text-gray-400 hover:text-gray-600"
                }
              `}
              aria-label={item.label}
            >
              <Icon
                className={`w-5 h-5 transition-all duration-200 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`}
              />
              <span className={`text-[10px] font-medium leading-none ${isActive ? "font-semibold" : ""}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#800000] mt-0.5 animate-in fade-in duration-300" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
