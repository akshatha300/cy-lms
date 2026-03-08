import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCareerRoadmaps } from "../../api/careerRoadmapApi";
import { 
  Briefcase, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Star, 
  Users,
  Target,
  Award,
  ArrowRight
} from "lucide-react";

const CareerRoadmap = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    try {
      setLoading(true);
      const data = await getCareerRoadmaps();
      setRoadmaps(data.roadmaps || []);
    } catch (error) {
      console.error("Failed to load career roadmaps:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    if (selectedDifficulty === "all") return true;
    return roadmap.difficulty === selectedDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner": return "#10b981";
      case "intermediate": return "#f59e0b";
      case "advanced": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case "beginner": return "Beginner";
      case "intermediate": return "Intermediate";
      case "advanced": return "Advanced";
      default: return "All Levels";
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", color: "#fff", textAlign: "center" }}>
        <div>Loading career paths...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", color: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "42px", fontWeight: "bold", marginBottom: "15px" }}>
          Choose Your AIML Career Path
        </h1>
        <p style={{ fontSize: "18px", color: "#d1d5db", maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
          Select a career path that matches your interests and goals. Each roadmap provides a structured learning path 
          with specific modules, labs, and skills needed to succeed in that role.
        </p>
      </div>

      {/* Stats Overview */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "20px", 
        marginBottom: "40px" 
      }}>
        <div style={{ backgroundColor: "#1f2937", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          <Briefcase size={32} color="#3b82f6" style={{ marginBottom: "10px" }} />
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
            {roadmaps.length}
          </div>
          <div style={{ fontSize: "14px", color: "#9ca3af" }}>Career Paths</div>
        </div>
        
        <div style={{ backgroundColor: "#1f2937", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          <Users size={32} color="#10b981" style={{ marginBottom: "10px" }} />
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
            {roadmaps.reduce((sum, r) => sum + r.estimatedDuration, 0)}
          </div>
          <div style={{ fontSize: "14px", color: "#9ca3af" }}>Total Weeks Available</div>
        </div>
        
        <div style={{ backgroundColor: "#1f2937", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          <TrendingUp size={32} color="#f59e0b" style={{ marginBottom: "10px" }} />
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
            {roadmaps.filter(r => r.difficulty === "advanced").length}
          </div>
          <div style={{ fontSize: "14px", color: "#9ca3af" }}>Advanced Paths</div>
        </div>
        
        <div style={{ backgroundColor: "#1f2937", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          <Award size={32} color="#8b5cf6" style={{ marginBottom: "10px" }} />
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
            {Math.max(...roadmaps.map(r => r.salaryRange?.max || 0), 0).toLocaleString()}
          </div>
          <div style={{ fontSize: "14px", color: "#9ca3af" }}>Max Salary (USD)</div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: "30px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: "#9ca3af", fontSize: "14px" }}>Filter by difficulty:</span>
          {["all", "beginner", "intermediate", "advanced"].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedDifficulty(level)}
              style={{
                padding: "8px 16px",
                backgroundColor: selectedDifficulty === level ? "#3b82f6" : "#374151",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.2s ease"
              }}
            >
              {getDifficultyLabel(level)}
            </button>
          ))}
        </div>
      </div>

      {/* Career Roadmap Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
        gap: "30px" 
      }}>
        {filteredRoadmaps.map((roadmap) => (
          <div
            key={roadmap._id}
            style={{
              backgroundColor: "#1f2937",
              borderRadius: "16px",
              padding: "30px",
              border: "1px solid #374151",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Icon and Header */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              marginBottom: "20px",
              gap: "15px"
            }}>
              <div style={{
                fontSize: "48px",
                width: "80px",
                height: "80px",
                borderRadius: "16px",
                backgroundColor: roadmap.color + "20",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {roadmap.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontSize: "24px", 
                  fontWeight: "bold", 
                  color: "#fff", 
                  marginBottom: "8px",
                  lineHeight: "1.2"
                }}>
                  {roadmap.roleName}
                </h3>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px"
                }}>
                  <div style={{
                    padding: "4px 12px",
                    backgroundColor: getDifficultyColor(roadmap.difficulty) + "20",
                    color: getDifficultyColor(roadmap.difficulty),
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    {getDifficultyLabel(roadmap.difficulty)}
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: "#9ca3af",
                    fontSize: "12px"
                  }}>
                    <Clock size={12} />
                    {roadmap.estimatedDuration} weeks
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{ 
              color: "#d1d5db", 
              fontSize: "14px", 
              lineHeight: "1.6", 
              marginBottom: "20px" 
            }}>
              {roadmap.description}
            </p>

            {/* Key Info */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(2, 1fr)", 
              gap: "15px", 
              marginBottom: "20px" 
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <DollarSign size={16} color="#10b981" />
                <div>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>Salary Range</div>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: "#fff" }}>
                    ${(roadmap.salaryRange?.min || 0).toLocaleString()} - ${(roadmap.salaryRange?.max || 0).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp size={16} color="#f59e0b" />
                <div>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>Demand</div>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: "#fff" }}>
                    {roadmap.careerOutlook?.demand || "High"}
                  </div>
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            {roadmap.prerequisites && roadmap.prerequisites.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>Prerequisites:</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {roadmap.prerequisites.slice(0, 3).map((prereq, index) => (
                    <span
                      key={index}
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#374151",
                        color: "#d1d5db",
                        borderRadius: "12px",
                        fontSize: "11px"
                      }}
                    >
                      {prereq}
                    </span>
                  ))}
                  {roadmap.prerequisites.length > 3 && (
                    <span style={{ color: "#9ca3af", fontSize: "11px" }}>
                      +{roadmap.prerequisites.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Career Outlook */}
            {roadmap.careerOutlook && (
              <div style={{ 
                backgroundColor: "#111827", 
                padding: "15px", 
                borderRadius: "8px", 
                marginBottom: "20px" 
              }}>
                <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>Career Outlook:</div>
                <div style={{ fontSize: "13px", color: "#d1d5db", lineHeight: "1.4" }}>
                  {roadmap.careerOutlook.description}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Link
              to={`/career-roadmap/${roadmap._id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "14px 24px",
                backgroundColor: roadmap.color,
                color: "#fff",
                textDecoration: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                transition: "all 0.2s ease",
                border: "none",
                cursor: "pointer",
                width: "100%",
                textAlign: "center"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.filter = "brightness(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.filter = "brightness(1)";
              }}
            >
              <Target size={18} />
              View Roadmap
              <ArrowRight size={18} />
            </Link>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRoadmaps.length === 0 && (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px", 
          color: "#9ca3af" 
        }}>
          <Briefcase size={64} style={{ marginBottom: "20px", opacity: 0.5 }} />
          <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>No career paths found</h3>
          <p>Try adjusting the filter or check back later for new career paths.</p>
        </div>
      )}
    </div>
  );
};

export default CareerRoadmap;
