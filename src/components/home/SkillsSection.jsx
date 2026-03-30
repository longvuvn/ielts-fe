import React from "react";
import { Headphones, BookText, PenTool, MessageSquare, TrendingUp } from "lucide-react";

const skills = [
  {
    title: "Listening",
    desc: "Luyện nghe với audio sát đề thi thật, phụ đề thông minh.",
    icon: <Headphones className="text-blue-400" size={28} />,
    color: "bg-blue-500/10",
  },
  {
    title: "Reading",
    desc: "Thư viện Passage đa dạng, tra từ vựng ngay khi đang đọc.",
    icon: <BookText className="text-emerald-400" size={28} />,
    color: "bg-emerald-500/10",
  },
  {
    title: "Writing",
    desc: "Chấm điểm Writing bằng AI theo tiêu chí bài thi IELTS.",
    icon: <PenTool className="text-amber-400" size={28} />,
    color: "bg-amber-500/10",
  },
  {
    title: "Speaking",
    desc: "Luyện phản xạ và phát âm chuẩn xác cùng trợ lý ảo.",
    icon: <MessageSquare className="text-purple-400" size={28} />,
    color: "bg-purple-500/10",
  },
];

const SkillsSection = () => {
  return (
    <section className="py-24 bg-[#0a1628] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <TrendingUp size={14} className="text-blue-400" />
            <span className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em]">Kỹ năng IELTS</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold font-serif text-white mb-4">
            Phát triển toàn diện 4 kỹ năng
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Chúng tôi cung cấp lộ trình cá nhân hóa cho từng kỹ năng, 
            giúp bạn bù đắp lỗ hổng kiến thức một cách nhanh nhất.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, i) => (
            <div 
              key={i} 
              className="bg-white/2 border border-white/5 p-8 rounded-3xl hover:bg-white/5 hover:-translate-y-2 transition-all group duration-300"
            >
              <div className={`${skill.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {skill.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{skill.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {skill.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
};

export default SkillsSection;
