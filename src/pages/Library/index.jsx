import React, { useState, useEffect, useRef } from "react";
import { Plus, X, Library } from "lucide-react";
import { message } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import KanbanBoard from "../../components/kanban/KanbanBoard";
import Button from "../../components/button/button.home";

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
    <div className="fixed inset-0 bg-page/80 backdrop-blur-md flex items-center justify-center z-[1000] p-6" onClick={onClose}>
      <div className="bg-card border border-border-default rounded-[24px] p-8 w-full max-w-md shadow-2xl animate-fade-slide-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-text-primary font-display text-2xl font-bold tracking-tight">
              {initialData ? "Chỉnh sửa Thư Viện" : "Tạo Thư Viện Mới"}
            </h3>
            <p className="text-text-secondary text-xs mt-1 font-medium">Tổ chức các bộ thẻ từ vựng của bạn</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-text-muted text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Tên thư viện *</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder="e.g. IELTS Academic Vocabulary"
              className="premium-input w-full"
            />
          </div>

          <div>
            <label className="block text-text-muted text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Mô tả</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về thư viện này..."
              className="premium-input w-full"
            />
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-border-default cursor-pointer group" onClick={() => setIsPublic(!isPublic)}>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isPublic ? 'bg-accent border-accent' : 'border-border-default group-hover:border-text-muted'}`}>
              {isPublic && <div className="w-2 h-2 bg-white rounded-sm" />}
            </div>
            <div className="flex flex-col">
              <span className="text-text-primary text-sm font-bold">Công khai thư viện</span>
              <span className="text-text-muted text-[10px] font-medium uppercase tracking-tight">Mọi người có thể xem thư viện này</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-10">
          <Button variant="ghost" onClick={onClose}>Hủy</Button>
          <Button variant="primary" onClick={handleSubmit} className="px-8 shadow-lg shadow-accent/20">
            {initialData ? "Cập nhật" : "Tạo Thư Viện"}
          </Button>
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
    <div className="fixed inset-0 bg-page/80 backdrop-blur-md flex items-center justify-center z-[1000] p-6" onClick={onClose}>
      <div className="bg-card border border-border-default rounded-[24px] p-8 w-full max-w-md shadow-2xl animate-fade-slide-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-text-primary font-display text-2xl font-bold tracking-tight">
              {initialData ? "Chỉnh sửa Flashcard" : "Tạo Flashcard Mới"}
            </h3>
            <p className="text-text-secondary text-xs mt-1 font-medium">Thêm từ vựng mới vào bộ sưu tập</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-text-muted text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Tên flashcard *</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder="e.g. Abandon (v)"
              className="premium-input w-full"
            />
          </div>

          <div>
            <label className="block text-text-muted text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Mô tả (Định nghĩa/Ví dụ)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập nghĩa của từ hoặc ví dụ..."
              rows={4}
              className="premium-input w-full resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-10">
          <Button variant="ghost" onClick={onClose}>Hủy</Button>
          <Button variant="primary" onClick={handleSubmit} className="px-8 shadow-lg shadow-accent/20">
            {initialData ? "Cập nhật" : "Tạo Flashcard"}
          </Button>
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

  const [libraries, setLibraries] = useState([]);
  const [cardsByLibrary, setCardsByLibrary] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [targetLibraryId, setTargetLibraryId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const dragCard = useRef(null);
  const [dragOverLibraryId, setDragOverLibraryId] = useState(null);

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

  const handleOpenAddCard = (libraryId) => {
    setTargetLibraryId(libraryId);
    setEditingItem(null);
    setShowCardModal(true);
  };

  const handleCreateFlashcard = async ({ title, description, libraryId }) => {
    try {
      if (editingItem && editingItem.type === 'FLASHCARD') {
        const res = await updateFlashcardAPI(editingItem.id, {
          title, description, libraryId, status: "ACTIVE"
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
    <div className="min-h-screen bg-page text-text-primary animate-fade-slide-in flex flex-col">
      {/* PAGE HEADER */}
      <div className="w-full border-b border-border-default bg-page/40 backdrop-blur-xl z-[100]">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-accent/10 text-accent rounded-2xl shadow-lg shadow-accent/5">
              <Library size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display tracking-tight text-text-primary">Flashcard Library</h1>
              <p className="text-text-secondary text-sm mt-1 font-medium">{libraries.length} active libraries · Click to start learning</p>
            </div>
          </div>
          <Button 
            variant="primary" 
            onClick={() => { setEditingItem(null); setShowLibraryModal(true); }}
            className="shadow-[0_0_25px_rgba(59,125,255,0.25)] h-12 px-8"
          >
            <Plus size={18} /> Thư Viện Mới
          </Button>
        </div>
      </div>

      {/* CONTENT GRID CONTAINER */}
      <div className="max-w-7xl mx-auto w-full px-8 py-10 flex-1">
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
      </div>

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
