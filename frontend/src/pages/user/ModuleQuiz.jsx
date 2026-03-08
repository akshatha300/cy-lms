import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getQuestionsByModule } from "../../api/questionApi";
import { getModules } from "../../api/moduleApi";
import { CheckCircle, XCircle, Clock, Award, ArrowLeft, RotateCcw } from "lucide-react";

const ModuleQuiz = () => {
  const { moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load module info
        const modulesData = await getModules();
        const modules = modulesData?.modules || modulesData || [];
        const currentModule = modules.find(m => m._id === moduleId);
        setModule(currentModule);

        // Load questions
        const questionsData = await getQuestionsByModule(moduleId);
        setQuestions(questionsData || []);
        setStartTime(new Date());
      } catch (err) {
        setError(err.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [moduleId]);

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setEndTime(new Date());
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (selectedAnswers[question._id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setStartTime(new Date());
    setEndTime(null);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>
          <div style={{ 
            width: "40px", 
            height: "40px", 
            border: "4px solid #e5e7eb", 
            borderTop: "4px solid #3b82f6", 
            borderRadius: "50%" 
          }}></div>
        </div>
        <p style={{ marginTop: "16px", color: "#6b7280" }}>Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <div
          style={{
            border: "2px solid #ef4444",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
            backgroundColor: "#fef2f2",
          }}
        >
          <p style={{ margin: 0, color: "#991b1b" }}>{error}</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <div
          style={{
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "48px",
            textAlign: "center",
            backgroundColor: "#f9fafb",
          }}
        >
          <Award size={48} color="#9ca3af" style={{ marginBottom: "16px" }} />
          <h3 style={{ color: "#6b7280", marginBottom: "8px" }}>No quiz available</h3>
          <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
            This module doesn't have a quiz yet.
          </p>
          <Link
            to={`/modules/${moduleId}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            <ArrowLeft size={16} style={{ marginRight: "6px" }} />
            Back to Module
          </Link>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const timeTaken = endTime ? Math.round((endTime - startTime) / 1000) : 0;

    return (
      <div style={{ padding: "20px" }}>
        <div style={{ marginBottom: "32px" }}>
          <Link
            to={`/modules/${moduleId}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "#6b7280",
              textDecoration: "none",
              fontSize: "14px",
              marginBottom: "16px"
            }}
          >
            <ArrowLeft size={16} style={{ marginRight: "6px" }} />
            Back to Module
          </Link>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937", marginBottom: "8px" }}>
            🎉 Quiz Results
          </h1>
          <p style={{ color: "#6b7280" }}>{module?.title}</p>
        </div>

        <div style={{
          display: "grid",
          gap: "24px",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          marginBottom: "32px"
        }}>
          <div style={{
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
            backgroundColor: "#ffffff"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: score.percentage >= 80 ? "#10b981" : score.percentage >= 60 ? "#f59e0b" : "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              <span style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>
                {score.percentage}%
              </span>
            </div>
            <h3 style={{ color: "#1f2937", marginBottom: "8px" }}>Your Score</h3>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              {score.correct} of {score.total} correct
            </p>
          </div>

          <div style={{
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
            backgroundColor: "#ffffff"
          }}>
            <Clock size={40} color="#3b82f6" style={{ marginBottom: "16px" }} />
            <h3 style={{ color: "#1f2937", marginBottom: "8px" }}>Time Taken</h3>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              {Math.floor(timeTaken / 60)}m {timeTaken % 60}s
            </p>
          </div>

          <div style={{
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
            backgroundColor: "#ffffff"
          }}>
            <Award size={40} color="#8b5cf6" style={{ marginBottom: "16px" }} />
            <h3 style={{ color: "#1f2937", marginBottom: "8px" }}>Performance</h3>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              {score.percentage >= 80 ? "Excellent!" : score.percentage >= 60 ? "Good job!" : "Keep practicing!"}
            </p>
          </div>
        </div>

        <div style={{
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
          backgroundColor: "#ffffff",
          marginBottom: "24px"
        }}>
          <h3 style={{ color: "#1f2937", marginBottom: "16px" }}>Answer Review</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {questions.map((question, index) => {
              const isCorrect = selectedAnswers[question._id] === question.correctAnswer;
              return (
                <div
                  key={question._id}
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    backgroundColor: isCorrect ? "#f0fdf4" : "#fef2f2",
                    border: `1px solid ${isCorrect ? "#10b981" : "#ef4444"}`
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "8px" }}>
                    {isCorrect ? (
                      <CheckCircle size={20} color="#10b981" style={{ marginRight: "8px", marginTop: "2px" }} />
                    ) : (
                      <XCircle size={20} color="#ef4444" style={{ marginRight: "8px", marginTop: "2px" }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "#1f2937", fontWeight: "600", marginBottom: "8px" }}>
                        Question {index + 1}: {question.questionText}
                      </p>
                      <div style={{ marginLeft: "28px" }}>
                        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "4px" }}>
                          Your answer: <span style={{ color: isCorrect ? "#10b981" : "#ef4444", fontWeight: "600" }}>
                            {selectedAnswers[question._id] || "Not answered"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p style={{ color: "#10b981", fontSize: "14px" }}>
                            Correct answer: <span style={{ fontWeight: "600" }}>{question.correctAnswer}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={resetQuiz}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 16px",
              backgroundColor: "#f3f4f6",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            <RotateCcw size={16} style={{ marginRight: "6px" }} />
            Retake Quiz
          </button>
          <Link
            to={`/modules/${moduleId}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            <ArrowLeft size={16} style={{ marginRight: "6px" }} />
            Back to Module
          </Link>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "32px" }}>
        <Link
          to={`/modules/${moduleId}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            color: "#6b7280",
            textDecoration: "none",
            fontSize: "14px",
            marginBottom: "16px"
          }}
        >
          <ArrowLeft size={16} style={{ marginRight: "6px" }} />
          Back to Module
        </Link>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937", marginBottom: "8px" }}>
          📝 Module Quiz
        </h1>
        <p style={{ color: "#6b7280" }}>{module?.title}</p>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px"
        }}>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937" }}>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div style={{
          width: "100%",
          height: "8px",
          backgroundColor: "#e5e7eb",
          borderRadius: "4px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#3b82f6",
            transition: "width 0.3s ease"
          }}></div>
        </div>
      </div>

      <div style={{
        border: "2px solid #e5e7eb",
        borderRadius: "12px",
        padding: "32px",
        backgroundColor: "#ffffff",
        marginBottom: "24px"
      }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937", marginBottom: "24px" }}>
          {question.questionText}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {question.optionsText.split(',').map((option, index) => {
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = selectedAnswers[question._id] === optionLetter;
            
            return (
              <label
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "2px solid #e5e7eb",
                  backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "#ffffff";
                }}
              >
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value={optionLetter}
                  checked={isSelected}
                  onChange={() => handleAnswerSelect(question._id, optionLetter)}
                  style={{ marginRight: "12px" }}
                />
                <span style={{ fontSize: "16px", color: "#1f2937" }}>
                  <strong>{optionLetter}.</strong> {option.trim()}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          style={{
            padding: "10px 16px",
            backgroundColor: currentQuestion === 0 ? "#f9fafb" : "#f3f4f6",
            color: currentQuestion === 0 ? "#9ca3af" : "#1f2937",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: currentQuestion === 0 ? "not-allowed" : "pointer"
          }}
        >
          Previous
        </button>

        <div style={{ display: "flex", gap: "12px" }}>
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length < questions.length}
              style={{
                padding: "10px 16px",
                backgroundColor: Object.keys(selectedAnswers).length < questions.length ? "#f9fafb" : "#10b981",
                color: Object.keys(selectedAnswers).length < questions.length ? "#9ca3af" : "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: Object.keys(selectedAnswers).length < questions.length ? "not-allowed" : "pointer"
              }}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                padding: "10px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleQuiz;
