import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  message, Skeleton, Input, Empty, Modal, Spin, 
  Progress, Tag, Button as AntButton, Pagination 
} from "antd";
import { 
  ArrowLeft, CheckCircle, Info, Music, Play, 
  ChevronRight, Filter, BookOpen, Headset, 
  PenTool, Sparkles, Lightbulb, Check, X, Eye, 
  Trophy, Mic, Layers
} from "lucide-react";
import { getWrongAnswersAPI, submitWrongAnswerReviewAPI } from "../../service/api/api.practice";
import { useAuth } from "../../hook/useAuth";

// ─── Constants Based on API Spec ───
const SKILLS = [
  { id: "ALL", label: "All Skills", icon: <Sparkles size={16} /> },
  { id: "LISTENING", label: "Listening", icon: <Headset size={16} /> },
  { id: "READING", label: "Reading", icon: <BookOpen size={16} /> },
  { id: "WRITING", label: "Writing", icon: <PenTool size={16} /> },
  { id: "SPEAKING", label: "Speaking", icon: <Mic size={16} /> },
];

const QUESTION_TYPES = [
  { id: "ALL", label: "All Types" },
  { id: "MULTIPLE_CHOICE", label: "Multiple Choice" },
  { id: "TRUE_FALSE_NOT_GIVEN", label: "True/False/Not Given" },
  { id: "MATCHING_HEADINGS", label: "Matching Headings" },
  { id: "SENTENCE_COMPLETION", label: "Sentence Completion" },
  { id: "SUMMARY_COMPLETION", label: "Summary Completion" },
];

// ─── Sub-Components ───

const cleanPassageContent = (html) => {
  if (!html) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  
  // Remove default players and duplicate audio elements
  doc.querySelectorAll("audio, video, .plyr, .plyr__controls, .audio-player, .wp-audio-shortcode").forEach(el => el.remove());
  
  // Remove common IELTS recording labels that clutter the UI
  const labels = doc.querySelectorAll("p, div, span, h3, h4");
  labels.forEach(el => {
    const text = el.textContent.trim().toLowerCase();
    if (
      /^recording \d+$/.test(text) || 
      text.includes("00:00") ||
      (text.includes("recording") && text.length < 15)
    ) {
      el.remove();
    }
  });

  return doc.body.innerHTML;
};

