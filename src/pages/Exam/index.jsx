import React, { useState, useEffect } from "react";
import { message, Pagination, Skeleton, Empty } from "antd";
import { BookOpen, Search, Filter } from "lucide-react";
import { getAllExamsAPI } from "../../service/api/api.exam";
import TestCard from "../../components/card/TestCard";
import { useNavigate } from "react-router-dom";

const ExamListPage = () => {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 8;
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams(currentPage - 1);
  }, [currentPage]);

  const fetchExams = async (page) => {
    try {
      setIsLoading(true);
      const res = await getAllExamsAPI(page, pageSize);
      if (res && res.status === 200) {
        setExams(res.data.content);
        setTotalElements(res.data.totalElements);
      }
    } catch (error) {
      console.error("Fetch exams error:", error);
      message.error(error?.message || "Không thể tải danh sách đề thi!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExamClick = (examId) => {
    // Navigate to exam detail or practice page
    navigate(`/exams/${examId}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-gray-100 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                Thư viện Đề thi IELTS
              </h1>
              <p className="text-lg text-gray-500 max-w-2xl">
                Tổng hợp các bộ đề thi IELTS sát với thực tế, giúp bạn ôn luyện
                và làm quen với cấu trúc bài thi một cách hiệu quả nhất.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <BookOpen size={16} />
                {totalElements} Đề thi sẵn có
              </div>
            </div>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Tìm kiếm đề thi (e.g. Cambridge 18...)"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 px-6 py-4 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all">
              <Filter size={20} />
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* EXAM GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100">
                <Skeleton active paragraph={{ rows: 4 }} />
              </div>
            ))}
          </div>
        ) : exams.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {exams.map((exam) => (
                <TestCard
                  key={exam.id}
                  title={exam.name || exam.title}
                  description={exam.description}
                  duration="180 phút"
                  attempts={exam.attempts || "1.2k"}
                  onClick={() => handleExamClick(exam.id)}
                />
              ))}
            </div>

            {/* PAGINATION */}
            <div className="mt-16 flex justify-center">
              <Pagination
                current={currentPage}
                total={totalElements}
                pageSize={pageSize}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                className="custom-pagination"
              />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-3xl p-20 shadow-sm border border-gray-100 text-center">
            <Empty description="Không tìm thấy đề thi nào" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamListPage;
