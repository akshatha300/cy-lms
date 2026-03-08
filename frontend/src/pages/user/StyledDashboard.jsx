import { useQuery } from "@tanstack/react-query";
import { Trophy, Target, Brain, Zap, Award, Activity, BookOpen, TrendingUp, Clock, Users, FlaskConical, Briefcase, Network, Mic } from "lucide-react";
import { getModules } from "../../api/moduleApi";
import { fetchProgress } from "../../api/progressApi";
import { Link } from "react-router-dom";
import CareerRoadmap from "./CareerRoadmap";
import CareerRoadmapDetail from "./CareerRoadmapDetail";
import InteractiveKnowledgeGraph from "./InteractiveKnowledgeGraph";
import VoiceTutor from "./VoiceTutor";

const StyledDashboard = () => {
  // Fetch modules
  const {
    data: modulesData,
    isLoading: modulesLoading,
    error: modulesError
  } = useQuery({
    queryKey: ["modules"],
    queryFn: getModules,
  });

  // Fetch progress
  const {
    data: progressData,
    isLoading: progressLoading,
    error: progressError
  } = useQuery({
    queryKey: ["progress"],
    queryFn: fetchProgress,
  });

  // Calculate data
  const modules = modulesData?.modules || modulesData || [];
  const progress = progressData?.progress || {};

  const stats = [
    {
      icon: Target,
      label: "Modules Completed",
      value: progress.completedModules?.length || 0,
      description: `of ${modules.length} total`,
      color: "#3b82f6"
    },
    {
      icon: Trophy,
      label: "Average Score",
      value: `${progress.averageScore || 0}%`,
      description: "Overall performance",
      color: "#10b981"
    },
    {
      icon: Zap,
      label: "Study Streak",
      value: progress.studyStreak || 0,
      description: "Days in a row",
      color: "#f59e0b"
    },
    {
      icon: Clock,
      label: "Study Time",
      value: `${Math.floor((progress.totalStudyTime || 0) / 60)}h ${((progress.totalStudyTime || 0) % 60)}m`,
      description: "This week",
      color: "#8b5cf6"
    }
  ];

  const recentModules = modules.slice(0, 3);

  const achievements = [
    {
      icon: Trophy,
      title: "Quick Learner",
      description: "Completed first module",
      achieved: (progress.completedModules?.length || 0) >= 1
    },
    {
      icon: Zap,
      title: "Consistent Student",
      description: "7-day streak",
      achieved: (progress.studyStreak || 0) >= 7
    },
    {
      icon: Brain,
      title: "Knowledge Seeker",
      description: "Score above 80%",
      achieved: (progress.averageScore || 0) >= 80
    }
  ];

  if (modulesLoading || progressLoading) {
    return (
      <div style={{ padding: "20px" }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (modulesError || progressError) {
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
          <p style={{ margin: 0, color: "#991b1b" }}>Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 AIML Learning Dashboard</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Track your progress and continue your AI/ML learning journey
      </p>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          marginBottom: "24px",
        }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              style={{
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "#f9fafb",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = stat.color)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "16px",
                  }}
                >
                  <Icon size={24} color="white" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>
                    {stat.value}
                  </h3>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
                    {stat.label}
                  </p>
                </div>
              </div>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "12px" }}>
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Modules & Achievements */}
      <div
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          marginBottom: "24px",
        }}
      >
        {/* Recent Modules */}
        <div
          style={{
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            backgroundColor: "#f9fafb",
          }}
        >
          <h3 style={{ margin: "0 0 16px 0", color: "#1f2937", display: "flex", alignItems: "center" }}>
            <BookOpen size={20} style={{ marginRight: "8px" }} />
            Continue Learning
          </h3>
          <div style={{ spaceY: "12px" }}>
            {recentModules.map((module) => (
              <Link
                key={module._id}
                to={`/modules/${module._id}`}
                style={{
                  display: "block",
                  padding: "12px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "#1f2937",
                  marginBottom: "8px",
                  border: "1px solid #e5e7eb",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0e7ff")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
                      {module.title}
                    </h4>
                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
                      {module.description?.substring(0, 60)}...
                    </p>
                  </div>
                  <div style={{ color: "#3b82f6", fontSize: "12px" }}>
                    Continue →
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link
            to="/modules"
            style={{
              display: "inline-block",
              marginTop: "12px",
              color: "#3b82f6",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            View all modules →
          </Link>
        </div>

        {/* Achievements */}
        <div
          style={{
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            backgroundColor: "#f9fafb",
          }}
        >
          <h3 style={{ margin: "0 0 16px 0", color: "#1f2937", display: "flex", alignItems: "center" }}>
            <Award size={20} style={{ marginRight: "8px" }} />
            Achievements
          </h3>
          <div style={{ spaceY: "12px" }}>
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px",
                    backgroundColor: achievement.achieved ? "#f0fdf4" : "#f9fafb",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    border: `1px solid ${achievement.achieved ? "#10b981" : "#e5e7eb"}`,
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: achievement.achieved 
                        ? "linear-gradient(135deg, #10b981, #059669)" 
                        : "linear-gradient(135deg, #d1d5db, #6b7280)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "12px",
                    }}
                  >
                    <Icon size={16} color={achievement.achieved ? "white" : "#9ca3af"} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#1f2937" }}>
                      {achievement.title}
                    </h4>
                    <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
                      {achievement.description}
                    </p>
                    {achievement.achieved && (
                      <span style={{ color: "#10b981", fontSize: "11px", fontWeight: "500" }}>
                        ✓ Achieved
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div
        style={{
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
          backgroundColor: "#f9fafb",
        }}
      >
        <h3 style={{ margin: "0 0 16px 0", color: "#1f2937" }}>
          Overall Progress
        </h3>
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: "100%",
              backgroundColor: "#e5e7eb",
              borderRadius: "8px",
              height: "8px",
            }}
          >
            <div
              style={{
                width: `${((progress.completedModules?.length || 0) / modules.length) * 100}%`,
                background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
                borderRadius: "8px",
                height: "8px",
                transition: "width 1s ease-out",
              }}
            ></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>
              {progress.completedModules?.length || 0} of {modules.length} modules
            </span>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#3b82f6" }}>
              {Math.round(((progress.completedModules?.length || 0) / modules.length) * 100)}% Complete
            </span>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div
        style={{
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
          backgroundColor: "#f9fafb",
          marginTop: "24px",
        }}
      >
        <h3 style={{ margin: "0 0 16px 0", color: "#1f2937" }}>
          Quick Navigation
        </h3>
        <div
          style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          <Link
            to="/modules"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "16px",
              backgroundColor: "#f3f4f6",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0e7ff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
          >
            <BookOpen size={24} color="#3b82f6" style={{ marginBottom: "8px" }} />
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Modules</span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              View all {modules.length} modules
            </span>
          </Link>

          <Link
            to="/labs"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "16px",
              backgroundColor: "#f3f4f6",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0e7ff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
          >
            <FlaskConical size={24} color="#10b981" style={{ marginBottom: "8px" }} />
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Labs</span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              Practical exercises & projects
            </span>
          </Link>

          <Link
            to="/chat"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "16px",
              backgroundColor: "#f3f4f6",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0e7ff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
          >
            <Brain size={24} color="#8b5cf6" style={{ marginBottom: "8px" }} />
            <span style={{ fontSize: "14px", fontWeight: "600" }}>AI Tutor</span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              Get help with AIML topics
            </span>
          </Link>

          <Link
            to="/career-roadmap"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "16px",
              backgroundColor: "#f3f4f6",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0e7ff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
          >
            <Briefcase size={24} color="#f59e0b" style={{ marginBottom: "8px" }} />
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Career Roadmap</span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              Choose your AIML career path
            </span>
          </Link>

          <Link
            to="/knowledge-graph"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "16px",
              backgroundColor: "#f3f4f6",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0e7ff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
          >
            <Network size={24} color="#8b5cf6" style={{ marginBottom: "8px" }} />
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Knowledge Graph</span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              Explore ML concept relationships interactively
            </span>
          </Link>

          <Link
            to="/voice-tutor"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "16px",
              backgroundColor: "#f3f4f6",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0e7ff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
          >
            <Mic size={24} color="#10b981" style={{ marginBottom: "8px" }} />
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Voice Tutor</span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              Ask questions with voice
            </span>
          </Link>

          <Link
            to="/progress"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "16px",
              backgroundColor: "#f3f4f6",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0e7ff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
          >
            <TrendingUp size={24} color="#059669" style={{ marginBottom: "8px" }} />
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Progress</span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              Track your learning journey
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StyledDashboard;
