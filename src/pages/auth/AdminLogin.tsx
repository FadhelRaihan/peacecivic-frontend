import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Mail, Key, ChevronRight, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login(email, password);
      
      // Verify role is ADMIN
      if (response.user.role !== 'ADMIN') {
         setError("Akses ditolak. Halaman ini hanya untuk Administrator.");
         setIsLoading(false);
         return;
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login gagal. Silakan cek kredensial admin Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1a1a1a] p-4 relative overflow-hidden font-sans">
      {/* Dark theme for Admin portal background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="admin-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#admin-grid)" />
        </svg>
      </div>

      {/* Glow effect for atmosphere */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4AF37] rounded-full mix-blend-screen filter blur-3xl opacity-5 pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-[#D4AF37] to-[#AA841E] text-white shadow-2xl mb-4 shadow-[#D4AF37]/20 transform hover:scale-105 transition-transform duration-300">
            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-black/80" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-widest uppercase">Admin Panel</h1>
          <p className="text-[#D4AF37] font-bold tracking-[0.2em] text-[10px] md:text-xs mt-1">PEACE CIVIC CENTRAL</p>
        </div>

        <Card className="rounded-2xl border-none bg-[#242424] overflow-hidden">
          <CardHeader className="pb-2 pt-6 md:pt-8 text-center text-white">
            <CardTitle className="text-xl md:text-2xl font-bold">Otentikasi Admin</CardTitle>
            <CardDescription className="text-xs md:text-sm text-gray-400">Masukkan akses khusus administrator</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-4 md:pt-6">
            <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
              {error && (
                <div className="p-3 md:p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs md:text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5 md:gap-2">
                <Label htmlFor="email" className="text-xs md:text-sm font-bold text-gray-300 ml-1">Email Administrator</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#D4AF37] transition-colors z-10">
                    <Mail className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@peacecivic.com"
                    className="block w-full h-auto pl-10 md:pl-11 pr-4 py-3 md:py-4 bg-[#2a2a2a] border-2 border-transparent rounded-xl focus:bg-[#333333] focus:border-[#D4AF37] focus:ring-0 transition-all outline-none text-white text-[13.5px] md:text-[15px] font-medium placeholder:text-gray-600 shadow-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 md:gap-2">
                <Label htmlFor="password" className="text-xs md:text-sm font-bold text-gray-300 ml-1">Master Password</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#D4AF37] transition-colors z-10">
                    <Key className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full h-auto pl-10 md:pl-11 pr-11 md:pr-12 py-3 md:py-4 bg-[#2a2a2a] border-2 border-transparent rounded-xl focus:bg-[#333333] focus:border-[#D4AF37] focus:ring-0 transition-all outline-none text-white text-[13.5px] md:text-[15px] font-medium placeholder:text-gray-600 shadow-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#D4AF37] transition-colors z-10 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 md:h-14 bg-[#D4AF37] hover:bg-[#AA841E] text-[#1a1a1a] font-black rounded-xl transition-all duration-300 shadow-xl shadow-[#D4AF37]/10 flex items-center justify-center gap-2 group mt-4 border-none cursor-pointer text-sm md:text-base mb-2"
              >
                {isLoading ? "Mengautentikasi..." : "Buka Panel Admin"}
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/5 text-center">
              <Link to="/login" className="text-gray-500 text-[11px] md:text-xs font-bold hover:text-[#D4AF37] transition-colors uppercase tracking-widest">
                Kembali ke Portal Umum
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
