import { useState, useEffect } from "react";
import AIMLChatbot from "./AIMLChatbot";

const GlobalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState("bottom-right");

  useEffect(() => {
    // Load saved position from localStorage
    const savedPosition = localStorage.getItem("chatbot-position");
    if (savedPosition) {
      setPosition(savedPosition);
    }

    // Add keyboard shortcut (Ctrl/Cmd + K)
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen]);

  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
    localStorage.setItem("chatbot-position", newPosition);
  };

  return (
    <>
      <AIMLChatbot
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        position={position}
      />
      
      {/* Position selector (only visible when chat is open) */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: position === "bottom-right" || position === "bottom-left" ? "80px" : "20px",
            [position.includes("right") ? "right" : "left"]: position.includes("right") ? "20px" : "20px",
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            padding: "8px",
            zIndex: 999,
            display: "flex",
            gap: "4px"
          }}
        >
          <button
            onClick={() => handlePositionChange("bottom-right")}
            style={{
              padding: "4px 8px",
              backgroundColor: position === "bottom-right" ? "#3b82f6" : "#374151",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "11px",
              cursor: "pointer"
            }}
          >
            BR
          </button>
          <button
            onClick={() => handlePositionChange("bottom-left")}
            style={{
              padding: "4px 8px",
              backgroundColor: position === "bottom-left" ? "#3b82f6" : "#374151",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "11px",
              cursor: "pointer"
            }}
          >
            BL
          </button>
        </div>
      )}
    </>
  );
};

export default GlobalChatbot;
