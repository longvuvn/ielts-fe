import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import {
  X, CheckCircle2, AlertCircle, Trophy, LayoutGrid, Volume2
} from "lucide-react";
import Button from "../../components/button/button.home";
import { 
  getDeckVocabularyQuizAPI, 
  getVocabulariesByFlashcardIdAPI,
  reviewDeckVocabularyAPI
} from "../../service/api/api.deckvocabulary";

const fixDefinitionText = (text = "") =>
  text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([.,;:])([^\s])/g, "$1 $2")
    .replace(/([a-z])(\d)/g, "$1 $2")
    .trim();

const FlashCardQuizPage = () => {
  const { flashcardId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const speak = useCallback((text) => {
    if (!text || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Lấy tất cả từ vựng trong Flashcard
        const vocabsRes = await getVocabulariesByFlashcardIdAPI(flashcardId);
        const allVocabs = vocabsRes?.data?.data || vocabsRes?.data?.content || vocabsRes?.data || [];

        if (!allVocabs || allVocabs.length < 4) {
          message.warning("Bạn cần ít nhất 4 từ vựng trong bộ này để luyện tập trắc nghiệm!");
          navigate(-1);
          return;
        }

        // 2. Với mỗi từ vựng, gọi API lấy bộ đáp án trắc nghiệm cho chính nó
        // Giới hạn luyện tập 20 từ ngẫu nhiên nếu bộ từ vựng quá lớn
        const shuffledVocabs = [...allVocabs].sort(() => Math.random() - 0.5).slice(0, 20);
        
        const quizPromises = shuffledVocabs.map(v => getDeckVocabularyQuizAPI(v.id));
        const quizResponses = await Promise.all(quizPromises);
        
        const processedQuestions = quizResponses.map((res, index) => {
          const quizOptions = res?.data?.data || res?.data || [];
          const originalVocab = shuffledVocabs[index];
          
          if (!quizOptions || quizOptions.length === 0) return null;

          return {
            word: originalVocab.word || originalVocab.vocabulary?.word || "Unknown",
            ipa: originalVocab.ipa || originalVocab.phonetic || originalVocab.vocabulary?.ipa || "",
            deckId: originalVocab.id,
            options: quizOptions.map(opt => ({
              text: fixDefinitionText(opt.definition),
              isCorrect: String(opt.isCorrect) === "true"
            })).sort(() => Math.random() - 0.5)
          };
        }).filter(Boolean);

        if (processedQuestions.length === 0) {
          message.warning("Không thể tạo câu hỏi trắc nghiệm!");
          navigate(-1);
          return;
        }

        setQuestions(processedQuestions);
      } catch (err) {
        console.error("Fetch quiz error:", err);
        message.error("Lỗi khi chuẩn bị bài luyện tập!");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [flashcardId, navigate]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (currentQuestion?.word && !isLoading && !isFinished) {
      const timer = setTimeout(() => speak(currentQuestion.word), 600);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentQuestion, isLoading, isFinished, speak]);

  const handleAnswer = async (option) => {
    if (selectedAnswer) return;

    setSelectedAnswer(option.text);
    const correct = option.isCorrect;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(s => s + 1);
      if (currentQuestion.deckId) {
        reviewDeckVocabularyAPI(currentQuestion.deckId, true).catch(console.error);
      }
    } else {
      if (currentQuestion.deckId) {
        reviewDeckVocabularyAPI(currentQuestion.deckId, false).catch(() => {});
      }
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setIsFinished(true);
      }
    }, 1200);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-[2000] flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse">Đang chuẩn bị câu hỏi trắc nghiệm...</p>
      </div>
    );
  }

  if (isFinished) {
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <div className="fixed inset-0 bg-slate-50 z-[2000] flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500" />
          <div className="w-24 h-24 bg-blue-50 text-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Trophy size={48} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 font-display">Hoàn thành thử thách!</h2>
          <p className="text-slate-500 mb-10 font-medium">Bạn đã vượt qua bài kiểm tra trắc nghiệm</p>
          
          <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 mb-10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Độ chính xác</span>
              <span className="text-accent font-black text-2xl">{accuracy}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${accuracy}%` }} />
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-white rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Đúng</p>
                <p className="text-xl font-bold text-slate-900">{score}</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Sai</p>
                <p className="text-xl font-bold text-slate-900">{questions.length - score}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="ghost" className="flex-1 h-14 rounded-2xl" onClick={() => navigate(-1)}>Kết thúc</Button>
            <Button variant="primary" className="flex-1 h-14 rounded-2xl shadow-xl shadow-blue-500/20" onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#f8fafc] z-[2000] flex flex-col animate-fade-in overflow-hidden">
      <div className="px-8 py-6 flex items-center justify-between bg-white border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-blue-50 text-accent rounded-xl"><LayoutGrid size={20} /></div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Thử thách Trắc nghiệm</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Câu hỏi {currentIndex + 1} / {questions.length}</p>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
      </div>

      <div className="h-1.5 w-full bg-slate-100 relative">
        <div 
          className="absolute top-0 left-0 h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full overflow-y-auto">
        <div className="w-full bg-white rounded-[40px] shadow-xl border border-slate-100 p-12 text-center mb-10 animate-fade-slide-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500/10" />
          <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-8 bg-blue-50 px-4 py-1.5 rounded-full inline-block">Chọn định nghĩa đúng cho</span>
          <h2 className="text-5xl lg:text-7xl font-bold font-display text-slate-900 tracking-tight mb-2">{currentQuestion?.word}</h2>
          
          {currentQuestion?.ipa && (
            <p className="text-xl font-mono text-slate-400 mb-8">/{currentQuestion.ipa}/</p>
          )}

          <div className="flex justify-center mt-2">
            <button 
              onClick={() => speak(currentQuestion?.word)}
              className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 hover:text-accent hover:bg-blue-50 transition-all border border-slate-100 flex items-center justify-center active:scale-90"
            >
              <Volume2 size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {currentQuestion?.options?.map((option, idx) => {
            let statusClasses = "bg-white border-slate-100 hover:border-accent/40 hover:bg-blue-50/30";
            let icon = null;

            if (selectedAnswer === option.text) {
              if (isCorrect) {
                statusClasses = "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-[1.02]";
                icon = <CheckCircle2 className="text-emerald-500" size={24} />;
              } else {
                statusClasses = "bg-red-50 border-red-500 text-red-900 shadow-[0_0_20px_rgba(239,68,68,0.15)] scale-[0.98]";
                icon = <AlertCircle className="text-red-500" size={24} />;
              }
            } else if (selectedAnswer && option.isCorrect) {
              statusClasses = "bg-emerald-50 border-emerald-500/50 text-emerald-900 opacity-80";
            } else if (selectedAnswer) {
              statusClasses = "bg-white border-slate-50 opacity-40 grayscale";
            }

            return (
              <button
                key={idx}
                disabled={!!selectedAnswer}
                onClick={() => handleAnswer(option)}
                className={`group flex items-center justify-between p-6 rounded-[28px] border-2 text-left transition-all duration-300 min-h-[100px] ${statusClasses}`}
              >
                <p className="text-lg font-bold flex-1 pr-4">{option.text}</p>
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  {icon || <div className="w-6 h-6 rounded-full border-2 border-slate-100 group-hover:border-accent/20 transition-colors" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FlashCardQuizPage;
