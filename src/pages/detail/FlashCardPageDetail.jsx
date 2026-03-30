import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { ArrowLeft, Plus, Search, X, Volume2, Trash2, ChevronLeft, ChevronRight, Edit2, Target } from "lucide-react";
import {
  getVocabulariesByFlashcardIdAPI,
  createDeckVocabularyAPI,
  updateDeckVocabularyAPI,
  deleteDeckVocabularyAPI,
  searchVocabularyAPI,
} from "../../service/api/api.deckvocabulary";

// ─── FLIP CARD ────────────────────────────────────────────────────────────────
const VocabFlipCard = ({ vocab, onDelete, onEdit, onSpeak }) => {
  const [flipped, setFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="perspective-1000 h-[200px]"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d cursor-pointer ${flipped ? 'rotate-y-180' : ''}`}
      >
        {/* FRONT */}
        <div
          onClick={() => setFlipped(true)}
          className={`absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col transition-all border ${
            isHovered 
              ? "bg-gradient-to-br from-[#1e3a5f] to-[#152d50] border-blue-500/40 shadow-2xl shadow-blue-900/20" 
              : "bg-gradient-to-br from-[#172d4a] to-[#0f2038] border-white/10 shadow-lg"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono text-blue-400/50 tracking-[0.2em] uppercase">Word</span>
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); onSpeak(vocab.word); }} className="p-2 rounded-lg bg-white/5 text-blue-300 hover:bg-white/10 transition-colors"><Volume2 size={14} /></button>
              <button onClick={(e) => { e.stopPropagation(); onEdit(vocab); }} className="p-2 rounded-lg bg-white/5 text-blue-300 hover:bg-white/10 transition-colors"><Edit2 size={14} /></button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(vocab.id); }} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-2xl font-bold font-serif text-white text-center break-words">{vocab.word}</p>
          </div>
          <div className="text-center mt-4">
            <span className="text-[10px] text-white/20 font-mono italic">tap to flip</span>
          </div>
        </div>

        {/* BACK */}
        <div
          onClick={() => setFlipped(false)}
          className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-6 flex flex-col bg-gradient-to-br from-[#0d3d2e] to-[#072a1e] border border-emerald-500/30 shadow-2xl shadow-emerald-900/20"
        >
          <span className="text-[10px] font-mono text-emerald-400/50 tracking-[0.2em] uppercase mb-4">Meaning</span>
          <div className="flex-1 flex items-center justify-center overflow-y-auto">
            <p className="text-lg font-serif text-emerald-50 font-medium leading-relaxed text-center">{vocab.userDefinition}</p>
          </div>
          <div className="text-center mt-4">
            <span className="text-[10px] text-emerald-400/20 font-mono italic">tap to flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── EDIT MODAL ─────────────────────────────────────────────────────────────
const EditVocabModal = ({ isOpen, onClose, vocab, onSave }) => {
  const [definition, setDefinition] = useState("");
  useEffect(() => { if (isOpen && vocab) setDefinition(vocab.userDefinition || ""); }, [isOpen, vocab]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[3000] p-6" onClick={onClose}>
      <div className="bg-[#0f1a2e] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-black/50" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold font-serif text-white">Sửa định nghĩa</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <p className="text-sm text-gray-400 mb-2 font-mono uppercase tracking-widest">Từ vựng: <span className="text-blue-400 font-bold">{vocab?.word}</span></p>
        <textarea
          autoFocus
          value={definition}
          onChange={e => setDefinition(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl text-white p-4 text-sm outline-none focus:border-blue-500 transition-colors min-h-[120px] resize-none"
          placeholder="Nhập nghĩa của từ..."
        />
        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 font-bold hover:bg-white/10 transition-all">Hủy</button>
          <button onClick={() => onSave(definition)} className="flex-1 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all">Lưu thay đổi</button>
        </div>
      </div>
    </div>
  );
};

// ─── STUDY MODE ─────────────────────────────────────────────────────────────
const StudyMode = ({ vocabs, onClose }) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const current = vocabs[index];
  const go = (dir) => { setFlipped(false); setTimeout(() => setIndex((i) => i + dir), 100); };
  const speak = (text) => { if ("speechSynthesis" in window) { const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; window.speechSynthesis.speak(u); } };

  return (
    <div className="fixed inset-0 bg-[#060d1a]/95 backdrop-blur-2xl flex flex-col items-center justify-center z-[2000] p-6">
      <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"><X size={32} /></button>
      
      <div className="flex items-center gap-6 mb-16">
        <span className="text-gray-500 font-mono text-sm uppercase tracking-[0.3em]">{index + 1} / {vocabs.length}</span>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${((index + 1) / vocabs.length) * 100}%` }} />
        </div>
      </div>

      <div className="perspective-1200 w-full max-w-lg aspect-[1.5/1]">
        <div 
          onClick={() => setFlipped(!flipped)} 
          className={`relative w-full h-full transition-transform duration-700 preserve-3d cursor-pointer ${flipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden rounded-[40px] bg-gradient-to-br from-[#1a3a6e] to-[#0f2444] border border-blue-500/30 flex flex-col items-center justify-center p-12 text-center shadow-2xl">
            <span className="text-xs font-mono text-blue-400/40 tracking-[0.4em] uppercase mb-8">Word</span>
            <p className="text-5xl lg:text-6xl font-bold font-serif text-white mb-10">{current?.word}</p>
            <button onClick={(e) => { e.stopPropagation(); speak(current?.word); }} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all font-bold text-sm border border-blue-500/20"><Volume2 size={18} /> Nghe phát âm</button>
          </div>
          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[40px] bg-gradient-to-br from-[#0d3d2e] to-[#052218] border border-emerald-500/30 flex flex-col items-center justify-center p-12 text-center shadow-2xl">
            <span className="text-xs font-mono text-emerald-400/40 tracking-[0.4em] uppercase mb-8">Meaning</span>
            <p className="text-3xl lg:text-4xl font-serif text-emerald-50 font-medium leading-relaxed">{current?.userDefinition}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-6 mt-20">
        <button disabled={index === 0} onClick={() => go(-1)} className="p-5 rounded-3xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-white/10 transition-all active:scale-90"><ChevronLeft size={32} /></button>
        <button disabled={index === vocabs.length - 1} onClick={() => go(1)} className="p-5 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-600/25 disabled:opacity-20 hover:bg-blue-700 transition-all active:scale-90"><ChevronRight size={32} /></button>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const FlashcardDetailPage = () => {
  const { flashcardId } = useParams();
  const navigate = useNavigate();
  const [vocabs, setVocabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studyMode, setStudyMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualWord, setManualWord] = useState("");
  const [manualMeaning, setManualMeaning] = useState("");
  const [editingVocab, setEditingVocab] = useState(null);

  useEffect(() => { if (flashcardId) fetchVocabs(); }, [flashcardId]);

  const fetchVocabs = async () => {
    try {
      setIsLoading(true);
      const res = await getVocabulariesByFlashcardIdAPI(flashcardId);
      const data = res?.data?.content || res?.content || res?.data || [];
      setVocabs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch vocab error:", err);
      message.error("Lỗi khi tải từ vựng!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) { setSearchResults([]); return; }
    try {
      setIsSearching(true);
      const res = await searchVocabularyAPI(query.trim());
      const data = res?.data?.content ?? res?.content ?? res?.data ?? [];
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Search error:", err); } finally { setIsSearching(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const handleManualAdd = async () => {
    if (!manualWord.trim() || !manualMeaning.trim()) return;
    await addVocab(manualWord.trim(), manualMeaning.trim());
    setManualWord(""); setManualMeaning(""); setShowManualAdd(false);
  };

  const handleAddFromSearch = (item) => {
    const word = item.word || item.term || "";
    setManualWord(word); setManualMeaning(""); 
    setShowManualAdd(true); setShowSearch(false);
    message.info(`Đã chọn từ "${word}", hãy nhập nghĩa của bạn.`);
  };

  const addVocab = async (word, userDefinition) => {
    try {
      const res = await createDeckVocabularyAPI({ flashcardId, word, userDefinition });
      if (res?.status === 201 || res?.status === 200) {
        message.success(`Đã thêm "${word}"!`); await fetchVocabs();
      } else { message.error("Thêm thất bại!"); }
    } catch (err) { message.error("Không thể thêm từ vựng!"); }
  };

  const handleDeleteVocab = async (vocabId) => {
    if (!window.confirm("Xóa từ vựng này?")) return;
    try {
      const res = await deleteDeckVocabularyAPI(vocabId);
      if (res?.status === 200) { setVocabs((prev) => prev.filter((v) => v.id !== vocabId)); message.success("Đã xóa!"); }
    } catch { message.error("Lỗi khi xóa!"); }
  };

  const handleUpdateVocab = async (newDefinition) => {
    try {
      const res = await updateDeckVocabularyAPI(editingVocab.id, {
        flashcardId, vocabularyId: editingVocab.vocabularyId || editingVocab.id,
        userDefinition: newDefinition, status: "ACTIVE"
      });
      if (res?.status === 200) {
        message.success("Đã cập nhật!");
        setVocabs(prev => prev.map(v => v.id === editingVocab.id ? { ...v, userDefinition: newDefinition } : v));
        setEditingVocab(null);
      }
    } catch { message.error("Cập nhật thất bại!"); }
  };

  const handleSpeak = (text) => { if ("speechSynthesis" in window) { const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; window.speechSynthesis.speak(u); } };

  return (
    <div className="min-h-screen bg-[#060d1a] font-sans flex flex-col animate-fade-slide-in">
      {/* ── TOPBAR ── */}
      <div className="sticky top-0 z-[100] px-8 py-6 border-b border-white/5 bg-[#060d1a]/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 px-4 py-2 hover:text-white hover:bg-white/10 transition-all font-medium text-sm"><ArrowLeft size={16} /> Quay lại</button>
          <div>
            <h1 className="text-2xl font-bold font-serif text-white m-0">Chi tiết Flashcard</h1>
            <p className="text-xs font-mono text-gray-500 m-0 mt-1 uppercase tracking-widest">{vocabs.length} từ vựng sẵn sàng</p>
          </div>
        </div>
        <div className="flex gap-3">
          {vocabs.length > 0 && <button onClick={() => setStudyMode(true)} className="flex items-center gap-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-500/20 active:scale-95 transition-all"><Target size={18} /> Luyện tập</button>}
          <button onClick={() => { setShowSearch(true); setShowManualAdd(false); }} className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">Tìm & Thêm</button>
          <button onClick={() => { setShowManualAdd(true); setShowSearch(false); }} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"><Plus size={18} /> Thêm thủ công</button>
        </div>
      </div>

      <div className="flex-1 p-8">
        {/* ADD PANELS */}
        {(showSearch || showManualAdd) && (
          <div className="mb-8 bg-white/2 border border-white/5 rounded-[32px] p-8 animate-fade-slide-in relative overflow-hidden">
            <button onClick={() => { setShowSearch(false); setShowManualAdd(false); }} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={24} /></button>
            
            {showSearch ? (
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold text-white mb-6 font-serif">Tìm từ vựng thông minh</h3>
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl text-white pl-12 pr-4 py-4 outline-none focus:border-blue-500 transition-all" placeholder="Nhập từ tiếng Anh..." />
                </div>
                <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {searchResults.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group">
                      <div><p className="font-bold text-white mb-1">{item.word}</p><p className="text-sm text-gray-500">{item.definition}</p></div>
                      <button onClick={() => handleAddFromSearch(item)} className="px-4 py-2 rounded-lg bg-blue-600/10 text-blue-400 font-bold text-xs hover:bg-blue-600 hover:text-white transition-all">+ Chọn</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold text-white mb-6 font-serif">Thêm từ vựng mới</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Từ vựng *</label>
                    <input autoFocus value={manualWord} onChange={e => setManualWord(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl text-white px-4 py-3.5 outline-none focus:border-blue-500" placeholder="e.g. Resilience" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Định nghĩa *</label>
                    <input value={manualMeaning} onChange={e => setManualMeaning(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleManualAdd()} className="w-full bg-white/5 border border-white/10 rounded-2xl text-white px-4 py-3.5 outline-none focus:border-blue-500" placeholder="e.g. Sự kiên cường" />
                  </div>
                </div>
                <div className="flex justify-end"><button onClick={handleManualAdd} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all">Lưu vào Flashcard</button></div>
              </div>
            )}
          </div>
        )}

        {/* GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-[200px] rounded-2xl bg-white/5 animate-pulse border border-white/5" />)}
          </div>
        ) : vocabs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-[32px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-500"><Plus size={40} /></div>
            <h2 className="text-2xl font-bold text-white font-serif mb-2">Thư viện trống</h2>
            <p className="text-gray-500 max-w-xs">Hãy bắt đầu hành trình bằng cách thêm những từ vựng đầu tiên của bạn.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vocabs.map(vocab => <VocabFlipCard key={vocab.id} vocab={vocab} onDelete={handleDeleteVocab} onEdit={setEditingVocab} onSpeak={handleSpeak} />)}
          </div>
        )}
      </div>

      <EditVocabModal isOpen={!!editingVocab} onClose={() => setEditingVocab(null)} vocab={editingVocab} onSave={handleUpdateVocab} />
      {studyMode && vocabs.length > 0 && <StudyMode vocabs={vocabs} onClose={() => setStudyMode(false)} />}
    </div>
  );
};

export default FlashcardDetailPage;
