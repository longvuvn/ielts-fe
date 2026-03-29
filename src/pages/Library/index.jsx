// src/pages/Library/index.jsx
import React, { useState, useEffect } from "react";
import { Plus, Search, Trash2 } from "lucide-react";

// Đảm bảo đường dẫn import các Component này là chính xác với cấu trúc thư mục của bạn
import CardList from "../../components/card/CardList";
import FlashcardModal from "../../components/modal/FlashcardModal";
import LibraryModal from "../../components/modal/LibraryModal";

const LibraryPage = () => {
  // ==========================================
  // 1. STATE QUẢN LÝ DỮ LIỆU
  // ==========================================
  const [libraries, setLibraries] = useState([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState(null);

  const [cards, setCards] = useState([]);
  const [editingCardId, setEditingCardId] = useState(null);

  // ==========================================
  // 2. STATE QUẢN LÝ GIAO DIỆN (UI)
  // ==========================================
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showLibraryForm, setShowLibraryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");

  // ==========================================
  // 3. USE-EFFECT (Tải dữ liệu từ LocalStorage)
  // ==========================================
  useEffect(() => {
    loadLibraries();
  }, []);

  useEffect(() => {
    if (selectedLibraryId) {
      loadCards(selectedLibraryId);
    }
  }, [selectedLibraryId]);

  const loadLibraries = () => {
    try {
      const stored = localStorage.getItem("flashcard_libraries");
      if (stored) {
        const libs = JSON.parse(stored);
        setLibraries(libs);
        if (libs.length > 0 && !selectedLibraryId) {
          setSelectedLibraryId(libs[0].id);
        }
      }
    } catch (error) {
      console.error("Error loading libraries:", error);
    }
  };

  const loadCards = (libraryId) => {
    try {
      const stored = localStorage.getItem(`flashcards_${libraryId}`);
      if (stored) {
        setCards(JSON.parse(stored));
      } else {
        // TỰ ĐỘNG TẠO DỮ LIỆU MẪU ĐỂ TEST 3D
        const mockCards = [
          {
            id: "1",
            front: "Software Engineering",
            back: "Kỹ thuật phần mềm là việc áp dụng một cách tiếp cận có hệ thống, có kỷ luật để phát triển phần mềm.",
            topic: "Major",
          },
          {
            id: "2",
            front: "Backend Developer",
            back: "Người tập trung vào logic máy chủ, cơ sở dữ liệu và API (như Spring Boot mà bạn đang học).",
            topic: "Career",
          },
        ];
        setCards(mockCards);
        // Lưu luôn vào localStorage để lần sau không bị mất
        localStorage.setItem(
          `flashcards_${libraryId}`,
          JSON.stringify(mockCards),
        );
      }
    } catch (error) {
      console.error("Error loading cards:", error);
    }
  };

  // ==========================================
  // 4. CÁC HÀM XỬ LÝ LOGIC (LIBRARIES)
  // ==========================================
  const handleCreateLibrary = (newLibraryName) => {
    const newLibrary = {
      id: Date.now().toString(),
      name: newLibraryName,
      createdAt: new Date().toISOString(),
      cards: [],
    };

    const updatedLibraries = [...libraries, newLibrary];
    setLibraries(updatedLibraries);
    localStorage.setItem(
      "flashcard_libraries",
      JSON.stringify(updatedLibraries),
    );

    setShowLibraryForm(false);
    setSelectedLibraryId(newLibrary.id);
  };

  const handleDeleteLibrary = (libraryId) => {
    if (window.confirm("Delete this library? This action cannot be undone.")) {
      const updatedLibraries = libraries.filter((lib) => lib.id !== libraryId);
      setLibraries(updatedLibraries);
      localStorage.setItem(
        "flashcard_libraries",
        JSON.stringify(updatedLibraries),
      );
      localStorage.removeItem(`flashcards_${libraryId}`);

      if (selectedLibraryId === libraryId) {
        setSelectedLibraryId(updatedLibraries[0]?.id || null);
      }
    }
  };

  // ==========================================
  // 5. CÁC HÀM XỬ LÝ LOGIC (FLASHCARDS)
  // ==========================================
  const handleSaveCard = (cardData) => {
    if (!selectedLibraryId) {
      alert("Please select a library first");
      return;
    }

    let updatedCards;

    if (editingCardId) {
      // Cập nhật thẻ cũ
      updatedCards = cards.map((card) =>
        card.id === editingCardId
          ? { ...card, ...cardData, updatedAt: new Date().toISOString() }
          : card,
      );
    } else {
      // Thêm thẻ mới
      const newCard = {
        id: Date.now().toString(),
        ...cardData,
        createdAt: new Date().toISOString(),
      };
      updatedCards = [...cards, newCard];
    }

    setCards(updatedCards);
    localStorage.setItem(
      `flashcards_${selectedLibraryId}`,
      JSON.stringify(updatedCards),
    );

    // Đóng form sau khi lưu
    setIsFormOpen(false);
    setEditingCardId(null);
  };

  const handleDeleteCard = (cardId) => {
    if (window.confirm("Delete this card?")) {
      const updatedCards = cards.filter((card) => card.id !== cardId);
      setCards(updatedCards);
      localStorage.setItem(
        `flashcards_${selectedLibraryId}`,
        JSON.stringify(updatedCards),
      );
    }
  };

  const handleEditCard = (cardId) => {
    setEditingCardId(cardId);
    setIsFormOpen(true);
  };

  const handleSpeak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; // Setup giọng đọc tiếng Anh
      window.speechSynthesis.speak(utterance);
    }
  };

  // ==========================================
  // 6. TÍNH TOÁN DỮ LIỆU HIỂN THỊ
  // ==========================================
  const uniqueTopics = ["All", ...new Set(cards.map((card) => card.topic))];
  const editingCard = cards.find((card) => card.id === editingCardId);
  const currentLibrary = libraries.find((lib) => lib.id === selectedLibraryId);

  // ==========================================
  // 7. RENDER GIAO DIỆN CHÍNH
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Trang */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Flashcard Library
          </h1>
          <p className="text-lg text-gray-600">
            Create and manage your vocabulary learning cards
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* CỘT TRÁI - DANH SÁCH LIBRARIES */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Libraries</h2>
                <button
                  onClick={() => setShowLibraryForm(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Create new library"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {libraries.length === 0 ? (
                  <p className="text-sm text-gray-500">No libraries yet</p>
                ) : (
                  libraries.map((library) => (
                    <div
                      key={library.id}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedLibraryId === library.id
                          ? "bg-blue-100 border-blue-300"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <button
                          onClick={() => setSelectedLibraryId(library.id)}
                          className="flex-1 text-left"
                        >
                          <p className="font-semibold text-gray-900">
                            {library.name}
                          </p>
                        </button>
                        <button
                          onClick={() => handleDeleteLibrary(library.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI - QUẢN LÝ FLASHCARDS CỦA LIBRARY */}
          <div className="lg:col-span-3">
            {selectedLibraryId ? (
              <div>
                {/* Tiêu đề Library hiện tại */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentLibrary?.name}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {cards.length} cards in this library
                  </p>
                </div>

                {/* Thanh tìm kiếm & Bộ lọc (Filters) */}
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <Search
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search cards..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {uniqueTopics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => setSelectedTopic(topic)}
                        className={`px-4 py-2 rounded-full font-semibold transition-all ${
                          selectedTopic === topic
                            ? "bg-black text-white"
                            : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        {topic}
                        {topic !== "All" && (
                          <span className="ml-2 text-sm">
                            ({cards.filter((c) => c.topic === topic).length})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nút thêm Card mới */}
                <button
                  onClick={() => {
                    setEditingCardId(null);
                    setIsFormOpen(true);
                  }}
                  className="mb-6 bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2 shadow-lg"
                >
                  <Plus size={20} /> Add Card
                </button>

                {/* Danh sách các Flashcards (Grid) */}
                <CardList
                  cards={cards}
                  selectedTopic={selectedTopic}
                  searchTerm={searchTerm}
                  onEdit={handleEditCard}
                  onDelete={handleDeleteCard}
                  onSpeak={handleSpeak}
                />
              </div>
            ) : (
              // Trạng thái khi chưa có Library nào
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-xl text-gray-500 mb-6">
                  Create a library to get started
                </p>
                <button
                  onClick={() => setShowLibraryForm(true)}
                  className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all inline-flex items-center gap-2"
                >
                  <Plus size={20} /> Create First Library
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 8. CÁC MODALS (Đã được tách file)          */}
      {/* ========================================== */}

      <FlashcardModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCardId(null);
        }}
        onSubmit={handleSaveCard}
        initialData={editingCard}
        topics={uniqueTopics.filter((t) => t !== "All")}
      />

      <LibraryModal
        isOpen={showLibraryForm}
        onClose={() => setShowLibraryForm(false)}
        onSubmit={handleCreateLibrary}
      />
    </div>
  );
};

export default LibraryPage;
