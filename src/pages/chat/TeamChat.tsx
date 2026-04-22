import { useState, useEffect } from "react";
import ChatRoom from "@/components/chat/ChatRoom";
import { userService, type UserProfile } from "@/api/user";
import { Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TeamChat() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#800000] animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Menyiapkan Ruang Duek Pakat...</p>
      </div>
    );
  }

  if (!userData?.team) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
           <AlertCircle className="w-10 h-10 text-gray-300" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Belum Memiliki Tim</h2>
          <p className="text-gray-500 font-medium mt-2">
            Anda harus membuat atau bergabung dengan tim terlebih dahulu untuk mengakses layanan Duek Pakat.
          </p>
        </div>
        <Link to="/">
          <Button className="bg-[#800000] hover:bg-[#600000] text-white font-black px-8 h-12 rounded-xl mt-4 cursor-pointer">
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ChatRoom 
        title={`Duek Pakat : ${userData.team.team_name}`} 
        isForum={false} 
        teamId={userData.team.id}
      />
    </div>
  );
}
