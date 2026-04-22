import { useState, useEffect } from "react";
import {
    ArrowLeft,
    Trophy,
    FileText,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { projectService, type Project } from "@/api/project";
import { type Badge } from "@/api/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProjectReviewDetailProps {
    project: Project | null;
    badges: Badge[];
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ProjectReviewDetail({
    project,
    badges,
    isOpen,
    onClose,
    onSuccess
}: ProjectReviewDetailProps) {
    const [gradingPoints, setGradingPoints] = useState<number>(100);
    const [feedback, setFeedback] = useState("");
    const [selectedBadgeId, setSelectedBadgeId] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);
    const [showApproveAlert, setShowApproveAlert] = useState(false);

    useEffect(() => {
        if (project) {
            setGradingPoints(project.points_awarded || 100);
            setFeedback(project.teacher_feedback || "");
            // If project is completed, find the badge ID
            // Assuming we have badge info in project or we can find it
            // For now, reset for new reviews
            if (project.status !== 'COMPLETED') {
                setSelectedBadgeId("");
            }
        }
    }, [project]);

    const handleApprovePlan = () => {
        setShowApproveAlert(true);
    };

    const executeApprovePlan = async () => {
        if (!project) return;
        setSubmitting(true);
        try {
            await projectService.approvePlan(project.id);
            toast.success("Rencana disetujui!");
            onSuccess?.();
            onClose();
        } catch (error) {
            toast.error("Gagal menyetujui rencana");
        } finally {
            setSubmitting(false);
            setShowApproveAlert(false);
        }
    };

    const handleFinalize = async () => {
        if (!project) return;
        if (!selectedBadgeId) {
            return toast.error("Mohon pilih lencana untuk tim ini!");
        }

        setSubmitting(true);
        try {
            await projectService.finalizeProject(project.id, {
                points: gradingPoints,
                teacher_feedback: feedback,
                badgeId: selectedBadgeId
            });
            toast.success("Proyek tuntas! Poin dan Lencana telah dibagikan.");
            onSuccess?.();
            onClose();
        } catch (error) {
            toast.error("Gagal merampungkan proyek");
        } finally {
            setSubmitting(false);
        }
    };

    if (!project) return null;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="w-[95vw] md:w-full max-w-5xl h-[95vh] md:h-auto p-0 overflow-hidden border-none bg-transparent shadow-none focus-visible:outline-none">
                    <DialogTitle className="sr-only">Detail Review Proyek</DialogTitle>
                    <Card className="w-full h-full flex flex-col rounded-xl md:rounded-2xl bg-white shadow-2xl overflow-hidden border-none">
                        <div className="bg-[#1a1a1a] text-white p-4 md:p-8 flex items-center gap-2 shrink-0">
                            <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all cursor-pointer">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-3 md:gap-6">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#800000] flex items-center justify-center text-xl md:text-2xl font-black shadow-lg shadow-[#800000]/20">
                                    {project.team?.team_name.slice(0, 1)}
                                </div>
                                <div>
                                    <h2 className="text-lg md:text-2xl font-black uppercase tracking-tight line-clamp-1">{project.title}</h2>
                                    <p className="text-[10px] md:text-xs font-bold text-[#D4AF37] uppercase tracking-[0.2em] mt-0.5 md:mt-1">Tim: {project.team?.team_name}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-10 grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10">
                            {/* Left: Content & Files (3 cols) */}
                            <div className="lg:col-span-3 space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Berkas Dokumentasi
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {project.plan_file_url && (
                                            <a href={project.plan_file_url} target="_blank" rel="noreferrer" className="p-5 rounded-2xl bg-gray-50 border border-transparent hover:border-orange-200 hover:bg-white transition-all flex items-center gap-4 group">
                                                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <span className="block text-sm font-black text-gray-900 uppercase tracking-tight">Rencana Aksi</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Klik untuk Lihat PDF</span>
                                                </div>
                                            </a>
                                        )}

                                        {project.report_files && project.report_files.length > 0 && project.report_files.map((url, index) => (
                                            <a key={index} href={url} target="_blank" rel="noreferrer" className="p-5 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-200 hover:bg-white transition-all flex items-center gap-4 group">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <span className="block text-sm font-black text-gray-900 uppercase tracking-tight">Dokumentasi {index + 1}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Buka Lampiran</span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8 rounded-xl bg-[#F9F6F0] border border-[#E8DCC4] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <AlertCircle className="w-16 h-16" />
                                    </div>
                                    <div className="flex items-center gap-3 text-[#8D6E63] mb-3">
                                        <AlertCircle className="w-5 h-5" />
                                        <span className="text-xs font-black uppercase tracking-[0.2em] italic">Etika Penilaian Guru</span>
                                    </div>
                                    <p className="text-xs text-[#5D4037] font-reguler leading-[1.8]">
                                        Evaluasi dilakukan berdasarkan integritas tim, kedalaman refleksi, serta orisinalitas dalam menyelesaikan tantangan kebhinekaan. Poin dan Lencana adalah bentuk apresiasi moril bagi para agen perubahan.
                                    </p>
                                </div>
                            </div>

                            {/* Right: Grading Form (2 cols) */}
                            <div className="lg:col-span-2 space-y-8 bg-gray-50/50 p-8 rounded-xl border border-gray-100">
                                {project.status === 'PLAN_SUBMITTED' ? (
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-black text-gray-900 leading-tight">Apakah Rencana Tim ini Layak untuk Dilanjutkan?</h3>
                                        <p className="text-sm text-gray-500 font-medium">Dengan menyetujui, tim akan mendapatkan notifikasi untuk mulai melaksanakan tahapan aksi nyata.</p>
                                        <Button
                                            className="w-full h-16 bg-[#800000] hover:bg-[#600000] text-white rounded-xl font-black uppercase tracking-widest shadow-xl border-none shadow-[#800000]/20 mt-4 cursor-pointer"
                                            onClick={handleApprovePlan}
                                            disabled={submitting}
                                        >
                                            {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Setujui Rencana Proyek"}
                                        </Button>
                                    </div>
                                ) : project.status === 'REPORT_SUBMITTED' ? (
                                    <div className="space-y-6 flex flex-col h-full">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nilai Performa (Poin)</label>
                                            <Input
                                                type="number"
                                                value={gradingPoints || 0}
                                                onChange={(e) => setGradingPoints(parseInt(e.target.value))}
                                                className="h-16 bg-white border-2 border-transparent focus:border-[#800000] rounded-2xl font-black text-2xl text-[#800000] text-center"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Pilih Lencana Apresiasi (Wajib)</label>
                                            <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                                                {badges.map(badge => (
                                                    <button
                                                        key={badge.id}
                                                        onClick={() => setSelectedBadgeId(badge.id)}
                                                        className={`
                                              p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 group
                                              ${selectedBadgeId === badge.id
                                                                ? "bg-white border-[#800000] shadow-lg shadow-[#800000]/10"
                                                                : "bg-white border-transparent hover:border-gray-200"}
                                            `}
                                                    >
                                                        <div className={`w-12 h-12 rounded-xl p-2 bg-gray-50 group-hover:scale-110 transition-transform ${selectedBadgeId === badge.id ? 'bg-[#800000]/5' : ''}`}>
                                                            <img src={badge.badge_icon_url} alt={badge.badge_name} className="w-full h-full object-contain" />
                                                        </div>
                                                        <span className={`text-[9px] font-black uppercase tracking-tighter line-clamp-1 ${selectedBadgeId === badge.id ? 'text-[#800000]' : 'text-gray-500'}`}>
                                                            {badge.badge_name}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Pesan Motivasi (Feedback)</label>
                                            <Textarea
                                                placeholder="Tuliskan kata-kata penyemangat untuk tim ini..."
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                className="min-h-[100px] bg-white border-none rounded-2xl p-4 text-sm font-medium resize-none focus:ring-2 focus:ring-[#800000]"
                                            />
                                        </div>

                                        <Button
                                            className="w-full h-16 bg-[#800000] hover:bg-[#600000] text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl mt-auto"
                                            onClick={handleFinalize}
                                            disabled={submitting || !selectedBadgeId}
                                        >
                                            {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Finalisasi & Kirim Nilai"}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-8 text-center py-6">
                                        <div className="w-32 h-32 mx-auto relative">
                                            <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full animate-ping" />
                                            <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-[#D4AF37] shadow-xl">
                                                <Trophy className="w-16 h-16 text-[#D4AF37]" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-2xl text-gray-900 uppercase">Proyek Selesai</h4>
                                            <div className="mt-4 inline-flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
                                                <div className="text-center border-r pr-6 border-gray-100">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Poin Akhir</p>
                                                    <p className="font-black text-[#800000] text-xl">{project.points_awarded}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Tim</p>
                                                    <p className="font-black text-green-600 text-sm">LEGACY AWARDED</p>
                                                </div>
                                            </div>
                                        </div>
                                        {project.teacher_feedback && (
                                            <div className="p-6 rounded-3xl bg-white border-2 border-dashed border-gray-100 italic text-sm text-gray-600 font-serif leading-relaxed">
                                                "{project.teacher_feedback}"
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </DialogContent>
            </Dialog>

            {/* Approval Confirmation Alert */}
            <AlertDialog open={showApproveAlert} onOpenChange={setShowApproveAlert}>
                <AlertDialogContent className="bg-[#FFF9F2] border-2 border-[#E8DCC4] rounded-2xl p-8 max-w-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black text-gray-900 uppercase tracking-tight">Setujui Rencana Proyek?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium text-[#5D4037] leading-relaxed">
                            Tim akan mulai melaksanakan tahapan aksi nyata. Tindakan ini memberikan sinyal transformasi bagi para pejuang kebhinekaan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-3">
                        <AlertDialogCancel className="h-12 rounded-xl border-2 border-gray-100 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all cursor-pointer">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={executeApprovePlan}
                            className="h-12 bg-[#800000] hover:bg-[#600000] text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-[#800000]/20 border-none cursor-pointer"
                        >
                            Iya, Setujui
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
