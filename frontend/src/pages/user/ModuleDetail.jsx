import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getModuleById,
  getQuestionsForModule,
  submitQuestionAttempt,
} from "../../api/moduleApi";
import QuestionCard from "../../components/QuestionCard";
// Helper functions for material display
const getMaterialIcon = (type) => {
  switch (type) {
    case "video": return "🎥";
    case "pdf": return "📄";
    case "article": return "📝";
    case "link": return "🔗";
    case "text": return "📋";
    default: return "📄";
  }
};

const getMaterialTypeColor = (type) => {
  switch (type) {
    case "video": return "#ef4444";
    case "pdf": return "#dc2626";
    case "article": return "#059669";
    case "link": return "#2563eb";
    case "text": return "#6b7280";
    default: return "#6b7280";
  }
};

const ModuleDetail = () => {
  const { id } = useParams();
  const [moduleData, setModuleData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submittingId, setSubmittingId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [lastResult, setLastResult] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mod, qs] = await Promise.all([
          getModuleById(id),
          getQuestionsForModule(id),
        ]);
        setModuleData(mod);
        setQuestions(qs);
        setCurrentIndex(0);
        setCorrectCount(0);
        setLastResult(null);
        setCompleted(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load module");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleAnswer = async (questionId, userAnswer) => {
    setFeedback("");
    setSubmittingId(questionId);
    try {
      const result = await submitQuestionAttempt({
        questionId,
        userAnswer,
      });

      const isCorrect =
        result?.attempt?.isCorrect ?? result?.isCorrect ?? false;

      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }

      const question = questions.find((q) => q._id === questionId);
      setLastResult({
        isCorrect,
        explanation: question?.explanation || null,
      });

      setFeedback(
        isCorrect
          ? "✅ Correct! Great job."
          : "❌ Not quite. Review the explanation and try the next one."
      );
    } catch (err) {
      setFeedback(err.response?.data?.message || "Failed to submit answer");
      // If user just answered the last question, mark module as completed
      if (currentIndex === totalQuestions - 1) {
        setCompleted(true);
      }
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) return <p>Loading module...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const totalQuestions = questions.length;
  const currentQuestion = totalQuestions > 0 ? questions[currentIndex] : null;

  return (
    <div>
      <h2>{moduleData?.title}</h2>
      <p style={{ color: "#6b7280" }}>{moduleData?.description}</p>

      {totalQuestions > 0 && (
        <p style={{ marginTop: "8px", fontSize: "0.9rem", color: "#4b5563" }}>
          Question {currentIndex + 1} of {totalQuestions} • Correct so far:{" "}
          {correctCount}
        </p>
      )}
            <p style={{ color: "#6b7280" }}>{moduleData?.description}</p>

      {/* Learning Materials Section */}
      {moduleData?.materials && moduleData.materials.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h3 style={{ 
            margin: "0 0 16px", 
            fontSize: "1.2rem", 
            fontWeight: "bold", 
            color: "#1f2937",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            📚 Learning Materials
          </h3>
          
          <div style={{ 
            display: "grid", 
            gap: "16px", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" 
          }}>
            {moduleData.materials.map((material, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "20px",
                  backgroundColor: "#f9fafb",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  marginBottom: "12px",
                  gap: "12px"
                }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    background: getMaterialTypeColor(material.type),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "18px"
                  }}>
                    {getMaterialIcon(material.type)}
                  </div>
                  <div>
                    <h4 style={{ 
                      margin: "0 0 4px", 
                      fontSize: "1rem", 
                      fontWeight: "600", 
                      color: "#1f2937" 
                    }}>
                      {material.title}
                    </h4>
                    <p style={{ 
                      margin: "0 0 8px", 
                      fontSize: "0.9rem", 
                      color: "#6b7280" 
                    }}>
                      {material.description || `Learn about ${material.title}`}
                    </p>
                  </div>
                </div>

                {/* Material Content */}
                <div style={{ marginTop: "12px" }}>
                  {material.type === "video" && (
                    <div style={{ textAlign: "center" }}>
                      <video
                        controls
                        style={{
                          width: "100%",
                          maxWidth: "400px",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                        }}
                        src={material.url}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

                  {material.type === "pdf" && (
                    <div style={{ textAlign: "center" }}>
                      <iframe
                        src={material.url}
                        style={{
                          width: "100%",
                          height: "500px",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb"
                        }}
                        title={material.title}
                      />
                    </div>
                  )}

                  {material.type === "article" && (
                    <div style={{
                      lineHeight: "1.6",
                      fontSize: "0.95rem",
                      color: "#374151",
                      backgroundColor: "#fefefe",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #f3f4f6"
                    }}>
                      {material.content}
                    </div>
                  )}

                  {material.type === "link" && (
                    <div style={{ textAlign: "center" }}>
                      <a
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "12px 20px",
                          backgroundColor: "#3b82f6",
                          color: "white",
                          textDecoration: "none",
                          borderRadius: "8px",
                          fontWeight: "500",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#2563eb";
                          e.target.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#3b82f6";
                          e.target.style.transform = "translateY(0)";
                        }}
                      >
                        🔗 Open Resource
                      </a>
                    </div>
                  )}

                  {material.type === "text" && (
                    <div style={{
                      lineHeight: "1.6",
                      fontSize: "0.95rem",
                      color: "#374151",
                      backgroundColor: "#f8fafc",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontStyle: "italic"
                    }}>
                      {material.content}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3>Questions</h3>
      {totalQuestions === 0 ? (
        <p>No questions available for this module yet.</p>
      ) : (
        <>
          {currentQuestion && (
            <QuestionCard
              key={currentQuestion._id}
              question={currentQuestion}
              submitting={submittingId === currentQuestion._id}
              onSubmit={(answer) =>
                handleAnswer(currentQuestion._id, answer)
              }
            />
          )}

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((idx) => Math.max(0, idx - 1))
              }
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((idx) =>
                  Math.min(totalQuestions - 1, idx + 1)
                )
              }
              disabled={currentIndex === totalQuestions - 1}
            >
              Next
            </button>
          </div>

          {feedback && (
            <p style={{ marginTop: "12px", fontWeight: "bold" }}>
              {feedback}
            </p>
          )}

          {lastResult?.explanation && (
            <p
              style={{
                marginTop: "8px",
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "#f3f4f6",
                color: "#374151",
                fontSize: "0.9rem",
              }}
            >
              <strong>Explanation: </strong>
              {lastResult.explanation}
            </p>
          )}

          {completed && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                backgroundColor: "#f9fafb",
              }}
            >
              <h4 style={{ margin: "0 0 6px" }}>Module summary</h4>
              <p style={{ margin: 0 }}>
                Score: {correctCount} / {totalQuestions} (
                {Math.round((correctCount / totalQuestions) * 100)}%)
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ModuleDetail;