const ProgressRing = ({ mastered, total }) => {
  const percentage = total > 0 ? Math.round((mastered / total) * 100) : 0;
  return (
    <div className="relative flex items-center justify-center">
      <Progress
        type="circle"
        percent={percentage}
        strokeColor={{ "0%": "#10b981", "100%": "#34d399" }}
        trailColor="#f1f5f9"
        strokeWidth={10}
        width={80}
        format={() => (
          <div className="flex flex-col items-center">
            <span className="text-xl font-black text-slate-800 leading-none">{mastered}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Solved</span>
          </div>
        )}
      />
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
    <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10 text-opacity-100`}>
      <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-xl font-black text-slate-800 leading-tight">{value}</p>
    </div>
  </div>
);

const AudioPlayer = ({ url }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  return (
    <div className="mb-6 rounded-3xl bg-slate-900 p-4 shadow-xl shadow-slate-200">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="flex items-center gap-4">
        <button 
          onClick={togglePlay} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-400 transition-all active:scale-90 shrink-0"
        >
          {isPlaying ? <X size={18} /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </button>
        <div className="flex-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-widest">
            <span>Listening Context</span>
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MistakeLabPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // API Data State
  const [groups, setGroups] = useState([]);
  const [meta, setMeta] = useState({
    totalQuestions: 0,
    totalWrongQuestions: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [masteredThisSession, setMasteredThisSession] = useState(0);
  
  // Filters
  const [skillFilter, setSkillFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [page, setPage] = useState(0);

  const learnerId = user?.learnerId || user?.id;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getWrongAnswersAPI(learnerId, {
        skill: skillFilter,
        type: typeFilter,
        page: page,
        size: meta.pageSize
      });
      
      const payload = res.data;
      if (payload) {
        setGroups(payload.groups || []);
        setMeta({
          totalQuestions: payload.totalQuestions || 0,
          totalWrongQuestions: payload.totalWrongQuestions || 0,
          totalPages: payload.totalPages || 0,
          currentPage: payload.currentPage || 0,
          pageSize: payload.pageSize || 10
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      message.error("Unable to load mistakes!");
    } finally {
      setIsLoading(false);
    }
  }, [learnerId, skillFilter, typeFilter, page, meta.pageSize]);

  useEffect(() => {
    if (learnerId) fetchData();
  }, [fetchData, learnerId]);

  const handleAnswerChange = (questionId, value, answerId = null) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { text: value, id: answerId }
    }));
  };

  const handleQuestionSubmit = async (questionId) => {
    try {
      setIsSubmitting(true);
      const answer = answers[questionId];
      if (!answer) {
        message.warning("Please provide an answer first!");
        return;
      }

      const payload = {
        answers: [{
          questionId: questionId,
          answerId: answer.id || null,
          answerText: answer.text || null
        }]
      };

      const res = await submitWrongAnswerReviewAPI(learnerId, payload);
      const correctCount = res.data || 0; // API returns integer as per spec
      const isCorrect = correctCount > 0;

      setFeedback(prev => ({
        ...prev,
        [questionId]: { status: isCorrect ? "CORRECT" : "WRONG" }
      }));

      if (isCorrect) {
        setMasteredThisSession(prev => prev + 1);
        message.success("Brilliant! You've mastered this question.");
      } else {
        message.error("Not quite. Check the context and try again.");
      }
    } catch (err) {
      message.error("Submission failed!" + (err.response?.data?.message ? ` (${err.response.data.message})` : ""));
    } finally {
      setIsSubmitting(false);
    }
  };

  const [hintVisible, setHintVisible] = useState({});
  const toggleHint = (qId) => {
    setHintVisible(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  if (isLoading && groups.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-8 flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-8">
          <Skeleton active avatar paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-['Inter'] text-slate-800">
      {/* ─── Header & Global Stats ─── */}
      <header className="bg-white border-b border-slate-100 px-8 py-6 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 group"
            >
              <ArrowLeft size={20} className="group-hover:text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                Smart Review Lab <Sparkles size={20} className="text-blue-500 fill-blue-500 animate-pulse" />
              </h1>
              <p className="text-slate-400 text-sm font-medium">Focused learning from your past mistakes.</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex gap-4">
              <StatCard 
                label="Remaining" 
                value={meta.totalWrongQuestions} 
                icon={Layers} 
                colorClass="bg-rose-500" 
              />
              <StatCard 
                label="Daily Streak" 
                value="12 Days" 
                icon={Trophy} 
                colorClass="bg-orange-500" 
              />
            </div>
            <div className="pl-6 border-l border-slate-100">
              <ProgressRing mastered={masteredThisSession} total={meta.totalQuestions} />
            </div>
          </div>
        </div>
      </header>

      {/* ─── Smart Filter Bar ─── */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-3 sticky top-[97px] z-40">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              {SKILLS.map(skill => (
                <button
                  key={skill.id}
                  onClick={() => { setSkillFilter(skill.id); setPage(0); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    skillFilter === skill.id 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {skill.icon}
                  <span className="hidden sm:inline">{skill.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
              <Filter size={14} className="text-slate-400" />
              <select 
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
                className="bg-transparent border-none text-sm font-bold text-slate-600 outline-none cursor-pointer"
              >
                {QUESTION_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
            
            <div className="h-6 w-px bg-slate-200 mx-2" />
            
            <Pagination 
              simple 
              current={page + 1} 
              total={meta.totalPages * 10} 
              onChange={(p) => setPage(p - 1)}
              size="small"
            />
          </div>
        </div>
      </div>

      {/* ─── Main Content: Grouped Layout ─── */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
          {isLoading ? (
            <div className="space-y-12">
              {[1, 2].map(i => <Skeleton key={i} active paragraph={{ rows: 12 }} />)}
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 animate-in fade-in zoom-in duration-700">
              <div className="w-64 h-64 bg-emerald-50 rounded-full flex items-center justify-center mb-10 border-4 border-emerald-100">
                <CheckCircle size={120} className="text-emerald-500" strokeWidth={1} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Zero Mistakes Left!</h2>
              <p className="text-slate-500 text-lg font-medium max-w-md text-center">Your mistake list is empty for these filters. Keep up the amazing work!</p>
              <AntButton 
                type="primary" 
                size="large" 
                className="mt-10 h-16 px-12 rounded-2xl font-black bg-blue-600 border-none shadow-xl hover:shadow-blue-200 active:scale-95"
                onClick={() => { setSkillFilter("ALL"); setTypeFilter("ALL"); setPage(0); }}
              >
                Refresh All Mistakes
              </AntButton>
            </div>
          ) : (
            groups.map((group, gIdx) => (
              <div 
                key={group.passageId || gIdx} 
                className="bg-white rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden flex flex-col lg:flex-row h-[850px] animate-in slide-in-from-bottom-8 duration-500"
              >
                {/* ─── LEFT: CONTEXT PANEL ─── */}
                <div className="lg:w-3/5 border-r border-slate-100 flex flex-col h-full">
                  <div className="p-10 border-b border-slate-50 bg-slate-50/40">
                    <div className="flex items-center justify-between mb-4">
                      <Tag className="rounded-xl font-black px-4 py-1.5 border-none bg-blue-600 text-white uppercase text-[10px] tracking-[0.2em]">
                        {group.audioUrl ? "Listening Context" : "Reading Passage"}
                      </Tag>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 leading-tight">Context Reference</h3>
                  </div>

                  <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-white">
                    {group.audioUrl && <AudioPlayer url={group.audioUrl} />}
                    {group.passageHtml ? (
                      <div 
                        className="passage-typography text-slate-700 leading-[2] text-xl font-['Lora']"
                        dangerouslySetInnerHTML={{ __html: cleanPassageContent(group.passageHtml) }}
                      />
                    ) : (
                      <div className="h-full flex flex-center items-center justify-center opacity-30 italic font-medium">
                        No text content for this section.
                      </div>
                    )}
                  </div>
                </div>

                {/* ─── RIGHT: QUESTION PANEL ─── */}
                <div className="lg:w-2/5 flex flex-col h-full bg-slate-50/30">
                  <div className="p-10 border-b border-slate-100 bg-white">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Info size={16} /></div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Group Instructions</h4>
                    </div>
                    <p className="text-slate-700 font-bold leading-relaxed">{group.instruction || "Answer the questions based on the provided context."}</p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                    {group.questions?.map((q) => {
                      const fb = feedback[q.id];
                      const isCorrect = fb?.status === "CORRECT";
                      const isWrong = fb?.status === "WRONG";

                      return (
                        <div 
                          key={q.id}
                          className={`p-8 rounded-[40px] transition-all duration-500 border-2 ${
                            isCorrect ? "bg-emerald-50 border-emerald-400 shadow-xl shadow-emerald-500/10" :
                            isWrong ? "bg-rose-50 border-rose-200" :
                            "bg-white border-slate-100 hover:border-blue-200 shadow-sm"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                              <span className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-lg transition-colors shadow-sm ${
                                isCorrect ? "bg-emerald-500 text-white" : "bg-slate-900 text-white"
                              }`}>
                                {q.questionNumber}
                              </span>
                              {isCorrect && (
                                <span className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest animate-in zoom-in">
                                  <Check size={14} strokeWidth={4} /> Mastered
                                </span>
                              )}
                            </div>
                            <Tag className="font-bold border-none bg-slate-100 text-slate-500 uppercase text-[9px] px-2 py-0.5 rounded-lg">
                              {q.type?.replace(/_/g, ' ')}
                            </Tag>
                          </div>

                          <div 
                            className="text-xl font-bold text-slate-800 mb-8 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: q.questionText }}
                          />

                          {/* ─── Question Inputs ─── */}
                          <div className="space-y-6">
                            {(q.type === "MULTIPLE_CHOICE" || q.answers?.length > 0) ? (
                              <div className="grid grid-cols-1 gap-3">
                                {q.answers?.map((opt, idx) => {
                                  const label = String.fromCharCode(65 + idx);
                                  const isSelected = answers[q.id]?.id === opt.id;
                                  return (
                                    <label key={opt.id} className={`flex items-start p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                                      isSelected ? "bg-blue-50 border-blue-500 ring-4 ring-blue-500/5" : "bg-white border-slate-50 hover:border-blue-100"
                                    }`}>
                                      <input 
                                        type="radio" name={`q-${q.id}`} className="hidden" 
                                        onChange={() => handleAnswerChange(q.id, opt.content, opt.id)}
                                        disabled={isCorrect || isSubmitting}
                                      />
                                      <div className={`w-10 h-10 rounded-xl border-2 mr-4 flex items-center justify-center shrink-0 font-bold transition-all ${
                                        isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-slate-100 text-slate-400 bg-slate-50"
                                      }`}>
                                        {label}
                                      </div>
                                      <span className={`font-bold pt-2 transition-colors ${isSelected ? "text-blue-900" : "text-slate-600"}`}>
                                        {opt.content}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            ) : (
                              <Input 
                                placeholder="Type your answer..." 
                                className={`h-16 rounded-[20px] border-2 px-6 font-bold text-lg transition-all ${
                                  isCorrect ? "bg-white border-emerald-500 text-emerald-700" :
                                  isWrong ? "bg-white border-rose-400 text-rose-700" :
                                  "bg-slate-50 border-slate-100 focus:border-blue-500 focus:bg-white"
                                }`}
                                value={answers[q.id]?.text || ""}
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                disabled={isCorrect || isSubmitting}
                                onPressEnter={() => handleQuestionSubmit(q.id)}
                              />
                            )}

                            {/* ─── Actions ─── */}
                            <div className="flex gap-3 pt-2">
                              {!isCorrect && (
                                <>
                                  <button
                                    onClick={() => handleQuestionSubmit(q.id)}
                                    disabled={isSubmitting}
                                    className="flex-1 h-14 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all active:scale-95 disabled:bg-slate-300 shadow-lg shadow-slate-200"
                                  >
                                    {isSubmitting ? <Spin size="small" /> : "Check Answer"}
                                  </button>
                                  <button
                                    onClick={() => toggleHint(q.id)}
                                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
                                  >
                                    <Lightbulb size={22} className={hintVisible[q.id] ? "text-amber-500 fill-amber-500" : ""} />
                                  </button>
                                </>
                              )}
                              {isCorrect && (
                                <button
                                  className="flex-1 h-14 bg-emerald-100 text-emerald-700 rounded-2xl font-black text-sm hover:bg-emerald-200 transition-all flex items-center justify-center gap-2"
                                  onClick={() => message.info("Detailed explanation coming soon!")}
                                >
                                  <Eye size={20} /> View Breakdown
                                </button>
                              )}
                            </div>

                            {hintVisible[q.id] && !isCorrect && (
                              <div className="p-5 bg-amber-50 border border-amber-100 rounded-[24px] animate-in slide-in-from-top-4 duration-300">
                                <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                                  <Sparkles size={12} strokeWidth={3} /> Smart Hint
                                </p>
                                <p className="text-sm text-amber-900 leading-relaxed italic font-medium">
                                  {q.skill === "READING" 
                                    ? "Scan the passage for keywords mentioned in the question. Focus on the relationship between entities." 
                                    : "Listen carefully for synonyms of the words in the question. The answer usually follows a signpost word."
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* ─── Global Pagination ─── */}
          {meta.totalPages > 1 && (
            <div className="flex justify-center pt-8">
              <Pagination 
                current={page + 1} 
                total={meta.totalPages * 10} 
                onChange={(p) => setPage(p - 1)}
                className="premium-pagination"
              />
            </div>
          )}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        
        .passage-typography p { margin-bottom: 2rem; }
        .passage-typography b, .passage-typography strong { color: #0f172a; font-weight: 800; }
        .passage-typography { font-family: 'Lora', serif; letter-spacing: -0.01em; }

        .premium-pagination .ant-pagination-item { border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 700; }
        .premium-pagination .ant-pagination-item-active { border-color: #3b82f6; background: #3b82f6; }
        .premium-pagination .ant-pagination-item-active a { color: white !important; }
      `}</style>
    </div>
  );
};

export default MistakeLabPage;
