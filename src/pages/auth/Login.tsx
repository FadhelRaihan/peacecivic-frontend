import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LogIn, Mail, Lock, ShieldCheck, ChevronRight, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
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
      
      if (response.user.role === 'ADMIN') {
        setError("Akun Admin hanya dapat masuk melalui portal khusus.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login gagal. Silakan cek email dan password Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F9F6F0] p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#800000] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#D4AF37] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#800000] text-white shadow-xl mb-3 md:mb-4 rotate-3 transform hover:rotate-0 transition-transform duration-300">
            <LogIn className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#800000] tracking-tight">PEACE CIVIC</h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium">LMS Budaya Damai & Demokrasi</p>
        </div>

        <Card className="rounded-2xl border-none bg-white overflow-hidden">
          <CardHeader className="pb-2 pt-6 md:pt-8 text-center">
            <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">Selamat Datang Kembali</CardTitle>
            <CardDescription className="text-xs md:text-sm text-gray-400">Silakan masuk untuk melanjutkan belajar</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-4 md:pt-6">
            <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5 md:gap-2">
                <Label htmlFor="email" className="text-xs md:text-sm font-bold text-gray-700 ml-1">Email</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#800000] transition-colors z-10">
                    <Mail className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="block w-full h-auto pl-10 md:pl-11 pr-4 py-3 md:py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#800000] focus:ring-0 transition-all outline-none text-[13.5px] md:text-[15px] font-medium placeholder:text-gray-400 shadow-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 md:gap-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-xs md:text-sm font-bold text-gray-700">Password</Label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#800000] transition-colors z-10">
                    <Lock className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full h-auto pl-10 md:pl-11 pr-11 md:pr-12 py-3 md:py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#800000] focus:ring-0 transition-all outline-none text-[13.5px] md:text-[15px] font-medium placeholder:text-gray-400 shadow-none inline-flex items-center"
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 md:h-14 bg-[#800000] hover:bg-[#600000] text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#800000]/20 flex items-center justify-center gap-2 group border-none cursor-pointer text-sm md:text-base mt-2"
              >
                {isLoading ? "Memproses..." : "Masuk Sekarang"}
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 text-center">
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                Belum punya akun?{" "}
                <Link to="/register" className="text-[#800000] font-bold hover:underline">
                  Daftar Disini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
