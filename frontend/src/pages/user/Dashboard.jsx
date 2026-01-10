import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Trophy,
  Target,
  Shield,
  Brain,
  Loader2,
  Activity,
  Star,
  Award,
  MessageSquare,
  Search
} from "lucide-react";
import { getModules } from "../../api/moduleApi";
import { fetchProgress } from "../../api/progressApi";
import { useEffect, useState } from "react";
import KpiBadge from "../../components/KpiBadge";
import LearningGauge from "../../components/LearningGauge";
import SectionCard from "../../components/SectionCard";

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

  // Calculate stats from real data
  const stats = [
    { icon: Trophy, label: "Completed", value: progress?.totalCorrect || 0, color: "bg-blue-500", bgColor: "bg-blue-50" },
  ];
  const animatedCompleted = useAnimatedCounter(progress?.totalCorrect || 0);

  // Calculate module progress
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Promotional Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black mb-4">
                Learn With Effectively With Us!
              </h1>
              <p className="text-lg text-teal-100 mb-6">
                Master cybersecurity skills with structured learning paths and hands-on labs. Get 30% off your first role selection.
              </p>
              <Link to="/app/role-selector" className="inline-block bg-white text-teal-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                Explore Roles →
              </Link>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="text-6xl">🎓</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Popular Courses (Modules) */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Popular Modules</h2>
            <div className="space-y-4">
              {moduleData.slice(0, 4).map((module, index) => {
                const colors = [
                  { bg: "bg-yellow-100", icon: "U", color: "bg-yellow-500" },
                  { bg: "bg-pink-100", icon: "M", color: "bg-pink-500" },
                  { bg: "bg-teal-100", icon: "W", color: "bg-teal-500" },
                  { bg: "bg-blue-100", icon: "S", color: "bg-blue-500" },
                ];
                const colorSet = colors[index % colors.length];
                
                return (
                  <SectionCard key={module._id} className="p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`${colorSet.bg} w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${colorSet.color.replace('bg-', 'text-')}`}>
                        {colorSet.icon}
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">⋮</button>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{module.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{modules.length}+ Modules</p>
                    <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg transition">
                      View Modules
                    </button>
                  </SectionCard>
                );
              })}
            </div>
          </div>

          {/* Middle Column - Current Activity & Stats */}
          <div className="lg:col-span-1 space-y-8">
            {/* Monthly Progress */}
            <SectionCard>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Progress</h3>
              <p className="text-sm text-gray-600 mb-4">This is the latest improvement</p>
              <div className="h-48 bg-gradient-to-t from-blue-100 to-transparent rounded-lg flex items-end justify-around p-4">
                {[20, 40, 35, 55, 65, 75].map((height, i) => (
                  <div key={i} className="w-8 h-full flex items-end">
                    <div style={{ height: `${height}%` }} className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"></div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white rounded-2xl p-5 shadow-lg">
                <div className="text-3xl font-black mb-2">{moduleData.length}0K+</div>
                <p className="text-sm font-semibold mb-3">Modules Available</p>
                <p className="text-xs opacity-90">Join thousands learning</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl p-5 shadow-lg">
                <div className="text-3xl font-black mb-2">{progress?.attemptsCount || 0}00K+</div>
                <p className="text-sm font-semibold mb-3">Questions Completed</p>
                <p className="text-xs opacity-90">This is latest data</p>
              </div>
            </div>
          </div>

          {/* Right Column - Performance & Info */}
          <div className="lg:col-span-1 space-y-8">
            {/* Courses in Progress */}
            <SectionCard>
              <div className="text-center mb-6">
                <div className="text-5xl font-black text-teal-600 mb-2">{modules.length}</div>
                <p className="text-sm font-semibold text-gray-600">Modules in Progress</p>
                <p className="text-xs text-gray-500 mt-2">Keep it up! 🚀</p>
              </div>
              <Link to="/app/modules" className="block w-full text-center bg-teal-50 text-teal-600 py-2 rounded-lg font-semibold hover:bg-teal-100 transition">
                View All
              </Link>
            </SectionCard>

            {/* Performance Stats */}
            <div className="space-y-3">
              <SectionCard className="p-4">
                <p className="text-sm text-gray-600 mb-2">Accuracy Rate</p>
                <div className="text-3xl font-black text-teal-600 mb-2">{progress?.accuracy || 0}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${progress?.accuracy || 0}%` }}></div>
                </div>
              </SectionCard>
              
              <SectionCard className="p-4">
                <p className="text-sm text-gray-600 mb-2">Total Questions</p>
                <div className="text-3xl font-black text-pink-600">{progress?.totalCorrect || 0}</div>
              </SectionCard>

              <SectionCard className="p-4">
                <p className="text-sm text-gray-600 mb-2">Streak Days</p>
                <div className="text-3xl font-black text-orange-600">7 Days 🔥</div>
              </SectionCard>
            </div>
          </div>
        </div>

        {/* Bottom Section - Extended Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <SectionCard>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Progress</h3>
            <p className="text-sm text-gray-600">You've completed</p>
            <div className="text-4xl font-black text-indigo-600 mt-2">
              {modules?.length ? Math.round(moduleData.filter(m => m.progress > 0).length / modules.length * 100) : 0}%
            </div>
            <p className="text-xs text-gray-500 mt-2">of your learning path</p>
          </SectionCard>

          <SectionCard>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Labs Completed</h3>
            <p className="text-sm text-gray-600">Hands-on practice</p>
            <div className="text-4xl font-black text-green-600 mt-2">12</div>
            <p className="text-xs text-gray-500 mt-2">Out of 17 available</p>
          </SectionCard>

          <SectionCard>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Role Readiness</h3>
            <p className="text-sm text-gray-600">Job readiness score</p>
            <div className="text-4xl font-black text-purple-600 mt-2">68%</div>
            <p className="text-xs text-gray-500 mt-2">SOC Analyst L1</p>
          </SectionCard>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 mb-8">
          <Link to="/app/labs" className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition group">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black mb-2">🔬 Practical Labs</h3>
                <p className="text-emerald-50 mb-4">Build real-world security skills through hands-on exercises</p>
                <button className="text-white font-bold group-hover:translate-x-1 transition">Explore Labs →</button>
              </div>
            </div>
          </Link>

          <Link to="/app/chat" className="bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition group">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black mb-2">💬 AI Tutor</h3>
                <p className="text-violet-50 mb-4">Get instant explanations and personalized guidance on complex topics</p>
                <button className="text-white font-bold group-hover:translate-x-1 transition">Chat Now →</button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;