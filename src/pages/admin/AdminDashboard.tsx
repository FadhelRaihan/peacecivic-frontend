import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  Zap,
  PieChart,
  ArrowUpRight,
  Loader2,
  Rocket
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminService } from "@/api/admin";
import { ChartAreaInteractive } from "@/components/ui/chart-interactive";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [activityData, setActivityData] = useState<any[]>([]);

  const [health, setHealth] = useState<any>({
    database: "Checking...",
    storage: "Checking..."
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewRes, activityRes, healthRes] = await Promise.all([
        adminService.getOverviewStats(),
        adminService.getActivityStats(),
        adminService.getHealthStatus()
      ]);
      setOverview(overviewRes.data.data);
      setActivityData(activityRes.data.data);
      setHealth((prev: any) => ({ ...prev, ...healthRes.data.data }));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !overview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
        <p className="text-gray-500 font-black uppercase tracking-[0.2em]">Sinkronisasi Data...</p>
      </div>
    );
  }

  const adminStats = [
    {
      title: "Total Pejuang",
      value: overview?.totalStudents || 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Guru Pembimbing",
      value: overview?.totalTeachers || 0,
      icon: GraduationCap,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Proyek Selesai",
      value: overview?.totalProjects || 0,
      icon: Rocket,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Poin Terdistribusi",
      value: overview?.totalPointsAwarded.toLocaleString() || "0",
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
  ];

  return (
    <div className="px-4 md:px-8 lg:px-12 md:pt-2 pb-8 space-y-8 animate-in fade-in duration-500">
      {/* --- Admin Welcome Section --- */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#800000]">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Pusat Kendali Utama</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">Dashboard Admin</h1>
          <p className="text-gray-500 font-medium italic text-sm">Monitoring performa platform dan integrasi konten secara real-time.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/reports")}
            className="px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            Analisis Lanjut <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* --- Admin Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((item, idx) => (
          <Card key={idx} className="border-none shadow-xl shadow-gray-100/50 rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.title}</p>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{item.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${item.bg}`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Activity Feed Section --- */}
        <div className="lg:col-span-2">
          <ChartAreaInteractive data={activityData} />
        </div>

        {/* --- Quick Management --- */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-black rounded-2xl p-8 shadow-2xl text-white relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[#D4AF37]/20 transition-all" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white/10 rounded-xl">
                  <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h2 className="text-md font-black uppercase tracking-tight">Kurikulum & Konten</h2>
              </div>
              <p className="text-white/60 text-xs mb-8 font-medium leading-relaxed italic">Kelola modul belajar, tantangan misi, dan sistem lencana penghargaan untuk para pejuang.</p>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/admin/modules")}
                  className="w-full py-4 bg-[#D4AF37] text-[#1a1a1a] font-black uppercase tracking-widest text-[10px] rounded-xl transition-all hover:bg-white active:scale-95 cursor-pointer shadow-lg shadow-[#D4AF37]/20"
                >
                  Manajemen Modul
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate("/admin/missions")}
                    className="py-4 bg-white/5 text-white font-black uppercase tracking-widest text-[9px] rounded-xl transition-all hover:bg-white/10 active:scale-95 cursor-pointer border border-white/10"
                  >
                    Misi
                  </button>
                  <button
                    onClick={() => navigate("/admin/badges")}
                    className="py-4 bg-white/5 text-white font-black uppercase tracking-widest text-[9px] rounded-xl transition-all hover:bg-white/10 active:scale-95 cursor-pointer border border-white/10"
                  >
                    Lencana
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/40 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#800000]" />
                <CardTitle className="text-sm font-black uppercase tracking-tight">Status Infrastruktur</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${health.database === 'Optimal' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Database Engine</span>
                </div>
                <span className={`text-[10px] font-black uppercase ${health.database === 'Optimal' ? 'text-green-600' : 'text-amber-600'}`}>
                  {health.database}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${health.storage === 'Connected' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cloud Storage</span>
                </div>
                <span className={`text-[10px] font-black uppercase ${health.storage === 'Connected' ? 'text-green-600' : 'text-amber-600'}`}>
                  {health.storage}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
