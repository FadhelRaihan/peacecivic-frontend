import { useState, useEffect } from "react";
import {
    Search,
    Trophy,
    CheckCircle,
    Clock,
    FileText,
    Loader2,
    ChevronRight,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProjectReviewDetail from "@/components/teacher/ProjectReviewDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectService, type Project } from "@/api/project";
import { badgeService, type Badge } from "@/api/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function TeacherProjectReview() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Selected Project for Review
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [projRes, badgeRes] = await Promise.all([
                projectService.getAllProjects(),
                badgeService.getAllBadges()
            ]);
            setProjects(projRes.data);
            setBadges(badgeRes.data);
        } catch (error) {
            toast.error("Gagal mengambil data proyek");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredProjects = projects.filter(p =>
        p.team?.team_name.toLowerCase().includes(search.toLowerCase()) ||
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    const pendingApproval = filteredProjects.filter(p => p.status === 'PLAN_SUBMITTED');
    const pendingGrading = filteredProjects.filter(p => p.status === 'REPORT_SUBMITTED');
    const completed = filteredProjects.filter(p => p.status === 'COMPLETED');

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
                <p className="text-gray-500 text-center font-bold animate-pulse uppercase tracking-[0.2em]">Menyiapkan Berkas Perjuangan...</p>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-8 lg:px-12 md:pt-2 pb-4 space-y-6">
            {/* --- Portal Header (Refined for Sidebar Only Look) --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[#800000]">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Portal Guru</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Peninjauan Peace Project</h1>
                    <p className="text-gray-500 font-medium italic text-sm">Berikan apresiasi pada aksi nyata yang merawat kebhinekaan.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Cari Tim atau Judul Proyek..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 h-12 w-full md:w-80 bg-gray-50 border-2 rounded-xl focus:bg-white focus:border-[#800000] focus:ring-0 transition-all"
                    />
                </div>
            </div>

            <div className="space-y-6">
                <Tabs defaultValue="approval" className="space-y-8">
                    <TabsList className="bg-white rounded-xl shadow-sm border border-gray-100 h-16 w-full md:w-auto grid grid-cols-3 md:inline-flex gap-2">
                        <TabsTrigger value="approval" className="rounded-xl px-2 md:px-8 font-black text-[9.5px] md:text-xs uppercase tracking-tight md:tracking-widest data-[state=active]:bg-[#800000] data-[state=active]:text-white transition-all cursor-pointer">
                            Persetujuan ({pendingApproval.length})
                        </TabsTrigger>
                        <TabsTrigger value="grading" className="rounded-xl px-2 md:px-8 font-black text-[9.5px] md:text-xs uppercase tracking-tight md:tracking-widest data-[state=active]:bg-[#800000] data-[state=active]:text-white transition-all cursor-pointer">
                            Penilaian ({pendingGrading.length})
                        </TabsTrigger>
                        <TabsTrigger value="history" className="rounded-xl px-2 md:px-8 font-black text-[9.5px] md:text-xs uppercase tracking-tight md:tracking-widest data-[state=active]:bg-[#800000] data-[state=active]:text-white transition-all cursor-pointer">
                            Riwayat ({completed.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* --- Approval Tab --- */}
                    <TabsContent value="approval" className="space-y-4 outline-none">
                        {pendingApproval.length === 0 ? (
                            <EmptyState icon={CheckCircle} message="Semua rencana sudah ditinjau!" />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingApproval.map((p) => (
                                    <ProjectCard key={p.id} project={p} onReview={() => setSelectedProject(p)} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* --- Grading Tab --- */}
                    <TabsContent value="grading" className="space-y-4 outline-none">
                        {pendingGrading.length === 0 ? (
                            <EmptyState icon={Clock} message="Belum ada laporan yang dikirim." />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingGrading.map((p) => (
                                    <ProjectCard key={p.id} project={p} onReview={() => setSelectedProject(p)} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* --- History Tab --- */}
                    <TabsContent value="history" className="space-y-4 outline-none">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {completed.map((p) => (
                                <ProjectCard key={p.id} project={p} onReview={() => setSelectedProject(p)} />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* --- Review Detail Dialog (EXTRACTED) --- */}
            <ProjectReviewDetail 
                project={selectedProject}
                badges={badges}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                onSuccess={fetchData}
            />
        </div>
    );
}

function ProjectCard({ project, onReview }: { project: Project, onReview: () => void }) {
    const statusConfig = {
        PLAN_SUBMITTED: { label: 'Proposal Baru', color: 'bg-orange-50 text-orange-600 border-transparent', icon: AlertCircle },
        REPORT_SUBMITTED: { label: 'Laporan Masuk', color: 'bg-blue-50 text-blue-600 border-transparent', icon: Clock },
        PLAN_APPROVED: { label: 'Aksi Berjalan', color: 'bg-green-50 text-green-600 border-transparent', icon: CheckCircle },
        COMPLETED: { label: 'Tuntas', color: 'bg-gray-100 text-gray-400 border-transparent', icon: Trophy },
        DRAFT: { label: 'Draft', color: 'bg-gray-50 text-gray-400 border-transparent', icon: FileText }
    };

    const config = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.DRAFT;
    const Icon = config.icon;

    return (
        <Card className="group overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
            <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${config.color}`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-black text-xl text-gray-900 group-hover:text-[#800000] transition-colors line-clamp-2 uppercase tracking-tight leading-tight">{project.title}</h3>
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl">
                        <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-[9px] font-black text-[#800000]">
                            {project.team?.team_name.slice(0, 1).toUpperCase()}
                        </div>
                        <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase">Tim {project.team?.team_name}</p>
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        variant="outline"
                        onClick={onReview}
                        className="w-full h-14 bg-white border-2 border-gray-100 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#800000] hover:text-white hover:border-[#800000] transition-all group/btn shadow-sm cursor-pointer"
                    >
                        Review Sekarang
                        <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function EmptyState({ icon: Icon, message }: { icon: any, message: string }) {
    return (
        <div className="bg-white rounded-2xl p-16 text-center border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon className="w-10 h-10 text-gray-200" />
            </div>
            <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">{message}</p>
        </div>
    );
}
