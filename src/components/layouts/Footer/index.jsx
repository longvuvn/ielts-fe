import {
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-page border-t border-border-default pt-24 pb-12 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 pb-20 border-b border-border-default">
          {/* Brand & Mission */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="bg-accent p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-accent/20">
                <BookOpen className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold font-display text-text-primary tracking-tight">
                IELTS<span className="text-accent">Master</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-xs font-medium">
              Empowering global learners with AI-driven paths to language mastery. 
              The definitive platform for IELTS preparation.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                <button
                  key={idx}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all duration-300"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Preparation Links */}
          <div>
            <h4 className="font-bold font-display text-text-primary mb-8 uppercase tracking-widest text-[10px]">Preparation</h4>
            <ul className="space-y-4">
              {[
                "Listening Modules",
                "Reading Mastery",
                "Writing Assistant",
                "Speaking Coach",
                "Full Mock Exams",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-text-secondary text-sm hover:text-accent transition-colors duration-200 font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-bold font-display text-text-primary mb-8 uppercase tracking-widest text-[10px]">Resources</h4>
            <ul className="space-y-4">
              {[
                "Study Guides",
                "Video Tutorials",
                "Grammar Reference",
                "Vocabulary Builder",
                "Test Strategies",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-text-secondary text-sm hover:text-accent transition-colors duration-200 font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="lg:col-span-1">
            <h4 className="font-bold font-display text-text-primary mb-8 uppercase tracking-widest text-[10px]">The Newsletter</h4>
            <p className="text-text-secondary text-sm mb-6 leading-relaxed font-medium">
              Join 10k+ students getting weekly IELTS tips and exclusive strategies.
            </p>
            <div className="relative group mb-8">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#0a1020] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all placeholder:text-text-muted/50"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-accent text-white rounded-lg hover:brightness-110 transition shadow-lg shadow-accent/20">
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted group-hover:text-accent transition-colors">
                  <Mail size={16} />
                </div>
                <span className="text-xs text-text-secondary font-mono">support@ieltmaster.io</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted group-hover:text-accent transition-colors">
                  <MapPin size={16} />
                </div>
                <span className="text-xs text-text-secondary font-medium">HQ: Available Worldwide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 IELTS MASTER. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Cookies"].map((legal) => (
              <a 
                key={legal} 
                href="#" 
                className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] hover:text-accent transition-colors"
              >
                {legal}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
