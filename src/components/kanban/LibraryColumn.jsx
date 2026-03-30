import React from "react";
import { Plus, Trash2, BookOpen } from "lucide-react";
import FlashcardItem from "./FlashcardItem";

const LibraryColumn = ({
  library,
  cards = [],
  onDeleteLibrary,
  onAddCard,
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
      style={{
        minWidth: "260px",
        maxWidth: "260px",
        background: isDragOver ? "rgba(99,179,255,0.08)" : "rgba(255,255,255,0.03)",
        border: isDragOver ? "2px dashed rgba(99,179,255,0.6)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: "18px",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        transition: "all 0.2s ease",
        backdropFilter: "blur(8px)",
        flexShrink: 0,
        alignSelf: "flex-start",
      }}
    >
      {/* COLUMN HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden", flex: 1 }}>
          <BookOpen size={15} style={{ color: "#60a5fa", flexShrink: 0 }} />
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontWeight: "600",
            fontSize: "13px",
            color: "#e2e8f0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {library.name}
          </span>
        </div>

        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0, marginLeft: "8px" }}>
          <span style={{
            background: "rgba(96,165,250,0.15)",
            color: "#93c5fd",
            borderRadius: "20px",
            padding: "2px 8px",
            fontSize: "11px",
            fontFamily: "'DM Mono', monospace",
          }}>
            {cards.length}
          </span>

          <button
            onClick={() => onAddCard(library.id)}
            title="Thêm flashcard mới"
            style={{
              background: "rgba(99,179,255,0.15)",
              border: "none", borderRadius: "8px", color: "#60a5fa",
              cursor: "pointer", padding: "5px", display: "flex", alignItems: "center", transition: "background 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(99,179,255,0.28)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(99,179,255,0.15)"}
          >
            <Plus size={14} />
          </button>

          <button
            onClick={() => onDeleteLibrary(library.id)}
            title="Xóa thư viện"
            style={{
              background: "rgba(248,113,113,0.1)",
              border: "none", borderRadius: "8px", color: "#f87171",
              cursor: "pointer", padding: "5px", display: "flex", alignItems: "center", transition: "background 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.25)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.1)"}
          >
            <Trash2 size={14} />
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