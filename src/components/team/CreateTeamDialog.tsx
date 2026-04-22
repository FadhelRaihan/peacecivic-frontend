import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Loader2 } from "lucide-react";
import { teamService } from "@/api/team";

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateTeamDialog({ open, onOpenChange, onSuccess }: CreateTeamDialogProps) {
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!teamName.trim()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      await teamService.createTeam(teamName);
      onSuccess();
      onOpenChange(false);
      setTeamName("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal membuat tim. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-[425px] rounded-2xl border-none bg-white p-0 overflow-hidden">
        <DialogHeader className="p-5 md:p-6 pb-2 text-center">
          <div className="mx-auto w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#800000]/5 flex items-center justify-center shadow-inner mb-3 md:mb-4">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-[#800000]" />
          </div>
          <DialogTitle className="text-xl md:text-2xl font-black text-[#800000] text-center tracking-tight uppercase">Buat Tim Baru</DialogTitle>
          <DialogDescription className="text-xs md:text-sm text-gray-500 font-medium text-center">
            Bangun tim hebatmu dan mulai aksi nyata untuk kedamaian.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-5 md:p-6 pt-2 space-y-4 md:space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[11px] md:text-sm font-medium animate-in fade-in zoom-in-95">
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-1.5 md:gap-2">
            <Label htmlFor="teamName" className="text-xs md:text-sm font-bold text-gray-700 ml-1">Nama Tim</Label>
            <Input
              id="teamName"
              placeholder="Masukkan nama tim hebatmu..."
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="h-11 md:h-12 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#800000] focus:ring-0 transition-all font-medium text-sm"
            />
          </div>
        </div>

        <DialogFooter className="p-5 md:p-6 pt-0">
          <Button
            onClick={handleCreate}
            disabled={isLoading || !teamName.trim()}
            className="w-full h-11 md:h-12 bg-[#800000] hover:bg-[#600000] text-white font-bold rounded-xl shadow-lg shadow-[#800000]/20 transition-all active:scale-[0.98] text-sm cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Dihidupkan...
              </>
            ) : (
              "Resmikan Tim Gata"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
