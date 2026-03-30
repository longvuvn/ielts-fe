import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { message, Skeleton, Empty } from "antd";
import { ArrowLeft, BookOpen, Clock, ChevronRight, Headphones, BookText, PenTool, MessageSquare, Star } from "lucide-react";
import { getSectionsByExamIdAPI } from "../../service/api/api.exam";

const ExamDetailPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy tên đề thi từ trang trước truyền sang (nếu có)
  const examTitleFromState = location.state?.examTitle;

  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (examId) fetchSections();
  }, [examId]);

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      const res = await getSectionsByExamIdAPI(examId);
      
      // Theo Postman: res = { data: [...], status: 200, message: "..." }
      if (res && res.status === 200) {
        setSections(res.data || []);
      }
    } catch (error) {
      console.error("Fetch sections error:", error);
      message.error("Không thể tải danh sách phần thi!");
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (title) => {
    const t = title?.toLowerCase() || "";
    if (t.includes('listening')) return <Headphones size={24} className="text-blue-400" />;
    if (t.includes('reading')) return <BookText size={24} className="text-emerald-400" />;
    if (t.includes('writing')) return <PenTool size={24} className="text-amber-400" />;
    if (t.includes('speaking')) return <MessageSquare size={24} className="text-purple-400" />;
    return <BookOpen size={24} className="text-blue-400" />;
  };

  const getBgColor = (title) => {
    const t = title?.toLowerCase() || "";
    if (t.includes('listening')) return 'bg-blue-500/10 border-blue-500/20';
    if (t.includes('reading')) return 'bg-emerald-500/10 border-emerald-500/20';
    if (t.includes('writing')) return 'bg-amber-500/10 border-amber-500/20';
    if (t.includes('speaking')) return 'bg-purple-500/10 border-purple-500/20';
    return 'bg-blue-500/10 border-blue-500/20';
  };

  return (
    <div className="min-h-screen bg-[#060d1a] animate-fade-slide-in pb-20">
      {/* TOPBAR */}
      <div className="sticky top-0 z-[100] px-8 py-6 border-b border-white/5 bg-[#060d1a]/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate("/exams")} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 px-4 py-2 hover:text-white hover:bg-white/10 transition-all font-medium text-sm">
            <ArrowLeft size={16} /> Thư viện đề
          </button>
          <div className="hidden sm:block h-8 w-px bg-white/10" />
          <div>
            <h1 className="text-2xl font-bold font-serif text-white m-0">
              {examTitleFromState || "Chi tiết Đề thi"}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-12">
        {isLoading ? (
          <div className="space-y-6">
            <div className="h-48 rounded-[32px] bg-white/5 animate-pulse" />
            <div className="grid gap-4 mt-12">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />)}
            </div>
          </div>
        ) : sections.length > 0 ? (
          <>
            {/* EXAM INFO CARD */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-10 mb-12 relative overflow-hidden shadow-2xl shadow-blue-900/20">
              <div className="relative z-10">
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest">IELTS Simulation</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> Full Test
                  </span>
                </div>
                <h2 className="text-4xl font-bold font-serif text-white mb-4">{examTitleFromState || "Bộ đề thi thực tế"}</h2>
                <p className="text-blue-100/70 text-lg max-w-2xl mb-8 leading-relaxed">
                  Luyện tập từng phần thi để đạt kết quả tốt nhất. Hệ thống sẽ tự động chấm điểm và lưu lại kết quả của bạn.
                </p>
                <div className="flex gap-8">
                  <div className="flex items-center gap-2 text-white/80 font-medium font-mono">
                    <Clock size={20} className="text-blue-300" /> {sections.length * 10} Phút
                  </div>
                  <div className="flex items-center gap-2 text-white/80 font-medium font-mono">
                    <BookOpen size={20} className="text-blue-300" /> {sections.length} Sections
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </div>

            {/* SECTIONS LIST */}
            <h3 className="text-xl font-bold text-white mb-6 font-serif flex items-center gap-2">
              Danh sách phần thi <span className="text-blue-500">/ Sections</span>
            </h3>
            
            <div className="grid gap-4">
              {sections.map((section, idx) => (
                <Link
                  key={section.id}
                  to={`/exams/${examId}/sections/${section.id}`}
                  state={{ audioUrl: section.audio_url, sectionTitle: section.title }}
                  className="group flex items-center justify-between p-6 bg-white/2 border border-white/5 rounded-3xl hover:bg-white/5 hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getBgColor(section.title)} group-hover:scale-110 transition-transform`}>
                      {getIcon(section.title)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        {section.title}
                      </h4>
                      <p className="text-sm text-gray-500 font-mono mt-1 uppercase tracking-widest">
                        Section Number: {section.section_number}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {section.audio_url && (
                      <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                        MP3 Included
                      </div>
                    )}
                    <div className="bg-white/5 p-2 rounded-xl text-gray-500 group-hover:text-white group-hover:bg-blue-600 transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white/2 border border-white/5 rounded-[40px] p-20 text-center">
            <Empty description={<span className="text-gray-500 font-serif">Chưa có phần thi nào được cập nhật</span>} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamDetailPage;
