import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { ArrowLeft, Plus, Search, X, Volume2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getVocabulariesByFlashcardIdAPI,
  createDeckVocabularyAPI,
  deleteDeckVocabularyAPI,
  searchVocabularyAPI,
} from "../../service/api/api.deckvocabulary";

// ─── FLIP CARD ────────────────────────────────────────────────────────────────
const VocabFlipCard = ({ vocab, onDelete, onSpeak }) => {
  const [flipped, setFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: "1000px", height: "180px" }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          onClick={() => setFlipped(true)}
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "16px",
            background: isHovered
              ? "linear-gradient(135deg, #1e3a5f 0%, #152d50 100%)"
              : "linear-gradient(135deg, #172d4a 0%, #0f2038 100%)",
            border: "1px solid rgba(100,160,255,0.2)",
            boxShadow: isHovered
              ? "0 12px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
              : "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{
              fontSize: "9px", fontFamily: "'DM Mono', monospace",
              color: "rgba(100,180,255,0.5)", letterSpacing: "2px", textTransform: "uppercase",
            }}>
              WORD
            </span>
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                onClick={(e) => { e.stopPropagation(); onSpeak(vocab.word); }}
                style={{
                  background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "6px",
                  color: "rgba(180,210,255,0.8)", cursor: "pointer", padding: "4px 5px",
                  display: "flex", alignItems: "center",
                }}
              >
                <Volume2 size={11} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(vocab.id); }}
                style={{
                  background: "rgba(248,113,113,0.1)", border: "none", borderRadius: "6px",
                  color: "#f87171", cursor: "pointer", padding: "4px 5px",
                  display: "flex", alignItems: "center",
                }}
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>

          {/* Word */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{
              color: "#e2f0ff", fontFamily: "'Playfair Display', serif",
              fontSize: "22px", fontWeight: "700", margin: 0, textAlign: "center",
              wordBreak: "break-word",
            }}>
              {vocab.word}
            </p>
          </div>

          {/* Hint */}
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "9px", color: "rgba(100,180,255,0.35)", fontFamily: "'DM Mono', monospace" }}>
              tap to see meaning →
            </span>
          </div>
        </div>

        {/* BACK */}
        <div
          onClick={() => setFlipped(false)}
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #0d3d2e 0%, #072a1e 100%)",
            border: "1px solid rgba(100,220,160,0.2)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            cursor: "pointer",
          }}
        >
          <span style={{
            fontSize: "9px", fontFamily: "'DM Mono', monospace",
            color: "rgba(100,220,160,0.5)", letterSpacing: "2px", textTransform: "uppercase",
          }}>
            MEANING
          </span>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{
              color: "#d1fae5", fontFamily: "'Playfair Display', serif",
              fontSize: "16px", lineHeight: "1.5", margin: 0, textAlign: "center",
              wordBreak: "break-word",
            }}>
              {vocab.userDefinition}
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "9px", color: "rgba(100,220,160,0.35)", fontFamily: "'DM Mono', monospace" }}>
              ← tap to flip back
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── STUDY MODE (duyệt từng thẻ) ─────────────────────────────────────────────
const StudyMode = ({ vocabs, onClose }) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = vocabs[index];
  const go = (dir) => { setFlipped(false); setTimeout(() => setIndex((i) => i + dir), 50); };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(12px)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      zIndex: 2000, gap: "32px",
    }}>
      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ color: "#64748b", fontSize: "12px", fontFamily: "'DM Mono', monospace" }}>
          {index + 1} / {vocabs.length}
        </span>
        <div style={{ width: "200px", height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", overflow: "hidden" }}>
          <div style={{
            width: `${((index + 1) / vocabs.length) * 100}%`,
            height: "100%",
            background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
            borderRadius: "99px",
            transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Big flip card */}
      <div style={{ perspective: "1200px", width: "380px", height: "260px" }}>
        <div
          onClick={() => setFlipped((f) => !f)}
          style={{
            position: "relative",
            width: "100%", height: "100%",
            transformStyle: "preserve-3d",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            cursor: "pointer",
          }}
        >
          {/* Front */}
          <div style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #1a3a6e 0%, #0f2444 100%)",
            border: "1px solid rgba(100,160,255,0.25)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "16px", padding: "32px",
          }}>
            <span style={{ fontSize: "10px", fontFamily: "'DM Mono', monospace", color: "rgba(100,180,255,0.5)", letterSpacing: "3px" }}>
              WORD
            </span>
            <p style={{
              color: "#e2f0ff", fontFamily: "'Playfair Display', serif",
              fontSize: "36px", fontWeight: "700", margin: 0, textAlign: "center",
            }}>
              {current?.word}
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); speak(current?.word); }}
              style={{
                background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "8px",
                color: "#60a5fa", cursor: "pointer", padding: "6px 12px",
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <Volume2 size={13} /> Nghe
            </button>
            <span style={{ fontSize: "10px", color: "rgba(100,180,255,0.3)", fontFamily: "'DM Mono', monospace" }}>
              click để xem nghĩa
            </span>
          </div>
          {/* Back */}
          <div style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #0d3d2e 0%, #052218 100%)",
            border: "1px solid rgba(100,220,160,0.25)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "12px", padding: "32px",
          }}>
            <span style={{ fontSize: "10px", fontFamily: "'DM Mono', monospace", color: "rgba(100,220,160,0.5)", letterSpacing: "3px" }}>
              MEANING
            </span>
            <p style={{
              color: "#d1fae5", fontFamily: "'Playfair Display', serif",
              fontSize: "26px", lineHeight: "1.4", margin: 0, textAlign: "center",
            }}>
              {current?.userDefinition}
            </p>
          </div>
        </div>
      </div>

      {/* Nav buttons */}
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <button
          disabled={index === 0}
          onClick={() => go(-1)}
          style={{
            background: index === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px",
            color: index === 0 ? "#334155" : "#e2e8f0",
            padding: "10px 20px", cursor: index === 0 ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: "6px",
            fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
          }}
        >
          <ChevronLeft size={16} /> Trước
        </button>

        <button
          onClick={onClose}
          style={{
            background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: "12px", color: "#f87171", padding: "10px 20px",
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
          }}
        >
          Thoát
        </button>

        <button
          disabled={index === vocabs.length - 1}
          onClick={() => go(1)}
          style={{
            background: index === vocabs.length - 1 ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            border: "none", borderRadius: "12px",
            color: index === vocabs.length - 1 ? "#334155" : "white",
            padding: "10px 20px", cursor: index === vocabs.length - 1 ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: "6px",
            fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: "600",
          }}
        >
          Tiếp <ChevronRight size={16} />
        </button>
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

  // Search
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Manual add
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualWord, setManualWord] = useState("");
  const [manualMeaning, setManualMeaning] = useState("");

  // ── FETCH VOCABS ──
  useEffect(() => {
    if (flashcardId) fetchVocabs();
  }, [flashcardId]);

  const fetchVocabs = async () => {
  try {
    setIsLoading(true);
    const res = await getVocabulariesByFlashcardIdAPI(flashcardId);

    console.log("Vocab res:", res);

    const data =
      res?.data?.content ||    
      res?.content ||           
      res?.data ||           
      [];

    console.log("Parsed vocabs:", data);

    setVocabs(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Fetch vocab error:", err);
    message.error("Lỗi khi tải từ vựng!");
  } finally {
    setIsLoading(false);
  }
};

  // ── SEARCH VOCAB ──
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) { setSearchResults([]); return; }
    try {
      setIsSearching(true);
      const res = await searchVocabularyAPI(query.trim());
      console.log("Search res:", res);
      // Interceptor unwrap: res = { data: { content: [...] }, message, status }
      const data = res?.data?.content ?? res?.content ?? res?.data ?? [];
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  // ── ADD VOCAB TỪ SEARCH RESULT ──
  const handleAddFromSearch = async (item) => {
    const word = item.word || "";
    const userDefinition = item.userDefinition || item.definition || item.meaning || "";
    await addVocab(word, userDefinition);
  };

  // ── MANUAL ADD ──
  const handleManualAdd = async () => {
    if (!manualWord.trim() || !manualMeaning.trim()) return;
    await addVocab(manualWord.trim(), manualMeaning.trim());
    setManualWord("");
    setManualMeaning("");
    setShowManualAdd(false);
  };

  const addVocab = async (word, userDefinition) => {
  try {
    const payload = { flashcardId, word, userDefinition };

    const res = await createDeckVocabularyAPI(payload);

    const isOk =
      res?.status === 201 ||
      res?.status === 200 ||
      res?.code === 201 ||
      res?.code === 200;

    if (isOk) {
      message.success(`Đã thêm "${word}"!`);
      await fetchVocabs();

    } else {
      message.error("Thêm thất bại!");
    }
  } catch (err) {
    console.error(err);
    message.error("Không thể thêm từ vựng!");
  }
};
  const handleDeleteVocab = async (vocabId) => {
    if (!window.confirm("Xóa từ vựng này?")) return;
    try {
      const res = await deleteDeckVocabularyAPI(vocabId);
      if (res?.status === 200) {
        setVocabs((prev) => prev.filter((v) => v.id !== vocabId));
        message.success("Đã xóa!");
      }
    } catch {
      message.error("Lỗi khi xóa!");
    }
  };

  const handleSpeak = (text) => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      window.speechSynthesis.speak(u);
    }
  };

  // ─── INPUT STYLES ─────────────────────────────────────────────────────────
  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#e2e8f0",
    padding: "10px 14px",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    color: "#94a3b8",
    fontSize: "11px",
    fontFamily: "'DM Mono', monospace",
    marginBottom: "6px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(100,150,255,0.2); border-radius: 999px; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeSlideIn 0.4s ease forwards; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #060d1a 0%, #0a1628 50%, #060e1c 100%)",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex", flexDirection: "column",
      }}>

        {/* ── TOPBAR ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 32px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(10px)",
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px", color: "#94a3b8", cursor: "pointer",
                padding: "8px 14px", display: "flex", alignItems: "center", gap: "6px",
                fontFamily: "'DM Sans', sans-serif", fontSize: "13px", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#e2e8f0"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            >
              <ArrowLeft size={15} /> Quay lại
            </button>
            <div>
              <h1 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", color: "#e2e8f0" }}>
                Từ vựng
              </h1>
              <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: "11px", fontFamily: "'DM Mono', monospace" }}>
                {vocabs.length} từ trong flashcard này
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {vocabs.length > 0 && (
              <button
                onClick={() => setStudyMode(true)}
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
                  border: "none", borderRadius: "10px", color: "white",
                  padding: "9px 18px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
                  fontWeight: "600", cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(124,58,237,0.4)",
                }}
              >
                🎯 Luyện tập
              </button>
            )}
            <button
              onClick={() => { setShowSearch(true); setShowManualAdd(false); }}
              style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", color: "#e2e8f0", padding: "9px 16px",
                fontSize: "13px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px",
              }}
            >
              <Search size={14} /> Tìm & thêm
            </button>
            <button
              onClick={() => { setShowManualAdd(true); setShowSearch(false); }}
              style={{
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                border: "none", borderRadius: "10px", color: "white",
                padding: "9px 16px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
                fontWeight: "600", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px",
                boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
              }}
            >
              <Plus size={14} /> Thêm thủ công
            </button>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ padding: "28px 32px", flex: 1 }}>

          {/* SEARCH PANEL */}
          {showSearch && (
            <div className="fade-in" style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px", padding: "20px", marginBottom: "24px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <span style={{ color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: "600" }}>
                  Tìm từ vựng để thêm vào flashcard
                </span>
                <button onClick={() => { setShowSearch(false); setSearchQuery(""); setSearchResults([]); }}
                  style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ position: "relative", marginBottom: "14px" }}>
                <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập từ cần tìm, e.g. download"
                  style={{ ...inputStyle, paddingLeft: "36px" }}
                />
              </div>

              {isSearching && (
                <div style={{ textAlign: "center", color: "#64748b", fontSize: "12px", fontFamily: "'DM Mono', monospace", padding: "12px" }}>
                  Đang tìm...
                </div>
              )}

              {searchResults.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "260px", overflowY: "auto" }}>
                  {searchResults.map((item, idx) => (
                    <div key={item.id || item.word || idx} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "rgba(255,255,255,0.04)", borderRadius: "10px",
                      padding: "10px 14px", border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <div>
                        <p style={{ margin: 0, color: "#e2e8f0", fontSize: "14px", fontFamily: "'Playfair Display', serif", fontWeight: "600" }}>
                          {item.word || item.term}
                        </p>
                        <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>
                          {item.definition || item.meaning || item.userDefinition || "—"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddFromSearch(item)}
                        style={{
                          background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.2)",
                          borderRadius: "8px", color: "#60a5fa", cursor: "pointer",
                          padding: "6px 12px", fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                          fontWeight: "600", whiteSpace: "nowrap",
                        }}
                      >
                        + Thêm
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {!isSearching && searchQuery && searchResults.length === 0 && (
                <div style={{ textAlign: "center", color: "#64748b", fontSize: "12px", fontFamily: "'DM Mono', monospace", padding: "16px" }}>
                  Không tìm thấy kết quả cho "{searchQuery}"
                </div>
              )}
            </div>
          )}

          {/* MANUAL ADD PANEL */}
          {showManualAdd && (
            <div className="fade-in" style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px", padding: "20px", marginBottom: "24px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: "600" }}>
                  Thêm từ vựng thủ công
                </span>
                <button onClick={() => setShowManualAdd(false)}
                  style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={labelStyle}>Từ *</label>
                  <input
                    autoFocus
                    value={manualWord}
                    onChange={(e) => setManualWord(e.target.value)}
                    placeholder="e.g. download"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Nghĩa *</label>
                  <input
                    value={manualMeaning}
                    onChange={(e) => setManualMeaning(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleManualAdd(); }}
                    placeholder="e.g. tải xuống"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button onClick={() => setShowManualAdd(false)} style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px", color: "#94a3b8", padding: "8px 18px",
                  fontSize: "13px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                }}>Hủy</button>
                <button onClick={handleManualAdd} style={{
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  border: "none", borderRadius: "10px", color: "white",
                  padding: "8px 18px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
                  fontWeight: "600", cursor: "pointer",
                }}>Thêm</button>
              </div>
            </div>
          )}

          {/* LOADING */}
          {isLoading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{
                  height: "180px", borderRadius: "16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  animation: `shimmer 1.5s ease-in-out ${i * 0.15}s infinite`,
                }} />
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!isLoading && vocabs.length === 0 && (
            <div className="fade-in" style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", minHeight: "300px", gap: "16px", textAlign: "center",
            }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "18px",
                background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Plus size={28} style={{ color: "#3b82f6" }} />
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#475569", margin: 0 }}>
                Chưa có từ vựng nào
              </p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#334155", margin: 0 }}>
                Tìm kiếm hoặc thêm thủ công để bắt đầu
              </p>
            </div>
          )}

          {/* VOCAB GRID */}
          {!isLoading && vocabs.length > 0 && (
            <div
              className="fade-in"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              {vocabs.map((vocab) => (
                <VocabFlipCard
                  key={vocab.id}
                  vocab={vocab}
                  onDelete={handleDeleteVocab}
                  onSpeak={handleSpeak}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* STUDY MODE OVERLAY */}
      {studyMode && vocabs.length > 0 && (
        <StudyMode vocabs={vocabs} onClose={() => setStudyMode(false)} />
      )}
    </>
  );
};

export default FlashcardDetailPage;