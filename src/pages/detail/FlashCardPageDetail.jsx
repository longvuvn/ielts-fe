import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { 
  ArrowLeft, Plus, Search, X, Volume2, Trash2, 
  ChevronLeft, ChevronRight, Edit2, Target, BookOpen, 
  Sparkles, RotateCcw, SearchIcon
} from "lucide-react";
import Button from "../../components/button/button.home";
import {
  getVocabulariesByFlashcardIdAPI,
  createDeckVocabularyAPI,
  updateDeckVocabularyAPI,
  deleteDeckVocabularyAPI,
  searchVocabularyAPI,
} from "../../service/api/api.deckvocabulary";

const fixDefinitionText = (text = "") =>
  text
    .replace(/([a-z])([A-Z])/g, "$1 $2")        
    .replace(/([.,;:])([^\s])/g, "$1 $2")           
    .replace(/([a-z])(\d)/g, "$1 $2")      
    .trim();


const VocabFlipCard = ({ vocab, onDelete, onEdit, onSpeak, index }) => {
  const [flipped, setFlipped] = useState(false);
  const [isRippling, setIsRippling] = useState(false);

  const handleSpeak = (e) => {
    e.stopPropagation();
    setIsRippling(true);
    onSpeak(vocab.word);
    setTimeout(() => setIsRippling(false), 1000);
  };

  return (
    <div
      className="perspective-1000 aspect-[4/3] min-h-[180px] animate-fade-slide-in group"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div
        className={`relative w-full h-full transition-all duration-500 preserve-3d cursor-pointer ${
          flipped ? "rotate-y-180" : ""
        }`}
        onClick={() => setFlipped(!flipped)}
      >
        {/* FRONT */}
        <div className="absolute inset-0 backface-hidden premium-card p-6 flex flex-col items-center justify-between border-slate-200 hover:border-accent/40 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(59,130,246,0.08)] transition-all duration-300">
          <div className="w-full flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">Word</span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleSpeak}
                className={`p-2 rounded-xl text-slate-400 hover:text-accent hover:bg-blue-50 transition-all relative overflow-hidden ${isRippling ? "text-accent" : ""}`}
              >
                {isRippling && <span className="absolute inset-0 bg-accent/10 animate-ping rounded-full" />}
                <Volume2 size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(vocab); }}
                className="p-2 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-all"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(vocab.id); }}
                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="text-center flex flex-col items-center">
            <h3 className="text-2xl lg:text-[28px] font-bold text-slate-900 tracking-tight leading-tight group-hover:text-accent transition-colors duration-300 font-display">
              {vocab.word}
            </h3>
            {vocab.phonetic || vocab.ipa ? (
              <p className="text-sm font-mono text-accent/70 mt-2 font-medium bg-blue-50/50 px-3 py-0.5 rounded-full border border-blue-100/50">
                /{vocab.phonetic || vocab.ipa}/
              </p>
            ) : (
              <p className="text-[10px] font-mono text-slate-300 mt-2 italic">/no ipa/</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 group-hover:text-accent/40 transition-colors uppercase tracking-widest">
            <RotateCcw size={10} />
            flip card
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 premium-card bg-slate-900 border-slate-800 p-6 flex flex-col items-center justify-between shadow-2xl">
          <span className="text-[10px] font-black text-accent uppercase tracking-widest w-full text-left">Definition</span>
          <div className="flex-1 flex items-center justify-center py-4">
            <p className="text-[15px] text-white text-center leading-relaxed font-medium line-clamp-5 px-2">
              {vocab.userDefinition}
            </p>
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            tap to flip back
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SEARCH MODAL ─────────────────────────────────────────────────────────────
const SearchModal = ({ isOpen, onClose, searchQuery, setSearchQuery, searchResults, isSearching, onAdd }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-start justify-center pt-[12vh] px-4 backdrop-blur-sm bg-slate-900/30"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl animate-fade-slide-in bg-white border border-slate-200 rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.15)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-lg font-bold text-slate-900 block font-display">Tra cứu từ vựng</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-8 py-6">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={20} />
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Nhập từ tiếng Anh để tra cứu..."
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-6 py-4 text-slate-900 font-medium placeholder-slate-400 outline-none transition-all focus:border-accent/20 focus:bg-white focus:ring-4 focus:ring-accent/5"
            />
          </div>
        </div>

        {/* Results */}
        <div className="px-4 pb-8 max-h-[400px] overflow-y-auto">
          {isSearching ? (
            <div className="flex flex-col gap-3 px-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 rounded-2xl bg-slate-50 animate-pulse" />
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="flex flex-col gap-2 px-4">
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl transition-all border border-transparent hover:border-slate-100 hover:bg-blue-50/30 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 group-hover:text-accent transition-colors">
                      {item.word}
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5 truncate italic">
                      {fixDefinitionText(item.definition || item.meaning || "")}
                    </p>
                  </div>
                  <button
                    onClick={() => onAdd(item)}
                    className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-accent hover:text-white hover:border-accent transition-all flex items-center justify-center shadow-sm active:scale-95"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : searchQuery.trim() ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <SearchIcon size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-400 text-sm font-medium">
                Không tìm thấy kết quả cho <span className="text-slate-900">&quot;{searchQuery}&quot;</span>
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-12 text-center">
              <Search size={32} className="text-slate-200 mb-4" />
              <p className="text-slate-400 text-sm font-medium">Hãy nhập từ vựng để bắt đầu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── EDIT MODAL ─────────────────────────────────────────────────────────────
const EditVocabModal = ({ isOpen, onClose, vocab, onSave }) => {
  const [definition, setDefinition] = useState(vocab?.userDefinition || "");
  
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[3000] p-6" onClick={onClose}>
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 w-full max-w-md shadow-2xl animate-fade-slide-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold font-display text-slate-900">Sửa định nghĩa</h3>
            <p className="text-slate-500 text-sm mt-1">Cập nhật ý nghĩa cho <span className="text-accent font-bold">{vocab?.word}</span></p>
          </div>
          <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-colors"><X size={20} /></button>
        </div>
        <textarea
          autoFocus
          value={definition}
          onChange={e => setDefinition(e.target.value)}
          className="premium-input w-full min-h-[160px] resize-none leading-relaxed bg-slate-50 border-transparent focus:bg-white"
          placeholder="Nhập nghĩa của từ..."
        />
        <div className="flex gap-3 mt-10">
          <Button variant="ghost" className="flex-1 rounded-2xl h-14" onClick={onClose}>Hủy bỏ</Button>
          <Button variant="primary" className="flex-1 rounded-2xl h-14 shadow-lg shadow-blue-500/20" onClick={() => onSave(definition)}>Lưu thay đổi</Button>
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

  const go = (dir) => { setFlipped(false); setTimeout(() => setIndex((i) => i + dir), 150); };
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[2000] flex flex-col p-8 lg:p-12 overflow-hidden animate-fade-slide-in">
      <div className="flex justify-between items-center mb-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-accent rounded-2xl shadow-sm border border-blue-100"><Target size={24} /></div>
          <div>
            <h2 className="text-slate-900 font-bold font-display text-xl">Luyện tập ghi nhớ</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Mastering {vocabs.length} Key Terms</p>
          </div>
        </div>
        <button onClick={onClose} className="p-3.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-[20px] transition-all border border-slate-100">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-6 mb-16 w-full max-w-md">
          <span className="text-slate-400 font-mono text-xs font-bold">{index + 1} / {vocabs.length}</span>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent shadow-[0_0_15px_rgba(59,125,255,0.4)] transition-all duration-500 ease-out"
              style={{ width: `${((index + 1) / vocabs.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="perspective-1200 w-full max-w-2xl aspect-[1.6/1]">
          <div
            onClick={() => setFlipped(!flipped)}
            className={`relative w-full h-full transition-all duration-700 preserve-3d cursor-pointer ${flipped ? "rotate-y-180" : ""}`}
          >
            <div className="absolute inset-0 backface-hidden rounded-[48px] premium-card bg-white border-slate-200 flex flex-col items-center justify-center p-12 text-center shadow-xl">
              <span className="text-[11px] font-black text-accent uppercase tracking-[0.4em] mb-12 bg-blue-50 px-4 py-1.5 rounded-full">Word to Recall</span>
              <p className="text-5xl lg:text-7xl font-bold font-display text-slate-900 mb-4 tracking-tight">{current?.word}</p>
              {current?.phonetic && <p className="text-xl font-mono text-slate-400 mb-12">/{current.phonetic}/</p>}
              <Button variant="secondary" onClick={(e) => { e.stopPropagation(); speak(current?.word); }} className="h-14 px-10 rounded-2xl" icon={Volume2}>
                Listen Pronunciation
              </Button>
            </div>
            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[48px] premium-card bg-slate-900 border-slate-800 flex flex-col items-center justify-center p-12 text-center shadow-2xl">
              <span className="text-[11px] font-black text-accent uppercase tracking-[0.4em] mb-12">Correct Definition</span>
              <p className="text-2xl lg:text-4xl font-bold leading-relaxed text-white font-display px-4">{current?.userDefinition}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-8 mt-20">
          <button disabled={index === 0} onClick={() => go(-1)} className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-100 text-slate-400 disabled:opacity-30 hover:text-accent hover:border-accent/30 transition-all active:scale-90 flex items-center justify-center shadow-sm">
            <ChevronLeft size={32} />
          </button>
          <button disabled={index === vocabs.length - 1} onClick={() => go(1)} className="w-24 h-20 rounded-[24px] bg-accent text-white shadow-2xl shadow-blue-500/30 disabled:opacity-30 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center">
            <ChevronRight size={40} />
          </button>
        </div>
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

  const fetchVocabs = useCallback(async () => {
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
  }, [flashcardId]);

  useEffect(() => { if (flashcardId) fetchVocabs(); }, [flashcardId, fetchVocabs]);

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

  const addVocab = async (word, userDefinition) => {
    try {
      const res = await createDeckVocabularyAPI({ flashcardId, word, userDefinition });
      if (res?.status === 201 || res?.status === 200) {
        message.success(`Đã thêm "${word}"!`); await fetchVocabs();
      } else { message.error("Thêm thất bại!"); }
    } catch { message.error("Không thể thêm từ vựng!"); }
  };

  const handleManualAdd = async () => {
    if (!manualWord.trim() || !manualMeaning.trim()) {
      message.warning("Vui lòng nhập đầy đủ từ vựng và định nghĩa!");
      return;
    }
    await addVocab(manualWord.trim(), manualMeaning.trim());
    setManualWord(""); setManualMeaning(""); setShowManualAdd(false);
  };

  const handleAddFromSearch = (item) => {
    const word = item.word || item.term || "";
    setManualWord(word); setManualMeaning("");
    setShowManualAdd(true); setShowSearch(false);
    message.info(`Đã chọn từ "${word}", hãy nhập nghĩa của bạn.`);
  };

  const handleDeleteVocab = async (vocabId) => {
    if (!window.confirm("Xóa từ vựng này?")) return;
    try {
      const res = await deleteDeckVocabularyAPI(vocabId);
      if (res?.status === 200) {
        setVocabs(prev => prev.filter(v => v.id !== vocabId));
        message.success("Đã xóa!");
      }
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

  const handleSpeak = (text) => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 animate-fade-slide-in flex flex-col">
      {/* ── TOPBAR ── */}
      <div className="sticky top-0 z-[100] border-b border-slate-100 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Button variant="ghost" onClick={() => navigate(-1)} icon={ArrowLeft} className="px-5 border border-slate-100 rounded-2xl hover:bg-slate-50">Quay lại</Button>
            <div>
              <h1 className="text-2xl font-bold font-display text-slate-900 m-0 tracking-tight leading-none">Chi tiết Flashcard</h1>
              <p className="text-[11px] font-black text-slate-400 m-0 mt-2 uppercase tracking-[0.2em]">{vocabs.length} TỪ VỰNG TRONG BỘ SƯU TẬP</p>
            </div>
          </div>
          <div className="flex gap-3">
            {vocabs.length > 0 && (
              <Button variant="primary" onClick={() => setStudyMode(true)} icon={Target} className="shadow-xl shadow-blue-500/20 px-8 h-12 rounded-[18px]">
                Luyện tập ngay
              </Button>
            )}
            <button
              onClick={() => { setShowSearch(true); setSearchQuery(""); setSearchResults([]); }}
              className="flex items-center gap-2.5 px-6 h-12 border border-slate-200 rounded-[18px] font-bold text-sm text-slate-600 hover:text-accent hover:border-accent/30 transition-all bg-white shadow-sm"
            >
              <SearchIcon size={18} /> Tra cứu & Thêm
            </button>
            <button
              onClick={() => setShowManualAdd(v => !v)}
              className="flex items-center gap-2.5 px-6 h-12 bg-slate-900 text-white border border-slate-900 rounded-[18px] font-bold text-sm hover:bg-slate-800 transition-all shadow-lg"
            >
              <Plus size={20} /> Thêm thủ công
            </button>
          </div>
        </div>
      </div>

      {/* ── SEARCH MODAL ── */}
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        isSearching={isSearching}
        onAdd={handleAddFromSearch}
      />

      <div className="flex-1 p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
        {/* MANUAL ADD PANEL */}
        {showManualAdd && (
          <div className="mb-12 animate-fade-slide-in relative overflow-hidden bg-white border border-slate-200 rounded-[32px] p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
            <button
              onClick={() => setShowManualAdd(false)}
              className="absolute top-6 right-6 p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-blue-50 text-accent rounded-2xl shadow-sm border border-blue-100">
                <Plus size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display leading-tight">Thêm từ vựng thủ công</h3>
                <p className="text-slate-500 text-sm mt-0.5 font-medium">Xây dựng vốn từ vựng cá nhân của bạn</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Từ vựng (English) *</label>
                <input
                  autoFocus
                  value={manualWord}
                  onChange={e => setManualWord(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 h-14 text-slate-900 font-bold placeholder-slate-300 outline-none transition-all focus:border-accent/20 focus:bg-white focus:ring-4 focus:ring-accent/5"
                  placeholder="Ví dụ: Persistence"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Định nghĩa (Vietnamese) *</label>
                <input
                  value={manualMeaning}
                  onChange={e => setManualMeaning(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleManualAdd()}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 h-14 text-slate-900 font-bold placeholder-slate-300 outline-none transition-all focus:border-accent/20 focus:bg-white focus:ring-4 focus:ring-accent/5"
                  placeholder="Ví dụ: Sự kiên trì"
                />
              </div>
            </div>

            <div className="flex justify-end mt-10 gap-4">
              <Button variant="ghost" onClick={() => setShowManualAdd(false)} className="h-14 px-8 rounded-2xl font-bold border border-slate-100">
                Hủy bỏ
              </Button>
              <Button variant="primary" onClick={handleManualAdd} className="h-14 px-12 rounded-2xl shadow-2xl shadow-blue-500/30 font-bold">
                Lưu vào bộ sưu tập
              </Button>
            </div>
          </div>
        )}

        {/* WORD CARD GRID */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <div key={i} className="aspect-[4/3] rounded-[32px] bg-white border border-slate-100 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : vocabs.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center animate-fade-slide-in">
            <div className="w-32 h-32 rounded-[48px] bg-blue-50 border border-blue-100 flex items-center justify-center mb-8 text-accent shadow-inner">
              <BookOpen size={56} />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 font-display mb-4 tracking-tight">Chưa có từ vựng nào</h2>
            <p className="text-slate-500 max-w-sm mb-12 font-medium leading-relaxed">
              Bắt đầu hành trình ghi nhớ bằng cách thêm những từ vựng đầu tiên của bạn.
            </p>
            <Button variant="primary" icon={Plus} onClick={() => setShowManualAdd(true)} className="h-16 px-14 rounded-[24px] shadow-2xl shadow-blue-500/20 text-lg">
              Thêm từ vựng ngay
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {vocabs.map((vocab, i) => (
              <VocabFlipCard
                key={vocab.id}
                vocab={vocab}
                index={i}
                onDelete={handleDeleteVocab}
                onEdit={setEditingVocab}
                onSpeak={handleSpeak}
              />
            ))}
          </div>
        )}
      </div>

      <EditVocabModal 
        key={editingVocab?.id || "empty"}
        isOpen={!!editingVocab} 
        onClose={() => setEditingVocab(null)} 
        vocab={editingVocab} 
        onSave={handleUpdateVocab} 
      />
      {studyMode && vocabs.length > 0 && <StudyMode vocabs={vocabs} onClose={() => setStudyMode(false)} />}
    </div>
  );
};

export default FlashcardDetailPage;
