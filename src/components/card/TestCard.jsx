import Badge from "../button/Badge";
import Button from "../button/button.home";
import { Clock, BookOpen, Star, Users } from "lucide-react";

const TestCard = ({
  title,
  description,
  duration = "180 min",
  sections = 4,
  rating = 4.8,
  attempts = 1200,
  badges = [],
  onClick,
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-blue-100 transition-all cursor-pointer group"
    >
      <div className="p-7">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
          <div className="bg-blue-50 text-blue-600 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
            <BookOpen size={20} />
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-5 line-clamp-2 h-10">{description || "No description provided for this exam."}</p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge color="blue">Academic</Badge>
          {badges.map((badge) => (
            <Badge key={badge} color={badge === "Popular" ? "pink" : "yellow"}>
              {badge}
            </Badge>
          ))}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-y-4 mb-6 pt-6 border-t border-gray-50">
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-gray-400" />
            <span className="text-xs text-gray-600 font-medium">{duration}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Users size={16} className="text-gray-400" />
            <span className="text-xs text-gray-600 font-medium">{attempts} users</span>
          </div>
        </div>

        <button 
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
        >
          Luyện tập ngay
        </button>
      </div>
    </div>
  );
};

export default TestCard;
