import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Award, 
  Clock,
  BarChart3,
  Zap,
  CheckCircle
} from 'lucide-react';

const MLProgressTracker = ({ progress, modules }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress.overall || 0);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const getSkillLevel = (score) => {
    if (score >= 90) return { level: 'Expert', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (score >= 75) return { level: 'Advanced', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 60) return { level: 'Intermediate', color: 'text-green-600', bg: 'bg-green-100' };
    return { level: 'Beginner', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  };

  const skillLevel = getSkillLevel(animatedProgress);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">ML Learning Progress</h2>
            <p className="text-sm text-gray-500">Track your machine learning journey</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full ${skillLevel.bg} ${skillLevel.color} font-semibold text-sm`}>
          {skillLevel.level}
        </div>
      </div>

      {/* Main Progress Circle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - animatedProgress / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{animatedProgress}%</span>
              <span className="text-xs text-gray-500">Complete</span>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
        </div>

        {/* Stats Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Modules</span>
            </div>
            <span className="text-lg font-bold text-blue-600">
              {progress.completedModules || 0}/{modules?.length || 5}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Quizzes</span>
            </div>
            <span className="text-lg font-bold text-green-600">
              {progress.completedQuizzes || 0}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Score</span>
            </div>
            <span className="text-lg font-bold text-purple-600">
              {progress.averageScore || 0}%
            </span>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="space-y-3">
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
            <div className="flex justify-center mb-2">
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {progress.streak || 0}
            </div>
            <div className="text-sm text-gray-600">Day Streak 🔥</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex justify-center mb-2">
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {progress.totalHours || 0}
            </div>
            <div className="text-sm text-gray-600">Hours Learned</div>
          </div>
        </div>
      </div>

      {/* Module Progress Bars */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
          Module Progress
        </h3>
        {modules?.map((module, index) => {
          const moduleProgress = progress.moduleProgress?.[module._id] || 0;
          return (
            <div key={module._id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{module.title}</span>
                <span className="text-sm text-gray-500">{moduleProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${moduleProgress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MLProgressTracker;
