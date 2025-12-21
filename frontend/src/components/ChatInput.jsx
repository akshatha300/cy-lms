import { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "10px",
      }}
    >
      <input
        type="text"
        placeholder="Ask a cybersecurity question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        style={{ flex: 1, padding: "10px" }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatInput;
