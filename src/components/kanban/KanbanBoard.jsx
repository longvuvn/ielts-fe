import React from "react";
import { Plus } from "lucide-react";
import LibraryColumn from "./LibraryColumn";

const primaryBtnStyle = {
  background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
  border: "none", borderRadius: "12px", color: "white",
  padding: "12px 28px", fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
  fontWeight: "600", cursor: "pointer", display: "inline-flex",
  alignItems: "center", gap: "8px", boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
};

const KanbanBoard = ({
  libraries = [],
  cardsByLibrary = {},
  isLoading,
  dragOverLibraryId,
  onDeleteLibrary,
  onAddCard,
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, gap: "12px" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: "260px", height: "340px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "18px",
            animation: `shimmer 1.5s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    );
  }

  if (libraries.length === 0) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", flex: 1, textAlign: "center", padding: "40px",
      }}>
        <div style={{
          width: "72px", height: "72px", borderRadius: "20px",
          background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px",
        }}>
          <Plus size={32} style={{ color: "#3b82f6" }} />
        </div>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", color: "#475569", margin: "0 0 10px" }}>
          Chưa có thư viện nào
        </p>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#334155", margin: "0 0 28px" }}>
          Tạo thư viện đầu tiên để bắt đầu học từ vựng
        </p>
        <button onClick={onOpenCreateLibrary} style={primaryBtnStyle}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,130,246,0.45)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(59,130,246,0.35)"; }}
        >
          <Plus size={16} /> Tạo Thư Viện
        </button>
      </div>
    );
  }

  return (
    <div
      onDragEnd={onDragEnd}
      style={{
        display: "flex", gap: "20px", padding: "28px 32px",
        overflowX: "auto", overflowY: "hidden",
        minHeight: "calc(100vh - 90px)", alignItems: "flex-start",
      }}
    >
      {libraries.map((lib) => (
        <LibraryColumn
          key={lib.id}
          library={lib}
          cards={cardsByLibrary[lib.id] || []}
          onDeleteLibrary={onDeleteLibrary}
          onAddCard={onAddCard}
          onDeleteCard={onDeleteCard}
          onClickCard={onClickCard}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDrop={onDrop}
          isDragOver={dragOverLibraryId === lib.id}
        />
      ))}

      {/* ADD LIBRARY PLACEHOLDER */}
      <div
        onClick={onOpenCreateLibrary}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onOpenCreateLibrary()}
        style={{
          minWidth: "220px", maxWidth: "220px",
          border: "2px dashed rgba(255,255,255,0.08)",
          borderRadius: "18px", padding: "32px 20px",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "10px", cursor: "pointer", color: "#334155",
          transition: "all 0.2s", flexShrink: 0, alignSelf: "flex-start", minHeight: "160px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
          e.currentTarget.style.color = "#60a5fa";
          e.currentTarget.style.background = "rgba(59,130,246,0.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          e.currentTarget.style.color = "#334155";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <Plus size={28} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px" }}>Thêm thư viện</span>
      </div>
    </div>
  );
};

export default KanbanBoard;