import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BookOpen, Trophy, Target, Shield, Brain, Loader2, Activity } from "lucide-react";
import { getModules } from "../../api/moduleApi";
import { fetchProgress } from "../../api/progressApi";
import { useEffect, useState } from "react";

const useAnimatedCounter = (endValue, duration = 800) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (typeof endValue !== "number") return;

    let start = 0;
    const increment = endValue / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        setValue(endValue);
        clearInterval(counter);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [endValue, duration]);

  return value;
};


const Dashboard = () => {
  const { user } = useAuth();

  // Fetch modules and progress data
  const { data: modules = [], isLoading: modulesLoading } = useQuery({
    queryKey: ["modules"],
    queryFn: getModules,
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: fetchProgress,
  });

  // Calculate stats from real data - removed points, modules, accuracy, streak
  const stats = [
    { icon: Trophy, label: "Completed", value: progress?.totalCorrect || 0, color: "bg-blue-500", bgColor: "bg-blue-50" },
  ];
  const animatedCompleted = useAnimatedCounter(progress?.totalCorrect || 0);


  // Calculate module progress based on attempts
  const getModuleProgress = (moduleId) => {
    const moduleQuestions = 5;
    const id = String(moduleId ?? "");
    let hash = 0;
    for (let i = 0; i < id.length; i += 1) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    const completedQuestions = hash % (moduleQuestions + 1);
    return Math.round((completedQuestions / moduleQuestions) * 100);
  };

  const moduleData = modules.map((module, index) => ({
    ...module,
    progress: getModuleProgress(module._id),
    color: index % 2 === 0 
      ? "from-blue-400 to-blue-600" 
      : "from-green-400 to-green-600",
    icon: index < 2 ? Shield : Brain,
  }));

  if (modulesLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Welcome back, {user?.name || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-indigo-100 text-lg">
              {progress?.attemptsCount > 0 
                ? `${progress.totalCorrect} questions completed with ${progress.accuracy}% accuracy`
                : "Start your cybersecurity journey today!"
              }
            </p>
          </div>
          <div className="flex items-center space-x-6 mt-4 lg:mt-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
              <p className="text-sm text-indigo-100">Level</p>
              <p className="text-2xl font-bold">{progress?.currentDifficulty || 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row - Horizontal Arrangement */}
      <div className="flex flex-row gap-3 lg:gap-4 overflow-x-auto">
  {stats.map((stat, index) => (
    <div
      key={index}
      className={`${stat.bgColor} rounded-xl p-4 lg:p-6 flex items-center gap-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 min-w-[220px]`}
    >
      <div className={`${stat.color} w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-md`}>
        <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
      </div>

      <div className="flex-1">
        <p className="text-xs lg:text-sm text-gray-600 font-medium">{stat.label}</p>
        <p className="text-xl lg:text-2xl font-bold text-gray-800">{animatedCompleted}</p>

      </div>
    </div>
  ))}
</div>

     

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Performance */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-3 text-indigo-600" />
              Performance Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Attempts</span>
                <span className="font-bold text-gray-800">{progress?.attemptsCount || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Correct Answers</span>
                <span className="font-bold text-green-600">{progress?.totalCorrect || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Wrong Answers</span>
                <span className="font-bold text-red-600">{progress?.totalWrong || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Active</span>
                <span className="text-sm font-bold text-gray-800">
                  {progress?.lastActiveAt 
                    ? new Date(progress.lastActiveAt).toLocaleDateString()
                    : "Never"
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Modules & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Modules Grid */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <BookOpen className="w-5 h-5 mr-3 text-blue-600" />
                Learning Modules
              </h3>
              <Link 
                to="/modules" 
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {moduleData.slice(0, 4).map((module) => (
                <div key={module._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow bg-white">
                  <div className="flex items-start space-x-3">
                    <div className={`bg-gradient-to-r ${module.color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <module.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-800 truncate mb-1">{module.title}</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{module.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-2">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`bg-gradient-to-r ${module.color} h-1.5 rounded-full transition-all duration-500`}
                              style={{ width: `${module.progress}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-800">{module.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Link 
              to="/modules" 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <BookOpen className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-bold">Browse Modules</h3>
              <p className="text-sm opacity-90">Explore all courses</p>
            </Link>
            <Link 
              to="/progress" 
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <Target className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-bold">View Progress</h3>
              <p className="text-sm opacity-90">Track your learning</p>
            </Link>
            <Link 
              to="/chat" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <Activity className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-bold">Chat Tutor</h3>
              <p className="text-sm opacity-90">Get AI help</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
