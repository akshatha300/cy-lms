import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRoleModules } from "../../api/moduleApi";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleInfo, setRoleInfo] = useState({ roleFiltered: false, roleName: null });

  useEffect(() => {
    const loadModules = async () => {
      try {
        const data = await getRoleModules();
        setModules(data.modules || []);
        setRoleInfo({
          roleFiltered: data.roleFiltered,
          roleName: data.roleName,
          totalSkills: data.totalSkills,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load modules");
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  if (loading) {
    return <p>Loading modules...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Learning Modules</h2>
      {roleInfo.roleFiltered && (
        <div style={{ 
          backgroundColor: "#dbeafe", 
          border: "2px solid #3b82f6", 
          borderRadius: "8px", 
          padding: "12px",
          marginBottom: "16px"
        }}>
          <p style={{ margin: 0, color: "#1e40af", fontWeight: "600" }}>
            🎯 Showing modules for: <strong>{roleInfo.roleName}</strong> ({modules.length} modules across {roleInfo.totalSkills} skills)
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#1e40af" }}>
            These are the modules you need to complete for your selected role.
          </p>
        </div>
      )}
      {!roleInfo.roleFiltered && (
        <div style={{ 
          backgroundColor: "#fef3c7", 
          border: "2px solid #f59e0b", 
          borderRadius: "8px", 
          padding: "12px",
          marginBottom: "16px"
        }}>
          <p style={{ margin: 0, color: "#92400e", fontWeight: "600" }}>
            💡 Select a career role to see personalized module recommendations
          </p>
          <Link to="/app/role-selector" style={{ color: "#92400e", textDecoration: "underline", fontSize: "0.9rem" }}>
            Choose your role →
          </Link>
        </div>
      )}
      <p>Select a module to begin your training.</p>

      {modules.length === 0 ? (
        <p>No modules available yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {modules.map((mod) => (
            <li
              key={mod._id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "12px",
              }}
            >
              <h3 style={{ margin: "0 0 4px" }}>{mod.title}</h3>
              <p style={{ margin: "0 0 8px", color: "#6b7280" }}>
                {mod.description}
              </p>
              <p style={{ margin: "0 0 8px", fontSize: "0.9rem" }}>
                Difficulty: {mod.difficulty ?? 1}
              </p>
              <Link to={`/app/modules/${mod._id}`} style={{ color: "#2563eb" }}>
                Start module
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Modules;
