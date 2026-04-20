import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { message, Skeleton, Input, Empty, Modal, Spin, Result, Button } from "antd";
import { ArrowLeft, Clock, ChevronLeft, ChevronRight, CheckCircle, Info, Music, Sparkles } from "lucide-react";
import { getSectionContentAPI } from "../../service/api/api.exam";
import { gradeWritingAPI, createSubmissionAPI } from "../../service/api/api.submission";
import { useAuth } from "../../hook/useAuth";

// ─── Utility: strip all audio/media elements from raw HTML string ───────────
const stripAudioFromHtml = (html = "") => {
  if (!html) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  doc.querySelectorAll("audio, video").forEach((el) => el.remove());
  doc.querySelectorAll(".mejs-container, .mejs-audio, .wp-audio-shortcode, .audio-player, [class*='audio'], [id*='audio']").forEach((el) => el.remove());
  doc.querySelectorAll("p, div").forEach((el) => {
    if (!el.textContent.trim() && !el.querySelector("img, table, ul, ol")) el.remove();
  });
  return doc.body.innerHTML;
};

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

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mb-10 rounded-[20px] bg-white border border-slate-200 shadow-md overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="bg-white/20 p-2 rounded-lg"><Music size={16} className="text-white" /></div>
        <div>
          <p className="text-white font-bold text-sm leading-none">Listening Audio</p>
          <p className="text-blue-100 text-[10px] uppercase tracking-widest mt-1">Please listen carefully and answer the questions</p>
        </div>
      </div>
      <div className="px-5 py-4">
        <audio ref={audioRef} src={url} onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)} onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)} onEnded={() => setIsPlaying(false)} />
        <div className="h-2 bg-slate-100 rounded-full cursor-pointer mb-3 relative group" onClick={handleSeek}>
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${progress}% - 6px)` }} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow active:scale-95 shrink-0">
            {isPlaying ? <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="1" width="4" height="12" rx="1" /><rect x="8" y="1" width="4" height="12" rx="1" /></svg> : <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 1.5l10 5.5-10 5.5V1.5z" /></svg>}
          </button>
          <span className="text-xs font-mono text-slate-400">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <div className="flex items-center gap-2 ml-auto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
            <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => { const v = parseFloat(e.target.value); setVolume(v); if (audioRef.current) audioRef.current.volume = v; }} className="w-20 accent-blue-500 h-1 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const PracticePage = () => {
  const { examId, sectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { audioUrl, sectionTitle } = location.state || {};

  const [passages, setPassages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600);

  const [isGrading, setIsGrading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const fetchSectionContent = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getSectionContentAPI(sectionId);
      // Axios customize bóc tách rồi, nên res là root JSON
      const data = res?.data || res;
      if (data) setPassages(Array.isArray(data) ? data : (data.passages || []));
    } catch (err) {
      console.error("Fetch content error:", err);
      message.error("Không thể tải nội dung bài thi!");
    } finally {
      setIsLoading(false);
    }
  }, [sectionId]);

  useEffect(() => { if (sectionId) fetchSectionContent(); }, [sectionId, fetchSectionContent]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId, value) => setAnswers((prev) => ({ ...prev, [questionId]: value }));

  const handleSubmit = async () => {
    const learnerIdValue = user?.learnerId || user?.id;
    if (!learnerIdValue) { message.error("Vui lòng đăng nhập để nộp bài!"); return; }
    if (!window.confirm("Bạn có chắc chắn muốn nộp bài?")) return;
    try {
      setIsSubmitting(true);
      const allQuestions = passages.flatMap((p) => p.questions || []);
      const submissionAnswerRequests = allQuestions.map(q => ({
        questionId: q.id,
        answerText: answers[q.id] || "",
        answerQuestion: q.content 
      }));
      const payload = { learnerId: learnerIdValue, examId: examId, submissionAnswerRequests };
      const res = await createSubmissionAPI(payload);
      if (res && (res.status === 200 || res.status === 201)) {
        message.success("Đã nộp bài thành công!");
        setSubmissionResult(res.data?.data || res.data);
        setShowResultModal(true);
      }
    } catch (err) { message.error("Lỗi khi nộp bài!"); }
    finally { setIsSubmitting(false); }
  };

  const handleAIScore = async (questionId) => {
    const answerText = answers[questionId];
    if (!answerText || answerText.trim().length < 50) { message.warning("Bài viết quá ngắn!"); return; }
    try {
      setIsGrading(true); setShowAiModal(true); setAiResult(null);
      const res = await gradeWritingAPI(questionId, answerText);
      if (res) setAiResult(res.data?.data || res.data);
    } catch (err) { setShowAiModal(false); }
    finally { setIsGrading(false); }
  };

  const allQuestions = passages.flatMap((p) => p.questions || []);
  const isWritingMode = (q) => {
    const type = (q.type || "").toLowerCase();
    const content = (q.content || "").toLowerCase();
    return type.includes("writing") || content.includes("write a") || allQuestions.length === 1;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-gray-900">
      <div className="bg-[#060d1a] border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-[100] shadow-xl">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/exams/${examId}`)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400"><ArrowLeft size={20} /></button>
          <div>
            <h2 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] leading-none mb-1.5">IELTS Simulation</h2>
            <h1 className="text-base font-bold text-white leading-none">{isLoading ? "Đang tải..." : sectionTitle || "Phần thi thực hành"}</h1>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold border ${timeLeft < 300 ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-blue-500/10 border-blue-500/20 text-blue-400"}`}><Clock size={18} />{formatTime(timeLeft)}</div>
          <button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg disabled:bg-slate-500">{isSubmitting ? <Spin size="small" /> : <CheckCircle size={18} />} Nộp bài</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 overflow-y-auto p-10 bg-white border-r border-gray-200 custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            {audioUrl && <AudioPlayer url={audioUrl} />}
            {isLoading ? <Skeleton active paragraph={{ rows: 12 }} /> : passages.length > 0 ? passages.map((passage, idx) => (
              <div key={passage.id || idx} className="mb-12 last:mb-0">
                {passage.instruction && <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8 flex gap-4"><Info className="text-blue-500 shrink-0 mt-0.5" size={20} /><p className="text-blue-800 font-medium text-sm leading-relaxed">{passage.instruction}</p></div>}
                <div className="ielts-content-renderer" dangerouslySetInnerHTML={{ __html: stripAudioFromHtml(passage.content_html || passage.passageHtml), }} />
              </div>
            )) : <Empty description="Không có nội dung" />}
          </div>
        </div>

        <div className="w-1/2 overflow-y-auto p-10 bg-[#f1f5f9] custom-scrollbar">
          <div className="max-w-2xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8 text-slate-800">
              <h3 className="text-xl font-bold flex items-center gap-3"><span className="bg-slate-800 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-mono">Q</span>Câu hỏi luyện tập</h3>
              <span className="text-xs font-bold text-slate-400 font-mono tracking-widest uppercase">{allQuestions.length} Questions</span>
            </div>

            {isLoading ? <div className="space-y-6">{[1, 2].map(i => <div key={i} className="bg-white p-8 rounded-3xl"><Skeleton active /></div>)}</div> : allQuestions.length === 0 ? <Empty description="Không có câu hỏi" /> : allQuestions.map((q) => {
              const isWriting = isWritingMode(q);
              const type = q.type?.toUpperCase() || "";
              let optionList = q.answers || q.options || q.questionAnswers || [];
              
              // Tự động tạo lựa chọn cho dạng TRUE_FALSE nếu database bị trống
              if (type === "TRUE_FALSE" && optionList.length === 0) {
                optionList = [
                  { id: "tf-1", content: "TRUE" },
                  { id: "tf-2", content: "FALSE" },
                  { id: "tf-3", content: "NOT GIVEN" }
                ];
              }

              // Chỉ coi là dạng chọn nếu có danh sách lựa chọn thực tế
              const isChoiceType = (type === "MULTIPLE_CHOICE" || type === "TRUE_FALSE" || type === "MULTIPLE_ANSWER") && optionList.length > 0;

              return (
                <div key={q.id} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:border-blue-400 transition-all group relative overflow-hidden mb-8">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-500 transition-colors" />
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-blue-600 font-mono">#{q.question_number}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">{q.type}</span>
                    </div>
                  </div>

                  <div className="mb-6 text-slate-800 font-bold leading-relaxed ielts-question-text" dangerouslySetInnerHTML={{ __html: q.question_text || q.content }} />
                  
                  {isWriting ? (
                    <div className="space-y-4">
                      <Input.TextArea placeholder="Nhập bài viết..." className="ielts-input writing-textarea" autoSize={{ minRows: 12, maxRows: 30 }} value={answers[q.id] || ""} onChange={(e) => handleAnswerChange(q.id, e.target.value)} />
                      <div className="flex justify-end pt-3.5"><button onClick={() => handleAIScore(q.id)} className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20 active:scale-95"><Sparkles size={18} /> Chấm điểm AI</button></div>
                    </div>
                  ) : isChoiceType ? (
                    <div className="grid grid-cols-1 gap-3">
                      {optionList.map((opt, index) => {
                        const label = String.fromCharCode(65 + index); // A, B, C, D...
                        const content = opt.content || opt.answerText;
                        const isSelected = answers[q.id] === content;
                        
                        return (
                          <label key={opt.id} className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? "bg-blue-50 border-blue-500 shadow-sm" : "bg-white border-slate-100 hover:border-blue-100"}`}>
                            <input type="radio" name={`q-${q.id}`} className="hidden" checked={isSelected} onChange={() => handleAnswerChange(q.id, content)} />
                            <div className={`w-8 h-8 rounded-lg border-2 mr-4 flex items-center justify-center shrink-0 font-bold transition-all ${isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-slate-200 text-slate-400"}`}>
                              {label}
                            </div>
                            <span className={`font-medium pt-1 transition-colors ${isSelected ? "text-blue-900 font-bold" : "text-slate-600"}`}>
                              {content}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Answer:</p>
                      <Input placeholder="Type your answer here (e.g. TRUE, FALSE, or your answer)..." className="ielts-input-field" value={answers[q.id] || ""} onChange={(e) => handleAnswerChange(q.id, e.target.value)} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-8 py-5 flex items-center justify-between shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-[110]">
        <div className="flex gap-2.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {allQuestions.map((q) => (
            <button key={q.id} className={`w-11 h-11 shrink-0 rounded-2xl font-bold text-sm transition-all border-2 ${answers[q.id] ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white border-slate-100 text-slate-400 hover:border-blue-400"}`}>{q.question_number}</button>
          ))}
        </div>
        <div className="flex gap-4 shrink-0">
          <button className="hidden sm:flex items-center gap-2 px-8 py-3 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"><ChevronLeft size={20} /> Trước đó</button>
          <button className="flex items-center gap-2 px-10 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-blue-600 transition-all shadow-xl active:scale-95">Tiếp theo <ChevronRight size={20} /></button>
        </div>
      </div>

      <Modal title={<div className="flex items-center gap-2 text-purple-600"><Sparkles size={20} /><span className="font-bold text-lg">Phân tích chi tiết từ chuyên gia AI</span></div>} open={showAiModal} onCancel={() => setShowAiModal(false)} footer={[<Button key="close" type="primary" onClick={() => setShowAiModal(false)} className="rounded-lg bg-purple-600">Đã hiểu</Button>]} width={900} centered className="ai-modal">
        {isGrading ? <div className="py-24 flex flex-col items-center justify-center gap-5"><div className="relative"><Spin size="large" /><Sparkles className="absolute -top-2 -right-2 text-purple-400 animate-pulse" size={20} /></div><div className="text-center"><p className="text-slate-600 font-bold text-lg">AI đang chấm điểm bài viết...</p></div></div> : aiResult ? <div className="space-y-8 max-h-[75vh] overflow-y-auto pr-3 custom-scrollbar p-1"><div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex items-center justify-between gap-6"><div><h4 className="text-purple-100 font-bold uppercase tracking-widest text-xs mb-2">Estimated IELTS Band</h4><div className="flex items-baseline gap-2"><span className="text-6xl font-black">{aiResult.band || "N/A"}</span><span className="text-purple-200 font-medium">/ 9.0</span></div></div></div></div> : <Empty description="Không có kết quả phân tích" />}
      </Modal>

      <Modal title="Kết quả bài thi" open={showResultModal} onCancel={() => setShowResultModal(false)} footer={[<Button key="back" onClick={() => navigate(`/exams/${examId}`)}>Quay lại trang đề thi</Button>]} width={600} centered><Result status="success" title="Nộp bài thành công!" subTitle={submissionResult?.score !== undefined ? `Điểm của bạn: ${submissionResult.score}/${allQuestions.length}` : "Bài thi của bạn đang được hệ thống xử lý chấm điểm."} /></Modal>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .ielts-content-renderer { color: #334155; font-size: 1.0625rem; line-height: 1.85; }
        .ielts-content-renderer p { margin-bottom: 0.75rem; }
        .ielts-input { padding: 0.875rem 1.125rem !important; border-radius: 0.875rem !important; border: 1.5px solid #e2e8f0 !important; font-size: 0.9375rem !important; transition: all 0.2s !important; }
        .ielts-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.1) !important; }
        input[type='range'] { -webkit-appearance: none; background: #e2e8f0; border-radius: 99px; height: 3px; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #3b82f6; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default PracticePage;
