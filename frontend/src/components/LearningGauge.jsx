import React from "react";

// Simple radial gauge using conic-gradient
const clamp = (n) => Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));

const LearningGauge = ({ value = 0, size = 180, stroke = 14, trackColor = "#eee", color = "#6d28d9" }) => {
  const v = clamp(value);
  const circle = {
    width: size,
    height: size,
    background: `conic-gradient(${color} ${v * 3.6}deg, ${trackColor} 0deg)`
  };

  const inner = {
    width: size - stroke * 2,
    height: size - stroke * 2
  };

  return (
    <div className="relative inline-grid place-items-center" style={circle}>
      <div className="bg-white rounded-full grid place-items-center" style={inner}>
        <div className="text-center">
          <div className="text-3xl font-extrabold text-gray-800">{Math.round(v)}</div>
          <div className="text-xs uppercase tracking-wide text-gray-500">Content</div>
        </div>
      </div>
    </div>
  );
};

export default LearningGauge;
