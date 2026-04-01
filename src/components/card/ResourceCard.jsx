import Button from "../button/button.home";
import Badge from "../button/Badge";
import { Download, FileText, ArrowUpRight } from "lucide-react";

const ResourceCard = ({
  title,
  description,
  category,
  type,
  downloads,
  image,
}) => {
  return (
    <div className="premium-card overflow-hidden group flex-1">
      {/* Image Area */}
      <div className="relative h-48 bg-elevated overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-card to-elevated">
            <FileText size={48} className="text-text-muted mb-2 opacity-20" />
            <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Resource Preview</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <Badge
            color={
              category === "Writing"
                ? "yellow"
                : category === "Speaking"
                  ? "yellow"
                  : "blue"
            }
          >
            {category}
          </Badge>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors font-display line-clamp-1">{title}</h3>
          <ArrowUpRight size={18} className="text-text-muted group-hover:text-accent transition-colors" />
        </div>
        
        <p className="text-text-secondary text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
          {description || "Access high-quality IELTS study materials and curated resources for your preparation."}
        </p>

        {/* Footer Info */}
        <div className="flex items-center justify-between py-4 border-t border-border-default">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded">{type}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Download size={14} className="text-text-muted" />
            <span className="text-xs font-mono text-text-muted">{downloads.toLocaleString()}</span>
          </div>
        </div>

        <Button variant="secondary" className="w-full mt-4 group-hover:bg-accent group-hover:text-white group-hover:border-accent">
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default ResourceCard;
