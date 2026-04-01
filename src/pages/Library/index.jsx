import React, { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Library } from "lucide-react";
import { message } from "antd";
import { useAuth } from "../../hook/useAuth";
import { useNavigate } from "react-router-dom";

import KanbanBoard from "../../components/kanban/KanbanBoard";
import Button from "../../components/button/button.home";
import FlashcardModal from "../../components/modal/FlashcardModal";
import CreateLibraryModal from "../../components/modal/CreateLibraryModal";
import UpdateLibraryModal from "../../components/modal/UpdateLibraryModal";


import {
  getAllLibrariesByLearnerIdAPI,
  createLibraryAPI,
  updateLibraryAPI,
  deleteLibraryAPI,
  searchLibraryAPI,
} from "../../service/api/api.library";
import {
  getFlashcardsByLibraryIdAPI,
  createFlashcardAPI,
  updateFlashcardAPI,
  deleteFlashcardAPI,
} from "../../service/api/api.flashcard";
import { Search, Loader2, Users } from "lucide-react";

const LibraryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const learnerId = user?.learnerId || user?.id;

  const [libraries, setLibraries] = useState([]);
  const [cardsByLibrary, setCardsByLibrary] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [targetLibraryId, setTargetLibraryId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const dragCard = useRef(null);
  const [dragOverLibraryId, setDragOverLibraryId] = useState(null);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length > 2) {
      setIsSearching(true);
      setShowSearchResults(true);
      try {
        const res = await searchLibraryAPI(value, 0, 10);
        if (res && res.data) {
          let results = [];
          if (Array.isArray(res.data)) results = res.data;
          else if (res.data.content) results = res.data.content;
          else if (res.data.data) results = res.data.data;
          
          setSearchResults(results);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const fetchCardsForLibrary = useCallback(async (libraryId) => {
    try {
      const res = await getFlashcardsByLibraryIdAPI(libraryId, 0, 50);
      if (res && (res.status === 200 || res.status === 201)) {
        let cards = [];
        if (Array.isArray(res.data)) {
          cards = res.data;
        } else if (res.data?.content && Array.isArray(res.data.content)) {
          cards = res.data.content;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          cards = res.data.data;
        }
        
        return cards.map((c) => ({
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
  }, []);

  const fetchLibraries = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getAllLibrariesByLearnerIdAPI(learnerId, 0, 50);
      if (res && (res.status === 200 || res.status === 201)) {
        let libs = [];
        if (Array.isArray(res.data)) {
          libs = res.data;
        } else if (res.data?.content && Array.isArray(res.data.content)) {
          libs = res.data.content;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          libs = res.data.data;
        }

        setLibraries(libs);
        const cardResults = await Promise.all(libs.map((lib) => fetchCardsForLibrary(lib.id)));
        const map = {};
        libs.forEach((lib, i) => { map[lib.id] = cardResults[i] || []; });
        setCardsByLibrary(map);
      }
    } catch (error) {
      console.error("Fetch libraries error:", error);
      message.error(error?.message || "Lỗi khi tải dữ liệu!");
    } finally {
      setIsLoading(false);
    }
  }, [learnerId, fetchCardsForLibrary]);

  useEffect(() => {
    if (learnerId) fetchLibraries();
  }, [learnerId, fetchLibraries]);

  const handleOpenEditLibrary = (library) => {
    setEditingItem({ ...library, type: 'LIBRARY' });
    setShowLibraryModal(true);
  };

  const handleOpenEditCard = (card) => {
    setEditingItem({ ...card, type: 'FLASHCARD' });
    setTargetLibraryId(card.libraryId);
    setShowCardModal(true);
  };

  const handleCloseModals = useCallback(() => {
    setShowLibraryModal(false);
    setShowCardModal(false);
    setEditingItem(null);
    setTargetLibraryId(null);
  }, []);

  const handleCreateLibrary = async ({ name, description, is_Public }) => {
    if (!learnerId) { message.error("Chưa đăng nhập!"); return; }
    try {
      if (editingItem && editingItem.type === 'LIBRARY') {
        const res = await updateLibraryAPI(editingItem.id, {
          name, description, is_Public, learnerId,
          createdAt: editingItem.createdAt,
          updatedAt: new Date().toISOString()
        });
        if (res && (res.status === 200 || res.status === 201)) {
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
    <div className="min-h-screen bg-page text-text-primary animate-fade-slide-in flex flex-col overflow-hidden">
      {/* PAGE HEADER */}
      <div className="w-full border-b border-border-default bg-page/40 backdrop-blur-xl z-[100] flex-shrink-0">
        <div className="max-w-[1800px] mx-auto px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-accent/10 text-accent rounded-2xl shadow-lg shadow-accent/5">
              <Library size={28} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold font-display tracking-tight text-text-primary">Flashcard Library</h1>
              <p className="text-text-secondary text-sm mt-1 font-medium">{libraries.length} active libraries · Scroll right to see more</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-text-secondary group-focus-within:text-accent transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search public libraries..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <Loader2 size={16} className="text-accent animate-spin" />
                </div>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[200] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 max-h-[400px] overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <div
                        key={result.id}
                        onClick={() => {
                          navigate(`/library/${result.id}`);
                          setShowSearchResults(false);
                        }}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                      >
                        <div className="p-2 bg-blue-50 text-accent rounded-lg group-hover:bg-accent group-hover:text-white transition-colors">
                          <Library size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{result.name}</h4>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{result.description || "No description"}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-accent uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                              <Users size={10} />
                              {result.learnerName || "Other User"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm text-slate-500 font-medium">No public libraries found matching `{searchTerm}`</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Button 
            variant="primary" 
            onClick={() => { setEditingItem(null); setShowLibraryModal(true); }}
            className="shadow-[0_0_25px_rgba(59,125,255,0.25)] h-12 px-8 whitespace-nowrap"
          >
            <Plus size={18} /> Thư Viện Mới
          </Button>
        </div>
      </div>

      {/* HORIZONTAL KANBAN AREA */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full px-8 py-10">
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
      </div>

      <CreateLibraryModal 
        isOpen={showLibraryModal && !editingItem} 
        onClose={handleCloseModals} 
        onSubmit={handleCreateLibrary} 
      />
      <UpdateLibraryModal 
        isOpen={showLibraryModal && editingItem?.type === 'LIBRARY'} 
        onClose={handleCloseModals} 
        onSubmit={handleCreateLibrary} 
        initialData={editingItem} 
      />
      <FlashcardModal
        key={editingItem?.id || 'card-new'}
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
