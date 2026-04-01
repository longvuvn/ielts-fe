import Badge from "../button/Badge";
import { Clock, BookOpen, Users, ArrowRight } from "lucide-react";

const TestCard = ({
  title,
  description,
  duration = "180 min",
  attempts = 1200,
  badges = [],
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="premium-card overflow-hidden cursor-pointer group flex flex-col h-full"
    >
      <div className="p-7 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-6 gap-4">
          <div className="bg-accent/10 text-accent p-2.5 rounded-xl group-hover:bg-accent group-hover:text-white transition-all shrink-0">
            <BookOpen size={22} />
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            <Badge color="blue">Academic</Badge>
            {badges.map((badge) => (
              <Badge key={badge} color={badge === "Popular" ? "yellow" : "blue"}>
                {badge}
              </Badge>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-bold text-text-primary group-hover:text-accent transition-colors leading-tight mb-3 font-display">
          {title}
        </h3>

        <p className="text-text-secondary text-sm mb-8 line-clamp-2 leading-relaxed">
          {description || "Master the IELTS Academic modules with our comprehensive practice exams."}
        </p>

        <div className="flex-1" />

        <div className="grid grid-cols-2 gap-4 mb-8 py-5 border-y border-border-default">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted">
              <Clock size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Time</span>
              <span className="text-xs text-text-primary font-mono font-bold">{duration}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted">
              <Users size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Taken</span>
              <span className="text-xs text-text-primary font-mono font-bold">{attempts.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-accent text-white py-3.5 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20">
          Luyện tập ngay
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default TestCard;
