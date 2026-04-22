import { useState, useEffect } from "react";
import { 
  Trophy, 
  Plus, 
  Trash2, 
  Upload,
  Loader2,
  Image as ImageIcon,
  ArrowLeft,
  Search
} from "lucide-react";
import { badgeService, type Badge } from "@/api/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

export default function ManageBadges() {
  const navigate = useNavigate();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // New Badge Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);

  const fetchBadges = async () => {
    try {
      const res = await badgeService.getAllBadges();
      setBadges(res.data);
    } catch (error) {
      toast.error("Gagal mengambil data lencana");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleCreateBadge = async () => {
    if (!name || !description || !iconFile) {
        return toast.error("Mohon lengkapi seluruh data lencana!");
    }

    setSubmitting(true);
    try {
        const formData = new FormData();
        formData.append("badge_name", name);
        formData.append("description", description);
        formData.append("badge_icon", iconFile);

        await badgeService.createBadge(formData);
        toast.success("Lencana baru berhasil ditambahkan!");
        
        // Reset Form
        setName("");
        setDescription("");
        setIconFile(null);
        setShowAddForm(false);
        fetchBadges();
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Gagal membuat lencana");
    } finally {
        setSubmitting(false);
    }
  };

  const handleDeleteBadge = async (id: string) => {
    if (!confirm("Hapus lencana ini?")) return;
    
    try {
        await badgeService.deleteBadge(id);
        toast.success("Lencana dihapus.");
        fetchBadges();
    } catch (error) {
        toast.error("Gagal menghapus lencana");
    }
  };

  const filteredBadges = badges.filter(b => 
    b.badge_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* --- Header Section --- */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 text-[#800000] mb-1">
              <Trophy className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Gamifikasi</span>
           </div>
           <h1 className="text-3xl font-black text-gray-900 tracking-tight">Kelola Lencana</h1>
           <p className="text-gray-500 font-medium">Tambah lencana baru untuk mengapresiasi perjuangan tim siswa.</p>
        </div>
        <div className="flex gap-2">
           <Button 
                variant="outline" 
                onClick={() => navigate("/")}
                className="rounded-xl font-bold border-gray-200"
           >
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
           </Button>
           <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-[#800000] hover:bg-[#600000] rounded-xl font-bold px-6 shadow-lg shadow-[#800000]/20"
           >
              {showAddForm ? "Tutup Panel" : <><Plus className="w-4 h-4 mr-2" /> Upload Lencana Baru</>}
           </Button>
        </div>
      </section>

      {/* --- Add Badge Form Panel --- */}
      {showAddForm && (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 animate-in slide-in-from-top-6 duration-500">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6">Informasi Lencana Baru</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nama Lencana Kehormatan</label>
                        <Input 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Sang Penjaga Damai"
                            className="h-14 bg-gray-50 border-none rounded-2xl font-bold text-lg focus:ring-2 focus:ring-[#800000]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Narasi / Deskripsi Lencana</label>
                        <Textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Deskripsikan kriteria atau makna dibalik lencana ini secara detail..."
                            className="min-h-[160px] bg-gray-50 border-none rounded-2xl p-6 text-sm font-medium resize-none focus:ring-2 focus:ring-[#800000]"
                        />
                    </div>
                </div>
                <div className="space-y-6 flex flex-col">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 text-center">Desain Icon Lencana</label>
                    <div className="flex-1 relative group cursor-pointer">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 opacity-0 z-20 cursor-pointer"
                        />
                        <div className="h-full min-h-[220px] border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center bg-gray-50 group-hover:border-[#D4AF37] group-hover:bg-white transition-all duration-300 relative overflow-hidden">
                            {iconFile ? (
                                <div className="flex flex-col items-center gap-4 animate-in zoom-in-95">
                                    <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center p-3">
                                        <img src={URL.createObjectURL(iconFile)} alt="Preview" className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-[10px] font-black text-[#D4AF37] truncate max-w-[200px] uppercase tracking-widest">{iconFile.name}</span>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                        <Upload className="w-8 h-8 text-gray-300 group-hover:text-[#800000]" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase text-gray-400">Tarik atau Pilih File</p>
                                    <p className="text-[9px] text-gray-300 mt-1">SVG, PNG, atau JPG (Transparan disarankan)</p>
                                </>
                            )}
                        </div>
                    </div>
                    <Button 
                        onClick={handleCreateBadge}
                        disabled={submitting}
                        className="h-16 bg-[#800000] hover:bg-[#600000] text-white font-black uppercase tracking-widest shadow-2xl rounded-2xl"
                    >
                        {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Publikasikan Lencana"}
                    </Button>
                </div>
            </div>
        </div>
      )}

      {/* --- Badge List Section --- */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                Daftar Koleksi Lencana
                <span className="bg-gray-100 text-gray-400 text-[10px] px-3 py-1 rounded-full">{badges.length} Unit</span>
            </h2>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                    placeholder="Cari lencana..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-gray-50 border-none rounded-2xl w-full md:w-64 font-bold"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-40 bg-gray-50 rounded-3xl animate-pulse" />
                ))
            ) : filteredBadges.length === 0 ? (
                <div className="col-span-full h-64 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 bg-gray-50/50">
                    <div className="p-5 bg-white rounded-full">
                        <ImageIcon className="w-10 h-10 text-gray-200" />
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Arsip Lencana Kosong</p>
                </div>
            ) : (
                filteredBadges.map((badge) => (
                <div key={badge.id} className="group flex flex-col gap-4 bg-white rounded-[2rem] p-6 border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-2xl hover:shadow-[#D4AF37]/5 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700" />
                    
                    <div className="flex items-start justify-between relative z-10">
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl shadow-sm p-3 flex items-center justify-center group-hover:bg-white transition-colors duration-500">
                            <img src={badge.badge_icon_url} alt={badge.badge_name} className="w-full h-full object-contain" />
                        </div>
                        <button 
                            onClick={() => handleDeleteBadge(badge.id)}
                            className="p-2 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-1 relative z-10">
                        <h4 className="font-black text-gray-900 uppercase tracking-tight text-lg group-hover:text-[#800000] transition-colors">{badge.badge_name}</h4>
                        <p className="text-xs text-gray-500 font-medium line-clamp-3 leading-relaxed">{badge.description}</p>
                    </div>
                </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
}
