import { useState } from "react";

const QuestionCard = ({ question, onSubmit, submitting }) => {
  const [selected, setSelected] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected || submitting) return;
    onSubmit(selected);
  };

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <h3 style={{ margin: "0 0 8px" }}>{question.questionText}</h3>
      <form onSubmit={handleSubmit}>
        {question.options?.map((opt) => (
          <label
            key={opt}
            style={{
              display: "block",
              marginBottom: "6px",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name={question._id}
              value={opt}
              checked={selected === opt}
              onChange={() => setSelected(opt)}
              style={{ marginRight: "8px" }}
            />
            {opt}
          </label>
        ))}

        <button type="submit" disabled={!selected || submitting}>
          {submitting ? "Checking..." : "Submit answer"}
        </button>
      </form>
    </div>
  );
};

export default QuestionCard;


