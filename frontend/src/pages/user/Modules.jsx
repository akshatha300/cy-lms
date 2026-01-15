import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRoleModules, getUserRole } from "../../api/roleBasedApi";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleInfo, setRoleInfo] = useState({ roleFiltered: false, roleName: null, roleId: null });

 useEffect(() => {
  const loadModules = async () => {
    try {
      // First get user's selected role
      const userRole = await getUserRole();
      
      if (userRole && userRole.primaryRole) {
        // Get modules for the user's role
        const data = await getRoleModules(userRole.primaryRole._id);
        setModules(data.modules || []);
        setRoleInfo({
          roleFiltered: true,
          roleName: userRole.primaryRole.name,
          roleId: userRole.primaryRole._id,
          moduleCount: data.moduleCount
        });
      } else {
        // No role selected, show all modules
        const { getModules } = await import("../../api/moduleApi");
        const data = await getModules();
        setModules(data.modules || []);
        setRoleInfo({
          roleFiltered: false,
          roleName: null,
          roleId: null
        });
      }
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
      <h2>
        {roleInfo.roleFiltered 
          ? `${roleInfo.roleName} Modules (${roleInfo.moduleCount || modules.length})`
          : "All Modules"
        }
      </h2>
      
      {roleInfo.roleFiltered && (
        <p>Your personalized learning path for {roleInfo.roleName}</p>
      )}

      {modules.length === 0 ? (
        <p>
          {roleInfo.roleFiltered 
            ? `No modules assigned to ${roleInfo.roleName} yet.` 
            : "No modules available."
          }
        </p>
      ) : (
        <div className="modules-grid">
          {modules.map((module) => (
            <div key={module._id} className="module-card">
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <p>Difficulty: {module.difficulty}</p>
              <Link to={`/app/modules/${module._id}`}>
                <button>View Module</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Modules;