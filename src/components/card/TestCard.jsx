import Badge from "../button/Badge";
import Button from "../button/button.home";
import { Clock, BookOpen, Star, Users } from "lucide-react";

const TestCard = ({
  title,
  description,
  duration,
  sections,
  rating,
  attempts,
  badges = [],
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {badges.map((badge) => (
            <Badge key={badge} color={badge === "Popular" ? "pink" : "yellow"}>
              {badge}
            </Badge>
          ))}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">{duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">{sections} sections</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star size={18} className="text-yellow-400" />
            <div>
              <p className="text-xs text-gray-900 font-semibold">{rating}/5</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">{attempts} attempts</p>
            </div>
          </div>
        </div>

        <Button variant="primary" className="w-full">
          Start Test
        </Button>
      </div>
    </div>
  );
};

export default TestCard;
