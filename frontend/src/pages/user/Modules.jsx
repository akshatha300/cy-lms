import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getModules } from "../../api/moduleApi";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadModules = async () => {
      try {
        const data = await getModules();
        setModules(data);
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
              <Link to={`/modules/${mod._id}`} style={{ color: "#2563eb" }}>
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
