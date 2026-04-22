import { useEffect, useState } from "react";
import { teacherService, type TeacherStats } from "@/api/teacher";
import { Users, LayoutGrid, ClipboardCheck, Clock, BookCheck, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await teacherService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch teacher stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Siswa",
      value: stats?.statistics.total_students || 0,
      icon: Users,
      color: "from-[#800000] to-[#600000]",
      label: "Siswa Aktif"
    },
    {
      title: "Total Tim",
      value: stats?.statistics.total_teams || 0,
      icon: LayoutGrid,
      color: "from-[#D4AF37] to-[#AA841E]",
      label: "Tim Terdaftar"
    },
    {
      title: "Menunggu Penilaian",
      value: stats?.statistics.pending_grading || 0,
      icon: ClipboardCheck,
      color: "from-[#1a1a1a] to-[#000000]",
      label: "Proyek Baru"
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-[0.2em]">Menyiapkan Berkas Perjuangan...</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-12 md:pt-2 pb-4 space-y-6">
      {/* --- Header Section --- */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#800000] via-[#6a0000] to-[#4a0000] p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-8 bg-[#D4AF37] rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Portal Guru</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Halo, Bapak/Ibu {user.full_name}!
          </h1>
          <p className="mt-2 text-white/70 max-w-lg font-medium">
            Selamat datang di panel kendali. Pantau progres siswa dan berikan penilaian untuk mendukung aksi nyata mereka.
          </p>
        </div>
      </section>

      {/* --- Statistics Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {statCards.map((item, idx) => (
          <div key={idx} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
             <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                  <item.icon className="w-6 h-6" />
                </div>
             </div>
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{item.title}</h3>
             <div className="flex items-end gap-2 mt-1">
                <span className="text-3xl font-black text-gray-900 leading-none">{item.value}</span>
                <span className="text-xs font-bold text-gray-400 mb-1">{item.label}</span>
             </div>
          </div>
        ))}
      </div>

      {/* --- Needs Attention Section --- */}
      <section>
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-xl font-black text-[#800000] uppercase tracking-tight flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Perlu Perhatian Segera
           </h2>
        </div>

        <div className="space-y-3">
          {stats?.needs_attention && stats.needs_attention.length > 0 ? (
            stats.needs_attention.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#800000]/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <BookCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#800000] transition-colors">{item.title}</h4>
                    <p className="text-xs font-medium text-gray-500">Tim: <span className="text-[#800000]">{item.team.team_name}</span></p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate("/teacher/review-proyek")}
                  className="px-4 py-2 bg-[#800000] text-white text-xs font-bold rounded-lg hover:bg-[#600000] shadow-sm transition-all cursor-pointer"
                >
                  Buka Panel Review
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Belum ada antrean penilaian</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
