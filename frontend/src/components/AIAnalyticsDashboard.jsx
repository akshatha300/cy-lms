import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Brain,
  Target,
  Activity,
  Users,
  BookOpen,
  Award,
  Clock,
  BarChart3,
  PieChart,
  Zap,
  Eye,
  MessageSquare
} from 'lucide-react';

const AIAnalyticsDashboard = ({ analytics, userProgress }) => {
  const [animatedValues, setAnimatedValues] = useState({
    engagement: 0,
    improvement: 0,
    completion: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        engagement: analytics.engagement || 0,
        improvement: analytics.improvement || 0,
        completion: analytics.completion || 0
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [analytics]);

  const getEngagementColor = (value) => {
    if (value >= 80) return 'text-green-600 bg-green-100';
    if (value >= 60) return 'text-blue-600 bg-blue-100';
    if (value >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRecommendationPriority = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">AI Learning Analytics</h2>
              <p className="text-purple-100">Personalized insights powered by machine learning</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{animatedValues.engagement}%</div>
            <div className="text-sm text-purple-100">Engagement Score</div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span className={`text-xs px-2 py-1 rounded-full ${getEngagementColor(animatedValues.engagement)}`}>
              {animatedValues.engagement}%
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.weeklyHours || 0}</div>
          <div className="text-sm text-gray-500">Hours This Week</div>
          <div className="text-xs text-green-600 mt-1">+{analytics.weeklyGrowth || 0}% from last week</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-green-500" />
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
              On Track
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{animatedValues.completion}%</div>
          <div className="text-sm text-gray-500">Completion Rate</div>
          <div className="text-xs text-blue-600 mt-1">Ahead by {analytics.daysAhead || 0} days</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
              Improving
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{animatedValues.improvement}%</div>
          <div className="text-sm text-gray-500">Skill Growth</div>
          <div className="text-xs text-green-600 mt-1">+{analytics.skillPoints || 0} points</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
              Active
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.streak || 0}</div>
          <div className="text-sm text-gray-500">Day Streak</div>
          <div className="text-xs text-orange-600 mt-1">Personal best: {analytics.bestStreak || 0}</div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              AI Recommendations
            </h3>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {analytics.recommendations?.length || 0} New
            </span>
          </div>
          <div className="space-y-3">
            {analytics.recommendations?.slice(0, 3).map((rec, index) => (
              <div key={index} className={`p-3 rounded-lg border ${getRecommendationPriority(rec.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{rec.title}</div>
                    <div className="text-xs mt-1 opacity-75">{rec.description}</div>
                  </div>
                  <span className="text-xs font-medium capitalize">{rec.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Pattern Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Learning Patterns
            </h3>
            <Eye className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Best Learning Time</span>
                <span className="font-medium">{analytics.bestTime || 'Evening'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Focus Duration</span>
                <span className="font-medium">{analytics.focusDuration || '45 min'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Quiz Performance</span>
                <span className="font-medium">{analytics.quizPerformance || '82%'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-600" />
            Learning Activity
          </h3>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-200 rounded-sm mr-1"></div>
              No activity
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-200 rounded-sm mr-1"></div>
              Low
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-sm mr-1"></div>
              Medium
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded-sm mr-1"></div>
              High
            </div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }, (_, i) => {
            const intensity = Math.random();
            const bgColor = intensity > 0.7 ? 'bg-green-600' : 
                           intensity > 0.4 ? 'bg-green-400' : 
                           intensity > 0.1 ? 'bg-green-200' : 'bg-gray-200';
            return (
              <div
                key={i}
                className={`aspect-square rounded-sm ${bgColor} hover:ring-2 hover:ring-green-300 transition-all cursor-pointer`}
                title={`Day ${i + 1}: ${Math.floor(intensity * 100)}% activity`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsDashboard;
