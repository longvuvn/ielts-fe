import React, { useState } from 'react';
import { Edit2, Trash2, Volume2, RotateCcw } from 'lucide-react';
import Badge from "../button/Badge";

const FlaskCard = ({ 
  id, 
  front, 
  back, 
  topic, 
  onEdit, 
  onDelete, 
  onSpeak 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative group perspective h-72">
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className={`relative w-full h-full transition-all duration-500 preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full premium-card p-8 flex flex-col backface-hidden shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <Badge color="blue">{topic || "General"}</Badge>
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak && onSpeak(front);
                }}
                className="p-2 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
              >
                <Volume2 size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center text-center">
            <h3 className="text-2xl font-bold text-text-primary leading-tight font-display">
              {front}
            </h3>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-text-muted group-hover:text-accent transition-colors">
            <RotateCcw size={14} className="animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Flip to reveal</span>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full premium-card p-8 flex flex-col backface-hidden rotate-y-180 border-accent/40 bg-elevated shadow-2xl">
          <div className="flex justify-between items-start mb-4">
             <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-2.5 py-1 rounded-md">Definition</span>
             <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak && onSpeak(back);
                }}
                className="p-2 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
              >
                <Volume2 size={18} />
              </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center text-center overflow-y-auto custom-scrollbar">
            <p className="text-lg text-text-secondary leading-relaxed italic">
              "{back}"
            </p>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-text-muted">
            <span className="text-[10px] font-bold uppercase tracking-widest">Click to flip back</span>
          </div>
        </div>
      </div>

      {/* Admin Actions - Hover Only */}
      <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit && onEdit(id);
          }}
          className="p-2.5 bg-elevated border border-border-default text-warning hover:border-warning/50 rounded-xl shadow-xl backdrop-blur-md"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete && onDelete(id);
          }}
          className="p-2.5 bg-elevated border border-border-default text-red-400 hover:border-red-400/50 rounded-xl shadow-xl backdrop-blur-md"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default FlaskCard;
