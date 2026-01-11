import { useState, useEffect } from "react";
import { getRoles, selectRole } from "../api/roleBasedApi";
import { useNavigate } from "react-router-dom";

const RoleSelector = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load roles");
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  const handleSelectRole = async (roleId) => {
  setSelecting(roleId);
  try {
    const response = await selectRole(roleId);
    console.log("Role selected:", response);
    // Optional: navigate to a dashboard if you have one
     navigate(`/app/role-dashboard/${roleId}`);
  } catch (err) {
    console.error("Failed to select role:", err);
    setError(err.response?.data?.message || "Failed to select role");
  } finally {
    setSelecting(null);
  }
};

  if (loading) return <p>Loading roles...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Choose Your Security Role</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Select a role to access a customized learning path and job readiness
        tracking.
      </p>

      <div
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {roles.map((role) => (
          <div
            key={role._id}
            style={{
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              padding: "16px",
              cursor: "pointer",
              transition: "all 0.2s",
              backgroundColor: "#f9fafb",
              hover: { borderColor: "#3b82f6" },
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          >
            <h3 style={{ margin: "0 0 8px" }}>{role.name}</h3>
            <p style={{ margin: "0 0 12px", color: "#6b7280", fontSize: "0.9rem" }}>
              {role.description}
            </p>

            <div style={{ fontSize: "0.85rem", color: "#4b5563", marginBottom: "12px" }}>
              <div>
                <strong>Seniority:</strong> {role.seniority}
              </div>
              <div>
                <strong>Skills:</strong> {role.requiredSkills?.length || 0} required
              </div>
              <div>
                <strong>Est. Hours:</strong> {role.estimatedHoursToComplete}
              </div>
            </div>

            <button
              onClick={() => handleSelectRole(role._id)}
              disabled={selecting === role._id}
              style={{
                width: "100%",
                padding: "10px 16px",
                backgroundColor: selecting === role._id ? "#ccc" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: selecting === role._id ? "not-allowed" : "pointer",
                fontWeight: "500",
                fontSize: "0.95rem",
              }}
            >
              {selecting === role._id ? "Selecting..." : "Select Role"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;
