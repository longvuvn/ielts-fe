import Button from "../button/button.home";

const SkillCard = ({
  icon: Icon,
  title,
  description,
  progress,
  lessons,
  duration,
  topics,
}) => {
  const borderColors = {
    Listening: "border-blue-300",
    Reading: "border-green-300",
    Writing: "border-purple-300",
    Speaking: "border-orange-300",
  };

  return (
    <div
      className={`border-2 ${borderColors[title]} rounded-2xl p-8 bg-white hover:shadow-lg transition-shadow`}
    >
      <div className="flex justify-center mb-6">
        <Icon size={48} className="text-gray-700" />
      </div>

      <h3 className="text-2xl font-bold text-center mb-4">{title}</h3>
      <p className="text-gray-600 text-center mb-6">{description}</p>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-sm font-bold text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-black rounded-full h-2 transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
        <div>
          <p className="text-sm text-gray-600">Lessons</p>
          <p className="text-lg font-bold">{lessons}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Duration</p>
          <p className="text-lg font-bold">{duration}</p>
        </div>
      </div>

      {/* Key Topics */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Key Topics:</p>
        <ul className="space-y-2">
          {topics.map((topic) => (
            <li key={topic} className="text-sm text-gray-600 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
              {topic}
            </li>
          ))}
        </ul>
      </div>

      <Button variant="primary" className="w-full">
        Start Learning
      </Button>
    </div>
  );
};

export default SkillCard;
