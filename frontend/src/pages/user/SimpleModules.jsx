import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getModules } from "../../api/moduleApi";
import { BookOpen, Clock, Users, ArrowRight, Play, FileText, Video, ExternalLink } from "lucide-react";

const SimpleModules = () => {
  const {
    data: modulesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["modules"],
    queryFn: getModules,
  });

  const modules = modulesData?.modules || modulesData || [];

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>
          <div style={{ 
            width: "40px", 
            height: "40px", 
            border: "4px solid #e5e7eb", 
            borderTop: "4px solid #3b82f6", 
            borderRadius: "50%" 
          }}></div>
        </div>
        <p style={{ marginTop: "16px", color: "#6b7280" }}>Loading modules...</p>
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
          <p style={{ margin: 0, color: "#991b1b" }}>
            Failed to load modules: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937", marginBottom: "8px" }}>
          📚 AIML Learning Modules
        </h1>
        <p style={{ color: "#6b7280", fontSize: "16px" }}>
          Master Artificial Intelligence and Machine Learning with our comprehensive course modules
        </p>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          alignItems: "center"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            backgroundColor: "#f3f4f6",
            borderRadius: "8px",
            border: "1px solid #e5e7eb"
          }}>
            <BookOpen size={16} color="#3b82f6" style={{ marginRight: "8px" }} />
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {modules.length} Modules
            </span>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            backgroundColor: "#f3f4f6",
            borderRadius: "8px",
            border: "1px solid #e5e7eb"
          }}>
            <Clock size={16} color="#10b981" style={{ marginRight: "8px" }} />
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              Self-paced Learning
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "24px",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        }}
      >
        {modules.map((module, index) => (
          <div
            key={module._id}
            style={{
              border: "2px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px",
              backgroundColor: "#ffffff",
              transition: "all 0.3s ease",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#3b82f6";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px"
              }}>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#3b82f6",
                  backgroundColor: "#eff6ff",
                  padding: "4px 8px",
                  borderRadius: "4px"
                }}>
                  Module {index + 1}
                </span>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: module.difficulty <= 2 ? "#10b981" : module.difficulty <= 3 ? "#f59e0b" : "#ef4444",
                  backgroundColor: module.difficulty <= 2 ? "#f0fdf4" : module.difficulty <= 3 ? "#fffbeb" : "#fef2f2",
                  padding: "4px 8px",
                  borderRadius: "4px"
                }}>
                  {module.difficulty <= 2 ? "Beginner" : module.difficulty <= 3 ? "Intermediate" : "Advanced"}
                </span>
              </div>
              
              <h3 style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "8px",
                lineHeight: "1.3"
              }}>
                {module.title}
              </h3>
              
              <p style={{
                color: "#6b7280",
                fontSize: "14px",
                lineHeight: "1.5",
                marginBottom: "16px"
              }}>
                {module.description}
              </p>

              {/* Learning Materials Section */}
              {module.materials && module.materials.length > 0 && (
                <div style={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "16px"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#374151"
                  }}>
                    <FileText size={14} style={{ marginRight: "6px" }} />
                    Learning Materials ({module.materials.length})
                  </div>
                  <div style={{
                    display: "grid",
                    gap: "8px",
                    maxHeight: "120px",
                    overflowY: "auto"
                  }}>
                    {module.materials.slice(0, 3).map((material, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "6px 8px",
                          backgroundColor: "#ffffff",
                          borderRadius: "6px",
                          fontSize: "11px",
                          color: "#6b7280",
                          border: "1px solid #e5e7eb"
                        }}
                      >
                        {material.type === "video" && <Video size={12} style={{ marginRight: "6px", color: "#ef4444" }} />}
                        {material.type === "pdf" && <FileText size={12} style={{ marginRight: "6px", color: "#dc2626" }} />}
                        {material.type === "article" && <FileText size={12} style={{ marginRight: "6px", color: "#3b82f6" }} />}
                        {material.type === "link" && <ExternalLink size={12} style={{ marginRight: "6px", color: "#10b981" }} />}
                        <span style={{ fontWeight: "500" }}>{material.title}</span>
                      </div>
                    ))}
                    {module.materials.length > 3 && (
                      <div style={{
                        fontSize: "11px",
                        color: "#9ca3af",
                        fontStyle: "italic",
                        textAlign: "center",
                        padding: "4px"
                      }}>
                        +{module.materials.length - 3} more materials
                      </div>
                    )}
                  </div>
                </div>
              )}

              {module.tags && module.tags.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {module.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        style={{
                          fontSize: "11px",
                          color: "#6b7280",
                          backgroundColor: "#f9fafb",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          border: "1px solid #e5e7eb"
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{
              display: "flex",
              gap: "12px",
              alignItems: "center"
            }}>
              <Link
                to={`/modules/${module._id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 16px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  transition: "all 0.2s",
                  border: "none",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
              >
                <Play size={16} style={{ marginRight: "6px" }} />
                Start Learning
              </Link>
            </div>
          </div>
        ))}
      </div>

      {modules.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "48px",
          backgroundColor: "#f9fafb",
          borderRadius: "12px",
          border: "2px solid #e5e7eb"
        }}>
          <BookOpen size={48} color="#9ca3af" style={{ marginBottom: "16px" }} />
          <h3 style={{ color: "#6b7280", marginBottom: "8px" }}>No modules available</h3>
          <p style={{ color: "#9ca3af" }}>
            Check back later for new AIML learning modules.
          </p>
        </div>
      )}
    </div>
  );
};

export default SimpleModules;
