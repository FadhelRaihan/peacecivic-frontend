import { useState, useEffect } from "react";
import { teacherService } from "@/api/teacher";
import { teamService } from "@/api/team";
import { badgeService, type Badge } from "@/api/badge";
import ProjectReviewDetail from "@/components/teacher/ProjectReviewDetail";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
  Users,
  Search,
  Filter,
  Trash2,
  UserMinus,
  Download,
  Loader2,
  ShieldCheck,
  Copy,
  ChevronDown,
  History,
  ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
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

export default function TeacherTeamManagement() {
  const [teams, setTeams] = useState<any[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Dialog State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedTeamForDelete, setSelectedTeamForDelete] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamsRes, badgesRes] = await Promise.all([
        teacherService.getTeamsManagement(),
        badgeService.getAllBadges()
      ]);
      setTeams(teamsRes.data);
      setBadges(badgesRes.data);
    } catch (error) {
      toast.error("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteTeam = async () => {
    if (!selectedTeamForDelete) return;
    try {
      await teamService.deleteTeam(selectedTeamForDelete.id);
      toast.success("Tim berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error("Gagal menghapus tim");
    } finally {
      setDeleteConfirmOpen(false);
      setSelectedTeamForDelete(null);
    }
  };

  const handleRemoveMember = async (teamId: string, userId: string) => {
    if (!window.confirm("Yakin ingin mengeluarkan anggota ini?")) return;
    try {
      await teamService.removeMember(teamId, userId);
      toast.success("Anggota berhasil dikeluarkan");
      fetchData();
    } catch (error) {
      toast.error("Gagal mengeluarkan anggota");
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Rekapitulasi Tim & Proyek');

    // Define Columns
    worksheet.columns = [
      { header: 'Nama Tim', key: 'team_name', width: 25 },
      { header: 'Kode Undangan', key: 'invite_code', width: 15 },
      { header: 'Daftar Anggota', key: 'members', width: 40 },
      { header: 'Judul Proyek', key: 'project_title', width: 35 },
      { header: 'Status Proyek', key: 'status', width: 20 },
      { header: 'Nilai (Poin)', key: 'points', width: 15 },
      { header: 'Feedback Guru', key: 'feedback', width: 50 },
    ];

    // Style Header Cells (Specifically for defined columns only)
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30; // Set header height for better look
    
    worksheet.columns.forEach((_, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF800000' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Add Data
    filteredTeams.forEach(team => {
      const memberNames = team.members.map((m: any) => m.user.full_name).join(', ');
      
      if (team.projects.length === 0) {
        worksheet.addRow({
          team_name: team.team_name,
          invite_code: team.invite_code,
          members: memberNames,
          project_title: 'Belum Ada Proyek',
          status: '-',
          points: 0,
          feedback: '-'
        });
      } else {
        team.projects.forEach((proj: any) => {
          worksheet.addRow({
            team_name: team.team_name,
            invite_code: team.invite_code,
            members: memberNames,
            project_title: proj.title,
            status: proj.status,
            points: proj.points_awarded || 0,
            feedback: proj.teacher_feedback || '-'
          });
        });
      }
    });

    // Final Styling for Data Rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.alignment = { vertical: 'middle', wrapText: true };
        row.height = 25; // Optional: consistent row height
        
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }
    });

    // Add Auto Filter
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: worksheet.columns.length }
    };

    // Export to File
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Rekap_Tim_PeaceCivic_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success("Data berhasil diekspor ke Excel!");
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.team_name.toLowerCase().includes(searchTerm.toLowerCase());
    const latestStatus = team.projects[0]?.status || "DRAFT";
    const matchesStatus = statusFilter === "ALL" || latestStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-[0.2em]">Menata Database Pejuang...</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-12 md:pt-2 pb-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#800000]">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Portal Guru</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Katalog Pejuang</h1>
          <p className="text-gray-500 font-medium italic text-sm">Kelola riwayat proyek dan anggota tim dalam satu pusat kendali.</p>
        </div>

        <Button
          onClick={exportToExcel}
          className="bg-[#D4AF37] px-6 hover:bg-[#B8962D] text-[#800000] font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-[#D4AF37]/20 cursor-pointer border-none rounded-2xl"
        >
          <Download className="w-4 h-4 mr-2" /> Ekspor Rekap Excel
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari nama tim pejuang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 bg-white border-2 border-transparent focus:border-[#800000] rounded-2xl shadow-sm transition-all font-medium"
          />
        </div>
        <div className="md:col-span-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-14 px-6 bg-white border-none rounded-2xl shadow-sm font-black text-xs uppercase tracking-widest text-[#800000]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Status Terakhir" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="PLAN_SUBMITTED">Menunggu Review</SelectItem>
              <SelectItem value="PLAN_APPROVED">Aksi Berjalan</SelectItem>
              <SelectItem value="REPORT_SUBMITTED">Penilaian Laporan</SelectItem>
              <SelectItem value="COMPLETED">Selesai/Tuntas</SelectItem>
              <SelectItem value="DRAFT">Persiapan/Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onDelete={() => {
                setSelectedTeamForDelete(team);
                setDeleteConfirmOpen(true);
              }}
              onRemoveMember={handleRemoveMember}
              onReviewProject={(project) => setSelectedProject(project)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-gray-200" />
          </div>
          <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs font-serif italic">Belum ada tim yang ditemukan...</p>
        </div>
      )}

      {/* Reusable Review Dialog */}
      <ProjectReviewDetail
        project={selectedProject}
        badges={badges}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onSuccess={fetchData}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-[#FFF9F2] border-2 border-[#E8DCC4] rounded-2xl p-8 max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-gray-900 uppercase tracking-tight">Hapus Tim Ini?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-[#5D4037] leading-relaxed">
              Tindakan ini akan menghapus seluruh data tim "<strong>{selectedTeamForDelete?.team_name}</strong>" dan riwayat proyeknya. Tindakan ini permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="h-12 rounded-xl border-2 border-gray-100 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all cursor-pointer">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeam}
              className="h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-600/20 border-none cursor-pointer"
            >
              Ya, Hapus Tim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function TeamCard({ team, onDelete, onRemoveMember, onReviewProject }: {
  team: any,
  onDelete: () => void,
  onRemoveMember: (tid: string, uid: string) => void,
  onReviewProject: (project: any) => void
}) {
  const [showMembers, setShowMembers] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const statusConfig = {
    PLAN_SUBMITTED: { label: 'Menunggu Reviu', color: 'bg-yellow-50 text-yellow-700' },
    REPORT_SUBMITTED: { label: 'Penilaian Laporan', color: 'bg-blue-50 text-blue-700' },
    PLAN_APPROVED: { label: 'Aksi Berjalan', color: 'bg-orange-50 text-orange-700' },
    COMPLETED: { label: 'Tuntas', color: 'bg-green-50 text-green-700' },
    DRAFT: { label: 'Persiapan', color: 'bg-gray-50 text-gray-500' }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(team.invite_code);
    toast.success("Kode undangan disalin!");
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
  };

  return (
    <Card className="group overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
      <CardContent className="px-6 py-2 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <UIBadge className={`bg-[#800000]/5 text-[#800000] border-none font-black text-xs uppercase tracking-widest px-3 py-1`}>
            {team.projects.length} Proyek
          </UIBadge>
          <Button
            variant="default"
            size="sm"
            onClick={onDelete}
            className="text-red-600 bg-red-50 hover:text-white hover:bg-red-600 rounded-xl h-9 w-9 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Team Title */}
        <div className="space-y-1">
          <h3 className="font-black text-2xl text-gray-900 group-hover:text-[#800000] transition-colors uppercase tracking-tight line-clamp-1 h-8">
            {team.team_name}
          </h3>
          <div
            onClick={copyInviteCode}
            className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-[#800000] transition-colors w-fit"
          >
            ID TIM: <span className="bg-gray-50 px-2 py-0.5 rounded text-[#800000]">{team.invite_code}</span>
            <Copy className="w-3 h-3" />
          </div>
        </div>

        {/* Member Preview */}
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex -space-x-3">
            {team.members.map((m: any) => (
              <Avatar key={m.id} className="w-9 h-9 border-2 border-white ring-1 ring-gray-100 italic transition-transform hover:scale-110 hover:z-10">
                <AvatarImage src={m.user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user.full_name}`} />
                <AvatarFallback className="bg-[#D4AF37] text-[#800000] text-[10px] font-black uppercase">
                  {m.user.full_name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="text-[10px] font-black text-gray-400 hover:text-[#800000] uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer"
          >
            {showMembers ? "Tutup" : "Kelola Anggota"}
            <ChevronDown className={`w-3 h-3 transition-transform ${showMembers ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expandable Members List */}
        {showMembers && (
          <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
            {team.members.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-gray-900 line-clamp-1">{m.user.full_name}</span>
                <button
                  onClick={() => onRemoveMember(team.id, m.user.id)}
                  className="text-red-600 hover:text-red-200 transition-colors cursor-pointer"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action Button: History */}
        <div className="pt-2">
          <Button
            onClick={() => setShowHistory(!showHistory)}
            className={`
                    w-full h-14 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 cursor-pointer
                    ${showHistory
                ? "bg-[#1a1a1a] text-white"
                : "bg-white text-gray-500 border-2 border-gray-100 hover:border-[#800000] hover:text-[#800000]"}
                `}
          >
            <History className="w-4 h-4" />
            {showHistory ? "Tutup Riwayat" : "Riwayat Proyek"}
          </Button>
        </div>

        {/* Expandable Project History */}
        {showHistory && (
          <div className="space-y-3 animate-in slide-in-from-top-4 duration-300">
            {team.projects.length > 0 ? team.projects.map((p: any) => {
              const cfg = getStatusConfig(p.status);
              return (
                <div
                  key={p.id}
                  onClick={() => onReviewProject({ ...p, team: { team_name: team.team_name } })}
                  className="p-4 bg-white border-2 border-gray-50 rounded-xl hover:border-[#800000] cursor-pointer transition-all flex flex-col gap-2 group/proj"
                >
                  <div className="flex items-center justify-between">
                    <UIBadge className={`${cfg.color} border-none font-black text-[8px] uppercase tracking-widest h-5 px-2`}>
                      {cfg.label}
                    </UIBadge>
                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover/proj:text-[#800000] transition-colors" />
                  </div>
                  <p className="text-xs font-black text-gray-800 line-clamp-2 uppercase leading-tight group-hover/proj:text-[#800000] transition-colors">
                    {p.title}
                  </p>
                </div>
              );
            }) : (
              <div className="text-center py-6 text-gray-300 italic text-[10px] font-bold uppercase tracking-widest bg-gray-50 rounded-2xl">
                Belum ada proyek...
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
