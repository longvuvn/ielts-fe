import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { message, Skeleton, Empty } from "antd";
import { 
  ArrowLeft, BookOpen, Clock, ChevronRight, Headphones, 
  BookText, PenTool, MessageSquare, Star, Sparkles, 
  Layers, ChevronLeft
} from "lucide-react";
import { getSectionsByExamIdAPI } from "../../service/api/api.exam";
import Button from "../../components/button/button.home";

const ExamDetailPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const examTitleFromState = location.state?.examTitle;

  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSections = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getSectionsByExamIdAPI(examId);
      
      if (res && res.status === 200) {
        setSections(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error("Fetch sections error:", error);
      message.error("Không thể tải danh sách phần thi!");
    } finally {
      setIsLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    if (examId) fetchSections();
  }, [examId, fetchSections]);

  const getSectionTheme = (title) => {
    const t = title?.toLowerCase() || "";
    if (t.includes('listening')) return {
      icon: <Headphones size={24} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      label: 'Listening'
    };
    if (t.includes('reading')) return {
      icon: <BookText size={24} />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      label: 'Reading'
    };
    if (t.includes('writing')) return {
      icon: <PenTool size={24} />,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      label: 'Writing'
    };
    if (t.includes('speaking')) return {
      icon: <MessageSquare size={24} />,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      label: 'Speaking'
    };
    return {
      icon: <BookOpen size={24} />,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      border: 'border-slate-100',
      label: 'General'
    };
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] animate-fade-slide-in flex flex-col">
      {/* TOPBAR */}
      <div className="sticky top-0 z-[100] border-b border-slate-100 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate("/exams")} 
              className="group flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 transition-all font-bold text-sm shadow-sm"
            >
              <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" /> 
              Quay lại thư viện
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <h1 className="text-xl font-bold text-slate-900 m-0 tracking-tight font-display">
              {examTitleFromState || "Chi tiết Đề thi"}
            </h1>
          </div>
          
        </div>
      </div>

      <div className="flex-1 max-w-[1200px] mx-auto w-full px-8 py-12">
        {isLoading ? (
          <div className="space-y-10">
            <div className="h-64 rounded-[40px] bg-white border border-slate-100 animate-pulse shadow-sm" />
            <div className="grid gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-28 rounded-3xl bg-white border border-slate-100 animate-pulse shadow-sm" />
              ))}
            </div>
          </div>
        ) : sections.length > 0 ? (
          <>
            {/* EXAM INFO HERO */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[48px] p-10 lg:p-14 mb-16 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.15)]">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="px-4 py-1.5 rounded-full bg-white/10 text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 backdrop-blur-sm">
                    IELTS Simulation 2024
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 border border-emerald-500/10 backdrop-blur-sm">
                    <Star size={12} fill="currentColor" /> Full Test Practice
                  </span>
                </div>

                <div className="max-w-3xl">
                  <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight font-display">
                    {examTitleFromState || "Bộ đề thi IELTS thực tế"}
                  </h2>
                  <p className="text-slate-400 text-lg lg:text-xl font-medium mb-10 leading-relaxed">
                    Trải nghiệm môi trường thi IELTS thực tế ngay tại nhà. Hệ thống cung cấp đầy đủ các phần thi với giao diện thông minh và chấm điểm chính xác.
                  </p>
                </div>

                <div className="flex flex-wrap gap-10 items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shadow-inner">
                      <Clock size={24} />
                    </div>
                    <div>
                      <div className="text-white text-xl font-black font-mono leading-none">{sections.length * 15}</div>
                      <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1.5">Phút làm bài</div>
                    </div>
                  </div>

                  <div className="h-10 w-px bg-white/10 hidden sm:block" />

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shadow-inner">
                      <Layers size={24} />
                    </div>
                    <div>
                      <div className="text-white text-xl font-black font-mono leading-none">{sections.length}</div>
                      <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1.5">Phần thi (Sections)</div>
                    </div>
                  </div>
                  
                  <div className="ml-auto hidden lg:block">
                    <div className="px-6 py-4 bg-blue-600 rounded-3xl text-white font-bold flex items-center gap-3 shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all cursor-pointer group">
                      Bắt đầu thi ngay
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTIONS LIST */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 font-display flex items-center gap-3">
                Cấu trúc đề thi
                <span className="text-sm font-medium text-slate-400 font-body px-3 py-1 bg-slate-100 rounded-full">
                  {sections.length} phần
                </span>
              </h3>
            </div>
            
            <div className="grid gap-6">
              {sections.map((section, idx) => {
                const theme = getSectionTheme(section.title);
                return (
                  <Link
                    key={section.id}
                    to={`/exams/${examId}/sections/${section.id}`}
                    state={{ audioUrl: section.audio_url, sectionTitle: section.title }}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-7 bg-white border border-slate-100 rounded-[32px] hover:border-blue-200 hover:shadow-[0_20px_40px_rgba(59,130,246,0.06)] transition-all duration-300"
                  >
                    <div className="flex items-center gap-8">
                      <div className="relative">
                        <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center ${theme.bg} ${theme.color} group-hover:scale-110 transition-transform duration-500 shadow-sm border ${theme.border}`}>
                          {theme.icon}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-slate-900 text-white text-[10px] font-black flex items-center justify-center shadow-lg border-2 border-white">
                          {idx + 1}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                           <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${theme.color}`}>
                            {theme.label}
                           </span>
                           <span className="w-1 h-1 rounded-full bg-slate-300" />
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {section.section_number > 0 ? `Section 0${section.section_number}` : 'Practice Section'}
                           </span>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-display tracking-tight">
                          {section.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-6 sm:mt-0">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center shadow-sm border border-slate-100">
                        <ChevronRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="bg-white border border-slate-100 rounded-[48px] p-24 text-center shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
               <BookOpen size={40} className="text-slate-200" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Chưa có nội dung đề thi</h3>
            <p className="text-slate-500 font-medium">Chúng tôi đang cập nhật dữ liệu cho phần thi này. Vui lòng quay lại sau!</p>
            <Button variant="primary" onClick={() => navigate("/exams")} className="mt-10 px-10 h-14 rounded-2xl">
              Quay lại thư viện
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamDetailPage;
