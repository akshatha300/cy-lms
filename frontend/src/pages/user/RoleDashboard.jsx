import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Shield, Target, Cloud, Bug, AlertTriangle } from "lucide-react";
import { getRoleById, getJobReadiness } from "../../api/roleBasedApi";

const roleIcons = {
  "SOC Analyst": Shield,
  "Penetration Tester": Target,
  "Cloud Security": Cloud,
  "Malware Analyst": Bug,
  "Incident Response": AlertTriangle,
};

const RoleDashboard = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [readiness, setReadiness] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoleData = async () => {
      try {
        const roleData = await getRoleById(roleId);
        setRole(roleData);
        
        const readinessData = await getJobReadiness(roleId);
        setReadiness(readinessData.score || 0);
      } catch (err) {
        console.error("Failed to load role data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (roleId) {
      loadRoleData();
    }
  }, [roleId]);

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;
  if (!role) return <div style={{ padding: "20px" }}>Role not found</div>;

  const Icon = roleIcons[role.name.split(" ")[0]] || Shield;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <div style={{ 
          width: "64px", 
          height: "64px", 
          borderRadius: "12px", 
          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Icon size={32} color="white" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>{role.name}</h1>
          <p style={{ margin: "4px 0 0", color: "#6b7280" }}>{role.description}</p>
        </div>
      </div>

      {/* Job Readiness */}
      <div style={{ 
        background: "#f0f9ff", 
        border: "1px solid #bfdbfe", 
        borderRadius: "12px", 
        padding: "24px", 
        marginBottom: "24px",
        textAlign: "center"
      }}>
        <h2 style={{ margin: "0 0 8px", color: "#1e40af" }}>Job Readiness Score</h2>
        <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#1e40af" }}>{readiness}%</div>
        <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
          {readiness >= 80 ? "Excellent! You're ready for this role." :
           readiness >= 60 ? "Good progress. Keep learning!" :
           "Keep working on your skills."}
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
        <button
          onClick={() => navigate("/app/labs")}
          style={{
            padding: "16px",
            borderRadius: "12px",
            border: "2px solid #e5e7eb",
            background: "white",
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          <h3 style={{ margin: "0 0 8px", color: "#3b82f6" }}>🔬 Practical Labs</h3>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
            Hands-on exercises for your role
          </p>
        </button>

        <button
          onClick={() => navigate("/app/modules")}
          style={{
            padding: "16px",
            borderRadius: "12px",
            border: "2px solid #e5e7eb",
            background: "white",
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          <h3 style={{ margin: "0 0 8px", color: "#3b82f6" }}>📚 Learning Modules</h3>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
            Study materials and resources
          </p>
        </button>

        <button
          onClick={() => navigate("/app/chat")}
          style={{
            padding: "16px",
            borderRadius: "12px",
            border: "2px solid #e5e7eb",
            background: "white",
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          <h3 style={{ margin: "0 0 8px", color: "#3b82f6" }}>💬 AI Tutor</h3>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
            Get help from your AI assistant
          </p>
        </button>
      </div>

      {/* Skills Overview */}
      {role.requiredSkills && role.requiredSkills.length > 0 && (
        <div style={{ marginTop: "32px" }}>
          <h2 style={{ marginBottom: "16px" }}>Required Skills</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {role.requiredSkills.map((skill, index) => (
              <span
                key={index}
                style={{
                  background: "#f3f4f6",
                  padding: "8px 12px",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  color: "#374151"
                }}
              >
                {skill.name || skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleDashboard;