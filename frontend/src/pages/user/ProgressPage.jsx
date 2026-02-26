import React, { useState, useEffect } from "react";
import { quizApiService } from "../../api/quizApi";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  BookOpen, 
  CheckCircle,
  XCircle,
  Calendar
} from "lucide-react";

const ProgressPage = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState(null);
  const [moduleAttempts, setModuleAttempts] = useState([]);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const data = await quizApiService.getQuizProgress();
      setProgressData(data);
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadModuleAttempts = async (moduleId) => {
    try {
      const data = await quizApiService.getModuleAttempts(moduleId);
      setModuleAttempts(data.attempts);
    } catch (error) {
      console.error("Error loading module attempts:", error);
    }
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981"; // green
    if (score >= 60) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy": return "#10b981";
      case "medium": return "#f59e0b";
      case "hard": return "#ef4444";
      default: return "#6b7280";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No progress data available.</p>
      </div>
    );
  }

  // Prepare chart data
  const moduleProgressData = progressData.moduleProgress.map(module => ({
    name: module.metadata.title.split(' ')[0], // Shorten name for chart
    score: module.bestScore,
    passed: module.passed ? 1 : 0,
    attempts: module.totalAttempts,
  }));

  const pieData = [
    { name: "Passed", value: progressData.passedModules, color: "#10b981" },
    { name: "Not Passed", value: progressData.totalModules - progressData.passedModules, color: "#ef4444" }
  ];

  const recentActivityData = progressData.recentAttempts.slice(0, 7).reverse().map((attempt, index) => ({
    day: `Day ${index + 1}`,
    score: attempt.score,
    moduleName: attempt.moduleName.split(' ')[0],
  }));

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">Your Learning Progress</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{progressData.overallProgress}%</div>
            <div className="text-blue-100">Overall Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{progressData.passedModules}/{progressData.totalModules}</div>
            <div className="text-blue-100">Modules Passed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{progressData.averageScore}%</div>
            <div className="text-blue-100">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{progressData.recentAttempts.length}</div>
            <div className="text-blue-100">Total Attempts</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Module Progress Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart className="w-5 h-5 mr-2" />
            Module Scores
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moduleProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Pie Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Completion Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Recent Activity
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={recentActivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Module Details */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Module Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progressData.moduleProgress.map((module) => (
            <div 
              key={module.moduleId}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                module.passed ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
              onClick={() => {
                setSelectedModule(module);
                loadModuleAttempts(module.moduleId);
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{module.metadata.title}</h3>
                {module.passed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Score:</span>
                  <span 
                    className="font-medium"
                    style={{ color: getScoreColor(module.bestScore) }}
                  >
                    {module.bestScore}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attempts:</span>
                  <span className="font-medium">{module.totalAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Time:</span>
                  <span className="font-medium">{formatTime(module.averageTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span 
                    className="font-medium"
                    style={{ color: getDifficultyColor(module.metadata.difficulty) }}
                  >
                    {module.metadata.difficulty}
                  </span>
                </div>
              </div>

              {module.bestAttemptDate && (
                <div className="mt-3 pt-3 border-t text-xs text-gray-500 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Last attempt: {new Date(module.bestAttemptDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Module Attempts Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {selectedModule.metadata.title} - Attempt History
              </h3>
              <button
                onClick={() => setSelectedModule(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {moduleAttempts.map((attempt, index) => (
                <div key={attempt.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        Attempt {moduleAttempts.length - index}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(attempt.completedAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div 
                        className="text-lg font-bold"
                        style={{ color: getScoreColor(attempt.percentage) }}
                      >
                        {attempt.percentage}%
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(attempt.timeSpent)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressPage;
