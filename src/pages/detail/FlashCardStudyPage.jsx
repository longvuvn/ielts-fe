import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import {
  X, Volume2, ChevronLeft, ChevronRight, BookOpen,
  Sparkles, RotateCcw, CheckCircle, Target
} from "lucide-react";
import Button from "../../components/button/button.home";
import {
  getVocabulariesByFlashcardIdAPI,
  incrementFlashcardCountAPI,
} from "../../service/api/api.deckvocabulary";

const FlashCardStudyPage = () => {
  const { flashcardId } = useParams();
  const navigate = useNavigate();
  const [vocabs, setVocabs] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    wrong: 0,
    hardWords: new Set(),
  });
  const [isFinished, setIsFinished] = useState(false);
  const [isReverseMode, setIsReverseMode] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  useEffect(() => {
    const fetchVocabs = async () => {
      try {
        setIsLoading(true);
        const res = await getVocabulariesByFlashcardIdAPI(flashcardId);
        const data = res?.data?.content || res?.content || res?.data || [];
        const fetchedVocabs = Array.isArray(data) ? data : [];
        setVocabs(fetchedVocabs);
        
        const shuffled = [...fetchedVocabs]
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(fetchedVocabs.length, 20));
        setQueue(shuffled);
      } catch (err) {
        console.error("Fetch vocab error:", err);
        message.error("Lỗi khi tải từ vựng!");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVocabs();
  }, [flashcardId, navigate]);

  const currentCard = queue[currentIndex];

  const speak = useCallback((text) => {
    if (!text || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    if (autoSpeak && currentCard && !isFlipped) {
      const timer = setTimeout(() => speak(currentCard.word), 400);
      return () => clearTimeout(timer);
    }
  }, [currentCard, autoSpeak, isFlipped, speak]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleEvaluation = (rating) => {
    if (!isFlipped) return;

    let newQueue = [...queue];
    let newStats = { ...sessionStats, reviewed: sessionStats.reviewed + 1 };

    switch (rating) {
      case "again":
        newStats.wrong += 1;
        newStats.hardWords.add(currentCard);
        const reInsertIndex = Math.min(currentIndex + 3, newQueue.length);
        newQueue.splice(reInsertIndex, 0, currentCard);
        break;
      case "hard":
        newStats.hardWords.add(currentCard);
        break;
      case "good":
        newStats.correct += 1;
        break;
      case "easy":
        newStats.correct += 1;
        break;
      default:
        break;
    }

    if (currentCard?.id) {
      incrementFlashcardCountAPI(currentCard.id).catch(console.error);
    }

    setSessionStats(newStats);
    setQueue(newQueue);

    if (currentIndex < newQueue.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < queue.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFinished || isLoading) return;

      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.key === "1" && isFlipped) handleEvaluation("again");
      else if (e.key === "2" && isFlipped) handleEvaluation("hard");
      else if (e.key === "3" && isFlipped) handleEvaluation("good");
      else if (e.key === "4" && isFlipped) handleEvaluation("easy");
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, currentIndex, queue, isFinished, isLoading]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-[2000] flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse">Đang chuẩn bị thẻ ghi nhớ...</p>
      </div>
    );
  }

  if (isFinished) {
    const accuracy = Math.round((sessionStats.correct / sessionStats.reviewed) * 100) || 0;
    return (
      <div className="fixed inset-0 bg-slate-50 z-[2000] flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl p-10 text-center border border-slate-100">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Sparkles size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 font-display mb-2">Tuyệt vời! Bạn đã hoàn thành</h2>
          <p className="text-slate-500 mb-10 font-medium">Kết quả luyện tập của bạn trong phiên này</p>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Đã học</p>
              <p className="text-3xl font-bold text-slate-900">{sessionStats.reviewed}</p>
            </div>
            <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
              <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-2">Chính xác</p>
              <p className="text-3xl font-bold text-emerald-600">{sessionStats.correct}</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest mb-2">Tỉ lệ</p>
              <p className="text-3xl font-bold text-blue-600">{accuracy}%</p>
            </div>
          </div>

          {sessionStats.hardWords?.size > 0 && (
            <div className="mb-10 text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Target size={14} className="text-amber-500" /> Cần chú ý các từ này
              </p>
              <div className="flex flex-wrap gap-2">
                {[...sessionStats.hardWords].slice(0, 6).map((word, i) => (
                  <span key={i} className="px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold border border-amber-100">
                    {word?.word}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => navigate(-1)}>
              Đóng lại
            </Button>
            <Button variant="primary" className="flex-1 h-14 rounded-2xl font-bold shadow-xl shadow-blue-500/20" onClick={() => window.location.reload()}>
              Luyện tập lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#f8fafc] z-[2000] flex flex-col animate-fade-in overflow-hidden">
      <div className="px-8 py-6 flex items-center justify-between bg-white border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-blue-50 text-accent rounded-xl">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none">Chế độ Luyện tập</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
              Card {currentIndex + 1} of {queue.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto-audio</span>
            <button 
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`w-10 h-5 rounded-full transition-all relative ${autoSpeak ? 'bg-accent' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${autoSpeak ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="h-1.5 w-full bg-slate-100 relative flex-shrink-0">
        <div 
          className="absolute top-0 left-0 h-full bg-accent transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          style={{ width: `${((currentIndex + 1) / queue.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center py-12 px-6">
        <div className="w-full max-w-2xl perspective-2000 aspect-[1.6/1] mb-12 flex-shrink-0">
          <div
            onClick={handleFlip}
            className={`relative w-full h-full transition-all duration-700 preserve-3d cursor-pointer ${isFlipped ? "rotate-y-180" : ""}`}
          >
            <div className="absolute inset-0 backface-hidden rounded-[40px] bg-white border-2 border-slate-100 shadow-xl flex flex-col items-center justify-center p-12 text-center group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-400/10 group-hover:bg-blue-400/30 transition-colors" />
              <span className="text-[11px] font-black text-accent uppercase tracking-[0.4em] mb-10 bg-blue-50 px-4 py-1.5 rounded-full">
                {isReverseMode ? "Definition" : "English Term"}
              </span>
              <h2 className="text-5xl lg:text-7xl font-bold font-display text-slate-900 tracking-tight mb-4">
                {isReverseMode ? currentCard?.userDefinition : currentCard?.word}
              </h2>
              {!isReverseMode && (currentCard?.phonetic || currentCard?.ipa) && (
                <p className="text-xl font-mono text-slate-400 mb-10">/{currentCard.phonetic || currentCard.ipa}/</p>
              )}
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); speak(currentCard?.word); }}
                  className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 hover:text-accent hover:bg-blue-50 transition-all border border-slate-100 flex items-center justify-center active:scale-90"
                >
                  <Volume2 size={24} />
                </button>
              </div>
              <div className="absolute bottom-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <RotateCcw size={12} /> Click or Space to flip
              </div>
            </div>

            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[40px] bg-slate-900 border-2 border-slate-800 shadow-2xl flex flex-col items-center justify-center p-12 text-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-accent/20" />
              <span className="text-[11px] font-black text-accent uppercase tracking-[0.4em] mb-10">Meaning</span>
              <h2 className="text-3xl lg:text-5xl font-bold leading-relaxed text-white font-display">
                {isReverseMode ? currentCard?.word : currentCard?.userDefinition}
              </h2>
              <div className="absolute bottom-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                tap to flip back
              </div>
            </div>
          </div>
        </div>

        <div className={`w-full max-w-3xl transition-all duration-500 mb-16 flex-shrink-0 ${isFlipped ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 translate-y-8 h-0 overflow-hidden pointer-events-none'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleEvaluation("again")}
              className="group flex flex-col items-center gap-3 p-4 bg-white border-2 border-red-50 rounded-3xl hover:border-red-200 hover:bg-red-50/50 transition-all active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <RotateCcw size={20} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900">Again</p>
                <p className="text-[10px] font-bold text-red-400 uppercase mt-0.5">Key 1</p>
              </div>
            </button>

            <button
              onClick={() => handleEvaluation("hard")}
              className="group flex flex-col items-center gap-3 p-4 bg-white border-2 border-amber-50 rounded-3xl hover:border-amber-200 hover:bg-amber-50/50 transition-all active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target size={20} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900">Hard</p>
                <p className="text-[10px] font-bold text-amber-400 uppercase mt-0.5">Key 2</p>
              </div>
            </button>

            <button
              onClick={() => handleEvaluation("good")}
              className="group flex flex-col items-center gap-3 p-4 bg-white border-2 border-blue-50 rounded-3xl hover:border-blue-200 hover:bg-blue-50/50 transition-all active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles size={20} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900">Good</p>
                <p className="text-[10px] font-bold text-blue-400 uppercase mt-0.5">Key 3</p>
              </div>
            </button>

            <button
              onClick={() => handleEvaluation("easy")}
              className="group flex flex-col items-center gap-3 p-4 bg-white border-2 border-emerald-50 rounded-3xl hover:border-emerald-200 hover:bg-emerald-50/50 transition-all active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle size={20} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900">Easy</p>
                <p className="text-[10px] font-bold text-emerald-400 uppercase mt-0.5">Key 4</p>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-auto pt-8 flex items-center gap-12 flex-shrink-0">
          <button 
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className="flex flex-col items-center gap-2 group disabled:opacity-20 transition-all"
          >
            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-accent group-hover:text-accent transition-all">
              <ChevronLeft size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-accent">Prev</span>
          </button>

          <div className="h-12 w-px bg-slate-100" />

          <button 
            onClick={handleNext}
            className="flex flex-col items-center gap-2 group transition-all"
          >
            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-accent group-hover:text-accent transition-all">
              <ChevronRight size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-accent">
              {currentIndex === queue.length - 1 ? 'Finish' : 'Skip'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashCardStudyPage;
