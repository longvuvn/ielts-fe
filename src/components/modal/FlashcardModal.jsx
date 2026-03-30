import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "../../components/button/button.home";

const FlashcardModal = ({ isOpen, onClose, onSubmit, targetLibraryId, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");

  if (!isOpen) return null;

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose();
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      libraryId: targetLibraryId
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[9999] p-6" 
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(e); }}
    >
      <div 
        className="bg-white border border-slate-200 rounded-[32px] p-8 w-full max-w-md shadow-2xl animate-fade-slide-in relative" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-slate-900 font-display text-2xl font-bold tracking-tight">
              {initialData ? "Chỉnh sửa Flashcard" : "Tạo Flashcard Mới"}
            </h3>
            <p className="text-slate-500 text-xs mt-1 font-medium">
              Thêm nội dung mới vào bộ sưu tập
            </p>
          </div>
          <button 
            type="button"
            onClick={handleClose} 
            className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Abandon (v)"
            className="w-full ..."
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập nghĩa..."
            rows={4}
            className="w-full ..."
          />

          <div className="flex gap-4 justify-end mt-12 pt-2">
            <Button type="button" onClick={handleClose}>
              Hủy bỏ
            </Button>
            <Button type="submit">
              {initialData ? "Cập nhật" : "Tạo Flashcard"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlashcardModal;