import { useState, useEffect } from "react";
import {
    CheckCircle2,
    Clock,
    Upload,
    ArrowLeft,
    AlertCircle,
    Trophy,
    Download,
    Loader2,
    Lock,
    Plus,
    History,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { projectService, type Project } from "@/api/project";
import { userService } from "@/api/user";
import { toast } from "sonner";

export default function PeaceProject() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [planFile, setPlanFile] = useState<File | null>(null);
    const [reportFiles, setReportFiles] = useState<File[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const userRes = await userService.getProfile();
            setUserData(userRes.data);

            if (userRes.data.team) {
                const projRes = await projectService.getMyTeamProjects();
                setProjects(projRes.data);

                // Find active project to show by default if it exists
                const active = projRes.data.find(p => p.status !== 'COMPLETED');
                if (active) {
                    setSelectedProject(active);
                }
            }
        } catch (error) {
            console.error("Failed to fetch project data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmitPlan = async () => {
        if (!title) return toast.error("Judul proyek wajib diisi!");
        if (!planFile) return toast.error("File Rencana (PDF) wajib diupload!");

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("teamId", userData.team.id);
            formData.append("title", title);
            formData.append("plan_file", planFile);

            await projectService.submitPlan(formData);
            toast.success("Rencana proyek berhasil dikirim!");
            setShowCreateForm(false);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal mengirim rencana");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitReport = async () => {
        if (reportFiles.length === 0) return toast.error("Minimal upload 1 file laporan!");

        setSubmitting(true);
        try {
            const formData = new FormData();
            reportFiles.forEach(file => {
                formData.append("report_files", file);
            });

            await projectService.submitReport(selectedProject!.id, formData);
            toast.success("Laporan proyek berhasil dikirim!");
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal mengirim laporan");
        } finally {
            setSubmitting(false);
        }
    };

    const activeProject = projects.find(p => p.status !== 'COMPLETED');
    const finishedProjects = projects.filter(p => p.status === 'COMPLETED');

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest">Memuat Arsip Perjuangan...</p>
            </div>
        );
    }

    if (!userData?.team) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <Lock className="w-10 h-10 text-gray-400" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-gray-900">Aksi Terkunci</h2>
                    <p className="text-gray-500 max-w-xs mx-auto">Anda harus bergabung dengan Tim terlebih dahulu sebelum dapat memulai Peace Project.</p>
                </div>
                <Button onClick={() => navigate("/")} className="bg-[#800000] rounded-xl font-bold">
                    Kembali ke Dashboard
                </Button>
            </div>
        );
    }

    // MISSION TRACKER SUB-COMPONENT
    const renderMissionTracker = (project: Project) => {
        const isCompleted = project.status === 'COMPLETED';
        const stages = [
            {
                id: 'PLAN',
                name: 'Rangkai Rencana',
                desc: 'Susun rencana aksi perdamaian tim mu.',
                status: isCompleted ? 'COMPLETED' : (project.status === 'DRAFT' ? 'CURRENT' : 'COMPLETED')
            },
            {
                id: 'APPROVAL',
                name: 'Restu Guru',
                desc: 'Tunggu persetujuan dari Guru pembimbing.',
                status: isCompleted ? 'COMPLETED' : (project.status === 'PLAN_SUBMITTED' ? 'CURRENT' : (['PLAN_APPROVED', 'REPORT_SUBMITTED', 'COMPLETED'].includes(project.status) ? 'COMPLETED' : 'PENDING'))
            },
            {
                id: 'ACTION',
                name: 'Aksi Nyata & Laporan',
                desc: 'Lakukan aksi mu dan kirimkan buktinya.',
                status: isCompleted ? 'COMPLETED' : (project.status === 'PLAN_APPROVED' ? 'CURRENT' : (['REPORT_SUBMITTED', 'COMPLETED'].includes(project.status) ? 'COMPLETED' : 'PENDING'))
            },
            {
                id: 'GRADING',
                name: 'Penilaian & Lencana',
                desc: 'Penilaian akhir dan pemberian reward.',
                status: isCompleted ? 'COMPLETED' : (project.status === 'REPORT_SUBMITTED' ? 'CURRENT' : (project.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING'))
            }
        ];

        return (
            <div className="space-y-6">
                {/* Project Info Header */}
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <button onClick={() => setSelectedProject(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <div>
                        <h3 className="font-black text-lg md:text-xl text-gray-900 uppercase tracking-tight">{project.title}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Dibuat pada: {new Date(project.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Stepper tracker */}
                <section className="bg-white rounded-2xl p-3 md:p-8 shadow-sm border border-gray-100 relative">
                    <div className="relative space-y-8">
                        {stages.map((stage, idx) => (
                            <div key={stage.id} className="relative flex gap-3 md:gap-6">
                                {idx !== stages.length - 1 && (
                                    <div className={`absolute left-[1.1rem] md:left-5 top-10 w-0.5 h-10 ${stage.status === 'COMPLETED' ? 'bg-[#800000]' : 'bg-gray-200'}`} />
                                )}
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${stage.status === 'COMPLETED' ? 'bg-[#800000] text-white shadow-md' :
                                        stage.status === 'CURRENT' ? 'bg-white border-2 md:border-4 border-[#D4AF37] text-[#D4AF37] shadow-lg animate-pulse' :
                                            'bg-gray-50 border-2 border-gray-100 text-gray-300'
                                    }`}>
                                    {stage.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : <span className="font-black text-xs md:text-sm">{idx + 1}</span>}
                                </div>
                                <div className="flex-1 pt-1 min-w-0">
                                    <h3 className={`font-black text-sm md:text-base uppercase tracking-tight ${stage.status === 'PENDING' ? 'text-gray-300' : 'text-gray-900'}`}>{stage.name}</h3>
                                    <p className={`text-xs mt-0.5 font-medium ${stage.status === 'PENDING' ? 'text-gray-300' : 'text-gray-500'}`}>{stage.desc}</p>

                                    {stage.id === 'PLAN' && stage.status === 'CURRENT' && (
                                        <div className="mt-4 p-5 rounded-2xl bg-gray-50 text-gray-500 text-xs italic">
                                            Proposal telah dikirim dan menunggu pemeriksaan awal.
                                        </div>
                                    )}

                                    {stage.id === 'APPROVAL' && stage.status === 'CURRENT' && (
                                        <div className="mt-4 p-5 rounded-2xl bg-orange-50 border border-orange-100 flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-orange-500 animate-pulse" />
                                            <p className="text-xs font-bold text-orange-600">Menunggu Guru memeriksa proposal tim mu...</p>
                                        </div>
                                    )}

                                    {stage.id === 'ACTION' && stage.status === 'CURRENT' && (
                                        <div className="mt-6 p-3 md:p-6 rounded-2xl bg-[#FDFBF7] border-2 border-dashed border-[#D4AF37]/30 space-y-4">
                                            <div className="flex items-center gap-3 mb-2 text-[#800000]">
                                                <AlertCircle className="w-5 h-5" />
                                                <p className="text-xs font-bold">Rencana disetujui! Upload bukti aksi tim mu (Foto/Video/PDF).</p>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-black uppercase text-[#800000] ml-1">Unggah Laporan (Maks. 5 File)</Label>
                                                <div className="relative">
                                                    <Input
                                                        type="file"
                                                        multiple
                                                        onChange={(e) => {
                                                            const files = Array.from(e.target.files || []);
                                                            if (reportFiles.length + files.length > 5) {
                                                                toast.error("Maksimal 5 file.");
                                                                return;
                                                            }
                                                            setReportFiles([...reportFiles, ...files]);
                                                        }}
                                                        className="hidden"
                                                        id="report-upload"
                                                    />
                                                    <Label htmlFor="report-upload" className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
                                                        <span className="text-xs text-gray-500 truncate">Pilih file...</span>
                                                        <Plus className="w-4 h-4 text-[#800000]" />
                                                    </Label>
                                                </div>

                                                {reportFiles.length > 0 && (
                                                    <div className="mt-3 space-y-2">
                                                        {reportFiles.map((file, i) => (
                                                            <div key={i} className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-gray-100 italic text-[10px] font-bold text-gray-500 shadow-sm">
                                                                <span className="truncate flex-1 min-w-0 mr-3">{file.name}</span>
                                                                <button 
                                                                    onClick={() => setReportFiles(reportFiles.filter((_, idx) => idx !== i))} 
                                                                    className="text-red-500 hover:text-red-700 shrink-0 font-black uppercase tracking-tighter cursor-pointer"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <Button onClick={handleSubmitReport} disabled={submitting} className="w-full bg-[#800000] hover:bg-[#600000] rounded-xl font-bold h-12 shadow-md text-xs md:text-sm px-2">
                                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Kirim Semua Laporan"}
                                            </Button>
                                        </div>
                                    )}

                                    {stage.id === 'GRADING' && stage.status === 'CURRENT' && (
                                        <div className="mt-4 p-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
                                            <p className="text-xs font-bold text-blue-600">Laporan terkirim! Guru sedang menghitung poin hasil perjuangan tim mu.</p>
                                        </div>
                                    )}

                                    {(stage.status === 'COMPLETED' || isCompleted) && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">Tuntas</span>
                                            {stage.id === 'PLAN' && project.plan_file_url && (
                                                <a href={project.plan_file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-[#800000] hover:underline underline-offset-2">
                                                    <Download className="w-3 h-3" /> Proposal
                                                </a>
                                            )}
                                            {stage.id === 'ACTION' && project.report_files && project.report_files.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {project.report_files.map((url, i) => (
                                                        <a key={i} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-[#800000] hover:underline underline-offset-2 bg-white px-2 py-1 rounded shadow-sm border border-gray-100">
                                                            <Download className="w-3 h-3" /> Berkas {i + 1}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Celebration Card for COMPLETED */}
                {isCompleted && (
                    <section className="bg-gradient-to-br from-[#D4AF37] to-[#AA841E] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl animate-in zoom-in duration-500">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full -mr-20 -mt-20 blur-3xl" />
                        <div className="relative z-10 flex flex-col items-center text-center gap-4">
                            <Trophy className="w-10 h-10 md:w-12 md:h-12 text-white drop-shadow-lg" />
                            <h2 className="text-xl md:text-2xl font-black uppercase italic">Misi Tercapai!</h2>
                            <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Poin Hadiah</span>
                                <p className="text-xl md:text-2xl font-black">+{project.points_awarded}</p>
                            </div>
                            {project.teacher_feedback && (
                                <div className="w-full mt-2 bg-black/10 rounded-2xl p-4 text-left text-sm italic font-medium">
                                    "{project.teacher_feedback}"
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>
        );
    };

    return (
        <div className="bg-[#F9F6F0]">
            <div className="max-w-3xl mx-auto px-4 py-6">
                {selectedProject ? (
                    renderMissionTracker(selectedProject)
                ) : showCreateForm ? (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-[#800000] uppercase tracking-tight">Mulai Misi Baru</h2>
                            <button onClick={() => setShowCreateForm(false)} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">Batal</button>
                        </div>

                        <Card className="rounded-2xl bg-white px-4 py-6 md:p-8 shadow-xl border-none space-y-6">
                            <div className="flex flex-col gap-2">
                                <Label className="text-[10px] font-black uppercase text-[#800000] ml-1">Nama Proyek Perjuangan</Label>
                                <Input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Misal: Aksi Kampanye Toleransi Sekolah"
                                    className="w-full bg-[#FDFBF7] border-2 border-gray-100 rounded-xl px-6 py-6 text-sm focus:outline-none focus:ring-0 focus:border-[#800000] transition-all font-medium"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-[10px] font-black uppercase text-[#800000] ml-1">Dokumen Rencana (PDF)</Label>
                                <Input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setPlanFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="plan-upload-new"
                                />
                                <Label htmlFor="plan-upload-new" className="flex items-center justify-between bg-[#FDFBF7] border-2 border-dashed border-gray-200 rounded-xl px-6 py-4 cursor-pointer hover:bg-[#FDFBF7]/80 transition-colors">
                                    <span className="text-xs text-gray-500 font-bold truncate">{planFile ? planFile.name : "Pilih file PDF rencana proyek..."}</span>
                                    <Upload className="w-5 h-5 text-[#800000]" />
                                </Label>
                            </div>
                            <div className="p-5 rounded-xl bg-orange-50 border border-orange-100 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                                <p className="text-[10px] font-bold text-orange-600 leading-relaxed uppercase">
                                    Setelah mengirim, Anda tidak dapat memulai proyek baru hingga proyek ini selesai atau dinilai oleh Guru.
                                </p>
                            </div>
                            <Button
                                onClick={handleSubmitPlan}
                                disabled={submitting}
                                className="w-full h-14 bg-[#800000] hover:bg-[#600000] rounded-xl border-none font-black uppercase tracking-[0.1em] shadow-lg shadow-[#800000]/20 cursor-pointer"
                            >
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : "Gelar Misi Perubahan"}
                            </Button>
                        </Card>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Hero Section */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#800000] to-[#4a0000] p-8 text-white shadow-2xl">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                            <Sparkles className="absolute bottom-6 right-8 w-12 h-12 text-[#D4AF37]/20" />
                            <div className="relative z-10 flex flex-col gap-2">
                                <h2 className="text-3xl font-black tracking-tight leading-none italic uppercase tracking-[-0.05em]">Aksi Nyata. <br />Perubahan Nyata.</h2>
                                <p className="text-sm font-medium text-white/70 max-w-[240px] mt-2">Daftarkan inisiatif tim mu untuk membangun perdamaian dan kerukunan di lingkungan sekitar.</p>

                                {!activeProject ? (
                                    <Button
                                        onClick={() => setShowCreateForm(true)}
                                        className="mt-6 w-fit bg-[#D4AF37] hover:bg-[#B8962D] text-[#800000] rounded-xl px-8 font-black uppercase tracking-widest text-xs h-12 shadow-lg cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Mulai Misi Baru
                                    </Button>
                                ) : (
                                    <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.1em]">Misi Sedang Berjalan</p>
                                            <p className="text-sm font-bold truncate max-w-[180px]">{activeProject.title}</p>
                                        </div>
                                        <Button size="sm" onClick={() => setSelectedProject(activeProject)} className="bg-white text-[#800000] hover:bg-white/90 rounded-lg font-bold text-[10px] h-8 px-4">Lanjut</Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* History Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <History className="w-5 h-5 text-[#800000]" />
                                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Arsip Perjuangan</h2>
                            </div>

                            {finishedProjects.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {finishedProjects.map((p) => (
                                        <div
                                            key={p.id}
                                            onClick={() => setSelectedProject(p)}
                                            className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                                                    <Trophy className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-gray-900 uppercase tracking-tight group-hover:text-[#800000] transition-colors">{p.title}</h3>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{new Date(p.created_at).toLocaleDateString()}</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                        <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">+{p.points_awarded} Poin</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#800000] group-hover:translate-x-1 transition-all" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white/50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm italic">Belum ada riwayat misi.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Removing Card import as it was removed in previous step by user action and I am using inline styles/simple divs mostly now or I can re-add it if needed. Re-reading user request confirms they removed Card. I replaced it with custom containers anyway.
