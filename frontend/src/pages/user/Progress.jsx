import { useQuery } from "@tanstack/react-query";
import { Trophy, Target, Brain, Zap, Award, Activity, BarChart3 } from "lucide-react";
import { fetchProgress } from "../../api/progressApi";

const Progress = () => {
  const { data: progressData, isLoading, error } = useQuery({
    queryKey: ["progress"],
    queryFn: fetchProgress,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-gray-600">Failed to load progress data</p>
      </div>
    );
  }

  const {
    accuracy,
    attemptsCount,
    totalCorrect,
    streak,
    currentDifficulty,
  } = progressData;

  const stats = [
    {
      icon: Target,
      label: "Accuracy",
      value: `${accuracy || 0}%`,
      bgColor: "#f9fafb",
      iconBg: "#6b7280",
      textColor: "#374151",
    },
    {
      icon: Trophy,
      label: "Correct Answers",
      value: totalCorrect || 0,
      bgColor: "#f9fafb",
      iconBg: "#6b7280",
      textColor: "#374151",
    },
    {
      icon: Activity,
      label: "Total Attempts",
      value: attemptsCount || 0,
      bgColor: "#f9fafb",
      iconBg: "#6b7280",
      textColor: "#374151",
    },
    {
      icon: Zap,
      label: "Current Streak",
      value: streak || 0,
      bgColor: "#f9fafb",
      iconBg: "#6b7280",
      textColor: "#374151",
    },
    {
      icon: Brain,
      label: "Difficulty Level",
      value: currentDifficulty || 1,
      bgColor: "#f9fafb",
      iconBg: "#6b7280",
      textColor: "#374151",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div style={{ background: "linear-gradient(to right, #374151, #6b7280)" }} className="rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Progress Analytics</h1>
            <p className="text-gray-200">Track your learning journey and achievements</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} style={{ backgroundColor: stat.bgColor }} className="rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div style={{ backgroundColor: stat.iconBg }} className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-md">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold" style={{ color: stat.textColor }}>{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-3 text-gray-600" />
            Performance Summary
          </h3>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Success Rate</span>
                </div>
                <span className="text-lg font-bold text-gray-800">{accuracy || 0}%</span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Learning Pace</span>
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {attemptsCount > 0 ? Math.round(attemptsCount / 10) : 0} q/day
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Current Streak</span>
                </div>
                <span className="text-lg font-bold text-gray-800">{streak || 0} days</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Brain className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Difficulty Level</span>
                </div>
                <span className="text-lg font-bold text-gray-800">Level {currentDifficulty || 1}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-3 text-gray-600" />
          Achievement Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`text-center p-4 rounded-lg border-2 ${
            accuracy >= 80 ? 'bg-gray-100 border-gray-400' : 'bg-gray-50 border-gray-200'
          }`}>
            <Trophy className={`w-8 h-8 mx-auto mb-2 ${accuracy >= 80 ? 'text-gray-700' : 'text-gray-400'}`} />
            <p className="text-sm font-medium">High Scorer</p>
            <p className="text-xs text-gray-600">80%+ accuracy</p>
          </div>
          <div className={`text-center p-4 rounded-lg border-2 ${
            streak >= 7 ? 'bg-gray-100 border-gray-400' : 'bg-gray-50 border-gray-200'
          }`}>
            <Zap className={`w-8 h-8 mx-auto mb-2 ${streak >= 7 ? 'text-gray-700' : 'text-gray-400'}`} />
            <p className="text-sm font-medium">Week Warrior</p>
            <p className="text-xs text-gray-600">7-day streak</p>
          </div>
          <div className={`text-center p-4 rounded-lg border-2 ${
            attemptsCount >= 50 ? 'bg-gray-100 border-gray-400' : 'bg-gray-50 border-gray-200'
          }`}>
            <Activity className={`w-8 h-8 mx-auto mb-2 ${attemptsCount >= 50 ? 'text-gray-700' : 'text-gray-400'}`} />
            <p className="text-sm font-medium">Dedicated</p>
            <p className="text-xs text-gray-600">50+ attempts</p>
          </div>
          <div className={`text-center p-4 rounded-lg border-2 ${
            currentDifficulty >= 3 ? 'bg-gray-100 border-gray-400' : 'bg-gray-50 border-gray-200'
          }`}>
            <Brain className={`w-8 h-8 mx-auto mb-2 ${currentDifficulty >= 3 ? 'text-gray-700' : 'text-gray-400'}`} />
            <p className="text-sm font-medium">Advanced</p>
            <p className="text-xs text-gray-600">Level 3+</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
