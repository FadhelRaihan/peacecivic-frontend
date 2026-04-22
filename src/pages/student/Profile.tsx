import { useState, useEffect, useRef } from "react";
import { userService, type UserProfile } from "@/api/user";
import { Loader2, Star, Camera } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const [data, setData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    try {
      const response = await userService.getProfile();
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate if it's an image
    if (!file.type.startsWith('image/')) {
      return toast.error("File harus berupa gambar");
    }

    setIsUploading(true);
    const toastId = toast.loading("Mengunggah foto profil...");

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      await userService.updateAvatar(formData);
      
      toast.success("Foto profil berhasil diperbarui", { id: toastId });
      // Refresh profile data
      await fetchProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengunggah foto profil", { id: toastId });
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse text-xs uppercase tracking-widest">Memuat Profil Kehormatan...</p>
      </div>
    );
  }

  if (!data) return null;

  const { profile, statistics } = data;
  const pointGoal = 1000;
  const missionGoal = statistics.total_missions || 20;

  return (
    <>
      {/* Top Header - Dark Maroon Game Style */}
      <div className="relative bg-[#800000] pt-14 pb-24 px-6 overflow-hidden">
        {/* Decorative Border Bottom */}
        <div className="absolute inset-x-0 bottom-0 h-4 bg-[url('/ornament-bottom.png')] opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#D4AF37]" />

        <div className="max-w-md mx-auto relative z-10 flex flex-col items-center mt-8">
          {/* Avatar with Laurel Wreath */}
          <div className="relative">
            {/* Yellow Circular Glow */}
            <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-2xl scale-125" />

            {/* Laurel Wreath SVG */}
            <div className="absolute -inset-10 flex items-center justify-center pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-[180px] h-[180px] text-[#D4AF37]">
                <path fill="currentColor" opacity="0.8" d="M100,10 C149.7,10 190,50.3 190,100 C190,149.7 149.7,190 100,190 C50.3,190 10,149.7 10,100 C10,50.3 50.3,10 100,10 M100,20 C55.8,20 20,55.8 20,100 C20,144.2 55.8,180 100,180 C144.2,180 180,144.2 180,100 C180,55.8 144.2,20 100,20" />
                {/* Simplified laurel leaves */}
                <path fill="currentColor" d="M45,85 L35,75 Q30,70 35,65 L45,70 Z M40,110 L30,100 Q25,95 30,90 L40,95 Z M50,135 L40,125 Q35,120 40,115 L50,120 Z" />
                <path fill="currentColor" transform="scale(-1, 1) translate(-200, 0)" d="M45,85 L35,75 Q30,70 35,65 L45,70 Z M40,110 L30,100 Q25,95 30,90 L40,95 Z M50,135 L40,125 Q35,120 40,115 L50,120 Z" />
              </svg>
            </div>

            <div 
              onClick={handleAvatarClick}
              className={`relative w-32 h-32 rounded-full border-4 border-[#D4AF37] overflow-hidden shadow-2xl bg-[#E8D4C0] group ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer hover:border-white transition-colors'}`}
            >
              <img
                src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.full_name}`}
                alt={profile.full_name}
                className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-30' : 'group-hover:opacity-75'}`}
              />
              
              {/* Upload Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white mb-1" />
                <span className="text-[8px] font-bold text-white uppercase tracking-tighter">Ubah Foto</span>
              </div>

              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Agent Ribbon Banner */}
          <div className="relative -mt-6 z-20 w-full flex flex-col items-center">
            <div className="bg-[#411609] border-2 border-[#D4AF37] px-8 py-2 rounded shadow-xl relative min-w-[200px] flex flex-col items-center">
              <span className="text-[#D4AF37] font-black uppercase text-sm tracking-widest">Agent of Peace</span>
              {/* Banner Side Ribbons */}
              <div className="absolute top-1 -left-4 w-4 h-full bg-[#2A0F06] -z-10 rounded-l skew-y-[15deg]" />
              <div className="absolute top-1 -right-4 w-4 h-full bg-[#2A0F06] -z-10 rounded-r -skew-y-[15deg]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Digital Parchment Style Card */}
      <div className="max-w-md mx-auto px-6 -mt-10 relative z-30">
        <div className="bg-[#FFF9F2] rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.15)] border-t-2 border-[#D4AF37]/30">
          <div className="space-y-6">

            {/* Progress Stats Section */}
            <div className="space-y-4">
              {/* decor line top */}
              <div className="flex items-center justify-between opacity-[0.3] mb-6">
                {[...Array(6)].map((_, i) => <Star key={i} className="w-2 h-2" />)}
              </div>

              {/* Missions Progress */}
              <div className="group">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black text-[#5D1212] w-24">Misi Selesai:</span>
                  <div className="flex-1 h-3 bg-[#3A2A22] rounded-full overflow-hidden p-[2px]">
                    <div
                      className="h-full bg-[#4DAF50] rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] transition-all duration-1000"
                      style={{ width: `${Math.min((statistics.missions_completed / missionGoal) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-black text-[#5D1212] w-8 text-right">{statistics.missions_completed}</span>
                </div>
                <div className="mt-3 border-b border-[#D4AF37]/10" />
              </div>

              {/* Points Progress */}
              <div className="group">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black text-[#5D1212] w-24">Poin:</span>
                  <div className="flex-1 h-3 bg-[#3A2A22] rounded-full overflow-hidden p-[2px]">
                    <div
                      className="h-full bg-[#FBC02D] rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] transition-all duration-1000"
                      style={{ width: `${Math.min((profile.points / pointGoal) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-black text-[#5D1212] w-8 text-right">{profile.points}</span>
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div className="pt-4 mt-4">
              {data.badges && data.badges.length > 0 ? (
                <div className="grid grid-cols-3 gap-6">
                  {data.badges.map((badge: any) => (
                    <div key={badge.id} className="flex flex-col items-center gap-3 group animate-in zoom-in duration-500">
                      <div className="relative">
                        <img src={badge.badge_icon_url} alt={badge.badge_name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[9px] font-black text-center uppercase tracking-tighter text-[#5D1212] leading-tight px-1 h-6 -mt-6 flex items-center">
                        {badge.badge_name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 flex flex-col items-center justify-center opacity-40 grayscale">
                  <div className="w-16 h-16 rounded-full border-4 border-dashed border-[#800000] flex items-center justify-center mb-3">
                    <Star className="w-6 h-6 text-[#800000]" />
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#800000] text-center">Belum ada lencana kehormatan tersemat</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
