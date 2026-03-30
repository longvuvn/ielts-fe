import React from "react";
import { BookOpen, Plus } from "lucide-react";

const FlaskLibrary = ({
  libraries = [],
  selectedLibrary = null,
  onSelectLibrary,
  onCreateLibrary,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen size={24} className="text-blue-600" />
          My Libraries
        </h2>
        <button
          onClick={onCreateLibrary}
          className="p-2 text-blue-600 hover:text-blue-700 transition"
          title="Create new library"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {libraries.length === 0 ? (
          <p className="text-sm text-gray-500">No libraries yet</p>
        ) : (
          libraries.map((library) => (
            <button
              key={library.id}
              onClick={() => onSelectLibrary(library.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                selectedLibrary === library.id
                  ? "bg-blue-100 text-blue-700 font-semibold border border-blue-300"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent"
              }`}
            >
              <p className="font-semibold">{library.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {library.cards?.length || 0} cards
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default FlaskLibrary;
