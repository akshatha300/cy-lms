import React, { useState, useEffect } from "react";
import { quizApiService } from "../api/quizApi";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const Quiz = ({ moduleId, onQuizComplete }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Timer effect
  useEffect(() => {
    if (startTime && !showResults) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, showResults]);

  // Load quiz questions
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await quizApiService.getQuizQuestions(moduleId);
        setQuiz(data);
        setStartTime(Date.now());
        // Initialize answers
        setAnswers(data.questions.map(q => ({
          questionId: q.id,
          selectedAnswer: null,
          timeSpent: 0,
        })));
      } catch (error) {
        console.error("Error loading quiz:", error);
      }
    };

    if (moduleId) {
      loadQuiz();
    }
  }, [moduleId]);

  const handleAnswerSelect = (questionIndex, selectedAnswer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex].selectedAnswer = selectedAnswer;
    newAnswers[questionIndex].timeSpent = timeSpent - (answers[questionIndex]?.timeSpent || 0);
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (answers.some(a => a.selectedAnswer === null)) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await quizApiService.submitQuiz(moduleId, answers, timeSpent);
      setResults(response);
      setShowResults(true);
      if (onQuizComplete) {
        onQuizComplete(response.results);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Error submitting quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quiz) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Quiz Results</h2>
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${
              results.results.passed 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {results.results.passed ? (
                <>
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Passed
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 mr-2" />
                  Not Passed
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {results.results.score}/{results.results.totalQuestions}
              </div>
              <div className="text-gray-600">Score</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {results.results.percentage}%
              </div>
              <div className="text-gray-600">Percentage</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatTime(results.results.timeSpent)}
              </div>
              <div className="text-gray-600">Time Spent</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Detailed Results</h3>
            {results.detailedResults.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                result.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    {result.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    )}
                    <span className="font-medium">Question {index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-500">{result.difficulty}</span>
                </div>
                
                <p className="mb-3">{result.question}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Your Answer:</span>
                    <p className={`p-2 rounded ${result.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                      {result.userAnswer}
                    </p>
                  </div>
                  {!result.isCorrect && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Correct Answer:</span>
                      <p className="p-2 rounded bg-green-100">
                        {result.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-blue-700">Explanation:</span>
                      <p className="text-sm text-blue-600">{result.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Module
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Quiz Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{quiz.metadata.title}</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-1" />
              {formatTime(timeSpent)}
            </div>
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            {currentQ.difficulty}
          </span>
          <h3 className="text-xl font-semibold mb-4">{currentQ.question}</h3>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <label
              key={index}
              className={`block p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-blue-300 ${
                answers[currentQuestion]?.selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={index}
                  checked={answers[currentQuestion]?.selectedAnswer === index}
                  onChange={() => handleAnswerSelect(currentQuestion, index)}
                  className="mr-3"
                />
                <span className="flex-1">{option}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div className="flex space-x-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-10 h-10 rounded-full border-2 transition-colors ${
                index === currentQuestion
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : answers[index]?.selectedAnswer !== null
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || answers.some(a => a.selectedAnswer === null)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
