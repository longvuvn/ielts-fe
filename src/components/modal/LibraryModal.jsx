// src/components/modal/LibraryModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

const LibraryModal = ({ isOpen, onClose, onSubmit }) => {
  const [newLibraryName, setNewLibraryName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newLibraryName.trim()) return;
    onSubmit(newLibraryName);
    setNewLibraryName(""); // Reset form sau khi submit
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Create New Library
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            type="text"
            value={newLibraryName}
            onChange={(e) => setNewLibraryName(e.target.value)}
            placeholder="Enter library name..."
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
            autoFocus
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LibraryModal;
