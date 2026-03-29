import React, { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit2 } from "lucide-react";
import FlaskCard from "../components/FlaskCard";
import CardList from "../components/CardList";
import AddFlaskForm from "../components/AddFlaskForm";
import FlaskLibrary from "../components/FlaskLibrary";

const LibraryPage = () => {
  // State for libraries
  const [libraries, setLibraries] = useState([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState(null);

  // State for cards
  const [cards, setCards] = useState([]);
  const [editingCardId, setEditingCardId] = useState(null);

  // State for UI
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [showLibraryForm, setShowLibraryForm] = useState(false);
  const [newLibraryName, setNewLibraryName] = useState("");

  // Initialize data from localStorage
  useEffect(() => {
    loadLibraries();
  }, []);

  // Load cards when library changes
  useEffect(() => {
    if (selectedLibraryId) {
      loadCards(selectedLibraryId);
    }
  }, [selectedLibraryId]);

  // Load libraries from localStorage
  const loadLibraries = () => {
    try {
      const stored = localStorage.getItem("flashcard_libraries");
      if (stored) {
        const libs = JSON.parse(stored);
        setLibraries(libs);
        if (libs.length > 0 && !selectedLibraryId) {
          setSelectedLibraryId(libs[0].id);
        }
      }
    } catch (error) {
      console.error("Error loading libraries:", error);
    }
  };

  // Load cards for selected library
  const loadCards = (libraryId) => {
    try {
      const stored = localStorage.getItem(`flashcards_${libraryId}`);
      if (stored) {
        setCards(JSON.parse(stored));
      } else {
        setCards([]);
      }
    } catch (error) {
      console.error("Error loading cards:", error);
      setCards([]);
    }
  };

  // Create new library
  const handleCreateLibrary = () => {
    if (!newLibraryName.trim()) return;

    const newLibrary = {
      id: Date.now().toString(),
      name: newLibraryName,
      createdAt: new Date().toISOString(),
      cards: [],
    };

    const updatedLibraries = [...libraries, newLibrary];
    setLibraries(updatedLibraries);
    localStorage.setItem(
      "flashcard_libraries",
      JSON.stringify(updatedLibraries),
    );

    setNewLibraryName("");
    setShowLibraryForm(false);
    setSelectedLibraryId(newLibrary.id);
  };

  // Delete library
  const handleDeleteLibrary = (libraryId) => {
    if (confirm("Delete this library? This action cannot be undone.")) {
      const updatedLibraries = libraries.filter((lib) => lib.id !== libraryId);
      setLibraries(updatedLibraries);
      localStorage.setItem(
        "flashcard_libraries",
        JSON.stringify(updatedLibraries),
      );
      localStorage.removeItem(`flashcards_${libraryId}`);

      if (selectedLibraryId === libraryId) {
        setSelectedLibraryId(updatedLibraries[0]?.id || null);
      }
    }
  };

  // Add or update card
  const handleSaveCard = (cardData) => {
    if (!selectedLibraryId) {
      alert("Please select a library first");
      return;
    }

    let updatedCards;

    if (editingCardId) {
      updatedCards = cards.map((card) =>
        card.id === editingCardId
          ? { ...card, ...cardData, updatedAt: new Date().toISOString() }
          : card,
      );
    } else {
      const newCard = {
        id: Date.now().toString(),
        ...cardData,
        createdAt: new Date().toISOString(),
      };
      updatedCards = [...cards, newCard];
    }

    setCards(updatedCards);
    localStorage.setItem(
      `flashcards_${selectedLibraryId}`,
      JSON.stringify(updatedCards),
    );
    setIsFormOpen(false);
    setEditingCardId(null);
  };

  // Delete card
  const handleDeleteCard = (cardId) => {
    if (confirm("Delete this card?")) {
      const updatedCards = cards.filter((card) => card.id !== cardId);
      setCards(updatedCards);
      localStorage.setItem(
        `flashcards_${selectedLibraryId}`,
        JSON.stringify(updatedCards),
      );
    }
  };

  // Edit card
  const handleEditCard = (cardId) => {
    setEditingCardId(cardId);
    setIsFormOpen(true);
  };

  // Text-to-speech
  const handleSpeak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  // Get unique topics
  const uniqueTopics = ["All", ...new Set(cards.map((card) => card.topic))];

  // Get editing card data
  const editingCard = cards.find((card) => card.id === editingCardId);

  // Get current library
  const currentLibrary = libraries.find((lib) => lib.id === selectedLibraryId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Flashcard Library
          </h1>
          <p className="text-lg text-gray-600">
            Create and manage your vocabulary learning cards
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Libraries */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Libraries</h2>
                <button
                  onClick={() => setShowLibraryForm(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Create new library"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                {libraries.length === 0 ? (
                  <p className="text-sm text-gray-500">No libraries yet</p>
                ) : (
                  libraries.map((library) => (
                    <div
                      key={library.id}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedLibraryId === library.id
                          ? "bg-blue-100 border-blue-300"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <button
                          onClick={() => setSelectedLibraryId(library.id)}
                          className="flex-1 text-left"
                        >
                          <p className="font-semibold text-gray-900">
                            {library.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {library.cards?.length || 0} cards
                          </p>
                        </button>
                        <button
                          onClick={() => handleDeleteLibrary(library.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Cards */}
          <div className="lg:col-span-3">
            {selectedLibraryId ? (
              <div>
                {/* Library Header */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentLibrary?.name}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {cards.length} cards in this library
                  </p>
                </div>

                {/* Search and Filters */}
                <div className="space-y-4 mb-6">
                  {/* Search */}
                  <div className="relative">
                    <Search
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search cards..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Topic Filter */}
                  <div className="flex flex-wrap gap-2">
                    {uniqueTopics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => setSelectedTopic(topic)}
                        className={`px-4 py-2 rounded-full font-semibold transition-all ${
                          selectedTopic === topic
                            ? "bg-black text-white"
                            : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        {topic}
                        {topic !== "All" && (
                          <span className="ml-2 text-sm">
                            ({cards.filter((c) => c.topic === topic).length})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Create Card Button */}
                <button
                  onClick={() => {
                    setEditingCardId(null);
                    setIsFormOpen(true);
                  }}
                  className="mb-6 bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2 shadow-lg"
                >
                  <Plus size={20} />
                  Add Card
                </button>

                {/* Cards Grid */}
                <CardList
                  cards={cards}
                  selectedTopic={selectedTopic}
                  searchTerm={searchTerm}
                  onEdit={handleEditCard}
                  onDelete={handleDeleteCard}
                  onSpeak={handleSpeak}
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-xl text-gray-500 mb-6">
                  Create a library to get started
                </p>
                <button
                  onClick={() => setShowLibraryForm(true)}
                  className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all inline-flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create First Library
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Library Modal */}
      {showLibraryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Library
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateLibrary();
              }}
              className="p-6 space-y-4"
            >
              <input
                type="text"
                value={newLibraryName}
                onChange={(e) => setNewLibraryName(e.target.value)}
                placeholder="Library name..."
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowLibraryForm(false);
                    setNewLibraryName("");
                  }}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Card Form */}
      <AddFlaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCardId(null);
        }}
        onSubmit={handleSaveCard}
        initialData={editingCard}
        topics={uniqueTopics.filter((t) => t !== "All")}
      />

      {/* Stats */}
      {selectedLibraryId && cards.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <p className="text-4xl font-bold text-blue-600">{cards.length}</p>
            <p className="text-gray-600 mt-2">Total Cards</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <p className="text-4xl font-bold text-green-600">
              {uniqueTopics.length - 1}
            </p>
            <p className="text-gray-600 mt-2">Topics</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <p className="text-4xl font-bold text-purple-600">
              {Math.ceil(cards.length / 10) * 10}
            </p>
            <p className="text-gray-600 mt-2">Learning Minutes</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
