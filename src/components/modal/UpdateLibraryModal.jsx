import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "../../components/button/button.home";

const UpdateLibraryModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // Sync state when initialData changes or modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      const val = initialData.is_Public;
      setIsPublic(val === true || val === "True" || val === "true");
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
    if (!name.trim()) return;
    onSubmit({ 
      name: name.trim(), 
      description: description.trim(), 
      is_Public: isPublic 
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
            <h3 className="text-slate-900 font-display text-2xl font-bold tracking-tight">Chỉnh sửa Thư Viện</h3>
            <p className="text-slate-500 text-xs mt-1 font-medium">Cập nhật thông tin kho từ vựng của bạn</p>
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
            <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2.5 ml-1">Tên thư viện *</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: IELTS Vocabulary"
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold placeholder-slate-300 outline-none transition-all focus:border-blue-500/20 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2.5 ml-1">Mô tả</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cập nhật mô tả thư viện..."
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold placeholder-slate-300 outline-none transition-all focus:border-blue-500/20 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
            />
          </div>

          <div 
            className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border-2 border-slate-50 cursor-pointer group transition-all hover:bg-white hover:border-blue-500/10" 
            onClick={() => setIsPublic(!isPublic)}
          >
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isPublic ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/20' : 'border-slate-200 group-hover:border-slate-300'}`}>
              {isPublic && <div className="w-2.5 h-2.5 bg-white rounded-[2px]" />}
            </div>
            <div className="flex flex-col">
              <span className="text-slate-900 text-sm font-bold leading-tight">Công khai thư viện</span>
              <span className="text-slate-400 text-[10px] font-bold mt-0.5 uppercase tracking-tight">Mọi người có thể xem thư viện này</span>
            </div>
          </div>

          <div className="flex gap-4 justify-end mt-12 pt-2">
            <Button variant="ghost" type="button" onClick={handleClose} className="h-14 px-8 rounded-2xl font-bold border border-slate-100">
              Hủy bỏ
            </Button>
            <Button variant="primary" type="submit" className="h-14 px-10 rounded-2xl shadow-2xl shadow-blue-500/20 font-bold">
              Cập nhật
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateLibraryModal;
