import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { getAdminLabs, createAdminLab, updateAdminLab, deleteAdminLab } from "../../api/adminApi";
import { useNavigate } from "react-router-dom";

const ViewLabs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingLab, setEditingLab] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    difficulty: 1,
    scenario: "defense",
    timeLimit: 30,
    requiredTools: [],
    tagsText: "",
    skillId: "",
    objectiveText: "",
    environment: "simulated",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadLabs();
  }, []);

  const loadLabs = async () => {
    try {
      setLoading(true);
      const data = await getAdminLabs();
      setLabs(data.labs || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load labs");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lab) => {
    setEditingLab(lab);
    setFormData({
      ...lab,
      requiredTools: lab.requiredTools || [],
      tagsText: Array.isArray(lab.tags) ? lab.tags.join(", ") : "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lab?")) return;
    try {
      await deleteAdminLab(id);
      await loadLabs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete lab");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      difficulty: Number(formData.difficulty) || 1,
      scenario: formData.scenario,
      timeLimit: Number(formData.timeLimit) || 30,
      requiredTools: formData.requiredTools.filter(tool => tool.trim() !== ""),
      tags: formData.tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      skillId: formData.skillId || null,
      objectiveText: formData.objectiveText.trim(),
      environment: formData.environment,
    };

    try {
      if (!payload.name || !payload.description) {
        setError("Name and description are required");
        return;
      }

      if (editingLab) {
        await updateAdminLab(editingLab._id, payload);
      } else {
        await createAdminLab(payload);
      }
      setIsFormOpen(false);
      setEditingLab(null);
      setFormData({
        name: "",
        description: "",
        difficulty: 1,
        scenario: "defense",
        timeLimit: 30,
        requiredTools: [],
        tagsText: "",
        skillId: "",
        objectiveText: "",
        environment: "simulated",
      });
      await loadLabs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save lab");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingLab(null);
    setFormData({
      name: "",
      description: "",
      difficulty: 1,
      scenario: "defense",
      timeLimit: 30,
      requiredTools: [],
      tagsText: "",
      skillId: "",
      objectiveText: "",
      environment: "simulated",
    });
  };

  const handleToolChange = (index, value) => {
    setFormData((prev) => {
      const newTools = [...prev.requiredTools];
      if (value.trim() === "") {
        newTools.splice(index, 1);
      } else {
        newTools[index] = value;
      }
      return { ...prev, requiredTools: newTools };
    });
  };

  const handleAddTool = () => {
    setFormData((prev) => ({
      ...prev,
      requiredTools: [...prev.requiredTools, ""],
    }));
  };

  const handleRemoveTool = (index) => {
    setFormData((prev) => ({
      ...prev,
      requiredTools: prev.requiredTools.filter((_, i) => i !== index),
    }));
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2 style={{ color: "#dc2626" }}>Access Denied</h2>
        <p>Admin role required to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Loading labs...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2 style={{ color: "#dc2626" }}>Error</h2>
        <p>{error}</p>
        <button 
          onClick={loadLabs}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* Header with Create Button */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "24px" 
      }}>
        <div>
          <h2 style={{ margin: 0, color: "#1f2937" }}>🔬 Labs Management</h2>
          <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
            View and manage all labs in one place
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setIsFormOpen(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            + Create Lab
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          backgroundColor: "#fef2f2", 
          border: "1px solid #fecaca", 
          borderRadius: "6px", 
          padding: "12px", 
          marginBottom: "20px",
          color: "#dc2626"
        }}>
          {error}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {isFormOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            maxWidth: "700px",
            width: "90%",
            maxHeight: "85vh",
            overflowY: "auto"
          }}>
            <h3 style={{ margin: "0 0 16px", color: "#1f2937" }}>
              {editingLab ? "Edit Lab" : "Create Lab"}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gap: "16px", marginBottom: "16px" }}>
                {/* Basic Info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
                      Lab Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px"
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
                      Difficulty (1-5)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={formData.difficulty}
                      onChange={(e) => setFormData((p) => ({ ...p, difficulty: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "14px",
                      resize: "vertical"
                    }}
                    required
                  />
                </div>

                {/* Lab Configuration */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
                      Scenario
                    </label>
                    <select
                      value={formData.scenario}
                      onChange={(e) => setFormData((p) => ({ ...p, scenario: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px"
                      }}
                    >
                      <option value="defense">Defense</option>
                      <option value="offense">Offense</option>
                      <option value="analysis">Analysis</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={120}
                      value={formData.timeLimit}
                      onChange={(e) => setFormData((p) => ({ ...p, timeLimit: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px"
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
                      Environment
                    </label>
                    <select
                      value={formData.environment}
                      onChange={(e) => setFormData((p) => ({ ...p, environment: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px"
                      }}
                    >
                      <option value="simulated">Simulated</option>
                      <option value="virtual">Virtual Lab</option>
                      <option value="physical">Physical Lab</option>
                    </select>
                  </div>
                </div>

                {/* Additional Fields */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tagsText}
                      onChange={(e) => setFormData((p) => ({ ...p, tagsText: e.target.value }))}
                      placeholder="siem, forensics, malware"
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px"
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
                      Objective
                    </label>
                    <textarea
                      value={formData.objectiveText}
                      onChange={(e) => setFormData((p) => ({ ...p, objectiveText: e.target.value }))}
                      rows={2}
                      placeholder="What will students learn in this lab?"
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        resize: "vertical"
                      }}
                    />
                  </div>
                </div>

                {/* Required Tools Section */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <h4 style={{ margin: 0, color: "#1f2937" }}>Required Tools</h4>
                    <button
                      type="button"
                      onClick={handleAddTool}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                    >
                      + Add Tool
                    </button>
                  </div>
                  
                  <div style={{ display: "grid", gap: "12px" }}>
                    {formData.requiredTools.map((tool, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center"
                        }}
                      >
                        <input
                          type="text"
                          value={tool}
                          onChange={(e) => handleToolChange(index, e.target.value)}
                          placeholder="e.g., Wireshark, Metasploit"
                          style={{
                            flex: 1,
                            padding: "6px",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "12px"
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTool(index)}
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "12px",
                            cursor: "pointer"
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#6b7280",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: saving ? "#9ca3af" : "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor: saving ? "not-allowed" : "pointer",
                    fontWeight: "600"
                  }}
                >
                  {saving ? "Saving..." : (editingLab ? "Update Lab" : "Create Lab")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {labs.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px", 
          backgroundColor: "#f9fafb", 
          borderRadius: "12px",
          border: "2px dashed #d1d5db"
        }}>
          <h3 style={{ color: "#6b7280", marginBottom: "12px" }}>No labs available</h3>
          <p style={{ color: "#9ca3af" }}>Create your first lab using the button above.</p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", 
          gap: "24px" 
        }}>
          {labs.map((lab) => (
            <div
              key={lab._id}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease",
                position: "relative"
              }}
            >
              {/* Action Buttons */}
              <div style={{ 
                position: "absolute", 
                top: "10px", 
                right: "10px", 
                display: "flex", 
                gap: "8px" 
              }}>
                <button
                  onClick={() => handleEdit(lab)}
                  style={{
                    padding: "6px 10px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(lab._id)}
                  style={{
                    padding: "6px 10px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>

              {/* Lab Header */}
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ 
                  margin: "0 0 12px", 
                  color: "#1f2937", 
                  fontSize: "1.3rem",
                  fontWeight: "600",
                  paddingRight: "100px"
                }}>
                  {lab.name}
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: "#6b7280", 
                  lineHeight: "1.5",
                  fontSize: "0.95rem"
                }}>
                  {lab.description}
                </p>
              </div>

              {/* Lab Metadata */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: "12px",
                  marginBottom: "12px"
                }}>
                  <div>
                    <span style={{ 
                      fontSize: "0.85rem", 
                      color: "#6b7280",
                      fontWeight: "500",
                      display: "block",
                      marginBottom: "4px"
                    }}>
                      Difficulty:
                    </span>
                    <span style={{
                      backgroundColor: "#f3f4f6",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      color: "#1f2937"
                    }}>
                      {lab.difficulty || 1}/5
                    </span>
                  </div>
                  
                  <div>
                    <span style={{ 
                      fontSize: "0.85rem", 
                      color: "#6b7280",
                      fontWeight: "500",
                      display: "block",
                      marginBottom: "4px"
                    }}>
                      Scenario:
                    </span>
                    <span style={{
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      fontWeight: "600"
                    }}>
                      {lab.scenario || "defense"}
                    </span>
                  </div>
                </div>

                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: "12px",
                  marginBottom: "12px"
                }}>
                  <div>
                    <span style={{ 
                      fontSize: "0.85rem", 
                      color: "#6b7280",
                      fontWeight: "500",
                      display: "block",
                      marginBottom: "4px"
                    }}>
                      Time Limit:
                    </span>
                    <span style={{
                      backgroundColor: "#fef3c7",
                      color: "#92400e",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      fontWeight: "600"
                    }}>
                      {lab.timeLimit || 30} min
                    </span>
                  </div>
                  
                  <div>
                    <span style={{ 
                      fontSize: "0.85rem", 
                      color: "#6b7280",
                      fontWeight: "500",
                      display: "block",
                      marginBottom: "4px"
                    }}>
                      Environment:
                    </span>
                    <span style={{
                      backgroundColor: "#e0e7ff",
                      color: "#3730a3",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      fontWeight: "600"
                    }}>
                      {lab.environment || "simulated"}
                    </span>
                  </div>
                </div>

                {lab.tags && lab.tags.length > 0 && (
                  <div>
                    <span style={{ 
                      fontSize: "0.85rem", 
                      color: "#6b7280",
                      fontWeight: "500",
                      display: "block",
                      marginBottom: "4px"
                    }}>
                      Tags:
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {lab.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: "#f0fdf4",
                            color: "#166534",
                            padding: "2px 6px",
                            borderRadius: "3px",
                            fontSize: "0.75rem",
                            fontWeight: "500"
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Lab Objective */}
              {lab.objectiveText && (
                <div style={{ 
                  borderTop: "1px solid #e5e7eb", 
                  paddingTop: "16px",
                  marginBottom: "16px"
                }}>
                  <h4 style={{ 
                    margin: "0 0 8px", 
                    color: "#1f2937",
                    fontSize: "0.9rem",
                    fontWeight: "600"
                  }}>
                    🎯 Objective:
                  </h4>
                  <p style={{ 
                    margin: 0, 
                    color: "#4b5563", 
                    fontSize: "0.85rem",
                    lineHeight: "1.4"
                  }}>
                    {lab.objectiveText}
                  </p>
                </div>
              )}

              {/* Required Tools */}
              {lab.requiredTools && lab.requiredTools.length > 0 && (
                <div style={{ 
                  borderTop: "1px solid #e5e7eb", 
                  paddingTop: "16px"
                }}>
                  <h4 style={{ 
                    margin: "0 0 8px", 
                    color: "#1f2937",
                    fontSize: "0.9rem",
                    fontWeight: "600"
                  }}>
                    🛠️ Required Tools:
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {lab.requiredTools.map((tool, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: "#f1f5f9",
                          color: "#0c4a6e",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: "500"
                        }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewLabs;
