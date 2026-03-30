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
        <div className="absolute inset-0 backface-hidden premium-card p-6 flex flex-col items-center justify-between border-border-default hover:border-accent/40 hover:-translate-y-1.5 hover:shadow-[0_8px_32px_rgba(59,125,255,0.12)] transition-all duration-300">
          <div className="w-full flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Word</span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleSpeak}
                className={`p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-all relative overflow-hidden ${isRippling ? "text-accent" : ""}`}
              >
                {isRippling && <span className="absolute inset-0 bg-accent/20 animate-ping rounded-full" />}
                <Volume2 size={14} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(vocab); }}
                className="p-1.5 rounded-lg text-text-muted hover:text-warning hover:bg-warning/10 transition-all"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(vocab.id); }}
                className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <h3 className="text-2xl lg:text-[26px] font-bold text-text-primary text-center tracking-tight leading-tight group-hover:text-accent transition-colors duration-300 font-display">
            {vocab.word}
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] italic text-text-muted group-hover:text-accent/50 transition-colors">
            <RotateCcw size={10} />
            tap to flip
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 premium-card bg-elevated border-accent/30 p-6 flex flex-col items-center justify-between shadow-2xl">
          <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] w-full text-left">Definition</span>
          <div className="flex-1 flex items-center justify-center py-4">
            <p className="text-[14px] text-text-secondary text-center leading-relaxed font-medium line-clamp-4">
              {vocab.userDefinition}
            </p>
          </div>
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-tight">
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
      className="fixed inset-0 z-[500] flex items-start justify-center pt-[8vh] px-4"
      style={{ background: "rgba(4,8,20,0.82)", backdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl animate-fade-slide-in"
        style={{
          background: "#0d1526",
          border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: 18,
          boxShadow: "0 40px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
          overflow: "hidden",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg" style={{ background: "rgba(59,130,246,0.12)" }}>
              <Sparkles size={14} className="text-blue-400" />
            </div>
            <span className="text-sm font-bold text-text-primary">Tìm từ vựng thông minh</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all"
            style={{ color: "#3d5275" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#f0f4ff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#3d5275"; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2" size={16} style={{ color: "#3d5275" }} />
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Nhập từ tiếng Anh để tra cứu..."
              style={{
                width: "100%",
                background: "#070d1b",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                color: "#f0f4ff",
                padding: "10px 14px 10px 38px",
                fontSize: 14,
                outline: "none",
                transition: "border 0.15s, box-shadow 0.15s",
              }}
              onFocus={e => {
                e.target.style.border = "1px solid rgba(59,125,255,0.45)";
                e.target.style.boxShadow = "0 0 0 3px rgba(59,125,255,0.12)";
              }}
              onBlur={e => {
                e.target.style.border = "1px solid rgba(255,255,255,0.08)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "0 16px" }} />

        {/* Results */}
        <div
          className="overflow-y-auto"
          style={{
            maxHeight: 340,
            padding: "8px 12px 14px",
            scrollbarWidth: "thin",
            scrollbarColor: "#1a2a40 transparent",
          }}
        >
          {isSearching ? (
            <div className="flex flex-col gap-2 pt-1">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="h-12 rounded-xl animate-pulse"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                />
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="flex flex-col gap-1 pt-1">
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                  style={{ cursor: "default" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(59,130,246,0.07)";
                    e.currentTarget.style.border = "1px solid rgba(59,130,246,0.18)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.border = "1px solid transparent";
                  }}
                >
                  {/* Word info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "#f0f4ff" }}>
                      {item.word}
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "#7a90b8" }}>
                      {fixDefinitionText(item.definition || item.meaning || "")}
                    </p>
                  </div>

                  {/* Add button */}
                  <button
                    onClick={() => onAdd(item)}
                    style={{
                      flexShrink: 0,
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: "rgba(59,130,246,0.1)",
                      color: "#60a5fa",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#3b7dff"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(59,130,246,0.1)"; e.currentTarget.style.color = "#60a5fa"; }}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : searchQuery.trim() ? (
            <div className="flex flex-col items-center py-10 text-center">
              <SearchIcon size={28} style={{ color: "#3d5275", opacity: 0.4, marginBottom: 10 }} />
              <p className="text-sm" style={{ color: "#3d5275" }}>
                Không tìm thấy kết quả cho{" "}
                <span style={{ color: "#7a90b8", fontWeight: 600 }}>"{searchQuery}"</span>
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 text-center">
              <Search size={28} style={{ color: "#3d5275", opacity: 0.25, marginBottom: 10 }} />
              <p className="text-sm" style={{ color: "#3d5275" }}>Nhập từ để bắt đầu tìm kiếm</p>
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
    <div className="fixed inset-0 bg-page/80 backdrop-blur-md flex items-center justify-center z-[3000] p-6" onClick={onClose}>
      <div className="bg-card border border-border-default rounded-[24px] p-8 w-full max-w-md shadow-2xl animate-fade-slide-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold font-display text-text-primary">Sửa định nghĩa</h3>
            <p className="text-text-secondary text-xs mt-1">Cập nhật ý nghĩa cho <span className="text-accent font-bold">{vocab?.word}</span></p>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-xl transition-colors"><X size={20} /></button>
        </div>
        <textarea
          autoFocus
          value={definition}
          onChange={e => setDefinition(e.target.value)}
          className="premium-input w-full min-h-[140px] resize-none leading-relaxed"
          placeholder="Nhập nghĩa của từ..."
        />
        <div className="flex gap-3 mt-10">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Hủy</Button>
          <Button variant="primary" className="flex-1" onClick={() => onSave(definition)}>Lưu thay đổi</Button>
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
    <div className="fixed inset-0 bg-page/98 backdrop-blur-3xl flex flex-col z-[2000] p-8 lg:p-12 overflow-hidden animate-fade-slide-in">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 text-accent rounded-xl"><Target size={20} /></div>
          <div>
            <h2 className="text-text-primary font-bold font-display text-lg">Active Recall Session</h2>
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mt-0.5">Mastering {vocabs.length} Key Terms</p>
          </div>
        </div>
        <button onClick={onClose} className="p-3 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-border-default">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-6 mb-16 w-full max-w-md">
          <span className="text-text-muted font-mono text-xs font-bold">{index + 1} / {vocabs.length}</span>
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent shadow-[0_0_12px_rgba(59,125,255,0.5)] transition-all duration-500 ease-out"
              style={{ width: `${((index + 1) / vocabs.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="perspective-1200 w-full max-w-2xl aspect-[1.6/1]">
          <div
            onClick={() => setFlipped(!flipped)}
            className={`relative w-full h-full transition-all duration-700 preserve-3d cursor-pointer ${flipped ? "rotate-y-180" : ""}`}
          >
            <div className="absolute inset-0 backface-hidden rounded-[40px] premium-card bg-gradient-to-br from-[#0d1526] to-[#070d1b] border-accent/20 flex flex-col items-center justify-center p-12 text-center shadow-2xl">
              <span className="text-[10px] font-bold text-accent uppercase tracking-[0.4em] mb-12">Word to Recall</span>
              <p className="text-5xl lg:text-7xl font-bold font-display text-text-primary mb-12 tracking-tight">{current?.word}</p>
              <Button variant="secondary" onClick={(e) => { e.stopPropagation(); speak(current?.word); }} className="h-12 px-8" icon={Volume2}>
                Listen Pronunciation
              </Button>
            </div>
            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[40px] premium-card bg-elevated border-success/30 flex flex-col items-center justify-center p-12 text-center shadow-2xl">
              <span className="text-[10px] font-bold text-success uppercase tracking-[0.4em] mb-12">Correct Definition</span>
              <p className="text-2xl lg:text-4xl font-medium leading-relaxed text-text-primary font-display">{current?.userDefinition}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-8 mt-20">
          <button disabled={index === 0} onClick={() => go(-1)} className="w-16 h-16 rounded-2xl bg-white/5 border border-border-default text-text-primary disabled:opacity-10 hover:bg-white/10 hover:border-accent/40 transition-all active:scale-90 flex items-center justify-center">
            <ChevronLeft size={32} />
          </button>
          <button disabled={index === vocabs.length - 1} onClick={() => go(1)} className="w-20 h-20 rounded-2xl bg-accent text-white shadow-xl shadow-accent/25 disabled:opacity-10 hover:brightness-110 transition-all active:scale-90 flex items-center justify-center">
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
    } catch { message.error("Không thể thêm từ vựng!"); }
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
    <div className="min-h-screen bg-page text-text-primary animate-fade-slide-in flex flex-col">
      {/* ── TOPBAR ── */}
      <div className="sticky top-0 z-[100] border-b border-border-default bg-page/40 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Button variant="ghost" onClick={() => navigate(-1)} icon={ArrowLeft} className="px-4">Quay lại</Button>
            <div>
              <h1 className="text-xl font-bold font-display text-text-primary m-0 tracking-tight">Chi tiết Flashcard</h1>
              <p className="text-[10px] font-bold text-text-muted m-0 mt-0.5 uppercase tracking-widest">{vocabs.length} TỪ VỰNG SẴN SÀNG</p>
            </div>
          </div>
          <div className="flex gap-3">
            {vocabs.length > 0 && (
              <Button variant="primary" onClick={() => setStudyMode(true)} icon={Target} className="shadow-lg shadow-accent/20 px-6 h-11">
                Luyện tập
              </Button>
            )}
            <button
              onClick={() => { setShowSearch(true); setSearchQuery(""); setSearchResults([]); }}
              className="flex items-center gap-2 px-5 h-11 border border-border-default rounded-xl font-bold text-sm text-text-secondary hover:text-text-primary hover:border-accent/40 transition-all bg-white/2"
            >
              <SearchIcon size={16} /> Tìm & Thêm
            </button>
            <button
              onClick={() => setShowManualAdd(v => !v)}
              className="flex items-center gap-2 px-5 h-11 bg-elevated border border-border-default rounded-xl font-bold text-sm text-text-primary hover:border-accent/40 transition-all shadow-xl"
            >
              <Plus size={18} /> Thêm thủ công
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

      <div className="flex-1 p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
        {/* MANUAL ADD PANEL */}
        {showManualAdd && (
          <div
            className="mb-10 animate-fade-slide-in relative overflow-hidden"
            style={{
              background: "#0d1526",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
              padding: "28px 36px",
            }}
          >
            <div className="absolute top-0 left-0 w-1 h-full" style={{ background: "#3b7dff", borderRadius: "4px 0 0 4px" }} />
            <button
              onClick={() => setShowManualAdd(false)}
              className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-xl transition-all"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl" style={{ background: "rgba(59,130,246,0.1)" }}>
                <Plus size={16} className="text-accent" />
              </div>
              <h3 className="text-base font-bold text-text-primary font-display">Thêm từ vựng mới</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 block">Tiếng Anh *</label>
                <input
                  autoFocus
                  value={manualWord}
                  onChange={e => setManualWord(e.target.value)}
                  className="w-full premium-input h-11"
                  placeholder="e.g. Persistence"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 block">Định nghĩa / Tiếng Việt *</label>
                <input
                  value={manualMeaning}
                  onChange={e => setManualMeaning(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleManualAdd()}
                  className="w-full premium-input h-11"
                  placeholder="e.g. Sự kiên trì"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" onClick={handleManualAdd} className="h-11 px-8 shadow-lg shadow-accent/20">
                Lưu vào Flashcard
              </Button>
            </div>
          </div>
        )}

        {/* WORD CARD GRID */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-[4/3] rounded-[16px] bg-white/5 animate-pulse border border-border-default" />
            ))}
          </div>
        ) : vocabs.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center animate-fade-slide-in">
            <div className="w-24 h-24 rounded-[32px] bg-accent/5 border border-accent/10 flex items-center justify-center mb-8 text-accent shadow-2xl">
              <BookOpen size={48} />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary font-display mb-3">Chưa có từ vựng nào</h2>
            <p className="text-text-secondary max-w-sm mb-10 font-medium leading-relaxed">
              Bắt đầu hành trình ghi nhớ bằng cách thêm những từ vựng đầu tiên.
            </p>
            <Button variant="primary" icon={Plus} onClick={() => setShowManualAdd(true)} className="h-14 px-12 shadow-xl shadow-accent/20">
              Thêm từ vựng ngay
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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