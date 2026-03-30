import React, { useState, useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import { message } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import KanbanBoard from "../../components/kanban/KanbanBoard";

import {
  getAllLibrariesByLearnerIdAPI,
  createLibraryAPI,
  updateLibraryAPI,
  deleteLibraryAPI,
} from "../../service/api/api.library";
import {
  getFlashcardsByLibraryIdAPI,
  createFlashcardAPI,
  updateFlashcardAPI,
  deleteFlashcardAPI,
} from "../../service/api/api.flashcard";

// ─── MODAL TẠO/SỬA LIBRARY ───────────────────────────────────────────────────
const LibraryModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setIsPublic(initialData.is_Public !== "False");
    } else if (isOpen) {
      setName("");
      setDescription("");
      setIsPublic(true);
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim(), is_Public: isPublic });
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000]" onClick={onClose}>
      <div className="bg-[#0f1a2e] border border-white/10 rounded-2xl p-7 w-[420px] max-w-[90vw] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="m-0 text-[#e2e8f0] font-serif text-xl">
            {initialData ? "Chỉnh sửa Thư Viện" : "Tạo Thư Viện Mới"}
          </h3>
          <button onClick={onClose} className="bg-none border-none text-[#94a3b8] cursor-pointer hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <label className="block text-[#94a3b8] text-xs font-mono mb-1.5 tracking-wider uppercase">Tên thư viện *</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          placeholder="e.g. IELTS Vocabulary"
          className="w-full bg-white/5 border border-white/10 rounded-lg text-[#e2e8f0] px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors mb-4"
        />

        <label className="block text-[#94a3b8] text-xs font-mono mb-1.5 tracking-wider uppercase">Mô tả</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả ngắn về thư viện này..."
          className="w-full bg-white/5 border border-white/10 rounded-lg text-[#e2e8f0] px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors mb-4"
        />

        <div className="flex items-center gap-2.5 mb-5">
          <input
            type="checkbox"
            id="is-public"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-auto cursor-pointer"
          />
          <label
            htmlFor="is-public"
            className="text-[#94a3b8] text-xs cursor-pointer select-none"
          >
            Công khai thư viện
          </label>
        </div>

        <div className="flex gap-2.5 justify-end">
          <button onClick={onClose} className="bg-white/5 border border-white/10 rounded-lg text-[#94a3b8] px-5 py-2 text-sm hover:bg-white/10 transition-colors">Hủy</button>
          <button onClick={handleSubmit} className="bg-gradient-to-br from-blue-500 to-blue-700 border-none rounded-lg text-white px-5 py-2 text-sm font-semibold hover:from-blue-600 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/20">
            {initialData ? "Cập nhật" : "Tạo"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MODAL TẠO/SỬA FLASHCARD ──────────────────────────────────────────────────
const FlashcardModal = ({ isOpen, onClose, onSubmit, targetLibraryId, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
    } else if (isOpen) {
      setTitle("");
      setDescription("");
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim(), libraryId: targetLibraryId });
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000]" onClick={onClose}>
      <div className="bg-[#0f1a2e] border border-white/10 rounded-2xl p-7 w-[420px] max-w-[90vw] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="m-0 text-[#e2e8f0] font-serif text-xl">
            {initialData ? "Chỉnh sửa Flashcard" : "Tạo Flashcard Mới"}
          </h3>
          <button onClick={onClose} className="bg-none border-none text-[#94a3b8] cursor-pointer hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <label className="block text-[#94a3b8] text-xs font-mono mb-1.5 tracking-wider uppercase">Tên flashcard *</label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          placeholder="e.g. Vocabulary for children"
          className="w-full bg-white/5 border border-white/10 rounded-lg text-[#e2e8f0] px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors mb-4"
        />

        <label className="block text-[#94a3b8] text-xs font-mono mb-1.5 tracking-wider uppercase">Mô tả</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả nội dung flashcard này..."
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg text-[#e2e8f0] px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors mb-4 resize-vertical"
        />

        <div className="flex gap-2.5 justify-end">
          <button onClick={onClose} className="bg-white/5 border border-white/10 rounded-lg text-[#94a3b8] px-5 py-2 text-sm hover:bg-white/10 transition-colors">Hủy</button>
          <button onClick={handleSubmit} className="bg-gradient-to-br from-blue-500 to-blue-700 border-none rounded-lg text-white px-5 py-2 text-sm font-semibold hover:from-blue-600 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/20">
            {initialData ? "Cập nhật" : "Tạo"}
          </button>
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
  const [editingItem, setEditingItem] = useState(null);

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
      if (res && (res.status === 200 || res.status === 201)) {
        const libs = res.data.content;
        setLibraries(libs);
        const cardResults = await Promise.all(libs.map((lib) => fetchCardsForLibrary(lib.id)));
        const map = {};
        libs.forEach((lib, i) => { map[lib.id] = cardResults[i]; });
        setCardsByLibrary(map);
      }
    } catch (error) {
      console.error("Fetch libraries error:", error);
      message.error(error?.message || "Lỗi khi tải dữ liệu!");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCardsForLibrary = async (libraryId) => {
    try {
      const res = await getFlashcardsByLibraryIdAPI(libraryId, 0, 50);
      if (res && (res.status === 200 || res.status === 201)) {
        return res.data.content.map((c) => ({
          id: c.id,
          title: c.title || c.name,
          description: c.description,
          libraryId,
          is_Public: c.is_Public ?? true,
          learnerId: c.learnerId,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt
        }));
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
    return [];
  };

  // ── ACTION HANDLERS ──
  const handleOpenEditLibrary = (library) => {
    setEditingItem({ ...library, type: 'LIBRARY' });
    setShowLibraryModal(true);
  };

  const handleOpenEditCard = (card) => {
    setEditingItem({ ...card, type: 'FLASHCARD' });
    setTargetLibraryId(card.libraryId);
    setShowCardModal(true);
  };

  const handleCloseModals = () => {
    setShowLibraryModal(false);
    setShowCardModal(false);
    setEditingItem(null);
  };

  // ── LIBRARY ACTIONS ──
  const handleCreateLibrary = async ({ name, description, is_Public }) => {
    if (!learnerId) { message.error("Chưa đăng nhập!"); return; }
    try {
      if (editingItem && editingItem.type === 'LIBRARY') {
        const res = await updateLibraryAPI(editingItem.id, {
          name, description, is_Public, learnerId,
          createdAt: editingItem.createdAt,
          updatedAt: new Date().toISOString()
        });
        if (res && res.status === 200) {
          message.success("Cập nhật thành công!");
          handleCloseModals();
          fetchLibraries();
        }
      } else {
        const res = await createLibraryAPI({ name, description, is_Public: String(is_Public), learnerId });
        if (res && (res.status === 201 || res.status === 200)) {
          message.success("Tạo thư viện thành công!");
          handleCloseModals();
          fetchLibraries();
        }
      }
    } catch (error) {
      message.error(error?.message || "Thao tác thất bại!");
    }
  };

  const handleDeleteLibrary = async (libraryId) => {
    if (!window.confirm("Xóa thư viện này và toàn bộ thẻ bên trong?")) return;
    try {
      const res = await deleteLibraryAPI(libraryId);
      if (res && res.status === 200) {
        message.success("Đã xóa thư viện!");
        setLibraries((prev) => prev.filter((l) => l.id !== libraryId));
        setCardsByLibrary((prev) => { const next = { ...prev }; delete next[libraryId]; return next; });
      }
    } catch (error) {
      message.error(error?.message || "Xóa thất bại!");
    }
  };

  // ── FLASHCARD ACTIONS ──
  const handleOpenAddCard = (libraryId) => {
    setTargetLibraryId(libraryId);
    setEditingItem(null);
    setShowCardModal(true);
  };
const handleCreateFlashcard = async ({ title, description, libraryId }) => {
  try {
    if (editingItem && editingItem.type === 'FLASHCARD') {
      const res = await updateFlashcardAPI(editingItem.id, {
        title,
        description,
        libraryId,
        status: "ACTIVE"
      });
      if (res && res.status === 200) {
        message.success("Cập nhật thành công!");
        handleCloseModals();
        setCardsByLibrary(prev => {
          const next = { ...prev };
          next[libraryId] = next[libraryId].map(c => c.id === editingItem.id ? { ...c, title, description } : c);
          return next;
        });
      }
    } else {
// ... create logic

        const res = await createFlashcardAPI({ title, description, libraryId });
        if (res && (res.status === 201 || res.status === 200)) {
          const newCard = {
            id: res.data?.id || res.data?.data?.id,
            title, description, libraryId,
            learnerId, is_Public: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setCardsByLibrary((prev) => ({
            ...prev,
            [libraryId]: [...(prev[libraryId] || []), newCard],
          }));
          message.success("Tạo flashcard thành công!");
          handleCloseModals();
        }
      }
    } catch (error) {
      message.error(error?.message || "Thao tác thất bại!");
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm("Xóa flashcard này?")) return;
    try {
      const res = await deleteFlashcardAPI(cardId);
      if (res && res.status === 200) {
        message.success("Đã xóa flashcard!");
        setCardsByLibrary((prev) => {
          const next = {};
          for (const libId in prev) {
            next[libId] = prev[libId].filter((c) => c.id !== cardId);
          }
          return next;
        });
      }
    } catch (error) {
      message.error(error?.message || "Lỗi khi xóa!");
    }
  };

  const handleClickCard = (cardId) => { navigate(`/flashcards/${cardId}`); };

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
      [toLibraryId]: [...(prev[toLibraryId] || []), { ...card, libraryId: toLibraryId }],
    }));

    try {
      const res = await updateFlashcardAPI(card.id, {
        title: card.title,
        description: card.description,
        libraryId: toLibraryId,
        status: "ACTIVE"
      });
      if (res && (res.status === 200 || res.status === 201)) {
        message.success("Đã chuyển flashcard thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi chuyển flashcard:", error);
      message.error(error?.message || "Không thể chuyển flashcard!");
      setCardsByLibrary((prev) => ({
        ...prev,
        [toLibraryId]: (prev[toLibraryId] || []).filter((c) => c.id !== card.id),
        [fromLibraryId]: [...(prev[fromLibraryId] || []), card],
      }));
    }
  };

  const handleDragEnd = () => { setDragOverLibraryId(null); dragCard.current = null; };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060d1a] via-[#0a1628] to-[#060e1c] font-sans flex flex-col animate-fade-slide-in">
      <div className="flex items-center justify-between px-8 py-[22px] border-b border-white/5 bg-white/2 backdrop-blur-md sticky top-0 z-[100]">
        <div>
          <h1 className="m-0 font-serif text-[26px] font-bold text-[#e2e8f0] tracking-tight">Flashcard Library</h1>
          <p className="m-0 mt-0.5 text-[#64748b] text-[12px] font-mono">{libraries.length} thư viện · nhấn vào flashcard để học từ vựng</p>
        </div>
        <button onClick={() => { setEditingItem(null); setShowLibraryModal(true); }} className="bg-gradient-to-br from-[#3b82f6] to-[#1e40af] border-none rounded-xl text-white px-5 py-2.5 text-sm font-semibold cursor-pointer flex items-center gap-2 shadow-lg shadow-blue-500/35 hover:-translate-y-0.5 hover:shadow-blue-500/45 transition-all">
          <Plus size={16} /> Thư Viện Mới
        </button>
      </div>

      <KanbanBoard
        libraries={libraries}
        cardsByLibrary={cardsByLibrary}
        isLoading={isLoading}
        dragOverLibraryId={dragOverLibraryId}
        onEditLibrary={handleOpenEditLibrary}
        onDeleteLibrary={handleDeleteLibrary}
        onAddCard={handleOpenAddCard}
        onEditCard={handleOpenEditCard}
        onDeleteCard={handleDeleteCard}
        onClickCard={handleClickCard}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onOpenCreateLibrary={() => { setEditingItem(null); setShowLibraryModal(true); }}
      />

      <LibraryModal 
        isOpen={showLibraryModal} 
        onClose={handleCloseModals} 
        onSubmit={handleCreateLibrary} 
        initialData={editingItem && editingItem.type === 'LIBRARY' ? editingItem : null} 
      />
      <FlashcardModal
        isOpen={showCardModal}
        onClose={handleCloseModals}
        onSubmit={handleCreateFlashcard}
        targetLibraryId={targetLibraryId}
        initialData={editingItem && editingItem.type === 'FLASHCARD' ? editingItem : null}
      />
    </div>
  );
};

export default LibraryPage;
