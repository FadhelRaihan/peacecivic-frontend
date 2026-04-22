import { useState, useEffect } from "react";
import ReactPlayer from 'react-player'
import { useParams, useNavigate } from "react-router-dom";
import { moduleService, type Module } from "@/api/module";
import { ChevronLeft, ChevronRight, CheckCircle, Award, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// react-pdf imports
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF worker using CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ModuleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [module, setModule] = useState<Module | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // PDF State
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const containerRef = (node: HTMLDivElement | null) => {
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries[0]) {
          setContainerWidth(entries[0].contentRect.width);
        }
      });
      resizeObserver.observe(node);
    }
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  useEffect(() => {
    const fetchModule = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const response = await moduleService.getModuleBySlug(slug);
        setModule(response.data);
        setIsCompleted(response.is_complete);
      } catch (error) {
        console.error("Failed to fetch module detail:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModule();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleComplete = async () => {
    if (!module || isCompleted) return;
    setIsSubmitting(true);
    try {
      await moduleService.markAsComplete(module.id);
      setIsCompleted(true);
      // Optional: Add success toast or confetti here later
    } catch (error) {
      console.error("Failed to complete module:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Mempersiapkan Lembar Materi...</p>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500 font-bold uppercase tracking-widest">Materi tidak ditemukan</p>
        <Button onClick={() => navigate(-1)} variant="ghost" className="mt-4">Kembali</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Top Header / Navigation */}
      <div className="sticky px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#800000] font-black group"
          >
            <div className="p-1.5 flex items-center gap-2 rounded-lg group-hover:bg-[#800000]/10 transition-colors cursor-pointer">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest hidden md:block">Kembali</span>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <Badge className={`${isCompleted ? 'bg-green-500' : 'bg-orange-500'} text-white border-none uppercase text-[9px] font-black tracking-widest`}>
              {isCompleted ? 'Sudah Selesai' : 'Sedang Dipelajari'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-0 pt-8 space-y-8">
        {/* Title Section */}
        <div className="space-y-4 px-0 md:px-4">
          <div className="flex items-center gap-2">
            <span className="w-10 h-1 bg-[#D4AF37]" />
            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">
              {module.category === 'KEWARGANEGARAAN' ? 'Pancasila & Kebangsaan' : 'Budaya & Tradisi Aceh'}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#800000] tracking-tight uppercase leading-none">
            {module.title}
          </h1>
          <div className="flex items-center gap-6 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5" />
              <span>1 Poin Kedamaian</span>
            </div>
          </div>
        </div>

        {/* Video Player Section */}
        {module.video_url && (
          <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-[#800000] bg-black flex items-center justify-center">
            <ReactPlayer
              src={module.video_url}
              width="100%"
              height="100%"
            />
          </div>
        )}

        {/* PDF Viewer Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 relative overflow-hidden flex flex-col items-center min-h-[400px]">
             {/* Subtle background pattern */}
             <div className="absolute inset-0 opacity-[0.8] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/simple-dashed.png')]" />
             
             {module.pdf_url ? (
              <div ref={containerRef} className="w-full flex flex-col items-center overflow-auto max-w-full relative z-10">
                <Document
                  file={module.pdf_url}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex flex-col items-center py-20 gap-4">
                      <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Memuat Dokumen PDF...</p>
                    </div>
                  }
                  error={
                    <div className="py-20 text-center space-y-4">
                      <FileText className="w-12 h-12 text-gray-200 mx-auto" />
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Gagal memuat PDF.</p>
                    </div>
                  }
                >
                  <Page 
                    pageNumber={pageNumber} 
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="max-w-full shadow-lg border border-gray-100"
                    width={containerWidth}
                  />
                </Document>
              </div>
            ) : (
              <div className="py-20 text-center space-y-4 relative z-10">
                <FileText className="w-12 h-12 text-gray-200 mx-auto" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Belum ada file PDF.</p>
              </div>
            )}
          </div>

          {/* PDF Navigation Controls */}
          {numPages && numPages > 1 && (
            <div className="flex items-center justify-between bg-[#800000] text-white p-4 rounded-2xl border border-white/20 animate-in slide-in-from-bottom duration-500">
              <Button
                disabled={pageNumber <= 1}
                onClick={() => changePage(-1)}
                variant="ghost"
                className="text-white hover:text-[#D4AF37] hover:bg-white/10 px-4 py-2 rounded-xl disabled:opacity-30 border border-white/20 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                <span className="text-xs font-bold uppercase tracking-widest">Prev</span>
              </Button>

              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Halaman</span>
                <span className="text-sm font-black tracking-tighter">{pageNumber} <span className="opacity-40">/</span> {numPages}</span>
              </div>

              <Button
                disabled={pageNumber >= (numPages || 0)}
                onClick={() => changePage(1)}
                variant="ghost"
                className="text-white hover:text-[#D4AF37] hover:bg-white/10 px-4 py-2 rounded-xl disabled:opacity-30 border border-white/20 cursor-pointer"
              >
                <span className="text-xs font-bold uppercase tracking-widest mr-1">Next</span>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="flex flex-col w-full items-center">
          {!isCompleted ? (
            <Button
              onClick={handleComplete}
              disabled={isSubmitting}
              className="bg-[#800000] w-full hover:bg-[#600000] text-white font-black text-sm uppercase tracking-widest py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Mencatat Progres...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-3" />
                  Selesaikan Materi
                </>
              )}
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center border-4 border-white shadow-lg">
                <Award className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-green-600 text-center font-black uppercase tracking-widest text-sm">Materi Selesai! Poin Berhasil Diklaim.</p>
              <Button onClick={() => navigate(-1)} variant="outline" className="border-[#800000] text-[#800000] font-black rounded-xl">
                Kembali ke Daftar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
