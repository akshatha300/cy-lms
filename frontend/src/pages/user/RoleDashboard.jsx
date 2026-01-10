import { useState, useEffect } from "react";
import { getJobReadiness, getRoleProgress, getRoleById } from "../../api/roleBasedApi";
import { useParams, Link } from "react-router-dom";

const RoleDashboard = () => {
  const { roleId } = useParams();
  const [role, setRole] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [roleData, readinessData, progressData] = await Promise.all([
          getRoleById(roleId),
          getJobReadiness(roleId),
          getRoleProgress(roleId),
        ]);

        setRole(roleData);
        setReadiness(readinessData);
        setProgress(progressData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [roleId]);

  if (loading) return <p>Loading role dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const getReadinessColor = (score) => {
    if (score < 40) return "#ef4444"; // red
    if (score < 75) return "#f59e0b"; // amber
    return "#10b981"; // green
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{role?.name}</h2>
      <p style={{ color: "#6b7280", marginBottom: "20px" }}>{role?.description}</p>

      {/* Quick Action: Go to Labs */}
      <Link
        to={`/app/labs/${roleId}`}
        style={{
          display: "block",
          backgroundColor: "#8b5cf6",
          color: "white",
          padding: "12px 16px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "600",
          textAlign: "center",
          marginBottom: "24px",
        }}
      >
        🔬 Go to Practical Labs
      </Link>

      {/* Job Readiness Score */}
      <div
        style={{
          backgroundColor: "#f0f9ff",
          border: "1px solid #bfdbfe",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "8px" }}>
          Overall Job Readiness
        </div>
        <div
          style={{
            fontSize: "48px",
            fontWeight: "700",
            color: getReadinessColor(readiness?.overallReadinessScore || 0),
            marginBottom: "8px",
          }}
        >
          {readiness?.overallReadinessScore || 0}%
        </div>
        <div style={{ fontSize: "0.95rem", color: "#374151" }}>
          {readiness?.readinessLevel || "Not Started"}
        </div>
        {readiness?.estimatedWeeksToReady > 0 && (
          <div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "8px" }}>
            Est. {readiness.estimatedWeeksToReady} weeks to completion
          </div>
        )}
      </div>

      {/* Component Breakdown */}
      <div
        style={{
          display: "grid",
          gap: "12px",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "Skills Completion",
            value: readiness?.skillsCompletionPercent || 0,
          },
          { label: "Lab Success Rate", value: readiness?.labSuccessRate || 0 },
          { label: "Assessment Score", value: readiness?.assessmentScore || 0 },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "12px",
              backgroundColor: "#f9fafb",
            }}
          >
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "4px" }}>
              {label}
            </div>
            <div style={{ fontSize: "28px", fontWeight: "600", color: "#1f2937" }}>
              {value}%
            </div>
          </div>
        ))}
      </div>

      {/* Skills Progress */}
      <div>
        <h3 style={{ marginBottom: "12px" }}>Skills Progress</h3>
        {progress?.skills && progress.skills.length > 0 ? (
          <div style={{ display: "grid", gap: "12px" }}>
            {progress.skills.map((skill) => (
              <div
                key={skill.skillId}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "12px",
                  backgroundColor: "#f9fafb",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <strong>{skill.skillId?.name || "Skill"}</strong>
                  <span style={{ color: "#6b7280" }}>
                    {skill.completionPercentage}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${skill.completionPercentage}%`,
                      height: "100%",
                      backgroundColor: "#3b82f6",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
                <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "4px" }}>
                  Status: {skill.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No skills tracked yet.</p>
        )}
      </div>

      {/* Missing Skills */}
      {readiness?.missingSkills && readiness.missingSkills.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h3 style={{ marginBottom: "12px", color: "#dc2626" }}>
            Missing Skills ({readiness.missingSkills.length})
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {readiness.missingSkills.map((skill) => (
              <li
                key={skill._id}
                style={{
                  padding: "8px 12px",
                  borderLeft: "4px solid #dc2626",
                  backgroundColor: "#fef2f2",
                  marginBottom: "8px",
                  borderRadius: "4px",
                  fontSize: "0.95rem",
                }}
              >
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RoleDashboard;
