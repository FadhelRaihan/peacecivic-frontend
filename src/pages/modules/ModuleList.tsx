import { useState, useEffect } from "react";
import { moduleService, type ModuleListItem } from "@/api/module";
import { BookOpen, Map, CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ModuleListProps {
  category: 'KEWARGANEGARAAN' | 'BUDAYA';
  title: string;
  subtitle: string;
}

export default function ModuleList({ category, title, subtitle }: ModuleListProps) {
  const [modules, setModules] = useState<ModuleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      setIsLoading(true);
      try {
        const response = await moduleService.getAllModules(category);
        setModules(response.data);
      } catch (error) {
        console.error("Failed to fetch modules:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModules();
  }, [category]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Membuka Gulungan Materi...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-[#800000] pb-8 relative">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-[#800000] rounded-xl shadow-lg">
                {category === 'KEWARGANEGARAAN' ? <BookOpen className="w-6 h-6 text-[#D4AF37]" /> : <Map className="w-6 h-6 text-[#D4AF37]" />}
             </div>
             <h1 className="text-3xl md:text-5xl font-black text-[#800000] tracking-tighter uppercase">{title}</h1>
          </div>
          <p className="text-gray-500 font-bold tracking-widest text-xs md:text-sm uppercase max-w-xl">{subtitle}</p>
        </div>
        
        <div className="hidden md:block text-right">
           <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">Total Materi</span>
           <p className="text-4xl font-black text-[#800000] leading-none">{modules.length}</p>
        </div>
        
        <div className="absolute -bottom-1 left-0 w-32 h-1 bg-[#D4AF37]" />
      </div>

      {/* Grid Section */}
      {modules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((item) => (
            <Card 
              key={item.id}
              onClick={() => navigate(`/modul/${item.slug}`)}
              className="group relative pt-0 overflow-hidden rounded-2xl border-none bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col h-full"
            >
              {/* Thumbnail Area */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={item.thumbnail_url || "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070"} 
                  alt={item.title}
                  className="w-full h-full object-fill transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                {item.is_completed && (
                  <div className="absolute top-4 left-4">
                     <Badge className="bg-green-500 hover:bg-green-600 text-white border-none px-3 py-1 flex items-center gap-1 shadow-lg animate-in zoom-in">
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Selesai</span>
                     </Badge>
                  </div>
                )}
              </div>

              {/* Content Area */}
              <CardContent className="px-6 py-2 flex flex-col flex-1 justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-0.5 bg-[#D4AF37]" />
                    <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest leading-none">
                      {category === 'KEWARGANEGARAAN' ? 'Pancasila & Civic' : 'Budaya & Tradisi'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#800000] leading-tight tracking-tight uppercase group-hover:text-[#600000] transition-colors">{item.title}</h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Klik untuk belajar</span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#800000] transition-all">
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-4">
           <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto">
              <BookOpen className="w-10 h-10 text-gray-200" />
           </div>
           <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm">Belum ada materi untuk kategori ini</p>
        </div>
      )}
    </div>
  );
}
