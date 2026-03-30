import React from "react";
import { ArrowRight, Play, BookOpen, Star, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-[#060d1a]">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 animate-fade-slide-in">
              <Star className="text-blue-400" size={16} fill="currentColor" />
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Hệ thống luyện thi IELTS số 1</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold font-serif text-white leading-[1.1] mb-8">
              Chinh phục <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic">
                IELTS 8.0+
              </span> <br />
              Dễ dàng hơn
            </h1>
            
            <p className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed">
              Nền tảng học tập thông minh sử dụng công nghệ AI để cá nhân hóa lộ trình, 
              giúp bạn ghi nhớ từ vựng và luyện đề hiệu quả gấp 3 lần.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/exams"
                className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/25 active:scale-95"
              >
                Bắt đầu ngay
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold transition-all active:scale-95">
                <div className="bg-white/10 p-1.5 rounded-full">
                  <Play size={16} fill="white" />
                </div>
                Xem demo
              </button>
            </div>

            <div className="mt-12 flex items-center gap-8 border-t border-white/5 pt-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#060d1a] bg-gray-800" />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#060d1a] bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                  +2k
                </div>
              </div>
              <p className="text-sm text-gray-500 font-medium">
                <span className="text-white">2,000+</span> học viên đang ôn luyện hàng ngày
              </p>
            </div>
          </div>

          <div className="relative lg:block hidden">
            <div className="relative z-10 bg-gradient-to-br from-white/10 to-transparent p-1 rounded-[40px] border border-white/10 backdrop-blur-2xl">
              <div className="bg-[#0f1a2e] rounded-[36px] overflow-hidden aspect-square flex items-center justify-center p-12">
                <div className="relative w-full h-full border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center">
                  <BookOpen size={120} className="text-blue-500/20 absolute" />
                  <div className="grid grid-cols-2 gap-6 w-full relative z-20">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                      <div className="bg-blue-500 w-10 h-10 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Star className="text-white" size={20} />
                      </div>
                      <h3 className="text-white font-bold mb-1">Flashcards</h3>
                      <p className="text-xs text-gray-500">AI-powered memory</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-8 hover:bg-white/10 transition-all group">
                      <div className="bg-indigo-500 w-10 h-10 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShieldCheck className="text-white" size={20} />
                      </div>
                      <h3 className="text-white font-bold mb-1">Exams</h3>
                      <p className="text-xs text-gray-500">Real structure</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decor elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
