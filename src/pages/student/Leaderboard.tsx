import { useState, useEffect } from "react";
import { leaderboardService, type LeaderboardUser } from "@/api/leaderboard";
import { Trophy, Medal, Crown, Loader2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await leaderboardService.getLeaderboard();
        setLeaders(response.data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Menyusun Peringkat Terbaik...</p>
      </div>
    );
  }

  const top3 = leaders.slice(0, 3);
  const theRest = leaders.slice(3);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#800000] shadow-xl mb-4 group hover:scale-110 transition-transform">
           <Trophy className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-[#800000] tracking-tighter uppercase">Papan Peringkat</h1>
        <p className="text-gray-500 font-bold tracking-widest text-[10px] uppercase">Apresiasi bagi para pejuang perdamaian terbaik</p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 pt-10">
        {/* Rank 2 */}
        {top3[1] && (
          <div className="flex flex-col items-center gap-3 order-2 md:order-1 animate-in slide-in-from-bottom-8 duration-700">
            <div className="relative group">
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Medal className="w-6 h-6 text-slate-400" />
               </div>
               <Avatar className="w-20 h-20 border-4 border-slate-300 shadow-lg group-hover:scale-105 transition-transform">
                  <AvatarImage src={top3[1].avatar_url || ""} />
                  <AvatarFallback className="bg-slate-300 text-slate-600 font-black">{top3[1].full_name.substring(0,2).toUpperCase()}</AvatarFallback>
               </Avatar>
               <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center border-2 border-white shadow-md">
                  <span className="text-xs font-black text-slate-600">2</span>
               </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-gray-800 leading-none">{top3[1].full_name.split(' ')[0]}</p>
              <p className="text-[10px] font-bold text-[#800000] mt-1">{top3[1].points.toLocaleString()} PTS</p>
            </div>
            <div className="w-24 h-24 bg-slate-100 rounded-t-2xl shadow-inner border-x border-t border-slate-200 hidden md:block" />
          </div>
        )}

        {/* Rank 1 */}
        {top3[0] && (
          <div className="flex flex-col items-center gap-4 order-1 md:order-2 animate-in slide-in-from-bottom-12 duration-1000">
            <div className="relative group">
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce">
                  <Crown className="w-8 h-8 text-[#D4AF37]" />
               </div>
               <Avatar className="w-28 h-28 border-4 border-[#D4AF37] shadow-xl group-hover:scale-110 transition-transform bg-white">
                  <AvatarImage src={top3[0].avatar_url || ""} />
                  <AvatarFallback className="bg-[#D4AF37] text-[#800000] font-black text-xl">{top3[0].full_name.substring(0,2).toUpperCase()}</AvatarFallback>
               </Avatar>
               <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center border-4 border-white shadow-xl">
                  <span className="text-sm font-black text-[#800000]">1</span>
               </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-[#800000] tracking-tight leading-none">{top3[0].full_name.split(' ')[0]}</p>
              <p className="text-xs font-black text-[#D4AF37] mt-1 tracking-widest">{top3[0].points.toLocaleString()} PTS</p>
            </div>
            <div className="w-32 h-32 bg-gradient-to-t from-[#D4AF37]/20 to-[#D4AF37]/5 rounded-t-3xl shadow-inner border-x-2 border-t-2 border-[#D4AF37]/30 hidden md:block" />
          </div>
        )}

        {/* Rank 3 */}
        {top3[2] && (
          <div className="flex flex-col items-center gap-3 order-3 animate-in slide-in-from-bottom-6 duration-500">
            <div className="relative group">
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Medal className="w-6 h-6 text-[#CD7F32]" />
               </div>
               <Avatar className="w-20 h-20 border-4 border-[#CD7F32]/50 shadow-lg group-hover:scale-105 transition-transform">
                  <AvatarImage src={top3[2].avatar_url || ""} />
                  <AvatarFallback className="bg-[#CD7F32]/30 text-[#800000] font-black">{top3[2].full_name.substring(0,2).toUpperCase()}</AvatarFallback>
               </Avatar>
               <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#CD7F32]/50 flex items-center justify-center border-2 border-white shadow-md">
                  <span className="text-xs font-black text-white">3</span>
               </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-gray-800 leading-none">{top3[2].full_name.split(' ')[0]}</p>
              <p className="text-[10px] font-bold text-[#800000] mt-1">{top3[2].points.toLocaleString()} PTS</p>
            </div>
            <div className="w-24 h-16 bg-orange-50/50 rounded-t-2xl shadow-inner border-x border-t border-orange-100 hidden md:block" />
          </div>
        )}
      </div>

      {/* Leaderboard List */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="p-6 md:p-8 space-y-1">
          {theRest.length > 0 ? (
            theRest.map((user, index) => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 text-center font-black text-gray-300 group-hover:text-[#800000] transition-colors">{index + 4}</span>
                  <Avatar className="w-10 h-10 border border-gray-100 group-hover:scale-110 transition-transform">
                    <AvatarImage src={user.avatar_url || ""} />
                    <AvatarFallback className="bg-gray-100 text-gray-400 font-bold text-xs uppercase">{user.full_name.substring(0,2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-black text-gray-800 group-hover:text-[#800000] transition-colors leading-none mb-1">{user.full_name}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{user.class_room || "General Class"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#800000] tracking-tight">{user.points.toLocaleString()} PTS</p>
                </div>
              </div>
            ))
          ) : (
             !top3.length && (
                <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                        <User className="w-8 h-8 text-gray-200" />
                    </div>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Belum ada peringkat untuk ditampilkan</p>
                </div>
             )
          )}
        </div>
      </div>
    </div>
  );
}
