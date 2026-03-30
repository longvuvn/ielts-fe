import React, { useState, useEffect } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { message } from "antd";

import CardList from "../../components/card/CardList";
import FlashcardModal from "../../components/modal/FlashcardModal";
import LibraryModal from "../../components/modal/LibraryModal";
import { useAuth } from "../../contexts/AuthContext";
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

const LibraryPage = () => {
  // 1. STATE QUẢN LÝ DỮ LIỆU
  const [libraries, setLibraries] = useState([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState(null);

  const [cards, setCards] = useState([]);
  const [editingCardId, setEditingCardId] = useState(null);
  const { user } = useAuth();
  // 2. STATE QUẢN LÝ UI
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showLibraryForm, setShowLibraryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");

  // State quản lý loading khi gọi API
  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // 3. USE-EFFECT GỌI API KHI RENDER
  // ==========================================
  useEffect(() => {
    fetchLibraries();
  }, []);

  useEffect(() => {
    if (selectedLibraryId) {
      fetchCards(selectedLibraryId);
    }
  }, [selectedLibraryId]);

  // ==========================================
  // 4. HÀM GỌI API - LIBRARIES
  // ==========================================
  const fetchLibraries = async () => {
    try {
      setIsLoading(true);

      // KIỂM TRA BẢO VỆ: Nếu chưa có user hoặc mất ID thì không gọi API
      if (!user || !user.id) {
        console.warn("Chưa có ID User, tạm ngưng gọi API.");
        return;
      }

      // TRUYỀN ID THẬT VÀO HÀM API
      const res = await getAllLibrariesByLearnerIdAPI(user.id, 0, 50);

      if (res && res.code === 200) {
        const libs = res.data.content;
        setLibraries(libs);
        if (libs.length > 0 && !selectedLibraryId) {
          setSelectedLibraryId(libs[0].id);
        }
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách Thư viện!");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateLibrary = async (newLibraryName) => {
    try {
      // KIỂM TRA BẢO VỆ
      if (!user || !user.id) {
        message.error("Lỗi xác thực, vui lòng đăng nhập lại!");
        return;
      }

      // TRUYỀN THÊM ID THẬT CỦA USER VÀO HÀM TẠO
      const res = await createLibraryAPI(newLibraryName, user.id);

      if (res && res.code === 201) {
        message.success("Tạo thư viện thành công!");
        setShowLibraryForm(false);
        await fetchLibraries(); // Tải lại danh sách mới
        setSelectedLibraryId(res.data.id);
      }
    } catch (error) {
      message.error("Không thể tạo thư viện lúc này.");
    }
  };

  const handleDeleteLibrary = async (libraryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thư viện này?")) {
      try {
        const res = await deleteLibraryAPI(libraryId);
        if (res && res.code === 200) {
          message.success("Xóa thư viện thành công!");
          // Nếu xóa thư viện đang chọn, reset lại lựa chọn
          if (selectedLibraryId === libraryId) {
            setSelectedLibraryId(null);
          }
          fetchLibraries();
        }
      } catch (error) {
        message.error("Xóa thất bại!");
      }
    }
  };

  const fetchCards = async (libraryId) => {
    try {
      const res = await getFlashcardsByLibraryIdAPI(libraryId, 0, 50);
      if (res && res.code === 200) {
        const mappedCards = res.data.content.map((card) => ({
          id: card.id,
          front: card.title, // Đổi tên field cho khớp UI
          back: card.description, // Đổi tên field cho khớp UI
          topic: card.status || "ACTIVE",
        }));
        setCards(mappedCards);
      }
    } catch (error) {
      message.error("Lỗi khi tải Flashcards!");
    }
  };

  const handleSaveCard = async (cardData) => {
    if (!selectedLibraryId) {
      message.warning("Vui lòng chọn thư viện trước!");
      return;
    }

    try {
      if (editingCardId) {
        // Gọi API Update (Hiện bạn chưa có hàm Update, tạm thời để lại TODO)
        message.info("Chức năng cập nhật đang được hoàn thiện!");
      } else {
        // UI gửi lên: front, back. Backend cần: title, description
        const res = await createFlashcardAPI(
          cardData.front, // title
          cardData.back, // description
          selectedLibraryId, // libraryId
        );

        if (res && res.code === 201) {
          message.success("Thêm thẻ Flashcard thành công!");
          setIsFormOpen(false);
          fetchCards(selectedLibraryId); // Load lại danh sách thẻ
        }
      }
    } catch (error) {
      message.error("Không thể lưu thẻ!");
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm("Bạn có muốn xóa thẻ này?")) {
      try {
        const res = await deleteFlashcardAPI(cardId);
        if (res && res.code === 200) {
          message.success("Đã xóa thẻ!");
          fetchCards(selectedLibraryId); // Load lại danh sách thẻ
        }
      } catch (error) {
        message.error("Lỗi khi xóa thẻ!");
      }
    }
  };

  const handleEditCard = (cardId) => {
    setEditingCardId(cardId);
    setIsFormOpen(true);
  };

  const handleSpeak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Flashcard Library
          </h1>
          <p className="text-lg text-gray-600">
            Hệ thống đồng bộ trực tiếp với Backend Spring Boot
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* CỘT TRÁI - DANH SÁCH LIBRARIES */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Libraries</h2>
                <button
                  onClick={() => setShowLibraryForm(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {isLoading ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Đang tải...
                  </p>
                ) : libraries.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Chưa có thư viện nào
                  </p>
                ) : (
                  libraries.map((library) => (
                    <div
                      key={library.id}
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedLibraryId === library.id
                          ? "bg-blue-50 border-blue-300 shadow-sm"
                          : "bg-white border-gray-100 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedLibraryId(library.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 truncate">
                          <p className="font-semibold text-gray-900 truncate">
                            {library.name}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Ngăn click nhầm vào vùng chọn Library
                            handleDeleteLibrary(library.id);
                          }}
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
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {currentLibrary?.name}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {cards.length} Flashcards
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCardId(null);
                      setIsFormOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all flex items-center gap-2 shadow-md"
                  >
                    <Plus size={20} /> Thêm Thẻ Mới
                  </button>
                </div>

                {/* Danh sách các Flashcards */}
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
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                <p className="text-xl text-gray-500 mb-6">
                  Hãy chọn một thư viện hoặc tạo mới để bắt đầu
                </p>
                <button
                  onClick={() => setShowLibraryForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all inline-flex items-center gap-2"
                >
                  <Plus size={20} /> Tạo Thư Viện Đầu Tiên
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CÁC MODALS */}
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
