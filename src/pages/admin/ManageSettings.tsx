// import { useState, useEffect } from "react";
// import { adminService } from "@/api/admin";
// import { 
//     Settings, 
//     Shield,
//     Trophy, 
//     Building2, 
//     Save, 
//     Loader2, 
//     Lock,
//     Globe,
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { toast } from "sonner";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export default function ManageSettings() {
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [settings, setSettings] = useState<any>({
//         appName: "PeaceCivic",
//         institutionName: "",
//         allowRegistration: "true",
//         maintenanceMode: "false",
//         baseMissionPoints: "500",
//         doublePointEvent: "false",
//         sessionTimeout: "120"
//     });

//     const fetchSettings = async () => {
//         setLoading(true);
//         try {
//             const res = await adminService.getSettings();
//             if (res.data.data && Object.keys(res.data.data).length > 0) {
//                 setSettings((prev: any) => ({ ...prev, ...res.data.data }));
//             }
//         } catch (error) {
//             toast.error("Gagal memuat pengaturan");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSave = async () => {
//         setSaving(true);
//         try {
//             await adminService.updateSettings(settings);
//             toast.success("Pengaturan berhasil disimpan");
//         } catch (error) {
//             toast.error("Gagal menyimpan pengaturan");
//         } finally {
//             setSaving(false);
//         }
//     };

//     useEffect(() => {
//         fetchSettings();
//     }, []);

//     if (loading) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
//                 <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
//                 <p className="text-gray-500 font-black uppercase tracking-[0.2em]">Menyiapkan Pengaturan...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="px-4 md:px-8 lg:px-12 md:pt-2 pb-8 space-y-8 animate-in fade-in duration-500">
//             {/* Header Section */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//                 <div className="flex flex-col gap-4 text-center md:text-left">
//                     <div className="flex items-center justify-center md:justify-start gap-2 text-[#800000]">
//                         <Settings className="w-5 h-5" />
//                         <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Platform Control</span>
//                     </div>
//                     <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">Pengaturan Sistem</h1>
//                     <p className="text-gray-500 font-medium italic text-sm">Konfigurasi global untuk menyesuaikan perilaku platform PeaceCivic.</p>
//                 </div>

//                 <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-3">
//                     <Button
//                         onClick={handleSave}
//                         disabled={saving}
//                         className="w-full md:w-auto bg-[#800000] px-8 h-12 rounded-2xl font-black text-xs uppercase tracking-widest gap-2 hover:bg-[#600000] shadow-lg shadow-[#800000]/20"
//                     >
//                         {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                         Simpan Perubahan
//                     </Button>
//                 </div>
//             </div>

//             <Tabs defaultValue="identity" className="w-full">
//                 <TabsList className="bg-white rounded-xl shadow-sm border border-gray-100 h-16 p-2 flex overflow-x-auto scrollbar-hide justify-start md:justify-center mb-8 gap-2">
//                     <TabsTrigger value="identity" className="rounded-xl px-6 font-black text-xs uppercase tracking-widest data-[state=active]:bg-[#800000] data-[state=active]:text-white transition-all">
//                         <Building2 className="w-4 h-4 mr-2" /> Identitas
//                     </TabsTrigger>
//                     <TabsTrigger value="system" className="rounded-xl px-6 font-black text-xs uppercase tracking-widest data-[state=active]:bg-[#800000] data-[state=active]:text-white transition-all">
//                         <Globe className="w-4 h-4 mr-2" /> Sistem
//                     </TabsTrigger>
//                     <TabsTrigger value="gamification" className="rounded-xl px-6 font-black text-xs uppercase tracking-widest data-[state=active]:bg-[#800000] data-[state=active]:text-white transition-all">
//                         <Trophy className="w-4 h-4 mr-2" /> Gamifikasi
//                     </TabsTrigger>
//                     <TabsTrigger value="security" className="rounded-xl px-6 font-black text-xs uppercase tracking-widest data-[state=active]:bg-[#800000] data-[state=active]:text-white transition-all">
//                         <Lock className="w-4 h-4 mr-2" /> Keamanan
//                     </TabsTrigger>
//                 </TabsList>

//                 {/* Identity Settings */}
//                 <TabsContent value="identity" className="space-y-6">
//                     <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white/40 backdrop-blur-sm">
//                         <CardHeader>
//                             <CardTitle className="text-xl font-black uppercase tracking-tight text-gray-900">Profil Instansi</CardTitle>
//                             <CardDescription className="text-xs font-medium italic">Informasi dasar yang akan muncul di antarmuka publik.</CardDescription>
//                         </CardHeader>
//                         <CardContent className="space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div className="space-y-2">
//                                     <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Aplikasi</Label>
//                                     <Input 
//                                         value={settings.appName} 
//                                         onChange={(e) => setSettings({...settings, appName: e.target.value})}
//                                         className="h-12 rounded-xl border-2 border-gray-100 font-bold" 
//                                     />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Instansi</Label>
//                                     <Input 
//                                         value={settings.institutionName} 
//                                         onChange={(e) => setSettings({...settings, institutionName: e.target.value})}
//                                         placeholder="Contoh: SMA Negeri 1 Banda Aceh"
//                                         className="h-12 rounded-xl border-2 border-gray-100 font-bold" 
//                                     />
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>

//                 {/* System Settings */}
//                 <TabsContent value="system" className="space-y-6">
//                     <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white/40 backdrop-blur-sm">
//                         <CardHeader>
//                             <CardTitle className="text-xl font-black uppercase tracking-tight text-gray-900">Perilaku Sistem</CardTitle>
//                             <CardDescription className="text-xs font-medium italic">Konfigurasi akses dan status operasional platform.</CardDescription>
//                         </CardHeader>
//                         <CardContent className="space-y-8">
//                             <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
//                                 <div className="space-y-1">
//                                     <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Pendaftaran Mandiri</p>
//                                     <p className="text-[10px] font-medium text-gray-500 italic">Izinkan siswa baru untuk mendaftar secara mandiri.</p>
//                                 </div>
//                                 <Switch 
//                                     checked={settings.allowRegistration === "true"}
//                                     onCheckedChange={(checked) => setSettings({...settings, allowRegistration: String(checked)})}
//                                 />
//                             </div>

//                             <div className="flex items-center justify-between p-4 bg-red-50/30 rounded-2xl border border-red-100">
//                                 <div className="space-y-1">
//                                     <p className="text-sm font-black text-red-900 uppercase tracking-tight text-[#800000]">Mode Pemeliharaan</p>
//                                     <p className="text-[10px] font-medium text-red-500 italic">Kunci akses publik untuk sementara waktu.</p>
//                                 </div>
//                                 <Switch 
//                                     checked={settings.maintenanceMode === "true"}
//                                     onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: String(checked)})}
//                                 />
//                             </div>

//                             <div className="space-y-2">
//                                 <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Batas Waktu Sesi (Menit)</Label>
//                                 <Input 
//                                     type="number"
//                                     value={settings.sessionTimeout} 
//                                     onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
//                                     className="h-12 rounded-xl border-2 border-gray-100 font-bold w-full md:w-[200px]" 
//                                 />
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>

//                 {/* Gamification Settings */}
//                 <TabsContent value="gamification" className="space-y-6">
//                     <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white/40 backdrop-blur-sm">
//                         <CardHeader>
//                             <CardTitle className="text-xl font-black uppercase tracking-tight text-gray-900">Ekonomi & Gamifikasi</CardTitle>
//                             <CardDescription className="text-xs font-medium italic">Atur perolehan poin dan mekanisme reward pejuang.</CardDescription>
//                         </CardHeader>
//                         <CardContent className="space-y-8">
//                             <div className="space-y-2">
//                                 <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Poin Dasar Misi</Label>
//                                 <div className="flex items-center gap-4">
//                                     <Input 
//                                         type="number"
//                                         value={settings.baseMissionPoints} 
//                                         onChange={(e) => setSettings({...settings, baseMissionPoints: e.target.value})}
//                                         className="h-12 rounded-xl border-2 border-gray-100 font-bold w-full md:w-[200px]" 
//                                     />
//                                     <span className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">Poin / Misi</span>
//                                 </div>
//                             </div>

//                             <div className="flex items-center justify-between p-4 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20">
//                                 <div className="space-y-1">
//                                     <div className="flex items-center gap-2">
//                                         <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Double Point Event</p>
//                                         <span className="px-2 py-0.5 bg-[#D4AF37] text-white text-[8px] font-black rounded-full uppercase">Hot</span>
//                                     </div>
//                                     <p className="text-[10px] font-medium text-gray-500 italic">Aktifkan pengali 2x poin untuk seluruh aktivitas.</p>
//                                 </div>
//                                 <Switch 
//                                     checked={settings.doublePointEvent === "true"}
//                                     onCheckedChange={(checked) => setSettings({...settings, doublePointEvent: String(checked)})}
//                                 />
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>

//                 {/* Security Settings */}
//                 <TabsContent value="security" className="space-y-6">
//                     <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white/40 backdrop-blur-sm">
//                         <CardHeader>
//                             <CardTitle className="text-xl font-black uppercase tracking-tight text-gray-900">Keamanan Admin</CardTitle>
//                             <CardDescription className="text-xs font-medium italic">Manajemen akses dan integritas data administratif.</CardDescription>
//                         </CardHeader>
//                         <CardContent className="space-y-6">
//                             <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 flex items-start gap-4">
//                                 <Shield className="w-5 h-5 text-orange-600 mt-1" />
//                                 <div className="space-y-1">
//                                     <p className="text-sm font-black text-orange-900 uppercase tracking-tight">Perlindungan Akun</p>
//                                     <p className="text-[10px] font-medium text-orange-700 italic">Gunakan password yang kuat dan unik untuk akun administratif. Disarankan untuk mengganti password secara berkala.</p>
//                                 </div>
//                             </div>

//                             <Button 
//                                 variant="outline"
//                                 className="w-full md:w-auto h-12 rounded-xl border-2 border-gray-100 font-bold text-xs uppercase tracking-widest gap-2 hover:bg-gray-50"
//                             >
//                                 <Lock className="w-4 h-4 text-[#800000]" /> Ganti Password Admin
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>
//             </Tabs>
//         </div>
//     );
// }
