const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-accent/10 text-accent border border-accent/20",
    yellow: "bg-warning/10 text-warning border border-warning/20",
    green: "bg-success/10 text-success border border-success/20",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
  };

  const selectedColor = colors[color] || colors.blue;

  return (
    <span className={`${selectedColor} premium-badge`}>
      {children}
    </span>
  );
};

export default Badge;
