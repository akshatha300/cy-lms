import React, { useState, useEffect } from 'react';
import {
  Brain,
  Target,
  Award,
  TrendingUp,
  Radar,
  BarChart3,
  PieChart,
  Star,
  Zap,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

const SkillAssessmentDashboard = ({ skills, assessments, recommendations }) => {
  const [animatedSkills, setAnimatedSkills] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedSkills(skills || {});
    }, 100);
    return () => clearTimeout(timer);
  }, [skills]);

  const getSkillColor = (level) => {
    switch(level) {
      case 'expert': return 'text-purple-600 bg-purple-100';
      case 'advanced': return 'text-blue-600 bg-blue-100';
      case 'intermediate': return 'text-green-600 bg-green-100';
      case 'beginner': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-gradient-to-r from-purple-500 to-purple-600';
    if (score >= 60) return 'bg-gradient-to-r from-blue-500 to-blue-600';
    if (score >= 40) return 'bg-gradient-to-r from-green-500 to-green-600';
    return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
  };

  const skillCategories = [
    { name: 'Machine Learning', icon: Brain, key: 'machineLearning' },
    { name: 'Data Analysis', icon: BarChart3, key: 'dataAnalysis' },
    { name: 'Programming', icon: Target, key: 'programming' },
    { name: 'Statistics', icon: PieChart, key: 'statistics' },
    { name: 'Deep Learning', icon: Zap, key: 'deepLearning' },
    { name: 'Feature Engineering', icon: Lightbulb, key: 'featureEngineering' }
  ];

  return (
    <div className="space-y-6">
      {/* Skills Overview Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Skill Assessment Dashboard</h2>
              <p className="text-indigo-100">Comprehensive evaluation of your data science expertise</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{assessments?.overallScore || 0}%</div>
            <div className="text-sm text-indigo-100">Overall Proficiency</div>
          </div>
        </div>
      </div>

      {/* Skills Radar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Radar className="w-5 h-5 mr-2 text-indigo-600" />
            Skills Radar
          </h3>
          <div className="relative h-64 flex items-center justify-center">
            {/* Simplified radar visualization */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-gray-200 rounded-full"></div>
                <div className="absolute w-32 h-32 border-2 border-gray-300 rounded-full"></div>
                <div className="absolute w-16 h-16 border-2 border-gray-400 rounded-full"></div>
              </div>
              {/* Skill points positioned around the circle */}
              {skillCategories.map((category, index) => {
                const angle = (index * 60) - 90; // Distribute evenly
                const radius = 80; // Radius of the circle
                const x = Math.cos(angle * Math.PI / 180) * radius;
                const y = Math.sin(angle * Math.PI / 180) * radius;
                const skill = animatedSkills[category.key] || { score: 0 };
                
                return (
                  <div
                    key={category.key}
                    className="absolute w-4 h-4 bg-indigo-600 rounded-full border-2 border-white shadow-lg"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      left: '50%',
                      top: '50%',
                      marginLeft: '-8px',
                      marginTop: '-8px'
                    }}
                    title={`${category.name}: ${skill.score}%`}
                  />
                );
              })}
            </div>
            {/* Labels */}
            <div className="absolute inset-0">
              {skillCategories.map((category, index) => {
                const angle = (index * 60) - 90;
                const radius = 120;
                const x = Math.cos(angle * Math.PI / 180) * radius;
                const y = Math.sin(angle * Math.PI / 180) * radius;
                
                return (
                  <div
                    key={category.key}
                    className="absolute text-xs font-medium text-gray-600"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      left: '50%',
                      top: '50%',
                      marginLeft: '-30px',
                      marginTop: '-8px',
                      width: '60px',
                      textAlign: 'center'
                    }}
                  >
                    {category.name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Skill Breakdown
          </h3>
          <div className="space-y-4">
            {skillCategories.map((category) => {
              const Icon = category.icon;
              const skill = animatedSkills[category.key] || { score: 0, level: 'beginner' };
              
              return (
                <div key={category.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-900">{skill.score}%</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getSkillColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor(skill.score)}`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assessment Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Completed
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{assessments?.completed || 0}</div>
          <div className="text-sm text-gray-500">Assessments Taken</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-purple-500" />
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              Achievement
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{assessments?.averageScore || 0}%</div>
          <div className="text-sm text-gray-500">Average Score</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Progress
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">+{assessments?.improvement || 0}%</div>
          <div className="text-sm text-gray-500">Skill Growth</div>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
            Personalized Learning Recommendations
          </h3>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
            AI-Powered
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations?.map((rec, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  rec.type === 'strength' ? 'bg-green-100' :
                  rec.type === 'improvement' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  {rec.type === 'strength' ? <Star className="w-4 h-4 text-green-600" /> :
                   rec.type === 'improvement' ? <AlertCircle className="w-4 h-4 text-yellow-600" /> :
                   <BookOpen className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">{rec.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{rec.description}</div>
                  {rec.action && (
                    <button className="text-xs text-indigo-600 hover:text-indigo-800 mt-2 font-medium">
                      {rec.action} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillAssessmentDashboard;
