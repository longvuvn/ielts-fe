import React from "react";
import { MessageCircle, Users, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: <Users className="text-blue-400" />,
    title: "Cộng đồng học thuật",
    desc: "Kết nối với hàng ngàn học viên, chia sẻ kinh nghiệm và tài liệu học tập quý giá."
  },
  {
    icon: <MessageCircle className="text-indigo-400" />,
    title: "Thảo luận bài giải",
    desc: "Hệ thống comment dưới mỗi câu hỏi giúp giải đáp thắc mắc ngay lập tức."
  },
  {
    icon: <Zap className="text-amber-400" />,
    title: "Chấm điểm tức thì",
    desc: "Nhận kết quả và phân tích lỗi sai ngay sau khi nộp bài với công nghệ AI."
  },
  {
    icon: <Globe className="text-emerald-400" />,
    title: "Tài liệu cập nhật",
    desc: "Kho đề thi được cập nhật liên tục từ các nguồn uy tín như Cambridge, British Council."
  }
];

const CommunitySection = () => {
  return (
    <section className="py-24 bg-[#060d1a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <div key={i} className="bg-white/2 border border-white/5 p-6 rounded-3xl hover:border-blue-500/30 transition-colors">
                  <div className="bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                    {f.icon}
                  </div>
                  <h3 className="text-white font-bold mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif text-white mb-6">
              Không chỉ là luyện đề, đó là một hệ sinh thái
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Chúng tôi xây dựng môi trường học tập tương tác cao, nơi bạn không bao giờ cảm thấy đơn độc trên con đường chinh phục IELTS.
            </p>
            <ul className="space-y-4">
              {["Hơn 50,000+ lượt thảo luận hàng tháng", "Đội ngũ mentor hỗ trợ 24/7", "Kho tài liệu 100GB+ miễn phí"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
