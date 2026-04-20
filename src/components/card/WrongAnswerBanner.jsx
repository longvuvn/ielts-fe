import React, { useState, useEffect } from "react";
import { AlertCircle, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hook/useAuth";
import { getWrongAnswersAPI } from "../../service/api/api.practice";

const WrongAnswerBanner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [totalWrong, setTotalWrong] = useState(0);
  const [loading, setLoading] = useState(true);

  const learnerId = user?.learnerId || user?.id;

  useEffect(() => {
    const fetchCount = async () => {
      if (!learnerId) return;
      try {
        const res = await getWrongAnswersAPI(learnerId, 1);
        if (res && res.data) {
          // Lấy totalWrongQuestions từ cấu trúc data.totalWrongQuestions
          const total = res.data?.data?.totalWrongQuestions || res.data?.totalWrongQuestions || 0;
          setTotalWrong(total);
        }
      } catch (error) {
        console.error("Error fetching wrong answers count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [learnerId]);

  if (loading) {
    return (
      <div className="w-full bg-blue-50/50 border border-blue-100 rounded-[2rem] p-8 mb-8 animate-pulse flex items-center justify-center">
        <Loader2 className="text-blue-400 animate-spin" size={24} />
      </div>
    );
  }

  if (totalWrong === 0) return null;

  return (
    <div className="relative w-full overflow-hidden mb-10 group">
      {/* Background with Blue Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-[2.5rem] shadow-2xl shadow-blue-500/20" />
      
      <div className="relative px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center text-white border border-white/30 shadow-inner group-hover:scale-110 transition-transform duration-500">
            <AlertCircle size={36} strokeWidth={2.5} />
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/20">
                Personalized Review
              </span>
            </div>
            <h2 className="text-3xl font-black text-white leading-tight font-display tracking-tight">
              Bạn có <span className="text-yellow-300 underline decoration-4 underline-offset-8">{totalWrong} câu hỏi</span> cần ôn tập lại!
            </h2>
            <p className="text-blue-50/80 mt-4 text-sm font-medium max-w-lg leading-relaxed">
              Hệ thống đã tự động tổng hợp danh sách các câu hỏi bạn từng làm sai. Hãy luyện tập ngay để củng cố kiến thức!
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/practice/wrong-answers")}
          className="group/btn relative px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 active:scale-95 whitespace-nowrap overflow-hidden"
        >
          <span className="relative z-10">Bắt đầu ôn tập</span>
          <ArrowRight className="relative z-10 group-hover/btn:translate-x-2 transition-transform duration-300" size={20} strokeWidth={3} />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
};

export default WrongAnswerBanner;
