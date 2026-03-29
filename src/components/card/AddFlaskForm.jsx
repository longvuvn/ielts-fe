import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const AddFlaskForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  topics = [],
}) => {
  const [formData, setFormData] = useState({
    front: "",
    back: "",
    topic: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ front: "", back: "", topic: "" });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.front.trim()) {
      newErrors.front = "Front side cannot be empty";
    }

    if (!formData.back.trim()) {
      newErrors.back = "Back side cannot be empty";
    }

    if (!formData.topic.trim()) {
      newErrors.topic = "Topic is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(formData);
    setFormData({ front: "", back: "", topic: "" });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? "Edit Flashcard" : "Create Flashcard"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Front */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Front (Question/Word)
            </label>
            <textarea
              name="front"
              value={formData.front}
              onChange={handleChange}
              placeholder="Enter question or vocabulary word..."
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none resize-none ${
                errors.front
                  ? "border-red-500 focus:border-red-600 bg-red-50"
                  : "border-gray-200 focus:border-blue-500 bg-white"
              }`}
              rows="3"
            />
            {errors.front && (
              <span className="text-red-600 text-sm mt-2">{errors.front}</span>
            )}
          </div>

          {/* Back */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Back (Answer/Definition)
            </label>
            <textarea
              name="back"
              value={formData.back}
              onChange={handleChange}
              placeholder="Enter answer or definition..."
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none resize-none ${
                errors.back
                  ? "border-red-500 focus:border-red-600 bg-red-50"
                  : "border-gray-200 focus:border-blue-500 bg-white"
              }`}
              rows="4"
            />
            {errors.back && (
              <span className="text-red-600 text-sm mt-2">{errors.back}</span>
            )}
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Topic/Category
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g., Vocabulary, Grammar, Phrases"
              list="topics"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                errors.topic
                  ? "border-red-500 focus:border-red-600 bg-red-50"
                  : "border-gray-200 focus:border-blue-500 bg-white"
              }`}
            />
            <datalist id="topics">
              {topics.map((topic) => (
                <option key={topic} value={topic} />
              ))}
            </datalist>
            {errors.topic && (
              <span className="text-red-600 text-sm mt-2">{errors.topic}</span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-all"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFlaskForm;
