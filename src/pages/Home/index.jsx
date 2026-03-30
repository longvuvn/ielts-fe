import React from "react";
import HeroSection from "../../components/home/HeroSection";
import SkillsSection from "../../components/home/SkillsSection";
import CommunitySection from "../../components/home/CommunitySection";
import Footer from "../../components/layouts/Footer/index";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-[#060d1a] selection:bg-blue-500/30">
      {/* Hero Section - First impression */}
      <HeroSection />

      {/* Skills Section - Key value proposition */}
      <SkillsSection />

      {/* Community/Features - Social proof & extras */}
      <CommunitySection />

      {/* Simple CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold font-serif text-white mb-6">
              Sẵn sàng để bắt đầu hành trình?
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
              Tham gia cùng hàng ngàn học viên khác và nâng cao band điểm IELTS của bạn ngay hôm nay.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl active:scale-95">
                Đăng ký miễn phí
              </button>
              <button className="bg-blue-700/30 text-white border border-blue-400/30 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700/50 transition-all active:scale-95">
                Tìm hiểu thêm
              </button>
            </div>
          </div>

          {/* Decor */}
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default HomePage;
