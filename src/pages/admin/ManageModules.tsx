import { useState, useEffect, useRef } from "react";
import { adminService } from "@/api/admin";
import { DataTable } from "@/components/ui/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import {
    BookOpen,
    Plus,
    MoreVertical,
    Trash2,
    Edit,
    Loader2,
    Video,
    FileText,
    Image as ImageIcon,
    Upload,
    CheckCircle2,
    Filter
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ModuleData {
    id: string;
    title: string;
    slug: string;
    video_url: string | null;
    pdf_url: string | null;
    category: "KEWARGANEGARAAN" | "BUDAYA";
    thumbnail_url: string | null;
}

export default function ManageModules() {
    const [modules, setModules] = useState<ModuleData[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Dialog States
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [moduleToDelete, setModuleToDelete] = useState<ModuleData | null>(null);
    const [moduleToEdit, setModuleToEdit] = useState<ModuleData | null>(null);

    // Form States
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        video_url: "",
        category: "KEWARGANEGARAAN",
    });

    // File States
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);

    // Filter state
    const [categoryFilter, setCategoryFilter] = useState("ALL");

    const filteredModules = modules.filter(module => {
        if (categoryFilter === "ALL") return true;
        return module.category === categoryFilter;
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await adminService.getModules();
            setModules(res.data.data);
        } catch (error) {
            toast.error("Gagal mengambil data modul");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'pdf') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (type === 'thumbnail') {
            setThumbnailFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPdfFile(file);
        }
    };

    const handleCreateModule = async () => {
        if (!formData.title || !formData.slug) {
            return toast.error("Judul dan Slug wajib diisi");
        }
        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('slug', formData.slug);
            data.append('video_url', formData.video_url);
            data.append('category', formData.category);
            if (thumbnailFile) data.append('thumbnail', thumbnailFile);
            if (pdfFile) data.append('pdf', pdfFile);

            await adminService.createModule(data);
            toast.success("Modul berhasil dibuat");
            setIsCreateDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal membuat modul");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateModule = async () => {
        if (!moduleToEdit) return;
        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('slug', formData.slug);
            data.append('video_url', formData.video_url);
            data.append('category', formData.category);
            if (thumbnailFile) data.append('thumbnail', thumbnailFile);
            if (pdfFile) data.append('pdf', pdfFile);

            await adminService.updateModule(moduleToEdit.id, data);
            toast.success("Modul berhasil diperbarui");
            setIsEditDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal memperbarui modul");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteModule = async () => {
        if (!moduleToDelete) return;
        setSubmitting(true);
        try {
            await adminService.deleteModule(moduleToDelete.id);
            toast.success("Modul berhasil dihapus");
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal menghapus modul");
        } finally {
            setSubmitting(false);
            setModuleToDelete(null);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            slug: "",
            video_url: "",
            category: "KEWARGANEGARAAN",
        });
        setThumbnailFile(null);
        setPdfFile(null);
        setThumbnailPreview(null);
        setModuleToEdit(null);
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
        if (pdfInputRef.current) pdfInputRef.current.value = "";
    };

    const openEditDialog = (module: ModuleData) => {
        setModuleToEdit(module);
        setFormData({
            title: module.title,
            slug: module.slug,
            video_url: module.video_url || "",
            category: module.category,
        });
        setThumbnailPreview(module.thumbnail_url);
        setIsEditDialogOpen(true);
    };

    const columns: ColumnDef<ModuleData>[] = [
        {
            accessorKey: "title",
            header: "Modul",
            cell: ({ row }) => {
                const module = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                            {module.thumbnail_url ? (
                                <img src={module.thumbnail_url} alt={module.title} className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="w-5 h-5 text-gray-300" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-gray-900 leading-tight uppercase tracking-tight">{module.title}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{module.slug}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "category",
            header: "Kategori",
            cell: ({ row }) => {
                const category = row.getValue("category") as string;
                const colors = {
                    KEWARGANEGARAAN: "bg-blue-50 text-blue-700 border-blue-100",
                    BUDAYA: "bg-orange-50 text-orange-700 border-orange-100",
                };
                return (
                    <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest inline-block ${colors[category as keyof typeof colors]}`}>
                        {category}
                    </div>
                );
            },
        },
        {
            id: "content",
            header: "Konten",
            cell: ({ row }) => {
                const module = row.original;
                return (
                    <div className="flex items-center gap-2">
                        {module.video_url && (
                            <div title="Video" className="p-1.5 bg-red-50 rounded-lg text-red-600">
                                <Video className="w-3.5 h-3.5" />
                            </div>
                        )}
                        {module.pdf_url && (
                            <div title="PDF" className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                                <FileText className="w-3.5 h-3.5" />
                            </div>
                        )}
                        {!module.video_url && !module.pdf_url && (
                            <span className="text-[10px] text-gray-300 font-bold italic">Tanpa Konten</span>
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
                                Kontrol Modul
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-50" />
                            <DropdownMenuItem
                                className="rounded-xl font-bold text-xs py-2.5 cursor-pointer text-[#800000]"
                                onClick={() => openEditDialog(row.original)}
                            >
                                <Edit className="w-3.5 h-3.5 mr-2" />
                                Edit Modul
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="rounded-xl font-bold text-xs py-2.5 text-red-600 cursor-pointer"
                                onClick={() => setModuleToDelete(row.original)}
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                Hapus Modul
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    const categoryFilterAction = (
        <div className="flex w-full md:w-auto items-center justify-center gap-2 px-3 h-12 bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:border-[#800000] transition-all">
            <Filter className="w-4 h-4 text-gray-400" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[120px] lg:w-[140px] h-8 border-none focus:ring-0 font-bold text-xs shadow-none px-0">
                    <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl">
                    <SelectItem value="ALL" className="font-bold text-xs">Semua Kategori</SelectItem>
                    <SelectItem value="KEWARGANEGARAAN" className="font-bold text-xs text-blue-600">Kewarganegaraan</SelectItem>
                    <SelectItem value="BUDAYA" className="font-bold text-xs text-orange-600">Budaya Aceh</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
                <p className="text-gray-500 font-black uppercase tracking-[0.2em]">Memuat Database Modul...</p>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-8 lg:px-12 md:pt-2 pb-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-[#800000]">
                        <BookOpen className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Kurikulum PeaceCivic</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">Manajemen Modul</h1>
                    <p className="text-gray-500 font-medium italic text-sm">Kelola materi pembelajaran, video, dan modul literasi platform.</p>
                </div>

                <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-3">
                    <Button
                        onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}
                        className="w-full md:w-auto bg-[#800000] px-6 hover:bg-[#600000] text-white font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-[#800000]/20 cursor-pointer border-none rounded-2xl"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Buat Modul Baru
                    </Button>
                </div>
            </div>

            {/* Main Table Container */}
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-1 border-2 border-white shadow-2xl shadow-gray-200/50">
                <DataTable
                    columns={columns}
                    data={filteredModules}
                    filterColumn="title"
                    searchPlaceholder="Cari judul modul..."
                    extraActions={categoryFilterAction}
                />
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="w-[95vw] md:max-w-xl rounded-2xl p-6 md:p-8 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                            <Plus className="w-6 h-6 text-[#800000]" />
                            Modul Baru
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Judul Modul</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Contoh: Aceh Pasca Konflik"
                                className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Slug (URL)</Label>
                            <Input
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                placeholder="aceh-pasca-konflik"
                                className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Kategori</Label>
                            <Select value={formData.category} onValueChange={(val: any) => setFormData({ ...formData, category: val })}>
                                <SelectTrigger className="rounded-lg h-11 md:h-12 font-bold text-sm">
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                    <SelectItem value="KEWARGANEGARAAN" className="font-bold text-sm">Kewarganegaraan</SelectItem>
                                    <SelectItem value="BUDAYA" className="font-bold text-sm">Budaya</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Video URL (Google Drive/YouTube)</Label>
                            <Input
                                value={formData.video_url}
                                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                placeholder="https://..."
                                className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                            />
                        </div>

                        {/* File Upload Sections */}
                        <div className="flex flex-col gap-4 md:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Thumbnail Upload */}
                                <div className="flex flex-col gap-2">
                                    <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Upload Thumbnail</Label>
                                    <div
                                        onClick={() => thumbnailInputRef.current?.click()}
                                        className="relative group cursor-pointer border-2 border-dashed border-gray-100 rounded-2xl p-4 hover:border-[#800000] hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-2 aspect-video overflow-hidden"
                                    >
                                        {thumbnailPreview ? (
                                            <>
                                                <img src={thumbnailPreview} className="absolute inset-0 w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Upload className="w-6 h-6 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-8 h-8 text-gray-300 group-hover:text-[#800000] transition-colors" />
                                                <span className="text-[10px] font-bold text-gray-400">Klik untuk upload (PNG/JPG)</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            ref={thumbnailInputRef}
                                            onChange={(e) => handleFileChange(e, 'thumbnail')}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </div>
                                </div>

                                {/* PDF Upload */}
                                <div className="flex flex-col gap-2">
                                    <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Upload Modul PDF</Label>
                                    <div
                                        onClick={() => pdfInputRef.current?.click()}
                                        className="group cursor-pointer border-2 border-dashed border-gray-100 rounded-2xl p-4 hover:border-[#800000] hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-3 aspect-video"
                                    >
                                        {pdfFile ? (
                                            <>
                                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                                    <CheckCircle2 className="w-6 h-6" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black text-gray-900 uppercase truncate max-w-[150px]">{pdfFile.name}</p>
                                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Siap Diunggah</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="w-8 h-8 text-gray-300 group-hover:text-[#800000] transition-colors" />
                                                <span className="text-[10px] font-bold text-gray-400">Pilih File PDF</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            ref={pdfInputRef}
                                            onChange={(e) => handleFileChange(e, 'pdf')}
                                            className="hidden"
                                            accept="application/pdf"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button
                            onClick={handleCreateModule}
                            disabled={submitting}
                            className="w-full h-12 md:h-14 border-none bg-[#800000] hover:bg-[#600000] text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-[#800000]/20 text-xs cursor-pointer"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Sedang Mengunggah...
                                </>
                            ) : "Simpan Modul"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="w-[95vw] md:max-w-xl rounded-2xl p-6 md:p-8 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                            <Edit className="w-6 h-6 text-[#800000]" />
                            Edit Modul
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Judul Modul</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Judul Modul"
                                className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Slug (URL)</Label>
                            <Input
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                placeholder="slug-url"
                                className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Kategori</Label>
                            <Select value={formData.category} onValueChange={(val: any) => setFormData({ ...formData, category: val })}>
                                <SelectTrigger className="rounded-lg h-11 md:h-12 font-bold text-sm">
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                    <SelectItem value="KEWARGANEGARAAN" className="font-bold text-sm">Kewarganegaraan</SelectItem>
                                    <SelectItem value="BUDAYA" className="font-bold text-sm">Budaya</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Video URL</Label>
                            <Input
                                value={formData.video_url}
                                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                placeholder="Video URL"
                                className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                            />
                        </div>

                        {/* File Upload Sections */}
                        <div className="flex flex-col gap-4 md:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Thumbnail Upload */}
                                <div className="space-y-2">
                                    <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Ganti Thumbnail (Opsional)</Label>
                                    <div
                                        onClick={() => thumbnailInputRef.current?.click()}
                                        className="relative group cursor-pointer border-2 border-dashed border-gray-100 rounded-2xl p-4 hover:border-[#800000] hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-2 aspect-video overflow-hidden"
                                    >
                                        {thumbnailPreview ? (
                                            <>
                                                <img src={thumbnailPreview} className="absolute inset-0 w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Upload className="w-6 h-6 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-8 h-8 text-gray-300 group-hover:text-[#800000] transition-colors" />
                                                <span className="text-[10px] font-bold text-gray-400">Klik untuk upload</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            ref={thumbnailInputRef}
                                            onChange={(e) => handleFileChange(e, 'thumbnail')}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </div>
                                </div>

                                {/* PDF Upload */}
                                <div className="space-y-2">
                                    <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Ganti Modul PDF (Opsional)</Label>
                                    <div
                                        onClick={() => pdfInputRef.current?.click()}
                                        className="group cursor-pointer border-2 border-dashed border-gray-100 rounded-2xl p-4 hover:border-[#800000] hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-3 aspect-video"
                                    >
                                        {pdfFile ? (
                                            <>
                                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                                    <CheckCircle2 className="w-6 h-6" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black text-gray-900 uppercase truncate max-w-[150px]">{pdfFile.name}</p>
                                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Siap Diunggah</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="w-8 h-8 text-gray-300 group-hover:text-[#800000] transition-colors" />
                                                <span className="text-[10px] font-bold text-gray-400">{moduleToEdit?.pdf_url ? "File PDF Sudah Ada" : "Pilih File PDF"}</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            ref={pdfInputRef}
                                            onChange={(e) => handleFileChange(e, 'pdf')}
                                            className="hidden"
                                            accept="application/pdf"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button
                            onClick={handleUpdateModule}
                            disabled={submitting}
                            className="w-full h-12 md:h-14 border-none bg-[#800000] hover:bg-[#600000] text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-[#800000]/20 text-xs"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Menyimpan...
                                </>
                            ) : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!moduleToDelete} onOpenChange={(open) => !open && setModuleToDelete(null)}>
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl bg-white w-[90vw] max-w-sm pt-8">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="w-full text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight text-center">Hapus Modul?</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs md:px-6 md:text-sm font-medium text-gray-500 leading-relaxed text-center">
                            Modul <span className="font-black text-[#800000]">{moduleToDelete?.title}</span> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-2 flex-row p-6">
                        <AlertDialogCancel className="h-10 md:h-11 rounded-xl border-2 border-gray-100 font-bold uppercase tracking-widest text-[10px] flex-1 cursor-pointer">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteModule}
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
