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
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <div className="flex-shrink-0 p-2.5 rounded-xl bg-accent/10 text-accent shadow-sm border border-accent/5">
            <BookOpen size={20} />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="font-bold text-base text-text-primary truncate font-display tracking-tight leading-tight group-hover/col:text-accent transition-colors duration-300">
              {library.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.1em]">
                {cards.length} Flashcards
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons - Hover Only */}
        <div className="flex gap-1.5 items-center opacity-0 group-hover/col:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/col:translate-x-0">
          <button
            onClick={() => onEditLibrary(library)}
            title="Sửa thư viện"
            className="p-2.5 rounded-xl text-text-muted hover:text-accent hover:bg-accent/10 transition-all border border-transparent hover:border-accent/10 bg-white/5"
          >
            <Settings2 size={16} />
          </button>
          <button
            onClick={() => onDeleteLibrary(library.id)}
            title="Xóa thư viện"
            className="p-2.5 rounded-xl text-red-400/60 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/10 bg-white/5"
          >
            <Trash2 size={16} />
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
