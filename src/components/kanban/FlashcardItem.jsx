import React, { useState } from "react";
import { Trash2, BookOpen, ChevronRight, Edit2 } from "lucide-react";

const FlashcardItem = ({ card, onEdit, onDelete, onClickCard, onDragStart, onDragEnd }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        borderRadius: "14px",
        background: isHovered
          ? "linear-gradient(135deg, #1e3a5f 0%, #162d4a 100%)"
          : "linear-gradient(135deg, #152842 0%, #0f1e33 100%)",
        border: isHovered
          ? "1px solid rgba(100,160,255,0.35)"
          : "1px solid rgba(100,160,255,0.12)",
        boxShadow: isHovered
          ? "0 8px 28px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)"
          : "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
        padding: "14px",
        cursor: isDragging ? "grabbing" : "pointer",
        opacity: isDragging ? 0.4 : 1,
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        minHeight: "110px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <BookOpen size={12} style={{ color: "#60a5fa", flexShrink: 0 }} />
          <span style={{
            fontSize: "9px",
            fontFamily: "'DM Mono', monospace",
            color: "rgba(100,180,255,0.6)",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}>
            FLASHCARD
          </span>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(card); }}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "6px",
              color: "rgba(180,210,255,0.8)",
              cursor: "pointer",
              padding: "3px 4px",
              display: "flex",
              alignItems: "center",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            title="Chỉnh sửa flashcard"
          >
            <Edit2 size={11} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "none",
              borderRadius: "6px",
              color: "#f87171",
              cursor: "pointer",
              padding: "3px 4px",
              display: "flex",
              alignItems: "center",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.22)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
            title="Xóa flashcard"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Title */}
      <div
        onClick={() => onClickCard(card.id)}
        style={{ flex: 1 }}
      >
        <p style={{
          color: "#e2f0ff",
          fontFamily: "'Playfair Display', serif",
          fontSize: "14px",
          fontWeight: "600",
          lineHeight: "1.4",
          wordBreak: "break-word",
          margin: "0 0 4px",
        }}>
          {card.title}
        </p>
        {card.description && (
          <p style={{
            color: "rgba(148,163,184,0.6)",
            fontSize: "11px",
            fontFamily: "'DM Sans', sans-serif",
            margin: 0,
            lineHeight: "1.4",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {card.description}
          </p>
        )}
      </div>

      {/* Footer: click to open */}
      <div
        onClick={() => onClickCard(card.id)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "4px",
          color: isHovered ? "#60a5fa" : "rgba(100,180,255,0.3)",
          transition: "color 0.2s",
        }}
      >
        <span style={{ fontSize: "9px", fontFamily: "'DM Mono', monospace" }}>
          Học từ vựng
        </span>
        <ChevronRight size={11} />
      </div>
    </div>
  );
};

export default FlashcardItem;
