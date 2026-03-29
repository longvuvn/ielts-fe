import React from "react";
import FlaskCard from "./FlashCard";

const CardList = ({
  cards = [],
  onEdit,
  onDelete,
  onSpeak,
  selectedTopic = "All",
  searchTerm = "",
}) => {
  const filteredCards = cards.filter((card) => {
    const matchesTopic =
      selectedTopic === "All" || card.topic === selectedTopic;
    const matchesSearch =
      card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.back.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTopic && matchesSearch;
  });

  if (filteredCards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {cards.length === 0
            ? "No flashcards yet. Create your first card!"
            : "No cards match your search."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCards.map((card) => (
        <FlaskCard
          key={card.id}
          id={card.id}
          front={card.front}
          back={card.back}
          topic={card.topic}
          onEdit={onEdit}
          onDelete={onDelete}
          onSpeak={onSpeak}
        />
      ))}
    </div>
  );
};

export default CardList;
