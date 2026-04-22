import { ShieldCheck, Users, GraduationCap, BookOpen, Zap, PieChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const adminStats = [
    { title: "Total Pengguna", value: "1,284", icon: Users, color: "bg-blue-500" },
    { title: "Guru Aktif", value: "48", icon: GraduationCap, color: "bg-purple-500" },
    { title: "Modul Belajar", value: "24", icon: BookOpen, color: "bg-amber-500" },
    { title: "Engagement", value: "89%", icon: Zap, color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* --- Admin Welcome Section --- */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 text-[#800000] mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Administrator</span>
           </div>
           <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pusat Kendali PeaceCivic</h1>
           <p className="text-gray-500 font-medium">Monitoring performa platform dan integrasi konten secara real-time.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 shadow-sm transition-all cursor-pointer">
              Unduh Laporan
           </button>
           <button className="px-4 py-2 bg-[#800000] text-white rounded-xl text-xs font-bold hover:bg-[#600000] shadow-lg shadow-[#800000]/20 transition-all cursor-pointer">
              Konfigurasi Sistem
           </button>
        </div>
      </section>

      {/* --- Admin Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {adminStats.map((item, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.title}</p>
              <h3 className="text-2xl font-black text-gray-900">{item.value}</h3>
            </div>
            <div className={`p-4 rounded-2xl ${item.color} text-white shadow-lg shadow-opacity-30`}>
              <item.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Activity Feed Placeholder --- */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                 <PieChart className="w-5 h-5 text-[#800000]" />
                 Aktivitas Platform
              </h2>
           </div>
           
           <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-50 rounded-2xl bg-gray-50/50">
              <p className="text-gray-300 font-bold uppercase tracking-widest text-sm">Grafik Statistik Penggunaan</p>
           </div>
        </div>

        {/* --- Quick Management --- */}
        <div className="space-y-6">
           <div className="bg-[#1a1a1a] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group">
              <h2 className="text-lg font-black uppercase tracking-tight mb-4 relative z-10">Manajemen Konten</h2>
              <p className="text-white/60 text-sm mb-6 relative z-10 font-medium">Tambah modul baru, perbarui kurikulum, atau kelola aset media.</p>
              <div className="space-y-3 relative z-10">
                <button className="w-full py-4 bg-[#D4AF37] text-black font-black rounded-2xl text-sm transition-all hover:bg-white active:scale-95 cursor-pointer">
                    Buka Editor Konten
                </button>
                <button 
                    onClick={() => navigate("/admin/badges")}
                    className="w-full py-4 bg-white/10 text-white font-bold rounded-2xl text-sm transition-all hover:bg-white/20 active:scale-95 cursor-pointer"
                >
                    Kelola Lencana
                </button>
              </div>
           </div>
           
           <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-4">Server Status</h2>
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cloudinary</span>
                      <span className="text-xs font-black text-green-500 uppercase">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Database</span>
                      <span className="text-xs font-black text-green-500 uppercase">Optimal</span>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
