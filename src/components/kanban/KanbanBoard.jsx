import React from "react";
import { Plus, Library as LibraryIcon } from "lucide-react";
import LibraryColumn from "./LibraryColumn";

const KanbanBoard = ({
  libraries = [],
  cardsByLibrary = {},
  isLoading,
  dragOverLibraryId,
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
  onOpenCreateLibrary,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="premium-card min-h-[400px] bg-white/5 animate-pulse border-white/5"
          />
        ))}
      </div>
    );
  }

  if (libraries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-slide-in">
        <div className="w-20 h-20 rounded-[24px] bg-accent/10 border border-accent/20 flex items-center justify-center mb-8 shadow-2xl shadow-accent/5">
          <LibraryIcon size={36} className="text-accent" />
        </div>
        <h2 className="text-3xl font-bold font-display text-text-primary mb-3">Chưa có thư viện nào</h2>
        <p className="text-text-secondary max-w-sm mx-auto mb-10 font-medium">
          Bắt đầu hành trình chinh phục từ vựng bằng cách tạo thư viện flashcard đầu tiên của bạn.
        </p>
        <button 
          onClick={onOpenCreateLibrary}
          className="premium-button-primary px-8 h-12 flex items-center gap-2 shadow-lg shadow-accent/20"
        >
          <Plus size={18} /> Tạo Thư Viện Ngay
        </button>
      </div>
    );
  }

  return (
    <div 
      onDragEnd={onDragEnd}
      className="flex flex-row gap-5 pt-3 items-start overflow-x-auto pb-10 custom-scrollbar-horizontal select-none"
      style={{ scrollBehavior: 'smooth' }}
    >
      {libraries.map((lib, index) => (
        <div key={`${lib.id}-${index}`} className="min-w-[380px] max-w-[380px] flex-shrink-0 animate-fade-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
          <LibraryColumn
            library={lib}
            cards={cardsByLibrary[lib.id] || []}
            onEditLibrary={onEditLibrary}
            onDeleteLibrary={onDeleteLibrary}
            onAddCard={onAddCard}
            onEditCard={onEditCard}
            onDeleteCard={onDeleteCard}
            onClickCard={onClickCard}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={onDrop}
            isDragOver={dragOverLibraryId === lib.id}
          />
        </div>
      ))}

      {/* ADD LIBRARY PLACEHOLDER */}
      <div
        onClick={onOpenCreateLibrary}
        className="min-w-[320px] flex-shrink-0 premium-card min-h-[280px] bg-transparent border-2 border-dashed border-white/5 hover:border-accent/40 hover:bg-accent/5 flex flex-col items-center justify-center gap-4 cursor-pointer group transition-all duration-300 hover:scale-[1.01]"
      >
        <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-text-muted group-hover:text-accent group-hover:border-accent/40 transition-colors">
          <Plus size={32} />
        </div>
        <span className="text-text-muted font-bold uppercase tracking-widest text-[11px] group-hover:text-accent transition-colors">
          Thêm thư viện
        </span>
      </div>
    </div>
  );
};

export default KanbanBoard;
