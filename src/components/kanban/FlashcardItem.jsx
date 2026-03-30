import React, { useState } from "react";
import { Trash2, BookOpen, Edit2, ArrowRight } from "lucide-react";

const FlashcardItem = ({ card, onEdit, onDelete, onClickCard, onDragStart, onDragEnd }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    onDragStart(e, card);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    if (onDragEnd) onDragEnd(e);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group/item relative bg-elevated/50 border border-white/5 rounded-[12px] p-4 cursor-pointer transition-all duration-200 hover:bg-elevated hover:border-accent/30 hover:shadow-xl hover:shadow-black/20 ${
        isDragging ? "opacity-40 cursor-grabbing" : "opacity-100"
      }`}
    >
      {/* Label and Actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen size={12} className="text-accent/60" />
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">
            FLASHCARD
          </span>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(card); }}
            className="p-1.5 rounded-md text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
            className="p-1.5 rounded-md text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div onClick={() => onClickCard(card.id)} className="flex-1 space-y-2">
        <h4 className="text-[14px] font-bold text-text-primary leading-snug font-display tracking-tight group-hover/item:text-accent transition-colors">
          {card.title}
        </h4>
        {card.description && (
          <p className="text-[12px] text-text-secondary leading-relaxed line-clamp-1 font-medium italic opacity-70">
            {card.description}
          </p>
        )}
      </div>

      {/* Link Footer */}
      <div 
        onClick={() => onClickCard(card.id)}
        className="mt-4 flex items-center gap-1.5 text-accent group/link transition-colors"
      >
        <span className="text-[11px] font-bold uppercase tracking-widest">
          Học từ vựng
        </span>
        <ArrowRight size={12} className="transition-transform group-hover/link:translate-x-1" />
      </div>
    </div>
  );
};

export default FlashcardItem;
