import React from "react";
import { ArrowRight, Play, BookOpen, Star, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../button/button.home";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-40 overflow-hidden bg-page">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-accent/5 rounded-full blur-[140px] opacity-60" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-10 animate-fade-slide-in">
            <Sparkles className="text-accent" size={14} fill="currentColor" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.2em]">The Future of IELTS Prep</span>
          </div>
          
          <h1 className="text-6xl lg:text-[88px] font-bold font-display text-text-primary leading-[0.95] tracking-tight mb-10">
            Master IELTS <br />
            <span className="text-accent relative inline-block">
              Intelligently
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/20" viewBox="0 0 300 12" fill="none">
                 <path d="M1 11C40 3.5 120 1 299 4" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>
          
          <p className="text-text-secondary text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Personalized AI-driven paths to your target score. 
            Smart vocabulary recall, real exam environments, and deep analytics.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            <Link to="/exams">
              <Button size="lg" className="px-10 h-14 text-lg shadow-[0_0_40px_rgba(59,125,255,0.3)]">
                Start Learning Free
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="px-10 h-14 text-lg" icon={Play}>
              Watch Demo
            </Button>
          </div>

          <div className="mt-16 flex flex-col items-center gap-6">
            <div className="flex -space-x-3 items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-xl border-2 border-page bg-elevated overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User Profile" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-xl border-2 border-page bg-accent flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                +2k
              </div>
            </div>
            <p className="text-sm text-text-muted font-bold uppercase tracking-widest">
              Join <span className="text-text-primary">2,500+</span> ambitious learners
            </p>
          </div>
        </div>

        {/* Visual Element */}
        <div className="relative max-w-5xl mx-auto mt-10">
           <div className="premium-card p-2 bg-white/5 backdrop-blur-3xl border-white/10 shadow-2xl overflow-hidden aspect-[16/9] rounded-[32px]">
              <div className="w-full h-full bg-page/40 rounded-[24px] overflow-hidden border border-white/5 relative group">
                 {/* Dashboard Mockup Style */}
                 <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
                 
                 <div className="p-12 h-full flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-8 w-full">
                       {[
                         { title: "Vocabulary", icon: Star, color: "text-yellow-400", bg: "bg-yellow-400/10" },
                         { title: "Exams", icon: ShieldCheck, color: "text-accent", bg: "bg-accent/10" },
                         { title: "Analytics", icon: BookOpen, color: "text-success", bg: "bg-success/10" }
                       ].map((item, idx) => (
                         <div key={idx} className="premium-card p-8 border-white/5 bg-elevated/50 backdrop-blur-md group-hover:border-accent/20 transition-all duration-500">
                            <div className={`${item.bg} ${item.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
                               <item.icon size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-text-primary mb-2 font-display">{item.title}</h4>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                               <div className="w-2/3 h-full bg-white/10 rounded-full" />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Glow Effects */}
           <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/30 blur-[80px] rounded-full opacity-50" />
           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 blur-[80px] rounded-full opacity-50" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
