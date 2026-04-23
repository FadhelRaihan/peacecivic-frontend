import { useState, useEffect } from "react";
import { adminService } from "@/api/admin";
import { DataTable } from "@/components/ui/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import {
    Plus,
    MoreVertical,
    Trash2,
    Edit,
    Loader2,
    BookOpen,
    MessageSquare,
    Rocket,
    Trophy,
    Settings2,
    Zap,
    Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface MissionData {
    id: string;
    title: string;
    description: string;
    points_reward: number;
    trigger_type: "READ_MODULE" | "CHAT_COUNT" | "PROJECT_UPLOAD";
    trigger_count: number;
    badge_reward_id: string | null;
    badge_reward?: {
        id: string;
        badge_name: string;
        badge_icon_url: string;
    } | null;
}

interface Badge {
    id: string;
    badge_name: string;
    badge_icon_url: string;
}

export default function ManageMissions() {
    const [missions, setMissions] = useState<MissionData[]>([]);
    const [allBadges, setAllBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [triggerFilter, setTriggerFilter] = useState("ALL");

    // Dialog States
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [missionToDelete, setMissionToDelete] = useState<MissionData | null>(null);
    const [missionToEdit, setMissionToEdit] = useState<MissionData | null>(null);

    // Form States
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        points_reward: number;
        trigger_type: "READ_MODULE" | "CHAT_COUNT" | "PROJECT_UPLOAD";
        trigger_count: number;
        badge_reward_id: string;
    }>({
        title: "",
        description: "",
        points_reward: 0,
        trigger_type: "READ_MODULE",
        trigger_count: 1,
        badge_reward_id: "NONE"
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [missionsRes, badgesRes] = await Promise.all([
                adminService.getMissions(),
                adminService.getBadges()
            ]);
            setMissions(missionsRes.data.data);
            setAllBadges(badgesRes.data.data);
        } catch (error) {
            toast.error("Gagal mengambil data misi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredMissions = missions.filter(mission => {
        if (triggerFilter === "ALL") return true;
        return mission.trigger_type === triggerFilter;
    });

    const handleCreateMission = async () => {
        if (!formData.title || !formData.description) {
            return toast.error("Judul dan Deskripsi wajib diisi");
        }
        setSubmitting(true);
        try {
            const submissionData = {
                ...formData,
                badge_reward_id: formData.badge_reward_id === "NONE" ? null : formData.badge_reward_id
            };
            await adminService.createMission(submissionData);
            toast.success("Misi otomatis berhasil dibuat");
            setIsCreateDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal membuat misi");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateMission = async () => {
        if (!missionToEdit) return;
        setSubmitting(true);
        try {
            const submissionData = {
                ...formData,
                badge_reward_id: formData.badge_reward_id === "NONE" ? null : formData.badge_reward_id
            };
            await adminService.updateMission(missionToEdit.id, submissionData);
            toast.success("Misi berhasil diperbarui");
            setIsEditDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal memperbarui misi");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteMission = async () => {
        if (!missionToDelete) return;
        setSubmitting(true);
        try {
            await adminService.deleteMission(missionToDelete.id);
            toast.success("Misi berhasil dihapus");
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal menghapus misi");
        } finally {
            setSubmitting(false);
            setMissionToDelete(null);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            points_reward: 0,
            trigger_type: "READ_MODULE",
            trigger_count: 1,
            badge_reward_id: "NONE"
        });
        setMissionToEdit(null);
    };

    const openEditDialog = (mission: MissionData) => {
        setMissionToEdit(mission);
        setFormData({
            title: mission.title,
            description: mission.description,
            points_reward: mission.points_reward,
            trigger_type: mission.trigger_type,
            trigger_count: mission.trigger_count,
            badge_reward_id: mission.badge_reward_id || "NONE"
        });
        setIsEditDialogOpen(true);
    };

    const columns: ColumnDef<MissionData>[] = [
        {
            accessorKey: "title",
            header: "Misi",
            cell: ({ row }) => {
                const mission = row.original;
                return (
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900 leading-tight uppercase tracking-tight">{mission.title}</span>
                        <span className="text-[10px] text-gray-400 font-bold truncate max-w-[200px]">{mission.description}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "trigger_type",
            header: "Trigger Otomatisasi",
            cell: ({ row }) => {
                const type = row.getValue("trigger_type") as string;
                const count = row.original.trigger_count;

                const configs = {
                    READ_MODULE: { label: "Baca Modul", icon: BookOpen, color: "text-blue-600 bg-blue-50" },
                    CHAT_COUNT: { label: "Kirim Pesan", icon: MessageSquare, color: "text-green-600 bg-green-50" },
                    PROJECT_UPLOAD: { label: "Selesaikan Proyek", icon: Rocket, color: "text-purple-600 bg-purple-50" },
                };

                const config = configs[type as keyof typeof configs];
                const Icon = config.icon;

                return (
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${config.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{config.label}</span>
                            <span className="text-[9px] font-bold text-gray-400">Target: {count} Kali</span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "points_reward",
            header: "Reward",
            cell: ({ row }) => {
                const mission = row.original;
                return (
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-yellow-50 rounded-lg">
                                <Trophy className="w-3.5 h-3.5 text-yellow-600" />
                            </div>
                            <span className="text-xs font-black text-[#800000]">{mission.points_reward} PT</span>
                        </div>
                        {mission.badge_reward && (
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 shadow-sm bg-white">
                                    <img src={mission.badge_reward.badge_icon_url} alt="Badge" className="w-full h-full object-contain" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{mission.badge_reward.badge_name}</span>
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl hover:bg-gray-100">
                                <MoreVertical className="h-4 w-4 text-gray-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-2 min-w-50">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-2 py-1.5">
                                Kontrol Misi
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-50" />
                            <DropdownMenuItem
                                className="rounded-xl font-bold text-xs py-2.5 cursor-pointer text-[#800000]"
                                onClick={() => openEditDialog(row.original)}
                            >
                                <Edit className="w-3.5 h-3.5 mr-2" />
                                Edit Misi
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="rounded-xl font-bold text-xs py-2.5 text-red-600 cursor-pointer"
                                onClick={() => setMissionToDelete(row.original)}
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                Hapus Misi
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
                <p className="text-gray-500 font-black uppercase tracking-[0.2em]">Sinkronisasi Misi...</p>
            </div>
        );
    }

    const triggerFilterAction = (
        <div className="flex w-full md:w-auto items-center justify-center gap-2 px-3 h-12 bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:border-[#800000] transition-all">
            <Filter className="w-4 h-4 text-gray-400" />
            <Select value={triggerFilter} onValueChange={setTriggerFilter}>
                <SelectTrigger className="w-[120px] lg:w-[140px] h-8 border-none focus:ring-0 font-bold text-xs shadow-none px-0 capitalize">
                    <SelectValue placeholder="Pilih Trigger" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl">
                    <SelectItem value="ALL" className="font-bold text-xs">Semua Trigger</SelectItem>
                    <SelectItem value="READ_MODULE" className="font-bold text-xs text-blue-600">Baca Modul</SelectItem>
                    <SelectItem value="CHAT_COUNT" className="font-bold text-xs text-green-600">Kirim Pesan</SelectItem>
                    <SelectItem value="PROJECT_UPLOAD" className="font-bold text-xs text-purple-600">Selesaikan Proyek</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    return (
        <div className="px-4 md:px-8 lg:px-12 md:pt-2 pb-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-[#800000]">
                        <Zap className="w-5 h-5 fill-current" />
                        <span className="text-xs font-black uppercase tracking-widest">Gamifikasi & Otomatisasi</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">Manajemen Misi</h1>
                    <p className="text-gray-500 font-medium italic text-sm">Atur misi otomatis yang menantang pejuang untuk aktif di platform.</p>
                </div>

                <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-3">
                    <Button
                        onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}
                        className="w-full md:w-auto bg-[#800000] px-6 hover:bg-[#600000] text-white font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-[#800000]/20 cursor-pointer border-none rounded-2xl"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Buat Misi Otomatis
                    </Button>
                </div>
            </div>

            {/* Main Table Container */}
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-1 border-2 border-white shadow-2xl shadow-gray-200/50">
                <DataTable
                    columns={columns}
                    data={filteredMissions}
                    filterColumn="title"
                    searchPlaceholder="Cari judul misi..."
                    extraActions={triggerFilterAction}
                />
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="w-[95vw] md:max-w-xl rounded-2xl p-6 md:p-8 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                            <Zap className="w-6 h-6 text-[#800000]" />
                            Misi Otomatis Baru
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Judul Misi</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Contoh: Sang Literat Pancasila"
                                className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Deskripsi Misi</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Jelaskan apa yang harus dilakukan siswa..."
                                className="rounded-lg border-gray-100 min-h-[100px] font-bold text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Trigger Otomatisasi</Label>
                                <Select value={formData.trigger_type} onValueChange={(val: any) => setFormData({ ...formData, trigger_type: val })}>
                                    <SelectTrigger className="rounded-lg h-11 md:h-12 font-bold text-sm">
                                        <SelectValue placeholder="Pilih Trigger" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl">
                                        <SelectItem value="READ_MODULE" className="font-bold text-sm">Baca Modul</SelectItem>
                                        <SelectItem value="CHAT_COUNT" className="font-bold text-sm">Kirim Pesan Chat</SelectItem>
                                        <SelectItem value="PROJECT_UPLOAD" className="font-bold text-sm">Selesaikan Proyek</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Target Progres (Jumlah)</Label>
                                <Input
                                    type="number"
                                    value={formData.trigger_count}
                                    onChange={(e) => setFormData({ ...formData, trigger_count: parseInt(e.target.value) })}
                                    placeholder="Contoh: 3"
                                    className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Reward Poin</Label>
                                <div className="relative">
                                    <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-600" />
                                    <Input 
                                        type="number"
                                        value={formData.points_reward} 
                                        onChange={(e) => setFormData({...formData, points_reward: parseInt(e.target.value)})}
                                        placeholder="0" 
                                        className="rounded-lg border-gray-100 h-11 md:h-12 pl-12 font-bold text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Reward Lencana (Opsional)</Label>
                                <Select value={formData.badge_reward_id} onValueChange={(val: any) => setFormData({...formData, badge_reward_id: val})}>
                                    <SelectTrigger className="rounded-lg h-11 md:h-12 font-bold text-sm">
                                        <SelectValue placeholder="Pilih Lencana" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl">
                                        <SelectItem value="NONE" className="font-bold text-sm italic text-gray-400">Tidak ada lencana</SelectItem>
                                        {allBadges.map(badge => (
                                            <SelectItem key={badge.id} value={badge.id} className="font-bold text-sm">
                                                <div className="flex items-center gap-2">
                                                    <img src={badge.badge_icon_url} className="w-4 h-4 object-contain" />
                                                    {badge.badge_name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleCreateMission}
                            disabled={submitting}
                            className="w-full h-12 md:h-14 border-none bg-[#800000] hover:bg-[#600000] text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-[#800000]/20 text-xs cursor-pointer"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Aktifkan Misi Otomatis"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="w-[95vw] md:max-w-xl rounded-2xl p-6 md:p-8 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                            <Settings2 className="w-6 h-6 text-[#800000]" />
                            Konfigurasi Misi
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Judul Misi</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Judul Misi"
                                className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Deskripsi Misi</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Deskripsi Misi"
                                className="rounded-lg border-gray-100 min-h-[100px] font-bold text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Trigger Otomatisasi</Label>
                                <Select value={formData.trigger_type} onValueChange={(val: any) => setFormData({ ...formData, trigger_type: val })}>
                                    <SelectTrigger className="rounded-lg h-11 md:h-12 font-bold text-sm">
                                        <SelectValue placeholder="Pilih Trigger" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl">
                                        <SelectItem value="READ_MODULE" className="font-bold text-sm">Baca Modul</SelectItem>
                                        <SelectItem value="CHAT_COUNT" className="font-bold text-sm">Kirim Pesan Chat</SelectItem>
                                        <SelectItem value="PROJECT_UPLOAD" className="font-bold text-sm">Selesaikan Proyek</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Target Progres (Jumlah)</Label>
                                <Input
                                    type="number"
                                    value={formData.trigger_count}
                                    onChange={(e) => setFormData({ ...formData, trigger_count: parseInt(e.target.value) })}
                                    className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Reward Poin</Label>
                                <div className="relative">
                                    <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-600" />
                                    <Input 
                                        type="number"
                                        value={formData.points_reward} 
                                        onChange={(e) => setFormData({...formData, points_reward: parseInt(e.target.value)})}
                                        className="rounded-lg border-gray-100 h-11 md:h-12 pl-12 font-bold text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Reward Lencana (Opsional)</Label>
                                <Select value={formData.badge_reward_id} onValueChange={(val: any) => setFormData({...formData, badge_reward_id: val})}>
                                    <SelectTrigger className="rounded-lg h-11 md:h-12 font-bold text-sm">
                                        <SelectValue placeholder="Pilih Lencana" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl">
                                        <SelectItem value="NONE" className="font-bold text-sm italic text-gray-400">Tidak ada lencana</SelectItem>
                                        {allBadges.map(badge => (
                                            <SelectItem key={badge.id} value={badge.id} className="font-bold text-sm">
                                                <div className="flex items-center gap-2">
                                                    <img src={badge.badge_icon_url} className="w-4 h-4 object-contain" />
                                                    {badge.badge_name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleUpdateMission}
                            disabled={submitting}
                            className="w-full h-12 md:h-14 border-none bg-[#800000] hover:bg-[#600000] text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-[#800000]/20 text-xs"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!missionToDelete} onOpenChange={(open) => !open && setMissionToDelete(null)}>
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl bg-white w-[90vw] max-w-sm pt-8">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="w-full text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight text-center">Hapus Misi?</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs md:px-6 md:text-sm font-medium text-gray-500 leading-relaxed text-center">
                            Misi <span className="font-black text-[#800000]">{missionToDelete?.title}</span> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-2 flex-row p-6">
                        <AlertDialogCancel className="h-10 md:h-11 rounded-xl border-2 border-gray-100 font-bold uppercase tracking-widest text-[10px] flex-1 cursor-pointer">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteMission}
                            disabled={submitting}
                            className="h-10 md:h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex-1 border-none shadow-lg shadow-red-200 cursor-pointer"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Iya, Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
