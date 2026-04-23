import { useState, useEffect } from "react";
import { adminService } from "@/api/admin";
import {
    CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell,
    ResponsiveContainer, Tooltip as RechartsTooltip, Legend, Bar, BarChart
} from "recharts";
import {
    BarChart3,
    Users,
    Trophy,
    Rocket,
    BookOpen,
    Loader2,
    TrendingUp,
    Medal,
    Flame,
    MessageSquare,
    PieChart as PieChartIcon,
    ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OverviewStats {
    totalStudents: number;
    totalTeachers: number;
    totalProjects: number;
    totalMissionsCompleted: number;
    totalPointsAwarded: number;
}

interface LeaderboardUser {
    id: string;
    full_name: string;
    points: number;
    avatar_url: string | null;
    class_room: string | null;
    _count: {
        badges_received: number;
    };
}

export default function ManageReports() {
    const [loading, setLoading] = useState(true);
    const [activeClass, setActiveClass] = useState("ALL");    
    const [overview, setOverview] = useState<OverviewStats | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [missionInsights, setMissionInsights] = useState<any[]>([]);
    const [detailedStats, setDetailedStats] = useState<any>(null);
    const [classrooms, setClassrooms] = useState<string[]>([]);

    const fetchData = async (classroom = "ALL") => {
        setLoading(true);
        try {
            const [overviewRes, leaderboardRes, missionRes, detailedRes, classRes] = await Promise.all([
                adminService.getOverviewStats(),
                adminService.getLeaderboard(),
                adminService.getMissionInsights(),
                adminService.getDetailedStats(classroom),
                adminService.getClassroomStats()
            ]);

            setOverview(overviewRes.data.data);
            setLeaderboard(leaderboardRes.data.data);
            setMissionInsights(missionRes.data.data);
            setDetailedStats(detailedRes.data.data);

            // Extract classrooms for tabs
            const classList = classRes.data.data.map((c: any) => c.classroom);
            setClassrooms(["ALL", ...classList]);
        } catch (error) {
            toast.error("Gagal memuat laporan statistik");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(activeClass);
    }, [activeClass]);

    if (loading && !detailedStats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
                <p className="text-gray-500 font-black uppercase tracking-[0.2em]">Menganalisis Data...</p>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-8 lg:px-12 md:pt-2 pb-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-[#800000]">
                        <BarChart3 className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Intelligence & Analytics</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">Laporan Statistik</h1>
                    <p className="text-gray-500 font-medium italic text-sm">Analisis performa pejuang dan efektivitas ekosistem.</p>
                </div>
            </div>

            {/* Tabs per Kelas */}
            <Tabs defaultValue="ALL" onValueChange={setActiveClass} className="w-full">
                <TabsList className="bg-white rounded-xl shadow-sm border border-gray-100 h-16 w-full md:w-auto grid grid-cols-3 md:inline-flex gap-2">
                    {classrooms.map((c) => (
                        <TabsTrigger
                            key={c}
                            value={c}
                            className="rounded-xl px-2 md:px-8 font-black text-[9.5px] md:text-xs uppercase tracking-tight md:tracking-widest data-[state=active]:bg-[#800000] data-[state=active]:text-white transition-all cursor-pointer"
                        >
                            {c === "ALL" ? "Seluruh Kelas" : c}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value={activeClass} className="space-y-8 mt-8 outline-none">
                    <div className="space-y-8 p-2">
                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Total Pejuang" value={overview?.totalStudents || 0} icon={Users} color="text-blue-600" bg="bg-blue-50" />
                            <StatCard title="Poin Terdistribusi" value={overview?.totalPointsAwarded || 0} icon={TrendingUp} color="text-green-600" bg="bg-green-50" suffix=" PT" />
                            <StatCard title="Misi Selesai" value={overview?.totalMissionsCompleted || 0} icon={Trophy} color="text-yellow-600" bg="bg-yellow-50" />
                            <StatCard title="Proyek Selesai" value={overview?.totalProjects || 0} icon={Rocket} color="text-purple-600" bg="bg-purple-50" />
                        </div>

                        {/* Chart Row 1: Module & Project Completion */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white/40 backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-[#800000]" />
                                        <CardTitle className="text-md md:text-lg font-black uppercase tracking-tight">Status Penyelesaian Modul</CardTitle>
                                    </div>
                                    <CardDescription className="text-xs font-medium italic">Persentase modul yang telah diselesaikan oleh pejuang.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={detailedStats?.moduleStats}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                            >
                                                {detailedStats?.moduleStats.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                            <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white/40 backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Rocket className="w-5 h-5 text-[#800000]" />
                                        <CardTitle className="text-md md:text-lg font-black uppercase tracking-tight">Status Proyek</CardTitle>
                                    </div>
                                    <CardDescription className="text-xs font-medium italic">Distribusi status pengerjaan proyek perdamaian.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={detailedStats?.projectStats}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                            <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                                            <Bar dataKey="value" fill="#800000" radius={[10, 10, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Chart Row 2: Classroom Comparison (Only show if ALL is selected) */}
                        {activeClass === "ALL" && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <Card className="lg:col-span-1 border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white/40 backdrop-blur-sm">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <PieChartIcon className="w-5 h-5 text-[#800000]" />
                                            <CardTitle className="text-md md:text-lg font-black uppercase tracking-tight">Proyek per Kelas</CardTitle>
                                        </div>
                                        <CardDescription className="text-xs font-medium italic">Tingkat penyelesaian proyek setiap kelas.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={detailedStats?.classroomComparison} layout="vertical">
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800 }} width={80} />
                                                <RechartsTooltip />
                                                <Bar dataKey="projectRate" fill="#D4AF37" radius={[0, 10, 10, 0]} label={{ position: 'right', fontSize: 10, fontWeight: 900, formatter: (v: any) => `${v}%` }} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card className="lg:col-span-1 border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white/40 backdrop-blur-sm">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-[#800000]" />
                                            <CardTitle className="text-md md:text-lg font-black uppercase tracking-tight">Keaktifan Kelas</CardTitle>
                                        </div>
                                        <CardDescription className="text-xs font-medium italic">Rata-rata poin yang dikumpulkan per kelas.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={detailedStats?.classroomComparison}>
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800 }} />
                                                <RechartsTooltip />
                                                <Bar dataKey="activityScore" fill="#800000" radius={[10, 10, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card className="lg:col-span-1 border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white/40 backdrop-blur-sm">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-[#800000]" />
                                            <CardTitle className="text-md md:text-lg font-black uppercase tracking-tight">Penggunaan Forum</CardTitle>
                                        </div>
                                        <CardDescription className="text-xs font-medium italic">Total pesan yang dikirimkan di forum per kelas.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={detailedStats?.classroomComparison}
                                                    dataKey="forumUsage"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={40}
                                                    outerRadius={70}
                                                >
                                                    {detailedStats?.classroomComparison.map((_: any, index: number) => {
                                                        const colors = ['#800000', '#D4AF37', '#475569', '#1e293b', '#92400e'];
                                                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                                    })}
                                                </Pie>
                                                <RechartsTooltip />
                                                <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Trends & Insights */}
                        <div className="flex flex-col gap-8">
                            <div className="lg:col-span-1 space-y-8">
                                {/* Mission Insights */}
                                <Card className="flex flex-col p-0 border-none shadow-2xl shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/40 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-br from-orange-600 to-red-600 text-white p-6">
                                        <div className="flex items-center gap-2">
                                            <Flame className="w-6 h-6 text-yellow-300" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Misi Menantang</span>
                                        </div>
                                        <CardTitle className="text-md md:text-xl font-black uppercase tracking-tight">Wawasan Misi</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-4">
                                        {missionInsights.slice(0, 4).map((m) => (
                                            <div key={m.id} className="px-4 py-3 bg-white/40 rounded-2xl border border-white space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-xs font-bold text-gray-900 line-clamp-1">{m.title}</span>
                                                    <ArrowUpRight className="w-3 h-3 text-red-500" />
                                                </div>
                                                <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase">
                                                    <span>Kesulitan</span>
                                                    <span className="text-red-600">{m.difficultyScore}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* Top 10 Leaderboard */}
                                <Card className="flex flex-col p-0 border-none shadow-2xl shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/40 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-br from-[#800000] to-[#600000] text-white p-6">
                                        <div className="flex items-center gap-2">
                                            <Medal className="w-6 h-6 text-[#D4AF37]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Top Pejuang</span>
                                        </div>
                                        <CardTitle className="text-xl font-black uppercase tracking-tight">Leaderboard</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-4">
                                        <Table>
                                            <TableBody>
                                                {leaderboard.map((user) => (
                                                    <TableRow key={user.id} className="hover:bg-gray-50 border-b-gray-50">
                                                        <TableCell className="flex items-center gap-2 py-3">
                                                            <Avatar className="w-7 h-7 border border-gray-100">
                                                                <AvatarImage src={user.avatar_url || ""} />
                                                                <AvatarFallback className="bg-gray-100 text-[8px] font-black">{user.full_name.substring(0, 2)}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-[10px] font-bold text-gray-900 truncate max-w-[80px]">{user.full_name}</span>
                                                        </TableCell>
                                                        <TableCell className="text-right text-[10px] font-black text-[#800000]">{user.points} PT</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bg, suffix = "" }: any) {
    return (
        <Card className="border-none shadow-xl shadow-gray-100/50 rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</p>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter">
                            {value.toLocaleString()}
                            <span className="text-xs font-bold text-gray-400 ml-1 uppercase">{suffix}</span>
                        </h3>
                    </div>
                    <div className={`p-3 rounded-2xl ${bg}`}>
                        <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
