import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Mail, Lock, User, GraduationCap, ChevronRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    class_room: "",
    role: "STUDENT",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [classes, setClasses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classList = await authService.getClasses();
        setClasses(classList);
        if (classList.length > 0 && !formData.class_room) {
          setFormData(prev => ({ ...prev, class_room: classList[0] }));
        }
      } catch (err) {
        console.error("Failed to fetch classes", err);
      }
    };
    fetchClasses();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.class_room) {
      setError("Pilih kelas terlebih dahulu. Jika tidak ada pilihan, hubungi Guru Anda.");
      setIsLoading(false);
      return;
    }

    try {
      await authService.register(formData);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registrasi gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F9F6F0] p-4 relative overflow-hidden">
      {/* Decorative background elements consistent with Login */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#800000] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#D4AF37] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />

      <div className="w-full max-w-2xl relative z-10 my-4 md:my-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#800000] text-white shadow-xl mb-3 md:mb-4 -rotate-3 transform hover:rotate-0 transition-transform duration-300">
            <UserPlus className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#800000] tracking-tight uppercase leading-tight">Daftar Akun</h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium italic">Silakan buat akun untuk Siswa</p>
        </div>

        <Card className="rounded-2xl border-none bg-white overflow-hidden">
          <CardHeader className="pb-2 pt-6 md:pt-8 text-center">
            <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">Bergabung Bersama Kami</CardTitle>
            <CardDescription className="text-xs md:text-sm text-gray-400">Isi data diri Anda dengan lengkap</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-4 md:pt-6">
            <form onSubmit={handleRegister} className="space-y-4 md:space-y-5">
              {error && (
                <div className="p-3 md:p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs md:text-sm font-medium flex items-start gap-3 animate-in fade-in zoom-in-95">
                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 shrink-0 mt-0.5" />
                  <span className="flex-1">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="flex flex-col gap-1.5 md:gap-2">
                  <Label htmlFor="full_name" className="text-xs md:text-sm font-bold text-gray-700 ml-1">Nama Lengkap</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#800000] transition-colors z-10">
                      <User className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <Input
                      id="full_name"
                      type="text"
                      required
                      placeholder="Masukkan nama lengkap"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="block w-full h-auto pl-10 md:pl-11 pr-4 py-3 md:py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#800000] focus:ring-0 transition-all outline-none text-[13.5px] md:text-[15px] font-medium placeholder:text-gray-400 shadow-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 md:gap-2">
                  <Label htmlFor="email" className="text-xs md:text-sm font-bold text-gray-700 ml-1">Alamat Email</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#800000] transition-colors z-10">
                      <Mail className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="block w-full h-auto pl-10 md:pl-11 pr-4 py-3 md:py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#800000] focus:ring-0 transition-all outline-none text-[13.5px] md:text-[15px] font-medium placeholder:text-gray-400 shadow-none focus:ring-offset-0"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="flex flex-col gap-1.5 md:gap-2">
                  <Label htmlFor="class_room" className="text-xs md:text-sm font-bold text-gray-700 ml-1">Pilih Kelas</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#800000] transition-colors z-10">
                      <GraduationCap className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <Select 
                      value={formData.class_room} 
                      onValueChange={(value) => setFormData({ ...formData, class_room: value })}
                    >
                      <SelectTrigger className="w-full h-auto pl-10 md:pl-11 pr-4 py-3 md:py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#800000] text-[13.5px] md:text-[15px] font-medium shadow-none transition-all outline-none border-none">
                        <SelectValue placeholder="Pilih Kelas Anda" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-2xl">
                        {classes.map((cls) => (
                          <SelectItem key={cls} value={cls} className="rounded-lg focus:bg-red-50 focus:text-[#800000] font-medium text-sm">
                            {cls}
                          </SelectItem>
                        ))}
                        {classes.length === 0 && (
                           <SelectItem value="none" disabled className="text-sm">Tidak ada kelas tersedia</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 md:gap-2">
                  <Label htmlFor="password" className="text-xs md:text-sm font-bold text-gray-700 ml-1">Password</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#800000] transition-colors z-10">
                      <Lock className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="block w-full h-auto pl-10 md:pl-11 pr-11 md:pr-12 py-3 md:py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#800000] focus:ring-0 transition-all outline-none text-[13.5px] md:text-[15px] font-medium placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#800000] transition-colors z-10 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 md:h-14 bg-[#800000] hover:bg-[#600000] text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#800000]/20 flex items-center justify-center gap-2 group mt-2 border-none cursor-pointer text-sm md:text-base"
              >
                {isLoading ? "Mendaftarkan..." : "Buat Akun Sekarang"}
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 text-center">
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                Sudah punya akun?{" "}
                <Link to="/login" className="text-[#800000] font-bold hover:underline">
                  Masuk Sekarang
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
