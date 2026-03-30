import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "../../components/button/button.home";

const FlashcardModal = ({ isOpen, onClose, onSubmit, targetLibraryId, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Sync state when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || "");
      setDescription(initialData?.description || "");
    }
  }, [isOpen, initialData]);

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
    onSubmit({ title: title.trim(), description: description.trim(), libraryId: targetLibraryId });
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
            <p className="text-slate-500 text-xs mt-1 font-medium">Thêm nội dung mới vào bộ sưu tập</p>
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
          <div>
            <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2.5 ml-1">Tên flashcard *</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Abandon (v)"
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold placeholder-slate-300 outline-none transition-all focus:border-blue-500/20 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2.5 ml-1">Mô tả (Định nghĩa/Ví dụ)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập nghĩa của từ hoặc ví dụ..."
              rows={4}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold placeholder-slate-300 outline-none transition-all focus:border-blue-500/20 focus:bg-white focus:ring-4 focus:ring-blue-500/5 resize-none"
            />
          </div>

          <div className="flex gap-4 justify-end mt-12 pt-2">
            <Button 
              variant="ghost" 
              type="button" 
              onClick={handleClose}
              className="h-14 px-8 rounded-2xl font-bold border border-slate-100"
            >
              Hủy bỏ
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              className="h-14 px-10 rounded-2xl shadow-2xl shadow-blue-500/20 font-bold"
            >
              {initialData ? "Cập nhật" : "Tạo Flashcard"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlashcardModal;
