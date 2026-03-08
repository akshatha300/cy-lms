import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getRoadmapById, getRoadmapProgress } from "../../api/careerRoadmapApi";
import { 
  ArrowLeft, 
  CheckCircle, 
  Circle, 
  Clock, 
  Target, 
  TrendingUp,
  BookOpen,
  Code,
  Award,
  AlertCircle,
  Play,
  BarChart3,
  Star,
  Users,
  Calendar,
  Zap
} from "lucide-react";

const CareerRoadmapDetail = () => {
  const { roleId } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRoadmapData();
  }, [roleId]);

  const loadRoadmapData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [roadmapData, progressData] = await Promise.all([
        getRoadmapById(roleId),
        getRoadmapProgress(roleId)
      ]);

      setRoadmap(roadmapData.roadmap);
      setProgress(progressData.progress);
    } catch (err) {
      console.error("Failed to load roadmap:", err);
      setError("Failed to load roadmap details");
    } finally {
      setLoading(false);
    }
  };

  const getReadinessColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getReadinessLevel = (score) => {
    if (score >= 80) return "Job Ready";
    if (score >= 60) return "Intermediate";
    return "Beginner";
  };

  const getReadinessMessage = (score) => {
    if (score >= 80) return "🎉 Start applying for jobs!";
    if (score >= 60) return "Almost ready - keep going!";
    return "Focus on fundamentals first";
  };

  const getStatusIcon = (completed) => {
    return completed ? <CheckCircle size={20} color="#10b981" /> : <Circle size={20} color="#6b7280" />;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "#10b981";
    if (percentage >= 60) return "#f59e0b";
    if (percentage >= 40) return "#3b82f6";
    return "#6b7280";
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", color: "#fff", textAlign: "center" }}>
        <div>Loading roadmap details...</div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div style={{ padding: "20px", color: "#fff", textAlign: "center" }}>
        <div style={{ color: "#ef4444", marginBottom: "20px" }}>{error}</div>
        <Link
          to="/career-roadmap"
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "8px"
          }}
        >
          Back to Career Paths
        </Link>
      </div>
    );
  }

  const metrics = progress?.overallMetrics || {};
  const recommendations = progress?.recommendations || [];

  return (
    <div style={{ padding: "20px", color: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <Link
          to="/career-roadmap"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#9ca3af",
            textDecoration: "none",
            marginBottom: "20px"
          }}
        >
          <ArrowLeft size={16} />
          Back to Career Paths
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "15px" }}>
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
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>
              {roadmap.roleName}
            </h1>
            <p style={{ color: "#d1d5db", fontSize: "16px", lineHeight: "1.5" }}>
              {roadmap.description}
            </p>
          </div>
        </div>
      </div>

      {/* Readiness Score Overview */}
      {metrics && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "20px", 
          marginBottom: "30px" 
        }}>
          {/* Main Readiness Score */}
          <div style={{
            backgroundColor: "#1f2937",
            borderRadius: "16px",
            padding: "30px",
            textAlign: "center",
            border: "2px solid",
            borderColor: getReadinessColor(metrics.readinessScore)
          }}>
            <div style={{ fontSize: "48px", fontWeight: "bold", color: getReadinessColor(metrics.readinessScore), marginBottom: "10px" }}>
              {metrics.readinessScore}%
            </div>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
              {getReadinessLevel(metrics.readinessScore)}
            </div>
            <div style={{ fontSize: "14px", color: "#9ca3af" }}>
              {getReadinessMessage(metrics.readinessScore)}
            </div>
          </div>

          {/* Progress Metrics */}
          <div style={{ backgroundColor: "#1f2937", borderRadius: "16px", padding: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
              <BarChart3 size={18} />
              Progress Metrics
            </h3>
            
            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>Modules</span>
                  <span style={{ fontSize: "12px", color: "#fff" }}>{metrics.moduleCompletion}%</span>
                </div>
                <div style={{ height: "6px", backgroundColor: "#374151", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${metrics.moduleCompletion}%`,
                    backgroundColor: getProgressColor(metrics.moduleCompletion),
                    transition: "width 0.3s ease"
                  }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>Labs</span>
                  <span style={{ fontSize: "12px", color: "#fff" }}>{metrics.labCompletion}%</span>
                </div>
                <div style={{ height: "6px", backgroundColor: "#374151", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${metrics.labCompletion}%`,
                    backgroundColor: getProgressColor(metrics.labCompletion),
                    transition: "width 0.3s ease"
                  }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>Quiz Average</span>
                  <span style={{ fontSize: "12px", color: "#fff" }}>{metrics.quizAverage}%</span>
                </div>
                <div style={{ height: "6px", backgroundColor: "#374151", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${metrics.quizAverage}%`,
                    backgroundColor: getProgressColor(metrics.quizAverage),
                    transition: "width 0.3s ease"
                  }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>Skills</span>
                  <span style={{ fontSize: "12px", color: "#fff" }}>{metrics.skillCompetency}%</span>
                </div>
                <div style={{ height: "6px", backgroundColor: "#374151", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${metrics.skillCompetency}%`,
                    backgroundColor: getProgressColor(metrics.skillCompetency),
                    transition: "width 0.3s ease"
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Time Tracking */}
          <div style={{ backgroundColor: "#1f2937", borderRadius: "16px", padding: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={18} />
              Time Tracking
            </h3>
            
            <div style={{ display: "grid", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>Estimated Duration</span>
                <span style={{ fontSize: "12px", color: "#fff" }}>{roadmap.estimatedDuration} weeks</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>Started</span>
                <span style={{ fontSize: "12px", color: "#fff" }}>
                  {progress?.startedAt ? new Date(progress.startedAt).toLocaleDateString() : "Not started"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>Last Activity</span>
                <span style={{ fontSize: "12px", color: "#fff" }}>
                  {progress?.lastAccessedAt ? new Date(progress.lastAccessedAt).toLocaleDateString() : "Never"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Zap size={20} />
            Recommendations
          </h3>
          <div style={{ display: "grid", gap: "15px" }}>
            {recommendations.map((rec, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: rec.priority === "high" ? "#7c2d12" : 
                                 rec.priority === "medium" ? "#78350f" : "#1e3a8a",
                  borderRadius: "12px",
                  padding: "20px",
                  border: "1px solid",
                  borderColor: rec.priority === "high" ? "#dc2626" : 
                               rec.priority === "medium" ? "#d97706" : "#3b82f6"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  {rec.priority === "high" && <AlertCircle size={20} color="#ef4444" />}
                  {rec.priority === "medium" && <Star size={20} color="#f59e0b" />}
                  {rec.priority === "info" && <Target size={20} color="#3b82f6" />}
                  <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}>
                    {rec.title}
                  </h4>
                </div>
                <p style={{ fontSize: "14px", color: "#d1d5db", marginBottom: "15px", lineHeight: "1.5" }}>
                  {rec.description}
                </p>
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor: rec.priority === "high" ? "#dc2626" : 
                                   rec.priority === "medium" ? "#d97706" : "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Play size={14} />
                  {rec.action === "start_module" ? "Start Module" :
                   rec.action === "retake_quiz" ? "Retake Quiz" :
                   rec.action === "retry_lab" ? "Retry Lab" :
                   rec.action === "practice_skill" ? "Practice Skill" :
                   "Continue Learning"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Required Components */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "30px" }}>
        {/* Required Modules */}
        <div style={{ backgroundColor: "#1f2937", borderRadius: "16px", padding: "25px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <BookOpen size={20} />
            Required Modules
          </h3>
          
          <div style={{ display: "grid", gap: "12px" }}>
            {roadmap.requiredModules?.map((module, index) => {
              const moduleProgress = progress?.moduleProgress?.find(m => 
                m.moduleId === module.moduleId
              );
              const isCompleted = moduleProgress?.completed || false;
              
              return (
                <div
                  key={module.moduleId || index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    backgroundColor: isCompleted ? "#065f46" : "#111827",
                    borderRadius: "8px",
                    border: isCompleted ? "1px solid #10b981" : "1px solid #374151"
                  }}
                >
                  {getStatusIcon(isCompleted)}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", color: "#fff", fontWeight: "500" }}>
                      {module.moduleName}
                    </div>
                    {isCompleted && moduleProgress?.quizScore && (
                      <div style={{ fontSize: "12px", color: "#10b981" }}>
                        Score: {moduleProgress.quizScore}%
                      </div>
                    )}
                  </div>
                  {!isCompleted && (
                    <Link
                      to={`/modules/${module.moduleId}`}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#3b82f6",
                        color: "#fff",
                        textDecoration: "none",
                        borderRadius: "6px",
                        fontSize: "12px"
                      }}
                    >
                      Start
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Required Labs */}
        <div style={{ backgroundColor: "#1f2937", borderRadius: "16px", padding: "25px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Code size={20} />
            Required Labs
          </h3>
          
          <div style={{ display: "grid", gap: "12px" }}>
            {roadmap.requiredLabs?.map((lab, index) => {
              const labProgress = progress?.labProgress?.find(l => 
                l.labId === lab.labId
              );
              const isCompleted = labProgress?.completed || false;
              
              return (
                <div
                  key={lab.labId || index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    backgroundColor: isCompleted ? "#065f46" : "#111827",
                    borderRadius: "8px",
                    border: isCompleted ? "1px solid #10b981" : "1px solid #374151"
                  }}
                >
                  {getStatusIcon(isCompleted)}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", color: "#fff", fontWeight: "500" }}>
                      {lab.labName}
                    </div>
                    {isCompleted && labProgress?.accuracy && (
                      <div style={{ fontSize: "12px", color: "#10b981" }}>
                        Accuracy: {labProgress.accuracy}%
                      </div>
                    )}
                    {!isCompleted && (
                      <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                        Min accuracy: {lab.minAccuracy}%
                      </div>
                    )}
                  </div>
                  {!isCompleted && (
                    <Link
                      to={`/labs/${lab.labId}/detail`}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#3b82f6",
                        color: "#fff",
                        textDecoration: "none",
                        borderRadius: "6px",
                        fontSize: "12px"
                      }}
                    >
                      Start
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Required Skills */}
        <div style={{ backgroundColor: "#1f2937", borderRadius: "16px", padding: "25px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Award size={20} />
            Required Skills
          </h3>
          
          <div style={{ display: "grid", gap: "12px" }}>
            {roadmap.requiredSkills?.map((skill, index) => {
              const skillProgress = progress?.skillProgress?.find(s => 
                s.skillId === skill.skillId
              );
              const competency = skillProgress?.competency || 0;
              const minCompetency = skill.minCompetency;
              
              return (
                <div
                  key={skill.skillId || index}
                  style={{
                    padding: "12px",
                    backgroundColor: "#111827",
                    borderRadius: "8px",
                    border: "1px solid #374151"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "14px", color: "#fff", fontWeight: "500" }}>
                      {skill.skillName}
                    </span>
                    <span style={{ fontSize: "12px", color: competency >= minCompetency ? "#10b981" : "#9ca3af" }}>
                      {competency}% / {minCompetency}%
                    </span>
                  </div>
                  <div style={{ height: "6px", backgroundColor: "#374151", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${competency}%`,
                      backgroundColor: competency >= minCompetency ? "#10b981" : "#f59e0b",
                      transition: "width 0.3s ease"
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestones */}
        {progress?.milestones && progress.milestones.length > 0 && (
          <div style={{ backgroundColor: "#1f2937", borderRadius: "16px", padding: "25px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Star size={20} />
              Recent Achievements
            </h3>
            
            <div style={{ display: "grid", gap: "10px" }}>
              {progress.milestones.slice(-5).reverse().map((milestone, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px",
                    backgroundColor: "#111827",
                    borderRadius: "8px"
                  }}
                >
                  <Star size={16} color="#f59e0b" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", color: "#fff" }}>
                      {milestone.description}
                    </div>
                    <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                      {new Date(milestone.achievedAt).toLocaleDateString()}
                      {milestone.score && ` • Score: ${milestone.score}%`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerRoadmapDetail;
