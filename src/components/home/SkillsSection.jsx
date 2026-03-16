import SkillCard from "../card/SkillCard";
import { Headphones, Book, PenTool, Mic } from "lucide-react";

const SkillsSection = () => {
  const skills = [
    {
      icon: Headphones,
      title: "Listening",
      description:
        "Master IELTS listening with authentic audio materials and practice tests",
      progress: 65,
      lessons: 24,
      duration: "45 mins",
      topics: [
        "Academic Lectures",
        "Conversations",
        "Monologues",
        "Note-taking Skills",
      ],
    },
    {
      icon: Book,
      title: "Reading",
      description:
        "Improve reading comprehension and speed with diverse academic texts",
      progress: 80,
      lessons: 32,
      duration: "60 mins",
      topics: [
        "Academic Texts",
        "Skimming & Scanning",
        "Question Types",
        "Time Management",
      ],
    },
    {
      icon: PenTool,
      title: "Writing",
      description:
        "Learn to write clear, well-structured essays and reports bádajibdaudb",
      progress: 45,
      lessons: 28,
      duration: "90 mins",
      topics: [
        "Task 1 Reports",
        "Task 2 Essays",
        "Grammar & Vocabulary",
        "Band Score Criteria",
      ],
    },
    {
      icon: Mic,
      title: "Speaking",
      description:
        "Build confidence in speaking with interactive practice sessions",
      progress: 55,
      lessons: 20,
      duration: "30 mins",
      topics: [
        "Part 1 Interview",
        "Part 2 Long Turn",
        "Part 3 Discussion",
        "Pronunciation",
      ],
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Master All Four IELTS Skills
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive study materials and practice exercises for Listening,
            Reading, Writing, and Speaking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skill) => (
            <SkillCard key={skill.title} {...skill} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
