import React from "react";
import { Plus, Trash2, BookOpen, Settings2 } from "lucide-react";
import FlashcardItem from "./FlashcardItem";

const LibraryColumn = ({
  library,
  cards = [],
  onEditLibrary,
  onDeleteLibrary,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onClickCard,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragOver,
}) => {
  return (
    <div
      onDragOver={(e) => onDragOver(e, library.id)}
      onDrop={(e) => onDrop(e, library.id)}
      className={`premium-card p-6 gap-6 min-h-[280px] group/col transition-all duration-300 ${
        isDragOver ? "border-accent/60 bg-accent/5 ring-4 ring-accent/10" : ""
      }`}
    >
      {/* COLUMN HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 overflow-hidden flex-1">
          <div className="p-2 rounded-lg bg-accent/10 text-accent">
            <BookOpen size={16} />
          </div>
          <span className="font-bold text-sm text-text-primary truncate font-display tracking-tight">
            {library.name}
          </span>
          <span className="bg-accent/10 text-accent border border-accent/20 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
            {cards.length}
          </span>
        </div>

        {/* Action buttons - Hover Only */}
        <div className="flex gap-1 items-center opacity-0 group-hover/col:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEditLibrary(library)}
            title="Sửa thư viện"
            className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-all"
          >
            <Settings2 size={14} />
          </button>
          <button
            onClick={() => onDeleteLibrary(library.id)}
            title="Xóa thư viện"
            className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* DROP ZONE HINT */}
      {isDragOver && (
        <div className="border-2 border-dashed border-accent/40 rounded-xl p-4 text-center animate-pulse">
          <p className="text-accent text-[10px] font-bold uppercase tracking-widest">Thả thẻ vào đây</p>
        </div>
      )}

      {/* CARDS LIST */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
               <BookOpen size={20} className="text-accent" />
            </div>
            <p className="text-text-secondary text-[13px] font-bold">Chưa có flashcard</p>
            <p className="text-text-muted text-[11px] mt-1 uppercase tracking-tight">Nhấn + để thêm</p>
          </div>
        ) : (
          cards.map((card, index) => (
            <FlashcardItem
              key={`${card.id}-${index}`}
              card={card}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
              onClickCard={onClickCard}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>

      {/* ADD CARD SHORTCUT */}
      <button
        onClick={() => onAddCard(library.id)}
        className="w-full flex items-center justify-center py-2.5 bg-transparent border border-dashed border-white/5 rounded-xl text-text-muted hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-300 font-bold text-[11px] uppercase tracking-widest"
      >
        <Plus size={14} className="mr-2" /> Thêm flashcard
      </button>
    </div>
  );
};

export default LibraryColumn;
