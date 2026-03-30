import React, { useState, useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import { message } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import KanbanBoard from "../../components/kanban/KanbanBoard";

import {
  getAllLibrariesByLearnerIdAPI,
  createLibraryAPI,
  deleteLibraryAPI,
} from "../../service/api/api.library";
import {
  getFlashcardsByLibraryIdAPI,
  createFlashcardAPI,
  deleteFlashcardAPI,
} from "../../service/api/api.flashcard";

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};
const modalStyle = {
  background: "#0f1a2e",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "18px",
  padding: "28px",
  width: "420px",
  maxWidth: "90vw",
  boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
};
const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#e2e8f0",
  padding: "10px 14px",
  fontSize: "14px",
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  boxSizing: "border-box",
};
const labelStyle = {
  display: "block",
  color: "#94a3b8",
  fontSize: "12px",
  fontFamily: "'DM Mono', monospace",
  marginBottom: "6px",
  letterSpacing: "1px",
  textTransform: "uppercase",
};
const primaryBtnStyle = {
  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  border: "none",
  borderRadius: "10px",
  color: "white",
  padding: "9px 20px",
  fontSize: "13px",
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: "600",
  cursor: "pointer",
};
const cancelBtnStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#94a3b8",
  padding: "9px 20px",
  fontSize: "13px",
  fontFamily: "'DM Sans', sans-serif",
  cursor: "pointer",
};

// ─── MODAL TẠO LIBRARY ───────────────────────────────────────────────────────
const LibraryModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim(), is_Public: isPublic });
    setName("");
    setDescription("");
    setIsPublic(true);
  };

  if (!isOpen) return null;
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "#e2e8f0", fontFamily: "'Playfair Display', serif", fontSize: "20px" }}>
            Tạo Thư Viện Mới
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <label style={labelStyle}>Tên thư viện *</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          placeholder="e.g. IELTS Vocabulary"
          style={inputStyle}
        />

        <label style={{ ...labelStyle, marginTop: "14px" }}>Mô tả</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả ngắn về thư viện này..."
          style={inputStyle}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "14px" }}>
          <input
            type="checkbox"
            id="is-public"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            style={{ width: "auto", cursor: "pointer" }}
          />
          <label
            htmlFor="is-public"
            style={{ ...labelStyle, margin: 0, textTransform: "none", letterSpacing: 0, cursor: "pointer" }}
          >
            Công khai thư viện
          </label>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={cancelBtnStyle}>Hủy</button>
          <button onClick={handleSubmit} style={primaryBtnStyle}>Tạo</button>
        </div>
      </div>
    </div>
  );
};

