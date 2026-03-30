import React from "react";
import { MessageCircle, Users, Zap, Globe, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: <Users size={20} className="text-accent" />,
    title: "Global Community",
    desc: "Connect with thousands of learners worldwide to share experiences and insights."
  },
  {
    icon: <MessageCircle size={20} className="text-blue-400" />,
    title: "Active Discussions",
    desc: "Get instant clarifications on complex questions through our nested comment system."
  },
  {
    icon: <Zap size={20} className="text-warning" />,
    title: "Instant Feedback",
    desc: "Receive comprehensive AI-driven performance analysis seconds after submission."
  },
  {
    icon: <Globe size={20} className="text-success" />,
    title: "Curated Materials",
    desc: "Always up-to-date with official sources from Cambridge and British Council."
  }
];

const CommunitySection = () => {
  return (
    <section className="py-32 bg-page">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <div key={i} className="premium-card p-8 hover:bg-white/5 group">
                  <div className="bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-inner">
                    {f.icon}
                  </div>
                  <h3 className="text-text-primary font-bold mb-3 font-display text-lg">{f.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-4xl lg:text-6xl font-bold font-display text-text-primary mb-8 leading-[1.1] tracking-tight">
              A Complete <span className="text-accent italic">Ecosystem</span> for Success
            </h2>
            <p className="text-text-secondary text-xl mb-10 leading-relaxed font-medium">
              We go beyond static tests. Build your future within a highly 
              interactive environment where support is always a click away.
            </p>
            
            <div className="space-y-6">
              {[
                "50,000+ monthly peer discussions",
                "24/7 dedicated mentor support",
                "100GB+ curated premium materials"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-text-primary font-bold">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                     <CheckCircle2 size={14} className="text-accent" />
                  </div>
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-8 premium-card border-dashed border-accent/30 bg-accent/5">
               <p className="text-text-primary font-bold mb-2">Ready to join the elite?</p>
               <p className="text-text-secondary text-sm">Join our Discord and Telegram groups for daily challenges.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
