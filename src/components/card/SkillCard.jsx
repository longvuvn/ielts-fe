import Button from "../button/button.home";

const SkillCard = ({
  icon: Icon,
  title,
  description,
  progress,
  lessons,
  duration,
  topics,
}) => {
  return (
    <div className="premium-card p-8 flex-1">
      <div className="flex items-center justify-between mb-8">
        <div className="p-3 rounded-xl bg-accent/10 text-accent">
          <Icon size={32} />
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1">Status</p>
          <span className="text-xs font-bold text-success flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
            Active
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-3 text-text-primary tracking-tight font-display">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed mb-8 flex-1">{description}</p>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Course Progress</span>
          <span className="text-sm font-mono font-bold text-text-primary">{progress}%</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-accent rounded-full h-full transition-all duration-500 shadow-[0_0_8px_rgba(59,125,255,0.5)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8 py-6 border-y border-border-default">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1">Lessons</p>
          <p className="text-lg font-bold text-text-primary font-display">{lessons}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1">Duration</p>
          <p className="text-lg font-bold text-text-primary font-display">{duration}</p>
        </div>
      </div>

      {/* Key Topics */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold mb-4">Core Focus Areas</p>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <span key={topic} className="text-[11px] font-bold text-text-secondary bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              {topic}
            </span>
          ))}
        </div>
      </div>

      <Button variant="primary" className="w-full shadow-lg shadow-accent/20">
        Resume Course
      </Button>
    </div>
  );
};

export default SkillCard;
