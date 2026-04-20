import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { message, Skeleton, Input, Empty, Modal, Spin, Result, Button } from "antd";
import { ArrowLeft, Clock, CheckCircle, Info, Home, RotateCcw, Music, Play, ChevronRight, ChevronLeft } from "lucide-react";
import { getWrongAnswersAPI, submitWrongAnswerReviewAPI } from "../../service/api/api.practice";
import { useAuth } from "../../hook/useAuth";

// ─── Custom Audio Player ─────────────────────────────────────────────────────
const AudioPlayer = ({ url }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const newTime = pct * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="mb-8 rounded-[24px] bg-white border border-slate-200 shadow-xl overflow-hidden sticky top-0 z-[50] animate-in slide-in-from-top duration-500">
      <div className="flex items-center gap-3 px-6 py-4 bg-[#0f172a]">
        <div className="bg-blue-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20"><Music size={18} /></div>
        <div>
          <p className="text-white font-bold text-sm">IELTS Listening Audio</p>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest font-medium">Review Mode Active</p>
        </div>
      </div>
      <div className="px-6 py-5 bg-white">
        <audio
          ref={audioRef}
          src={url}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={() => setIsPlaying(false)}
        />
        <div className="h-1.5 bg-slate-100 rounded-full cursor-pointer mb-4 relative group" onClick={handleSeek}>
          <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <button onClick={togglePlay} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg active:scale-90">
            {isPlaying ? <svg width="16" height="16" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="1" width="4" height="12" rx="1" /><rect x="8" y="1" width="4" height="12" rx="1" /></svg> : <Play size={20} className="ml-1" fill="currentColor" />}
          </button>
          <span className="text-xs font-mono font-bold text-slate-500">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => {
            const v = parseFloat(e.target.value);
            setVolume(v);
            if (audioRef.current) audioRef.current.volume = v;
          }} className="w-20 accent-blue-600 h-1 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

const WrongAnswerPracticePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessionData, setSessionData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  
  const questionRefs = useRef({});
  const scrollContainerRef = useRef(null);

  const learnerId = user?.learnerId || user?.id;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getWrongAnswersAPI(learnerId, 10);
      const payload = res?.data; 
      
      if (payload) {
        setSessionData(payload);
        const qList = (payload.questions || []).sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0));
        setQuestions(qList);
        
        let foundUrl = payload.audioUrl || null;
        if (!foundUrl) {
          const searchString = JSON.stringify(payload);
          const urlRegex = /https?:\/\/[^"'\s]+\.(?:mp3|wav|ogg|m4a)/i;
          const match = searchString.match(urlRegex);
          if (match) foundUrl = match[0].replace(/\\/g, '');
        }
        setAudioUrl(foundUrl);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      message.error("Không thể tải câu hỏi ôn tập!");
    } finally {
      setIsLoading(false);
    }
  }, [learnerId]);

  useEffect(() => {
    if (learnerId) fetchData();
  }, [learnerId, fetchData]);

  const scrollToQuestion = (id) => {
    questionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const cleanPassage = useMemo(() => {
    if (questions.length === 0) return null;
    let html = questions[0].passageHtml || "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    doc.querySelectorAll(".plyr, .plyr__controls, audio, video").forEach(el => el.remove());
    return doc.body.innerHTML;
  }, [questions]);

  const handleAnswerChange = (questionId, value, answerId = null) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { text: value, id: answerId }
    }));
  };

  const handleSubmit = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn nộp bài?")) return;
    try {
      setIsSubmitting(true);
      const payload = {
        answers: questions.map(q => ({
          questionId: q.id,
          answerId: q.type?.toUpperCase().includes("CHOICE") ? (answers[q.id]?.id || null) : null,
          answerText: !q.type?.toUpperCase().includes("CHOICE") ? (answers[q.id]?.text || "") : null
        }))
      };
      const res = await submitWrongAnswerReviewAPI(learnerId, payload);
      if (res && (res.status === 200 || res.status === 201)) {
        const correctCount = res.data?.correctCount || res.correctCount || 0; 
        setResultData({ correct: correctCount, total: questions.length });
        setShowResult(true);
      }
    } catch (err) { message.error("Lỗi khi nộp bài!"); }
    finally { setIsSubmitting(false); }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 text-center border border-slate-100 animate-in zoom-in duration-300">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner"><CheckCircle size={48} /></div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Hoàn thành!</h2>
          <div className="bg-slate-50 rounded-[32px] p-8 mb-10 border border-slate-100 mt-6"><div className="text-6xl font-black text-blue-600 mb-2">{resultData?.correct || 0}<span className="text-2xl text-slate-200 mx-2">/</span>{resultData?.total || 0}</div><div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Câu trả lời đúng</div></div>
          <div className="space-y-4"><button onClick={() => { setShowResult(false); setAnswers({}); fetchData(); }} className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"><RotateCcw size={20} /> Ôn tập tiếp</button><button onClick={() => navigate("/exams")} className="w-full flex items-center justify-center gap-3 py-5 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-black hover:bg-slate-50 transition-all active:scale-95"><Home size={20} /> Về trang đề thi</button></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-gray-900">
      {/* TOPBAR */}
      <div className="bg-[#0f172a] border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-[100] shadow-xl">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400"><ArrowLeft size={20} /></button>
          <div>
            <h2 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-1 leading-none">Review Mode</h2>
            <h1 className="text-base font-bold text-white leading-none">Ôn tập câu sai ({questions.length} câu)</h1>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400"><Clock size={18} /> {formatTime(timeLeft)}</div>
          <button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:bg-slate-500">
            {isSubmitting ? <Spin size="small" /> : <CheckCircle size={18} />} Nộp bài
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Passage */}
        <div className="w-1/2 overflow-y-auto p-10 bg-white border-r border-slate-200 custom-scrollbar ielts-passage-container">
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 20 }} />
            ) : (
              <>
                {audioUrl ? <AudioPlayer url={audioUrl} /> : (
                  <div className="mb-8 p-6 bg-blue-50/50 border-2 border-dashed border-blue-100 rounded-[2rem] text-center">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm text-blue-500"><Music size={24} /></div>
                    <p className="text-blue-900 font-bold text-sm">Chế độ ôn tập bài đọc/nghe</p>
                  </div>
                )}
                <div className="ielts-content-renderer" dangerouslySetInnerHTML={{ __html: cleanPassage }} />
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Questions */}
        <div ref={scrollContainerRef} className="w-1/2 overflow-y-auto p-10 bg-[#f1f5f9] custom-scrollbar">
          <div className="max-w-2xl mx-auto pb-20">
            {isLoading ? (
              <div className="space-y-6">{[1, 2, 3].map(i => <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm"><Skeleton active /></div>)}</div>
            ) : (
              questions.map((q, idx) => (
                <div 
                  key={q.id} 
                  ref={el => questionRefs.current[q.id] = el}
                  className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:border-blue-400 transition-all group relative overflow-hidden mb-8"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-500 transition-colors" />
                  <div className="flex justify-between items-center mb-6">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">{q.questionNumber || idx + 1}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">{q.type}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-6 leading-relaxed ielts-question-text" dangerouslySetInnerHTML={{ __html: q.questionText || `Câu trả lời cho câu số ${q.questionNumber || idx + 1}:` }} />
                  
                  {(() => {
                    const type = q.type?.toUpperCase() || "";
                    let optionList = q.answers || [];
                    
                    if (type === "TRUE_FALSE" && optionList.length === 0) {
                      optionList = [
                        { id: "tf-1", content: "TRUE" },
                        { id: "tf-2", content: "FALSE" },
                        { id: "tf-3", content: "NOT GIVEN" }
                      ];
                    }

                    const isChoiceType = (type === "MULTIPLE_CHOICE" || type === "TRUE_FALSE") && optionList.length > 0;

                    if (isChoiceType) {
                      return (
                        <div className="grid grid-cols-1 gap-3">
                          {optionList.map((opt, optIdx) => {
                            const label = String.fromCharCode(65 + optIdx);
                            const isSelected = answers[q.id]?.id === opt.id;
                            
                            return (
                              <label key={opt.id} className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? "bg-blue-50 border-blue-500 shadow-sm" : "bg-white border-slate-100 hover:border-blue-100"}`}>
                                <input type="radio" name={`q-${q.id}`} className="hidden" checked={isSelected} onChange={() => handleAnswerChange(q.id, opt.content, opt.id)} />
                                <div className={`w-8 h-8 rounded-lg border-2 mr-4 flex items-center justify-center shrink-0 font-bold transition-all ${isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-slate-200 text-slate-400"}`}>
                                  {label}
                                </div>
                                <span className={`font-medium pt-1 transition-colors ${isSelected ? "text-blue-900 font-bold" : "text-slate-600"}`}>{opt.content}</span>
                              </label>
                            );
                          })}
                        </div>
                      );
                    } else {
                      return (
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Answer:</p>
                          <Input placeholder="Type your answer here (e.g. TRUE, FALSE, or your answer)..." className="ielts-input-large" value={answers[q.id]?.text || ""} onChange={(e) => handleAnswerChange(q.id, e.target.value)} />
                        </div>
                      );
                    }
                  })()}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─── NEW: BOTTOM NAVIGATION FOOTER ─── */}
      {!isLoading && questions.length > 0 && (
        <div className="bg-white border-t border-slate-200 px-8 py-4 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-[110]">
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar max-w-[70%] py-1">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id]?.text || answers[q.id]?.id;
              return (
                <button
                  key={q.id}
                  onClick={() => scrollToQuestion(q.id)}
                  className={`w-10 h-10 shrink-0 rounded-xl font-bold text-xs transition-all border-2 flex items-center justify-center
                    ${isAnswered 
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                      : "bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-500"
                    }`}
                >
                  {q.questionNumber || idx + 1}
                </button>
              );
            })}
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#0f172a] text-white font-bold hover:bg-blue-600 transition-all shadow-xl active:scale-95"
            >
              Nộp bài <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .ielts-content-renderer { color: #334155; font-size: 1.05rem; line-height: 1.85; }
        .ielts-content-renderer p { margin-bottom: 1.25rem; }
        .ielts-passage-container .tab-content, .ielts-passage-container .tab-pane { display: block !important; opacity: 1 !important; }
        .ielts-passage-container .nav-pills { display: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .ielts-input-large { padding: 1.25rem !important; border-radius: 1.25rem !important; border: 2px solid #e2e8f0 !important; font-size: 1rem; font-weight: 600 !important; transition: all 0.2s !important; background: #fff !important; }
        .ielts-input-large:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 4px rgba(59,130,246,0.1) !important; }
        input[type='range'] { -webkit-appearance: none; background: #e2e8f0; border-radius: 99px; height: 4px; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #3b82f6; cursor: pointer; border: 2px solid #fff; }
      `}</style>
    </div>
  );
};

export default WrongAnswerPracticePage;
