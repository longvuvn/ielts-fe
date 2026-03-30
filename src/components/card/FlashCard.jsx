import React, { useState } from 'react';
import { Edit2, Trash2, Volume2 } from 'lucide-react';

const FlaskCard = ({ 
  id, 
  front, 
  back, 
  topic, 
  onEdit, 
  onDelete, 
  onSpeak 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      onClick={() => setIsFlipped(!isFlipped)}
      className="relative h-64 cursor-pointer perspective"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front Side */}
        <div
          className="absolute w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-300 p-6 flex flex-col justify-between shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div>
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {topic}
            </span>
            <p className="text-2xl font-bold text-gray-900 mt-4 line-clamp-4">
              {front}
            </p>
          </div>
          <p className="text-sm text-gray-500 text-center">Click to reveal answer</p>
        </div>

        {/* Back Side */}
        <div
          className="absolute w-full h-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 p-6 flex flex-col justify-between shadow-lg"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div>
            <p className="text-sm text-green-600 font-semibold mb-2">Answer</p>
            <p className="text-lg text-gray-900 line-clamp-6">
              {back}
            </p>
          </div>
          <p className="text-sm text-gray-500 text-center">Click to flip back</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2 z-10 bg-white rounded-lg shadow-md p-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSpeak && onSpeak(front);
          }}
          className="p-2 text-gray-400 hover:text-blue-500 transition"
          title="Pronounce"
        >
          <Volume2 size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit && onEdit(id);
          }}
          className="p-2 text-gray-400 hover:text-amber-500 transition"
          title="Edit"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete && onDelete(id);
          }}
          className="p-2 text-gray-400 hover:text-red-500 transition"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default FlaskCard;