// ─── MODAL TẠO FLASHCARD (title / description / libraryId) ───────────────────
const FlashcardModal = ({ isOpen, onClose, onSubmit, targetLibraryId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isOpen) { setTitle(""); setDescription(""); }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim(), libraryId: targetLibraryId });
  };

  if (!isOpen) return null;
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "#e2e8f0", fontFamily: "'Playfair Display', serif", fontSize: "20px" }}>
            Tạo Flashcard Mới
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <label style={labelStyle}>Tên flashcard *</label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          placeholder="e.g. Vocabulary for children"
          style={inputStyle}
        />

        <label style={{ ...labelStyle, marginTop: "14px" }}>Mô tả</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả nội dung flashcard này..."
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={cancelBtnStyle}>Hủy</button>
          <button onClick={handleSubmit} style={primaryBtnStyle}>Tạo</button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const LibraryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const learnerId = user?.id ?? JSON.parse(localStorage.getItem("user_info") || "{}")?.id;

  // ── DATA STATE ──
  const [libraries, setLibraries] = useState([]);
  const [cardsByLibrary, setCardsByLibrary] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ── MODAL STATE ──
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [targetLibraryId, setTargetLibraryId] = useState(null);

  // ── DRAG STATE ──
  const dragCard = useRef(null);
  const [dragOverLibraryId, setDragOverLibraryId] = useState(null);

  // ── FETCH ──
  useEffect(() => {
    if (learnerId) fetchLibraries();
  }, [learnerId]);

  const fetchLibraries = async () => {
    try {
      setIsLoading(true);
      const res = await getAllLibrariesByLearnerIdAPI(learnerId, 0, 50);
      if (res?.status === 200) {
        const libs = res.data.content;
        setLibraries(libs);
        const cardResults = await Promise.all(libs.map((lib) => fetchCardsForLibrary(lib.id)));
        const map = {};
        libs.forEach((lib, i) => { map[lib.id] = cardResults[i]; });
        setCardsByLibrary(map);
      }
    } catch {
      message.error("Lỗi khi tải dữ liệu!");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCardsForLibrary = async (libraryId) => {
    try {
      const res = await getFlashcardsByLibraryIdAPI(libraryId, 0, 50);
      console.log("Flashcards res:", res);
      if (res?.status === 200) {
        return res.data.content.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          libraryId,
        }));
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
    return [];
  };

  // ── LIBRARY ACTIONS ──
  const handleCreateLibrary = async ({ name, description, is_Public }) => {
    if (!learnerId) { message.error("Chưa đăng nhập!"); return; }
    try {
      const res = await createLibraryAPI({ name, description, is_Public: String(is_Public), learnerId });
      if (res?.status === 201 || res?.status === 200) {
        message.success("Tạo thư viện thành công!");
        setShowLibraryModal(false);
        fetchLibraries();
      }
    } catch {
      message.error("Không thể tạo thư viện!");
    }
  };

  const handleDeleteLibrary = async (libraryId) => {
    if (!window.confirm("Xóa thư viện này và toàn bộ thẻ bên trong?")) return;
    try {
      const res = await deleteLibraryAPI(libraryId);
      if (res?.status === 200) {
        message.success("Đã xóa thư viện!");
        setLibraries((prev) => prev.filter((l) => l.id !== libraryId));
        setCardsByLibrary((prev) => { const next = { ...prev }; delete next[libraryId]; return next; });
      }
    } catch {
      message.error("Xóa thất bại!");
    }
  };

  // ── FLASHCARD ACTIONS ──
  const handleOpenAddCard = (libraryId) => {
    setTargetLibraryId(libraryId);
    setShowCardModal(true);
  };

  // ── Tạo flashcard: title / description / libraryId ──
  const handleCreateFlashcard = async ({ title, description, libraryId }) => {
    try {
      const res = await createFlashcardAPI({ title, description, libraryId });
      console.log("Create flashcard res:", res);
      if (res?.status === 201 || res?.status === 200) {
        const newCard = {
          id: res.data?.id || res.data?.data?.id,
          title,
          description,
          libraryId,
        };
        setCardsByLibrary((prev) => ({
          ...prev,
          [libraryId]: [...(prev[libraryId] || []), newCard],
        }));
        message.success("Tạo flashcard thành công!");
        setShowCardModal(false);
      }
    } catch {
      message.error("Không thể tạo flashcard!");
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm("Xóa flashcard này?")) return;
    try {
      const res = await deleteFlashcardAPI(cardId);
      if (res?.status === 200) {
        message.success("Đã xóa flashcard!");
        setCardsByLibrary((prev) => {
          const next = {};
          for (const libId in prev) {
            next[libId] = prev[libId].filter((c) => c.id !== cardId);
          }
          return next;
        });
      }
    } catch {
      message.error("Lỗi khi xóa!");
    }
  };

  // ── Nhấn vào flashcard → navigate đến trang detail ──
  const handleClickCard = (cardId) => {
    navigate(`/flashcards/${cardId}`);
  };

  // ── DRAG & DROP ──
  const handleDragStart = (e, card) => {
    let fromLibraryId = null;
    for (const libId in cardsByLibrary) {
      if (cardsByLibrary[libId].find((c) => c.id === card.id)) { fromLibraryId = libId; break; }
    }
    dragCard.current = { card, fromLibraryId };
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, libraryId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverLibraryId(libraryId);
  };

  const handleDrop = async (e, toLibraryId) => {
    e.preventDefault();
    setDragOverLibraryId(null);
    if (!dragCard.current) return;
    const { card, fromLibraryId } = dragCard.current;
    dragCard.current = null;
    if (fromLibraryId === toLibraryId) return;
    setCardsByLibrary((prev) => ({
      ...prev,
      [fromLibraryId]: (prev[fromLibraryId] || []).filter((c) => c.id !== card.id),
      [toLibraryId]: [...(prev[toLibraryId] || []), card],
    }));
    message.success("Đã chuyển flashcard sang thư viện mới!");
  };

  const handleDragEnd = () => { setDragOverLibraryId(null); dragCard.current = null; };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(100,150,255,0.2); border-radius: 999px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(100,150,255,0.4); }
        @keyframes shimmer { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.15; } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .page-enter { animation: fadeSlideIn 0.5s ease forwards; }
      `}</style>

      <div className="page-enter" style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #060d1a 0%, #0a1628 50%, #060e1c 100%)",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* TOPBAR */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)", backdropFilter: "blur(10px)",
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: "700", color: "#e2e8f0", letterSpacing: "-0.5px" }}>
              Flashcard Library
            </h1>
            <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: "12px", fontFamily: "'DM Mono', monospace" }}>
              {libraries.length} thư viện · nhấn vào flashcard để học từ vựng
            </p>
          </div>
          <button
            onClick={() => setShowLibraryModal(true)}
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
              border: "none", borderRadius: "12px", color: "white",
              padding: "10px 20px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
              fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center",
              gap: "8px", boxShadow: "0 4px 16px rgba(59,130,246,0.35)", transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,130,246,0.45)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(59,130,246,0.35)"; }}
          >
            <Plus size={16} /> Thư Viện Mới
          </button>
        </div>

        {/* KANBAN BOARD */}
        <KanbanBoard
          libraries={libraries}
          cardsByLibrary={cardsByLibrary}
          isLoading={isLoading}
          dragOverLibraryId={dragOverLibraryId}
          onDeleteLibrary={handleDeleteLibrary}
          onAddCard={handleOpenAddCard}
          onDeleteCard={handleDeleteCard}
          onClickCard={handleClickCard}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onOpenCreateLibrary={() => setShowLibraryModal(true)}
        />
      </div>

      <LibraryModal isOpen={showLibraryModal} onClose={() => setShowLibraryModal(false)} onSubmit={handleCreateLibrary} />
      <FlashcardModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        onSubmit={handleCreateFlashcard}
        targetLibraryId={targetLibraryId}
      />
    </>
  );
};

export default LibraryPage;