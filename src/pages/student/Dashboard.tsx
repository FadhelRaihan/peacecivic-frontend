import { useState, useEffect } from "react";
import { Trophy, ChevronRight, Users, Sparkles, UserPlus, LogIn, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { userService, type UserProfile } from "@/api/user";
import CreateTeamDialog from "@/components/team/CreateTeamDialog";
import JoinTeamDialog from "@/components/team/JoinTeamDialog";

// --- Feature Cards Data ---
const features = [
  {
    id: 1,
    title: "Modul Belajar",
    subtitle: "Materi Pancasila",
    image: "/images/Book-Icon.svg",
    path: "/modul",
    bgColor: "from-[#5a1a1a] to-[#3d0f0f]",
  },
  {
    id: 2,
    title: "Duek Pakat",
    subtitle: "Forum Musyawarah",
    image: "/images/Group-Discusion.svg",
    path: "/team-chat",
    bgColor: "from-[#4a3d1a] to-[#2e250f]",
  },
  {
    id: 3,
    title: "Budaya Aceh",
    subtitle: "Kearifan Lokal",
    image: "/images/Rumah-Icon.svg",
    path: "/budaya",
    bgColor: "from-[#2d4a1a] to-[#1a2e0f]",
  },
  {
    id: 4,
    title: "Peace Project",
    subtitle: "Aksi Sosial",
    image: "/images/Peace-Love.png",
    path: "/proyek",
    bgColor: "from-[#4a1a2d] to-[#2e0f1a]",
  },
];

// --- Helper to get initials from name ---
const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showJoinTeam, setShowJoinTeam] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getProfile();
      setUserData(response.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Menyiapkan Dashboard Perjuangan...</p>
      </div>
    );
  }

  const teamMembers = userData?.team?.members || [];
  const displayMembers = teamMembers.slice(0, 3);
  const remainingCount = teamMembers.length > 3 ? teamMembers.length - 3 : 0;

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-6 pb-4 space-y-3 md:space-y-4">
      <h1 className="text-lg md:text-3xl text-center font-bold text-[#6a0000] mb-6 md:mb-10">Belajar Damai & Demokrasi</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 items-stretch">
        {/* --- Greeting Section --- */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#800000] via-[#6a0000] to-[#4a0000] p-5 md:p-6 text-white flex flex-col justify-center min-h-[140px] md:min-h-[160px]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full -ml-10 -mb-10 blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1 rounded-md bg-[#D4AF37]/20">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              </div>
              <span className="text-[10px] text-white/80 font-bold uppercase tracking-[0.2em]">
                Selamat Datang
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight mb-2">
              Halo, <span className="text-[#D4AF37]">{userData?.profile.full_name.split(' ')[0]}!</span>
            </h1>
            <div className="flex items-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full shadow-inner group transition-all hover:bg-white/20">
                <div className="bg-[#D4AF37] p-1 rounded-full shadow-sm group-hover:rotate-12 transition-transform">
                  <Trophy className="w-2.5 h-2.5 text-[#800000]" />
                </div>
                <span className="text-[13px] font-bold text-[#D4AF37]">
                  {userData?.profile.points || 0} <span className="text-white/90 font-medium ml-0.5">Poin Kedamaian</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* --- Team Card Section --- */}
        {userData?.team ? (
          <Card className="rounded-3xl border-none bg-white flex flex-col transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden relative group min-h-[140px] md:min-h-[160px]">
            <CardHeader className="pb-2 pt-5 px-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#800000]/5 flex items-center justify-center shadow-inner">
                    <Users className="w-5 h-5 text-[#800000]" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-extrabold text-gray-900 tracking-tight">
                      {userData.team.team_name}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Tim Aktif</p>
                    </div>
                  </div>
                </div>

                {/* Team members mini avatars dynamically */}
                <div className="flex -space-x-2.5">
                  {displayMembers.map((member) => (
                    <div
                      key={member.id}
                      title={member.full_name}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-[#800000]/10 to-[#800000]/20 border-2 border-white flex items-center justify-center shadow-sm relative group cursor-pointer overflow-hidden"
                    >
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt={member.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[9px] font-bold text-[#800000]">
                          {getInitials(member.full_name)}
                        </span>
                      )}
                    </div>
                  ))}
                  {remainingCount > 0 && (
                    <div className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center shadow-sm">
                      <span className="text-[9px] font-bold text-gray-400">+{remainingCount}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0 flex flex-col flex-1 justify-between">
              <div className="mb-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Kode Undangan</p>
                <div
                  onClick={() => copyToClipboard(userData.team?.invite_code || "")}
                  className="flex items-center justify-between bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl px-3 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors group/code"
                >
                  <span className="text-lg font-black text-[#800000] tracking-[0.2em]">{userData.team.invite_code}</span>
                  {isCopied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 animate-in zoom-in" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-300 group-hover/code:text-[#800000] transition-colors" />
                  )}
                </div>
              </div>

              <Button
                onClick={() => navigate("/proyek")}
                className="w-full bg-[#800000] hover:bg-[#600000] text-white font-bold rounded-xl h-10 text-xs transition-all duration-300 hover:shadow-lg shadow-md group border-none cursor-pointer"
              >
                Proyek Aksi
                <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-3xl border-none bg-white flex flex-col transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden min-h-[140px] md:min-h-[160px]">
            <CardHeader className="pb-1 pt-5 px-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner">
                  <Users className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <CardTitle className="text-base font-extrabold text-gray-900 tracking-tight">
                    Mulai Beraksi
                  </CardTitle>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Belum ada tim</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-3 flex flex-col gap-2 flex-1 justify-center">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowCreateTeam(true)}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#800000]/5 hover:bg-[#800000]/10 border-2 border-transparent hover:border-[#800000]/20 transition-all group cursor-pointer"
                >
                  <LogIn className="w-5 h-5 text-[#800000] group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black text-[#800000] uppercase tracking-tighter">Buat Tim</span>
                </button>
                <button
                  onClick={() => setShowJoinTeam(true)}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 border-2 border-transparent hover:border-[#D4AF37]/20 transition-all group cursor-pointer"
                >
                  <UserPlus className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-tighter">Gabung Tim</span>
                </button>
              </div>
              <p className="text-[9px] text-center text-gray-400 font-medium italic mt-1">
                "Bekerja bersama untuk dampak yang lebih besar"
              </p>
            </CardContent>
          </Card>
        )}

        {/* --- Quick Actions (Leaderboard) --- */}
        <button
          onClick={() => navigate("/leaderboard")}
          className="group relative overflow-hidden rounded-3xl bg-[#D4AF37] p-5 md:p-6 text-left hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex flex-col justify-between min-h-[140px] md:min-h-[160px]"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/30 transition-colors" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/5 rounded-full blur-xl" />

          <div className="relative z-10 flex items-start justify-between w-full">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500">
              <Trophy className="w-6 h-6 md:w-7 md:h-7 text-white drop-shadow-md" />
            </div>
            <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-xl group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="relative z-10 mt-auto">
            <h3 className="text-lg md:text-xl font-black text-white leading-tight tracking-tight uppercase">
              Leaderboard
            </h3>
            <p className="text-[10px] md:text-[11px] text-white/80 mt-0.5 font-medium max-w-[150px]">
              Kejar posisi teratas sekarang!
            </p>
          </div>
        </button>
      </div>

      {/* --- Feature Cards Section --- */}
      <section>
        <h2 className="text-[15px] md:text-base font-bold text-[#6a0000] mb-2">Ruang Pembelajaran</h2>

        <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-4 gap-3 md:gap-5">
          {features.map((feature) => (
            <div
              key={feature.id}
              onClick={() => navigate(feature.path)}
              className="group relative flex flex-col bg-[#121212] rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
            >
              <div className={`relative bg-gradient-to-br ${feature.bgColor} flex `}>
                <div className="flex justify-center z-10 w-full h-18 md:h-48 lg:h-48 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#121212] to-transparent" />
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full"
                  />
                </div>
              </div>

              <div className="flex flex-col flex-1 mt-3">
                <div className="flex flex-col items-center mb-1.5 px-6">
                  <h3 className="text-sm text-center md:text-lg font-black text-white leading-tight tracking-tight uppercase">
                    {feature.title}
                  </h3>
                  <p className="text-center text-[10px] md:text-[11px] text-white/60 font-medium mb-4 line-clamp-1">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dialog Components */}
      <CreateTeamDialog
        open={showCreateTeam}
        onOpenChange={setShowCreateTeam}
        onSuccess={fetchProfile}
      />
      <JoinTeamDialog
        open={showJoinTeam}
        onOpenChange={setShowJoinTeam}
        onSuccess={fetchProfile}
      />
    </div>
  );
}
