import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2 } from "lucide-react";
import { teamService } from "@/api/team";

interface JoinTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function JoinTeamDialog({ open, onOpenChange, onSuccess }: JoinTeamDialogProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    if (!inviteCode.trim()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      await teamService.joinTeam(inviteCode.toUpperCase());
      onSuccess();
      onOpenChange(false);
      setInviteCode("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Kode tim tidak valid atau gagal bergabung.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-[425px] border-none bg-white p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-5 md:p-6 pb-2 text-center">
          <div className="mx-auto w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#D4AF37]/5 flex items-center justify-center shadow-inner mb-3 md:mb-4">
            <UserPlus className="w-6 h-6 md:w-8 md:h-8 text-[#D4AF37]" />
          </div>
          <DialogTitle className="text-xl md:text-2xl text-center font-black text-[#D4AF37] tracking-tight uppercase">Gabung Tim</DialogTitle>
          <DialogDescription className="text-xs md:text-sm text-gray-500 text-center font-medium">
            Masukkan kode undangan dari temanmu untuk bergabung dalam satu perjuangan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-5 md:p-6 pt-2 space-y-4 md:space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[11px] md:text-sm font-medium animate-in fade-in zoom-in-95">
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-1.5 md:gap-2">
            <Label htmlFor="inviteCode" className="text-xs md:text-sm font-bold text-gray-700 ml-1">Kode Undangan</Label>
            <Input
              id="inviteCode"
              placeholder="Contoh: A1B2C3"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="h-12 md:h-14 text-center text-xl md:text-2xl font-black tracking-[0.5em] bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-0 transition-all placeholder:text-gray-300 placeholder:tracking-normal placeholder:font-medium placeholder:text-sm md:placeholder:text-base uppercase"
              maxLength={6}
            />
          </div>
        </div>

        <DialogFooter className="p-5 md:p-6 pt-0">
          <Button
            onClick={handleJoin}
            disabled={isLoading || inviteCode.length < 4}
            className="w-full h-11 md:h-12 bg-[#D4AF37] hover:bg-[#AA841E] text-black font-bold rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all active:scale-[0.98] border-none text-sm cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              "Gabung Sekarang"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
