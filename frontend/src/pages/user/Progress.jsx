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
      <div style={{ padding: "20px" }}>
        <p>Loading progress...</p>
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
          <p style={{ margin: 0, color: "#991b1b" }}>Failed to load progress data</p>
        </div>
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
      description: "Overall success rate",
    },
    {
      icon: Trophy,
      label: "Correct Answers",
      value: totalCorrect || 0,
      description: "Total correct responses",
    },
    {
      icon: Activity,
      label: "Total Attempts",
      value: attemptsCount || 0,
      description: "Questions attempted",
    },
    {
      icon: Zap,
      label: "Current Streak",
      value: streak || 0,
      description: "Days in a row",
    },
    {
      icon: Brain,
      label: "Difficulty Level",
      value: `Level ${currentDifficulty || 1}`,
      description: "Current difficulty",
    },
  ];

  const achievements = [
    {
      icon: Trophy,
      title: "High Scorer",
      description: "80%+ accuracy",
      achieved: accuracy >= 80,
    },
    {
      icon: Zap,
      title: "Week Warrior",
      description: "7-day streak",
      achieved: streak >= 7,
    },
    {
      icon: Activity,
      title: "Dedicated",
      description: "50+ attempts",
      achieved: attemptsCount >= 50,
    },
    {
      icon: Brain,
      title: "Advanced",
      description: "Level 3+",
      achieved: currentDifficulty >= 3,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Progress Analytics</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Track your learning journey and achievements
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
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "16px",
                  }}
                >
                  <Icon size={24} color="white" />
                </div>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: "0.9rem", color: "#6b7280", fontWeight: "500" }}>
                    {stat.label}
                  </p>
                  <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937" }}>
                    {stat.value}
                  </p>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Performance Summary */}
      <div
        style={{
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
          backgroundColor: "#f9fafb",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ margin: "0 0 20px", fontSize: "1.2rem", fontWeight: "bold", color: "#1f2937" }}>
          🏆 Performance Summary
        </h3>
        <div
          style={{
            display: "grid",
            gap: "12px",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          }}
        >
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Trophy size={20} color="#6b7280" style={{ marginRight: "8px" }} />
                <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "500" }}>
                  Success Rate
                </span>
              </div>
              <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#1f2937" }}>
                {accuracy || 0}%
              </span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Target size={20} color="#6b7280" style={{ marginRight: "8px" }} />
                <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "500" }}>
                  Learning Pace
                </span>
              </div>
              <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#1f2937" }}>
                {attemptsCount > 0 ? Math.round(attemptsCount / 10) : 0} q/day
              </span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Zap size={20} color="#6b7280" style={{ marginRight: "8px" }} />
                <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "500" }}>
                  Current Streak
                </span>
              </div>
              <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#1f2937" }}>
                {streak || 0} days
              </span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Brain size={20} color="#6b7280" style={{ marginRight: "8px" }} />
                <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "500" }}>
                  Difficulty Level
                </span>
              </div>
              <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#1f2937" }}>
                Level {currentDifficulty || 1}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div
        style={{
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
          backgroundColor: "#f9fafb",
        }}
      >
        <h3 style={{ margin: "0 0 20px", fontSize: "1.2rem", fontWeight: "bold", color: "#1f2937" }}>
          🏅 Achievement Badges
        </h3>
        <div
          style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={index}
                style={{
                  textAlign: "center",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "2px solid",
                  borderColor: achievement.achieved ? "#10b981" : "#e5e7eb",
                  backgroundColor: achievement.achieved ? "#f0fdf4" : "#f9fafb",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (achievement.achieved) {
                    e.currentTarget.style.borderColor = "#059669";
                    e.currentTarget.style.backgroundColor = "#dcfce7";
                  } else {
                    e.currentTarget.style.borderColor = "#3b82f6";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = achievement.achieved ? "#10b981" : "#e5e7eb";
                  e.currentTarget.style.backgroundColor = achievement.achieved ? "#f0fdf4" : "#f9fafb";
                }}
              >
                <Icon
                  size={32}
                  color={achievement.achieved ? "#10b981" : "#9ca3af"}
                  style={{ marginBottom: "8px" }}
                />
                <p style={{ margin: "0 0 4px", fontSize: "0.9rem", fontWeight: "600", color: "#1f2937" }}>
                  {achievement.title}
                </p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
                  {achievement.description}
                </p>
                {achievement.achieved && (
                  <div
                    style={{
                      marginTop: "8px",
                      padding: "4px 8px",
                      backgroundColor: "#10b981",
                      color: "white",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      display: "inline-block",
                    }}
                  >
                    ✅ Achieved
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Progress;