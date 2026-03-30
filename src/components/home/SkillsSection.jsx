import React from "react";
import { Headphones, BookText, PenTool, MessageSquare, TrendingUp, Sparkles } from "lucide-react";

const skills = [
  {
    title: "Listening",
    desc: "Master diverse accents with real-time smart transcriptions and adaptive playback.",
    icon: <Headphones size={24} />,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    title: "Reading",
    desc: "Vast library of academic passages with instant AI-powered vocabulary lookups.",
    icon: <BookText size={24} />,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    title: "Writing",
    desc: "Get instant feedback on your essays using our advanced AI evaluation engine.",
    icon: <PenTool size={24} />,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    title: "Speaking",
    desc: "Practice natural conversations and refine your pronunciation with an AI tutor.",
    icon: <MessageSquare size={24} />,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
];

const SkillsSection = () => {
  return (
    <section className="py-32 bg-page relative overflow-hidden border-y border-border-default">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <TrendingUp size={14} className="text-accent" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.2em]">Core Expertise</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold font-display text-text-primary mb-6 tracking-tight">
            Holistic Skill Development
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Tailored paths for all modules. Bridge your gaps with data-driven 
            insights and high-frequency IELTS content.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skill, i) => (
            <div 
              key={i} 
              className="premium-card p-10 hover:border-accent/40 group relative overflow-hidden flex-1"
            >
              {/* Subtle background icon */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-text-primary group-hover:scale-110 group-hover:opacity-[0.07] transition-all duration-500">
                {React.cloneElement(skill.icon, { size: 120 })}
              </div>

              <div className={`${skill.bg} ${skill.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-black/20`}>
                {skill.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-text-primary mb-4 font-display">{skill.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-8 flex-1">
                {skill.desc}
              </p>
              
              <div className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                Explore Modules <Sparkles size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
    </section>
  );
};

export default SkillsSection;
