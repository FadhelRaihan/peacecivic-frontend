import { useState, useEffect, useMemo } from "react";
import { adminService } from "@/api/admin";
import { badgeService, type Badge } from "@/api/badge";
import { DataTable } from "@/components/ui/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
    Mail,
    ShieldCheck,
    Loader2,
    MoreVertical,
    Trash2,
    Edit,
    Plus,
    UserCircle,
    Key,
    School,
    Trophy,
    Eye,
    Users as UsersIcon,
    Award,
    BookOpen,
    Target,
    XCircle,
    Download,
    Filter
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface UserData {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
    role: "ADMIN" | "TEACHER" | "STUDENT";
    class_room: string | null;
    points: number;
    created_at: string;
    team_members: any[];
    badges_received: any[];
    _count?: {
        team_members: number;
        progress: number;
        missions: number;
        badges_received: number;
    };
}

type DetailTab = 'OVERVIEW' | 'TEAMS' | 'BADGES' | 'PROGRESS';

export default function ManageUsers() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [allBadges, setAllBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState<string>("ALL");

    // Dialog States
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
    const [userToEdit, setUserToEdit] = useState<UserData | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [activeTab, setActiveTab] = useState<DetailTab>('OVERVIEW');
    const [submitting, setSubmitting] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        role: "STUDENT",
        class_room: "",
        points: 0
    });

    const filteredUsers = useMemo(() => {
        if (roleFilter === "ALL") return users;
        return users.filter(user => user.role === roleFilter);
    }, [users, roleFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, badgesRes] = await Promise.all([
                adminService.getUsers(),
                badgeService.getAllBadges()
            ]);
            setUsers(usersRes.data.data);
            setAllBadges(badgesRes.data);
        } catch (error) {
            toast.error("Gagal mengambil data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateUser = async () => {
        if (!formData.full_name || !formData.email || !formData.password) {
            return toast.error("Mohon lengkapi data wajib");
        }
        setSubmitting(true);
        try {
            await adminService.createUser(formData);
            toast.success("User berhasil dibuat");
            setIsCreateDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal membuat user");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateUser = async () => {
        if (!userToEdit) return;
        setSubmitting(true);
        try {
            await adminService.updateUser(userToEdit.id, formData);
            toast.success("User berhasil diperbarui");
            setIsEditDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal memperbarui user");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        setSubmitting(true);
        try {
            await adminService.deleteUser(userToDelete.id);
            toast.success("User berhasil dihapus");
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal menghapus user");
        } finally {
            setSubmitting(false);
            setUserToDelete(null);
        }
    };

    const handleAwardBadge = async (badgeId: string) => {
        if (!selectedUser) return;
        setSubmitting(true);
        try {
            await adminService.awardBadge({ userId: selectedUser.id, badgeId });
            toast.success("Lencana berhasil diberikan");
            const updatedUsers = await adminService.getUsers();
            setUsers(updatedUsers.data.data);
            const newUser = updatedUsers.data.data.find((u: any) => u.id === selectedUser.id);
            setSelectedUser(newUser);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal memberikan lencana");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRevokeBadge = async (userBadgeId: string) => {
        if (!confirm("Tarik lencana ini?")) return;
        setSubmitting(true);
        try {
            await adminService.revokeBadge(userBadgeId);
            toast.success("Lencana berhasil ditarik");
            const updatedUsers = await adminService.getUsers();
            setUsers(updatedUsers.data.data);
            const newUser = updatedUsers.data.data.find((u: any) => u.id === selectedUser?.id);
            setSelectedUser(newUser);
        } catch (error: any) {
            toast.error("Gagal menarik lencana");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemoveFromTeam = async (teamMemberId: string) => {
        if (!confirm("Keluarkan user dari tim ini?")) return;
        setSubmitting(true);
        try {
            await adminService.removeFromTeam(teamMemberId);
            toast.success("User berhasil dikeluarkan dari tim");
            const updatedUsers = await adminService.getUsers();
            setUsers(updatedUsers.data.data);
            const newUser = updatedUsers.data.data.find((u: any) => u.id === selectedUser?.id);
            setSelectedUser(newUser);
        } catch (error: any) {
            toast.error("Gagal mengeluarkan user");
        } finally {
            setSubmitting(false);
        }
    };

    const handleExportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Database User PeaceCivic');

        // Define Columns
        worksheet.columns = [
            { header: 'Nama Lengkap', key: 'full_name', width: 25 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Role', key: 'role', width: 15 },
            { header: 'Kelas', key: 'class_room', width: 15 },
            { header: 'Tim', key: 'team', width: 25 },
            { header: 'Poin', key: 'points', width: 10 },
            { header: 'Lencana', key: 'badges', width: 40 },
            { header: 'Misi Tuntas', key: 'missions', width: 15 },
            { header: 'Modul Selesai', key: 'modules', width: 15 },
            { header: 'Tanggal Terdaftar', key: 'created_at', width: 20 },
        ];

        // Style Header
        const headerRow = worksheet.getRow(1);
        headerRow.height = 30;
        worksheet.columns.forEach((_, index) => {
            const cell = headerRow.getCell(index + 1);
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF800000' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // Add Data
        filteredUsers.forEach(user => {
            worksheet.addRow({
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                class_room: user.class_room || '-',
                team: user.team_members?.[0]?.team?.team_name || '-',
                points: user.points,
                badges: user.badges_received?.map(b => b.badge.badge_name).join(', ') || '-',
                missions: user._count?.missions || 0,
                modules: user._count?.progress || 0,
                created_at: new Date(user.created_at).toLocaleDateString(),
            });
        });

        // Finalize
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                row.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                row.height = 25;
            }
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Database_User_PeaceCivic_${new Date().toLocaleDateString()}.xlsx`);
        toast.success("Database user berhasil diekspor ke Excel");
    };

    const resetForm = () => {
        setFormData({
            full_name: "",
            email: "",
            password: "",
            role: "STUDENT",
            class_room: "",
            points: 0
        });
        setUserToEdit(null);
    };

    const openEditDialog = (user: UserData) => {
        setUserToEdit(user);
        setFormData({
            full_name: user.full_name,
            email: user.email,
            password: "",
            role: user.role,
            class_room: user.class_room || "",
            points: user.points
        });
        setIsEditDialogOpen(true);
    };

    const columns: ColumnDef<UserData>[] = [
        {
            accessorKey: "full_name",
            header: "Identitas User",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-white shadow-sm ring-1 ring-gray-100">
                            <AvatarImage src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`} />
                            <AvatarFallback className="bg-[#D4AF37] text-[#800000] font-black uppercase text-xs">
                                {user.full_name.substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-gray-900 leading-tight uppercase tracking-tight">{user.full_name}</span>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                                <Mail className="w-3 h-3" />
                                {user.email}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "role",
            header: "Peran",
            cell: ({ row }) => {
                const role = row.getValue("role") as string;
                const colors = {
                    ADMIN: "bg-red-50 text-red-700 border-red-100",
                    TEACHER: "bg-blue-50 text-blue-700 border-blue-100",
                    STUDENT: "bg-green-50 text-green-700 border-green-100",
                };
                return (
                    <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest inline-block ${colors[role as keyof typeof colors]}`}>
                        {role}
                    </div>
                );
            },
        },
        {
            accessorKey: "class_room",
            header: "Kelas",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-50 rounded-lg">
                        <School className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">{row.getValue("class_room") || "-"}</span>
                </div>
            ),
        },
        {
            accessorKey: "points",
            header: "Poin",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-yellow-50 rounded-lg">
                        <Trophy className="w-3.5 h-3.5 text-yellow-600" />
                    </div>
                    <span className="text-sm font-black text-[#800000]">{row.getValue("points")} PT</span>
                </div>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setSelectedUser(row.original); setActiveTab('OVERVIEW'); }}
                        className="h-8 w-8 p-0 rounded-xl hover:bg-gray-100 text-blue-600"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl hover:bg-gray-100">
                                <MoreVertical className="h-4 w-4 text-gray-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-2 min-w-50">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-2 py-1.5">
                                Kontrol Admin
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-50" />
                            <DropdownMenuItem
                                className="rounded-xl font-bold text-xs py-2.5 cursor-pointer text-[#800000]"
                                onClick={() => openEditDialog(row.original)}
                            >
                                <Edit className="w-3.5 h-3.5 mr-2" />
                                Sunting Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="rounded-xl font-bold text-xs py-2.5 text-red-600 cursor-pointer"
                                onClick={() => setUserToDelete(row.original)}
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                Hapus Permanen
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
                <p className="text-gray-500 font-black uppercase tracking-[0.2em]">Memuat Database User...</p>
            </div>
        );
    }

    const roleFilterAction = (
        <div className="flex w-full md:w-auto items-center justify-center gap-2 px-3 h-12 bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:border-[#800000] transition-all">
            <Filter className="w-4 h-4 text-gray-400" />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[100px] lg:w-[120px] h-8 border-none focus:ring-0 font-bold text-xs shadow-none px-0">
                    <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl">
                    <SelectItem value="ALL" className="font-bold text-xs">Semua Role</SelectItem>
                    <SelectItem value="STUDENT" className="font-bold text-xs text-green-600">Siswa</SelectItem>
                    <SelectItem value="TEACHER" className="font-bold text-xs text-blue-600">Guru</SelectItem>
                    <SelectItem value="ADMIN" className="font-bold text-xs text-red-600">Admin</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    return (
        <div className="px-4 md:px-8 lg:px-12 md:pt-2 pb-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[#800000]">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Portal Administrator</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">Manajemen User</h1>
                    <p className="text-gray-500 font-medium italic text-sm">Kelola seluruh akses, peran, dan statistik pengguna platform PeaceCivic.</p>
                </div>

                <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-3">
                    <Button
                        onClick={handleExportExcel}
                        className="w-full md:w-auto bg-[#D4AF37] px-6 hover:bg-[#B8962D] text-[#800000] font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-[#D4AF37]/20 cursor-pointer border-none rounded-2xl"
                    >
                        <Download className="w-4 h-4 mr-2" /> Ekspor Rekap Excel
                    </Button>
                    <Button
                        onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}
                        className="w-full md:w-auto bg-[#800000] px-6 hover:bg-[#600000] text-white font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-[#800000]/20 cursor-pointer border-none rounded-2xl"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Tambah User Baru
                    </Button>
                </div>
            </div>

            {/* Main Table Container */}
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-1 border-2 border-white shadow-2xl shadow-gray-200/50">
                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    filterColumn="full_name"
                    searchPlaceholder="Cari nama user atau pejuang..."
                    extraActions={roleFilterAction}
                />
            </div>

            {/* User Detail Drawer */}
            <Drawer open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DrawerContent className="max-h-[90vh] rounded-t-[3rem] border-none shadow-2xl bg-white focus-visible:outline-none">
                    <div className="mx-auto w-12 h-1.5 bg-gray-100 rounded-full my-4 shrink-0" />
                    <DrawerHeader className="px-4 md:px-12">
                        <div className="flex items-center gap-4 md:gap-6 mb-4">
                            <Avatar className="w-16 h-16 md:w-20 md:h-20 border-4 border-white shadow-xl ring-2 ring-gray-50">
                                <AvatarImage src={selectedUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser?.full_name}`} />
                                <AvatarFallback className="bg-[#D4AF37] text-[#800000] text-xl md:text-2xl font-black">{selectedUser?.full_name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-2">
                                <DrawerTitle className="text-start text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tight leading-tight">
                                    {selectedUser?.full_name}
                                </DrawerTitle>
                                <DrawerDescription className="font-bold text-gray-400 uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> {selectedUser?.email}
                                    <span className="mx-2 text-gray-200 hidden md:inline">|</span>
                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-[8px] md:text-[10px]">{selectedUser?.role}</span>
                                </DrawerDescription>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2 overflow-x-auto no-scrollbar">
                            <TabButton active={activeTab === 'OVERVIEW'} onClick={() => setActiveTab('OVERVIEW')} icon={Eye} label="Ikhtisar" />
                            <TabButton active={activeTab === 'TEAMS'} onClick={() => setActiveTab('TEAMS')} icon={UsersIcon} label="Kesatuan" />
                            <TabButton active={activeTab === 'BADGES'} onClick={() => setActiveTab('BADGES')} icon={Award} label="Lencana" />
                            <TabButton active={activeTab === 'PROGRESS'} onClick={() => setActiveTab('PROGRESS')} icon={Target} label="Progres" />
                        </div>
                    </DrawerHeader>

                    <div className="px-4 md:px-12 pb-12 pt-6 overflow-y-auto">
                        {activeTab === 'OVERVIEW' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                <StatCard icon={Trophy} value={`${selectedUser?.points} PT`} label="Total Poin" color="bg-yellow-50 text-yellow-600" />
                                <StatCard icon={Award} value={selectedUser?._count?.badges_received || 0} label="Lencana" color="bg-orange-50 text-orange-600" />
                                <StatCard icon={BookOpen} value={selectedUser?._count?.progress || 0} label="Modul Selesai" color="bg-blue-50 text-blue-600" />
                                <StatCard icon={Target} value={selectedUser?._count?.missions || 0} label="Misi Tuntas" color="bg-green-50 text-green-600" />
                            </div>
                        )}

                        {activeTab === 'TEAMS' && (
                            <div className="space-y-3 md:space-y-4">
                                {selectedUser?.team_members && selectedUser.team_members.length > 0 ? (
                                    selectedUser.team_members.map((tm: any) => (
                                        <div key={tm.id} className="p-4 md:p-6 rounded-[2rem] bg-gray-50 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white flex items-center justify-center text-[#800000] shadow-sm">
                                                    <UsersIcon className="w-6 h-6 md:w-8 md:h-8" />
                                                </div>
                                                <div>
                                                    <h4 className="text-base md:text-lg font-black text-gray-900 uppercase tracking-tight">{tm.team.team_name}</h4>
                                                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Bergabung: {new Date(tm.joined_at).toLocaleDateString()}</p>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {tm.team.projects.map((p: any) => (
                                                            <span key={p.id} className="text-[8px] md:text-[9px] font-black uppercase bg-white px-2 py-1 rounded-md border border-gray-100">{p.title}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleRemoveFromTeam(tm.id)}
                                                className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl h-10 md:h-12 text-[10px] md:text-xs font-black uppercase tracking-widest"
                                            >
                                                <XCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" /> Keluarkan
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState label="Belum tergabung dalam tim manapun" />
                                )}
                            </div>
                        )}

                        {activeTab === 'BADGES' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                                    {selectedUser?.badges_received.map((ub: any) => (
                                        <div key={ub.id} className="group relative p-3 md:p-4 rounded-3xl bg-white border-2 border-gray-50 flex flex-col items-center text-center gap-2 md:gap-3 hover:border-[#800000] transition-all">
                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gray-50 p-2 group-hover:scale-110 transition-transform">
                                                <img src={ub.badge.badge_icon_url} alt={ub.badge.badge_name} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tight text-gray-900 leading-tight">{ub.badge.badge_name}</span>
                                            <button
                                                onClick={() => handleRevokeBadge(ub.id)}
                                                className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg"
                                            >
                                                <XCircle className="w-3 h-3 md:w-4 md:h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8 border-t border-gray-100">
                                    <h5 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-400 mb-6 text-center md:text-left">Berikan Lencana Kehormatan</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                                        {allBadges.filter(b => !selectedUser?.badges_received.some(ub => ub.badge_id === b.id)).map(badge => (
                                            <button
                                                key={badge.id}
                                                onClick={() => handleAwardBadge(badge.id)}
                                                className="p-3 md:p-4 rounded-3xl bg-gray-50/50 border-2 border-dashed border-gray-100 hover:border-[#800000] hover:bg-white transition-all flex flex-col items-center text-center gap-2 group"
                                            >
                                                <div className="w-10 h-10 md:w-12 md:h-12 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                                    <img src={badge.badge_icon_url} alt={badge.badge_name} className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tight text-gray-400 group-hover:text-[#800000]">{badge.badge_name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'PROGRESS' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-center md:text-left">
                                <div className="space-y-4">
                                    <h5 className="flex items-center justify-center md:justify-start gap-2 text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-400">
                                        <BookOpen className="w-4 h-4" /> Modul Selesai
                                    </h5>
                                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Belum ada modul tuntas</p>
                                </div>
                                <div className="space-y-4">
                                    <h5 className="flex items-center justify-center md:justify-start gap-2 text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-400">
                                        <Target className="w-4 h-4" /> Misi Tuntas
                                    </h5>
                                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Belum ada misi tuntas</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <DrawerFooter className="bg-gray-50/50 px-4 md:px-8 py-4 md:py-6 rounded-b-[3rem]">
                        <DrawerClose asChild>
                            <Button variant="outline" className="w-full h-12 rounded-2xl border-gray-200 font-black uppercase tracking-widest text-[10px] md:text-xs">Tutup Detail</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="w-[95vw] md:max-w-md rounded-2xl p-6 md:p-8 border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                            <UserCircle className="w-6 h-6 text-[#800000]" />
                            User Baru
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 md:space-y-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Lengkap</Label>
                            <Input 
                                value={formData.full_name} 
                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                placeholder="Contoh: Muhammad Al-Fatih" 
                                className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</Label>
                            <Input 
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                type="email" 
                                placeholder="fatih@peacecivic.id" 
                                className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Password</Label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <Input 
                                    value={formData.password} 
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    type="password" 
                                    placeholder="Min. 8 Karakter" 
                                    className="rounded-lg border-gray-100 h-11 md:h-12 pl-12 font-bold text-sm"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Role</Label>
                                <Select value={formData.role} onValueChange={(val: any) => setFormData({...formData, role: val})}>
                                    <SelectTrigger className="rounded-lg h-11 md:h-12 font-bold text-sm">
                                        <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl">
                                        <SelectItem value="STUDENT" className="text-sm font-bold">Siswa</SelectItem>
                                        <SelectItem value="TEACHER" className="text-sm font-bold">Guru</SelectItem>
                                        <SelectItem value="ADMIN" className="text-sm font-bold">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Kelas</Label>
                                <Input 
                                    value={formData.class_room} 
                                    onChange={(e) => setFormData({...formData, class_room: e.target.value})}
                                    placeholder="Contoh: Aceh-01" 
                                    className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            onClick={handleCreateUser} 
                            disabled={submitting}
                            className="w-full h-12 md:h-14 border-none bg-[#800000] hover:bg-[#600000] text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-[#800000]/20 text-xs"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Daftarkan User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="w-[95vw] md:max-w-md rounded-2xl p-6 md:p-8 border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                            <Edit className="w-6 h-6 text-[#800000]" />
                            Sunting Profile
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 md:space-y-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Lengkap</Label>
                            <Input 
                                value={formData.full_name} 
                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                placeholder="Nama Lengkap" 
                                className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</Label>
                            <Input 
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                type="email" 
                                placeholder="Email" 
                                className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Role</Label>
                                <Select value={formData.role} onValueChange={(val: any) => setFormData({...formData, role: val})}>
                                    <SelectTrigger className="rounded-lg h-11 md:h-12 font-bold text-sm">
                                        <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl">
                                        <SelectItem value="STUDENT" className="text-sm font-bold">Siswa</SelectItem>
                                        <SelectItem value="TEACHER" className="text-sm font-bold">Guru</SelectItem>
                                        <SelectItem value="ADMIN" className="text-sm font-bold">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Poin</Label>
                                <Input 
                                    type="number"
                                    value={formData.points} 
                                    onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                                    className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Kelas</Label>
                            <Input 
                                value={formData.class_room} 
                                onChange={(e) => setFormData({...formData, class_room: e.target.value})}
                                placeholder="Kelas" 
                                className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                                disabled={formData.role !== 'STUDENT'}
                            />
                            {formData.role === 'STUDENT' && (
                                <p className="text-[8px] font-bold text-red-500 uppercase tracking-[0.05em] mt-1">
                                    * Mengubah kelas akan mengeluarkan pejuang dari tim saat ini secara otomatis.
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Ganti Password (Opsional)</Label>
                            <Input 
                                value={formData.password} 
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                type="password" 
                                placeholder="Kosongkan jika tidak ingin diubah" 
                                className="rounded-lg border-gray-100 h-11 md:h-12 font-bold text-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            onClick={handleUpdateUser} 
                            disabled={submitting}
                            className="w-full h-12 md:h-14 border-none bg-[#800000] hover:bg-[#600000] text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-[#800000]/20 text-xs"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl bg-white w-[90vw] max-w-sm pt-8">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="w-full text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight text-center text-center">Hapus User?</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs md:px-6 md:text-sm font-medium text-gray-500 leading-relaxed text-center">
                            Tindakan ini akan menghapus akun <span className="font-black text-[#800000]">{userToDelete?.full_name}</span> secara permanen. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-2 flex-row">
                        <AlertDialogCancel className="h-10 md:h-11 rounded-xl border-2 border-gray-100 font-bold uppercase tracking-widest text-[10px] flex-1 cursor-pointer">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteUser}
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

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                ${active ? 'bg-[#800000] text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}
            `}
        >
            <Icon className="w-3 h-3 md:w-4 md:h-4" />
            {label}
        </button>
    );
}

function StatCard({ icon: Icon, value, label, color }: any) {
    return (
        <div className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] ${color} flex flex-col gap-1 md:gap-2`}>
            <Icon className="w-5 h-5 md:w-6 md:h-6 opacity-60" />
            <div className="mt-1 md:mt-2">
                <p className="text-lg md:text-2xl font-black">{value}</p>
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-80 leading-tight">{label}</p>
            </div>
        </div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="py-12 md:py-20 text-center flex flex-col items-center gap-4 bg-gray-50 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-gray-200" />
            </div>
            <p className="text-gray-400 font-bold italic uppercase tracking-widest text-[9px] md:text-xs px-4">{label}</p>
        </div>
    );
}
