const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    pink: "bg-pink-100 text-pink-700",
    green: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`${colors[color]} text-xs font-semibold px-3 py-1 rounded-full`}
    >
      {children}
    </span>
  );
};

export default Badge;
