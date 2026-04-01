import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { 
  ArrowLeft, Library, Search, Loader2, BookOpen, 
  ChevronRight, Users, Calendar, Info
} from "lucide-react";
import Button from "../../components/button/button.home";
import { getLibraryByIdAPI } from "../../service/api/api.library";
import { getFlashcardsByLibraryIdAPI } from "../../service/api/api.flashcard";

const LibraryDetailPage = () => {
  const { libraryId } = useParams();
  const navigate = useNavigate();
  const [library, setLibrary] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLibraryData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [libRes, cardRes] = await Promise.all([
        getLibraryByIdAPI(libraryId),
        getFlashcardsByLibraryIdAPI(libraryId, 0, 50)
      ]);

      if (libRes && (libRes.status === 200 || libRes.status === 201)) {
        setLibrary(libRes.data?.data || libRes.data);
      }

      if (cardRes && (cardRes.status === 200 || cardRes.status === 201)) {
        let cards = [];
        if (Array.isArray(cardRes.data)) {
          cards = cardRes.data;
        } else if (cardRes.data?.content && Array.isArray(cardRes.data.content)) {
          cards = cardRes.data.content;
        } else if (cardRes.data?.data && Array.isArray(cardRes.data.data)) {
          cards = cardRes.data.data;
        }
        setFlashcards(cards);
      }
    } catch (error) {
      console.error("Error fetching library detail:", error);
      message.error("Lỗi khi tải thông tin thư viện!");
    } finally {
      setIsLoading(false);
    }
  }, [libraryId]);

  useEffect(() => {
    if (libraryId) fetchLibraryData();
  }, [libraryId, fetchLibraryData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-accent animate-spin" />
          <p className="text-text-secondary font-medium">Đang tải thông tin thư viện...</p>
        </div>
      </div>
    );
  }

  if (!library) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-page gap-6">
        <div className="w-24 h-24 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center shadow-sm">
          <Info size={48} />
        </div>
        <h2 className="text-2xl font-bold text-text-primary">Không tìm thấy thư viện</h2>
        <Button variant="ghost" onClick={() => navigate(-1)} icon={ArrowLeft}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page text-text-primary animate-fade-slide-in flex flex-col">
      {/* HEADER */}
      <div className="w-full border-b border-border-default bg-page/40 backdrop-blur-xl z-[100] sticky top-0">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              icon={ArrowLeft} 
              className="px-4 border border-border-default rounded-xl hover:bg-slate-50"
            >
              Quay lại
            </Button>
            <div className="h-10 w-[1px] bg-border-default" />
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-accent/10 text-accent rounded-xl">
                <Library size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display tracking-tight text-text-primary m-0">
                  {library.name}
                </h1>
                <p className="text-[10px] font-black text-text-secondary m-0 mt-1 uppercase tracking-widest flex items-center gap-3">
                  <span className="flex items-center gap-1"><Users size={12} /> {library.learnerName || "Learner"}</span>
                  <span className="w-1 h-1 bg-border-default rounded-full" />
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(library.createdAt).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                <span className="text-accent font-bold text-sm">{flashcards.length} Flashcards</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-8 py-10">
        {/* FLASHCARDS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {flashcards.length > 0 ? (
             flashcards.map((card) => (
               <div 
                 key={card.id}
                 onClick={() => navigate(`/flashcards/${card.id}`)}
                 className="group relative bg-white border border-border-default rounded-3xl p-6 cursor-pointer hover:border-accent hover:shadow-[0_20px_40px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden"
               >
                 <div className="absolute top-0 left-0 w-1.5 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                 
                 <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                       <BookOpen size={24} />
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                 </div>

                 <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                    {card.title || card.name}
                 </h3>
                 <p className="text-sm text-text-secondary line-clamp-2 mb-6">
                    {card.description || "Không có mô tả cho bộ thẻ này."}
                 </p>

                 <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <span>Practice now</span>
                    <span className="bg-slate-50 px-2 py-0.5 rounded-md group-hover:bg-accent group-hover:text-white transition-colors">View Deck</span>
                 </div>
               </div>
             ))
           ) : (
             <div className="col-span-full py-20 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-300 mb-6">
                   <BookOpen size={40} />
                </div>
                <h4 className="text-xl font-bold text-text-primary mb-2">Thư viện trống</h4>
                <p className="text-text-secondary">Thư viện này hiện chưa có bộ thẻ flashcard nào.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default LibraryDetailPage;
