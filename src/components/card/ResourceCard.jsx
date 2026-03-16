import Button from "../button/button.home";
import Badge from "../button/Badge";
import { Download } from "lucide-react";

const ResourceCard = ({
  title,
  description,
  category,
  type,
  downloads,
  image,
}) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-40 bg-gray-200">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500">Image</span>
          </div>
        )}
        <Badge
          color={
            category === "Writing"
              ? "pink"
              : category === "Speaking"
                ? "yellow"
                : category === "Grammar"
                  ? "pink"
                  : "blue"
          }
        >
          {category}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>

        {/* Type & Downloads */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600">{type}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download size={16} className="text-gray-400" />
            <span className="text-xs text-gray-600">{downloads} downloads</span>
          </div>
        </div>

        <Button variant="primary" className="w-full">
          Access Resource
        </Button>
      </div>
    </div>
  );
};

export default ResourceCard;
