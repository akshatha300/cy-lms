import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserRole } from "../../api/roleBasedApi";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleInfo, setRoleInfo] = useState({ roleFiltered: false, roleName: null, roleId: null, mandatoryModules: [], optionalModules: [] });

  const normalizeModuleResponse = (data) => {
    if (Array.isArray(data)) {
      return {
        modules: data,
        moduleCount: data.length,
      };
    }

    if (data && typeof data === "object") {
      const modules = data.modules || [];
      const moduleCount =
        typeof data.moduleCount === "number"
          ? data.moduleCount
          : modules.length;

      return {
        modules,
        moduleCount,
      };
    }

    return {
      modules: [],
      moduleCount: 0,
    };
  };

  useEffect(() => {
    const loadModules = async () => {
      try {
        console.log("=== DEBUG: Loading Modules ===");
        
        // First get user's selected role
        const userRole = await getUserRole();
        console.log("User role:", userRole);
        
        if (userRole && userRole.primaryRole) {
          console.log("Primary role found:", userRole.primaryRole.name);
          
          // Get ALL modules first
          const { getModules } = await import("../../api/moduleApi");
          const allModulesResponse = await getModules();
          const { modules: allModules, moduleCount } = normalizeModuleResponse(allModulesResponse);
          
          // Define mandatory modules for each role
          const mandatoryModules = getMandatoryModules(userRole.primaryRole.name);
          
          // Filter mandatory modules from all modules
          const mandatoryModulesData = allModules.filter(module => 
            mandatoryModules.some(mandatoryModule => 
              module.title.toLowerCase().includes(mandatoryModule.toLowerCase())
            )
          );
          
          // Optional modules are all other modules
          const optionalModulesData = allModules.filter(module => 
            !mandatoryModules.some(mandatoryModule => 
              module.title.toLowerCase().includes(mandatoryModule.toLowerCase())
            )
          );
          
          setModules(allModules);
          setRoleInfo({
            roleFiltered: true,
            roleName: userRole.primaryRole.name,
            roleId: userRole.primaryRole._id,
            moduleCount,
            mandatoryModules: mandatoryModulesData,
            optionalModules: optionalModulesData
          });
        } else {
          console.log("No primary role found, loading all modules");
          
          // No role selected, show all modules
          const { getModules } = await import("../../api/moduleApi");
          const allModulesResponse = await getModules();
          console.log("All modules data:", allModulesResponse);

          const { modules: allModules, moduleCount } = normalizeModuleResponse(allModulesResponse);
          
          setModules(allModules);
          setRoleInfo({
            roleFiltered: false,
            roleName: null,
            roleId: null,
            moduleCount,
            mandatoryModules: [], // No mandatory modules without role
            optionalModules: allModules // All modules are optional
          });
        }
      } catch (err) {
        console.error("Error loading modules:", err);
        setError(err.response?.data?.message || "Failed to load modules");
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  // Define mandatory modules for each role
  const getMandatoryModules = (roleName) => {
    const mandatoryMap = {
      "SOC Analyst L1": [
        "Phishing Awareness",
        "Malware Basics",
        "SIEM Fundamentals",
        "Incident Response Procedures"
      ],
      "Penetration Tester": [
        "Network Penetration Testing",
        "Exploit Development Basics",
        "Web Application Security",
        "Secure Coding Practices"
      ],
      "Cloud Security Engineer": [
        "Cloud Security Fundamentals",
        "AWS Security Essentials",
        "Security Compliance Frameworks",
        "DevSecOps Fundamentals"
      ],
      "Malware Analyst": [
        "Malware Basics",
        "Threat Intelligence Basics",
        "Incident Response Procedures",
        "SIEM Fundamentals"
      ],
      "Incident Response Lead": [
        "Incident Response Procedures",
        "SIEM Fundamentals",
        "Threat Intelligence Basics",
        "Malware Basics"
      ],
      "Security Auditor": [
        "Security Auditing",
        "Security Compliance Frameworks",
        "Data Protection & Privacy",
        "Risk Management"
      ],
      "Security Architect": [
        "Network Security Fundamentals",
        "Security Compliance Frameworks",
        "Data Protection & Privacy",
        "DevSecOps Fundamentals"
      ],
      "Digital Forensics Analyst": [
        "Incident Response Procedures",
        "Malware Basics",
        "Threat Intelligence Basics",
        "Data Protection & Privacy"
      ],
      "Application Security Engineer": [
        "Web Application Security",
        "Secure Coding Practices",
        "DevSecOps Fundamentals",
        "Password Security"
      ],
      "Threat Intelligence Analyst": [
        "Threat Intelligence Basics",
        "SIEM Fundamentals",
        "Malware Basics",
        "Social Engineering"
      ]
    };
    
    return mandatoryMap[roleName] || [];
  };

  const getDifficultyColor = (difficulty) => {
  // Convert to string if it's a number
  const diffStr = difficulty?.toString().toLowerCase();
  
  if (diffStr === "beginner" || diffStr === "easy" || difficulty === 1) return "#10b981";
  if (diffStr === "intermediate" || diffStr === "medium" || difficulty === 2) return "#f59e0b";
  if (diffStr === "hard" || diffStr === "advanced" || difficulty === 3) return "#ef4444";
  return "#6b7280"; // Default gray color
};


  const getModuleIcon = (type) => {
    if (type === "video") return "🎥";
    if (type === "reading") return "📚";
    if (type === "interactive") return "🎯";
    if (type === "quiz") return "📝";
    return "📖";
  };

  const getDurationDisplay = (duration) => {
    if (!duration) return "30 min";
    if (duration.includes("min")) return duration;
    if (duration.includes("hour")) return duration;
    return `${duration} min`;
  };

  console.log("=== DEBUG: Current State ===");
  console.log("Loading:", loading);
  console.log("Modules count:", modules.length);
  console.log("Modules:", modules);
  console.log("Error:", error);
  console.log("Role info:", roleInfo);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", marginBottom: "10px" }}>📚</div>
        <p>Loading modules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", marginBottom: "10px" }}>❌</div>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "24px",
        paddingBottom: "16px",
        borderBottom: "2px solid #f3f4f6"
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>
            {roleInfo.roleFiltered 
              ? `${roleInfo.roleName} Modules` 
              : "All Modules"
            }
          </h2>
          {roleInfo.roleFiltered && (
            <p style={{ 
              margin: "4px 0 0", 
              color: "#6b7280", 
              fontSize: "14px" 
            }}>
              All modules available for {roleInfo.roleName} (🔒 = Mandatory)
            </p>
          )}
        </div>
        <div style={{
          backgroundColor: "#dcfce7",
          color: "#166534",
          padding: "8px 16px",
          borderRadius: "20px",
          fontSize: "14px",
          fontWeight: "600"
        }}>
          {roleInfo.moduleCount || modules.length} Modules
        </div>
      </div>

      {/* Debug Info */}
      <div style={{ 
        backgroundColor: "#fef3c7", 
        padding: "10px", 
        borderRadius: "8px", 
        marginBottom: "20px",
        fontSize: "12px"
      }}>
        <strong>Debug Info:</strong> Loading: {loading.toString()}, Modules: {modules.length}, Role: {roleInfo.roleName}
      </div>

      {/* Modules Grid */}
      {modules.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "#f8fafc",
          border: "2px dashed #cbd5e1",
          borderRadius: "12px",
          margin: "20px 0"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📚</div>
          <h3 style={{ margin: "0 0 16px", color: "#64748b" }}>
            {roleInfo.roleFiltered 
              ? `No modules assigned to ${roleInfo.roleName} yet` 
              : "No modules available"
            }
          </h3>
          <p style={{ color: "#6b7280", margin: 0 }}>
            {roleInfo.roleFiltered 
              ? "Select a role to see role-specific modules, or contact your administrator."
              : "Check back later for new learning materials."
            }
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "20px"
        }}>
          {modules.map((module) => {
            // Check if this module is mandatory
            const isMandatory = roleInfo.mandatoryModules && 
              roleInfo.mandatoryModules.some(mandatoryModule => mandatoryModule._id === module._id);
            
            return (
              <div
                key={module._id}
                style={{
                  border: isMandatory ? "2px solid #fbbf24" : "2px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "20px",
                  backgroundColor: isMandatory ? "#fffbeb" : "#ffffff",
                  boxShadow: isMandatory 
                    ? "0 4px 6px -1px rgba(251, 191, 36, 0.1)"
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s ease-in-out",
                  cursor: "pointer",
                  position: "relative"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = isMandatory
                    ? "0 8px 12px -2px rgba(251, 191, 36, 0.15)"
                    : "0 8px 12px -2px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = isMandatory
                    ? "0 4px 6px -1px rgba(251, 191, 36, 0.1)"
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                }}
              >
                {/* Mandatory Badge */}
                {isMandatory && (
                  <div style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "#dc2626",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    🔒 Mandatory
                  </div>
                )}
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "flex-start", 
                  marginBottom: "12px" 
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: "0 0 8px", 
                      fontSize: "18px", 
                      fontWeight: "bold", 
                      color: isMandatory ? "#92400e" : "#1f2937",
                      lineHeight: "1.3"
                    }}>
                      {isMandatory && "🔒 "}{module.title}
                    </h3>
                    <p style={{ 
                      margin: "0 0 12px", 
                      color: "#6b7280", 
                      fontSize: "14px",
                      lineHeight: "1.4"
                    }}>
                      {module.description}
                    </p>
                  </div>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: getDifficultyColor(module.difficulty),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "bold"
                  }}>
                    {module.difficulty?.toString()?.charAt(0)?.toUpperCase() || "M"}
                  </div>
                </div>

                <div style={{ 
                  display: "flex", 
                  gap: "16px", 
                  marginBottom: "16px",
                  fontSize: "13px",
                  color: "#4b5563"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>{getModuleIcon(module.type)}</span>
                    <span style={{ fontWeight: "600" }}>{module.type || "Reading"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>⏱️</span>
                    <span>{getDurationDisplay(module.duration)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>📊</span>
                    <span>{module.topics?.length || 0} topics</span>
                  </div>
                </div>

                {/* View Module Button */}
                <Link
                  to={`/app/modules/${module._id}`}
                  style={{
                    textDecoration: "none"
                  }}
                >
                  <button
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      backgroundColor: isMandatory ? "#dc2626" : "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isMandatory ? "#b91c1c" : "#059669";
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isMandatory ? "#dc2626" : "#10b981";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    {isMandatory ? "🔒 View Mandatory Module" : "🚀 View Module"}
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Modules;