import { ChevronRight, Users, BookOpen, MessageSquare, HeartHandshake, ShieldCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F0] overflow-hidden font-sans">
      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#800000]/95 backdrop-blur-md shadow-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center rotate-3 shadow-lg">
                <HeartHandshake className="w-5 h-5 md:w-6 md:h-6 text-[#800000]" />
              </div>
              <span className="text-xl md:text-2xl font-black text-white tracking-tight">PeaceCivic</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#fitur" className="text-white/80 hover:text-white font-semibold transition-colors text-sm">Fitur Utama</a>
              <a href="#alur" className="text-white/80 hover:text-white font-semibold transition-colors text-sm">Cara Kerja</a>
              <a href="#gamifikasi" className="text-white/80 hover:text-white font-semibold transition-colors text-sm">Gamifikasi</a>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="hidden md:flex text-white hover:bg-white/10 font-bold border-none cursor-pointer">
                  Masuk
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-[#D4AF37] hover:bg-[#b08d26] text-[#4a3d1a] font-black shadow-lg shadow-[#D4AF37]/20 border-none cursor-pointer">
                  Daftar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40 px-4">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#800000]/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/4" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-6 md:space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[#800000]/10 border border-[#800000]/20 text-[#800000] font-bold text-xs md:text-sm animate-fade-in">
              <Star className="w-4 h-4 fill-current" />
              <span>Platform LMS Pendidikan Karakter Pertama</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Pendidikan <span className="text-[#800000]">Demokrasi</span> & <br className="hidden lg:block"/>
              Harmoni <span className="text-[#D4AF37]">Budaya</span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Pelajari nilai-nilai Pancasila, lestarikan kearifan lokal Aceh, dan wujudkan kedamaian melalui aksi nyata kolaboratif di lingkungan sekitarmu.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link to="/register" className="w-full sm:w-auto">
                <Button className="w-full h-14 px-8 bg-[#800000] hover:bg-[#600000] text-white font-bold rounded-xl text-base shadow-xl shadow-[#800000]/20 flex items-center gap-2 group border-none cursor-pointer transition-all hover:scale-105">
                  Mulai Belajar Sekarang
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full h-14 px-8 bg-white text-gray-700 font-bold border-2 border-gray-200 hover:border-[#800000] hover:text-[#800000] rounded-xl text-base cursor-pointer transition-all">
                  Masuk ke Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Images - Grid Layout */}
          <div className="relative h-[400px] md:h-[500px] w-full max-w-lg mx-auto hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-[#800000] to-[#4a0000] rounded-[40px] rotate-3 opacity-10 blur-xl" />
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-3xl p-6 shadow-2xl z-20 hover:-translate-y-2 transition-transform duration-300 rotate-6 border border-gray-100 flex flex-col items-center justify-center gap-4">
               <img src="/images/Peace-Love.png" alt="Peace" className="w-24 h-24 object-contain drop-shadow-md" />
               <div className="text-center">
                 <h3 className="font-black text-[#800000] text-lg">Peace Project</h3>
                 <p className="text-xs text-gray-500 font-medium">Aksi Sosial Nyata</p>
               </div>
            </div>

            <div className="absolute bottom-10 left-0 w-72 h-48 bg-[#121212] rounded-3xl p-6 shadow-2xl z-30 hover:-translate-y-2 transition-transform duration-300 -rotate-3 border border-gray-800 flex items-center justify-between overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
               <div className="relative z-10 space-y-2">
                 <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-black" />
                 </div>
                 <h3 className="font-black text-white text-lg leading-tight">Budaya<br/>Aceh</h3>
               </div>
               <img src="/images/Rumah-Icon.svg" alt="Rumah Aceh" className="w-28 h-28 object-contain relative z-10 translate-x-4" />
            </div>
          </div>
        </div>
      </section>

      {/* --- Fitur Utama Section --- */}
      <section id="fitur" className="py-20 md:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <h2 className="text-sm font-black text-[#D4AF37] tracking-widest uppercase mb-3">Keunggulan Platform</h2>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">Membangun Karakter Melalui Kolaborasi Aktif</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-[2rem] bg-gray-50 hover:bg-[#800000] transition-colors duration-500 cursor-default border border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-[#800000]" />
              </div>
              <h4 className="text-xl font-black text-gray-900 group-hover:text-white mb-3 transition-colors">Modul Interaktif</h4>
              <p className="text-gray-500 group-hover:text-white/80 font-medium leading-relaxed transition-colors text-sm">
                Pelajari materi Pendidikan Kewarganegaraan dan nilai luhur budaya Aceh secara komprehensif.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-[2rem] bg-gray-50 hover:bg-[#D4AF37] transition-colors duration-500 cursor-default border border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h4 className="text-xl font-black text-gray-900 group-hover:text-[#4a3d1a] mb-3 transition-colors">Duek Pakat (Forum)</h4>
              <p className="text-gray-500 group-hover:text-[#4a3d1a]/80 font-medium leading-relaxed transition-colors text-sm">
                Ruang diskusi real-time untuk bertukar ide dan memecahkan studi kasus bersama tim secara kolaboratif.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-[2rem] bg-gray-50 hover:bg-[#121212] transition-colors duration-500 cursor-default border border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-gray-900" />
              </div>
              <h4 className="text-xl font-black text-gray-900 group-hover:text-white mb-3 transition-colors">Peace Project</h4>
              <p className="text-gray-500 group-hover:text-white/60 font-medium leading-relaxed transition-colors text-sm">
                Implementasikan solusi nyata di masyarakat. Rancang aksi sosial, ajukan ke guru, dan wujudkan kedamaian.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Cara Kerja Section --- */}
      <section id="alur" className="py-20 md:py-32 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-sm font-black text-[#800000] tracking-widest uppercase mb-3">Langkah Mudah</h2>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">Alur Pembelajaran</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0" />

            {[
              { num: "01", title: "Daftar Akun", desc: "Bergabung ke kelas yang telah disiapkan Guru." },
              { num: "02", title: "Pelajari Materi", desc: "Baca modul dan pahami nilai kebangsaan." },
              { num: "03", title: "Bentuk Tim", desc: "Diskusikan isu terkini di Duek Pakat." },
              { num: "04", title: "Aksi Nyata", desc: "Upload laporan Peace Project & raih poin." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-[#F9F6F0] shadow-xl flex items-center justify-center text-xl font-black text-[#800000] mb-6">
                  {step.num}
                </div>
                <h4 className="text-lg font-black text-gray-900 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-500 font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Gamifikasi CTA Section --- */}
      <section id="gamifikasi" className="py-20 bg-[#800000] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <ShieldCheck className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
            Kumpulkan Lencana &<br/>Raih Peringkat Teratas!
          </h2>
          <p className="text-white/80 font-medium text-base md:text-lg mb-10 max-w-2xl mx-auto">
            Sistem gamifikasi cerdas kami menghargai setiap progres belajarmu. Dapatkan poin dari membaca modul, berdiskusi, hingga menyelesaikan proyek sosial.
          </p>
          <Link to="/register">
             <Button className="h-14 px-10 bg-white hover:bg-gray-100 text-[#800000] font-black rounded-full text-base shadow-2xl hover:scale-105 transition-all border-none cursor-pointer">
               Mulai Petualanganmu
             </Button>
          </Link>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#121212] py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-[#D4AF37]" />
            <span className="text-xl font-black text-white tracking-tight">PeaceCivic</span>
          </div>
          <p className="text-sm font-medium text-gray-500">
            © 2026 PeaceCivic LMS. Semua Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}