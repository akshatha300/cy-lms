import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getModuleById,
  getQuestionsForModule,
  submitQuestionAttempt,
} from "../../api/moduleApi";
import QuestionCard from "../../components/QuestionCard";

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


