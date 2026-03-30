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
      className="min-w-[260px] max-w-[260px] rounded-[18px] p-5 flex flex-col gap-3.5 transition-all duration-200 backdrop-blur-md shrink-0 self-start"
      style={{
        background: isDragOver ? "rgba(99,179,255,0.08)" : "rgba(255,255,255,0.03)",
        border: isDragOver ? "2px dashed rgba(99,179,255,0.6)" : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* COLUMN HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <BookOpen size={15} className="text-blue-400 shrink-0" />
          <span className="font-mono font-semibold text-sm text-[#e2e8f0] truncate">
            {library.name}
          </span>
        </div>

        <div className="flex gap-1.5 items-center shrink-0 ml-2">
          <span className="bg-blue-400/15 text-blue-300 rounded-full px-2 py-0.5 text-[11px] font-mono">
            {cards.length}
          </span>

          <button
            onClick={() => onEditLibrary(library)}
            title="Sửa thư viện"
            className="bg-white/5 border-none rounded-lg text-gray-400 cursor-pointer p-1.5 flex items-center hover:bg-white/10 hover:text-white transition-all"
          >
            <Settings2 size={13} />
          </button>

          <button
            onClick={() => onAddCard(library.id)}
            title="Thêm flashcard mới"
            className="bg-blue-400/15 border-none rounded-lg text-blue-400 cursor-pointer p-1.5 flex items-center hover:bg-blue-400/30 transition-all"
          >
            <Plus size={13} />
          </button>

          <button
            onClick={() => onDeleteLibrary(library.id)}
            title="Xóa thư viện"
            className="bg-red-400/10 border-none rounded-lg text-red-400 cursor-pointer p-1.5 flex items-center hover:bg-red-400/25 transition-all"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* DROP ZONE HINT */}
      {isDragOver && (
        <div style={{
          border: "2px dashed rgba(99,179,255,0.4)",
          borderRadius: "12px",
          padding: "10px",
          textAlign: "center",
          color: "rgba(99,179,255,0.7)",
          fontSize: "11px",
          fontFamily: "'DM Mono', monospace",
          animation: "pulse 1s infinite",
        }}>
          Thả thẻ vào đây
        </div>
      )}

      {/* CARDS LIST */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxHeight: "calc(100vh - 320px)",
        overflowY: "auto",
        paddingRight: "2px",
      }}>
        {cards.length === 0 ? (
          <div style={{
            textAlign: "center",
            color: "rgba(148,163,184,0.35)",
            fontSize: "12px",
            fontFamily: "'DM Mono', monospace",
            padding: "28px 0",
            lineHeight: "1.8",
          }}>
            Chưa có flashcard nào<br />
            <span style={{ fontSize: "10px", opacity: 0.6 }}>Nhấn + để thêm</span>
          </div>
        ) : (
          cards.map((card) => (
            <FlashcardItem
              key={card.id}
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
        style={{
          background: "none",
          border: "1px dashed rgba(255,255,255,0.1)",
          borderRadius: "10px",
          color: "rgba(148,163,184,0.4)",
          fontSize: "12px",
          fontFamily: "'DM Mono', monospace",
          padding: "8px",
          cursor: "pointer",
          transition: "all 0.2s",
          textAlign: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(99,179,255,0.3)";
          e.currentTarget.style.color = "#60a5fa";
          e.currentTarget.style.background = "rgba(99,179,255,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.color = "rgba(148,163,184,0.4)";
          e.currentTarget.style.background = "none";
        }}
      >
        + Thêm flashcard
      </button>
    </div>
  );
};

export default LibraryColumn;