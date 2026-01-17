import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { getModules, createModule, updateModule, deleteModule } from "../../api/moduleApi";
import { useNavigate } from "react-router-dom";

const emptyMaterial = () => ({
  title: "",
  type: "article",
  url: "",
  content: "",
});

const initialForm = {
  title: "",
  description: "",
  difficulty: 1,
  tagsText: "",
  published: true,
  materials: [emptyMaterial()],
};

const ViewModules = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingModule, setEditingModule] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      setLoading(true);
      const data = await getModules();
      setModules(data || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (module) => {
    setEditingModule(module);
    setFormData({
      title: module.title || "",
      description: module.description || "",
      difficulty: module.difficulty ?? 1,
      tagsText: Array.isArray(module.tags) ? module.tags.join(", ") : "",
      published: module.published !== undefined ? module.published : true,
      materials: module.materials?.length ? module.materials : [emptyMaterial()],
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this module?")) return;
    try {
      await deleteModule(id);
      await loadModules();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete module");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      difficulty: Number(formData.difficulty) || 1,
      published: !!formData.published,
      tags: formData.tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      materials: (formData.materials || []).map((m) => ({
        title: m.title.trim(),
        type: m.type || "article",
        url: m.url?.trim() || "",
        content: m.content?.trim() || "",
      })),
    };

    try {
      if (!payload.title || !payload.description) {
        setError("Title and description are required");
        return;
      }

      if (editingModule) {
        await updateModule(editingModule._id, payload);
      } else {
        await createModule(payload);
      }
      setIsFormOpen(false);
      setEditingModule(null);
      setFormData(initialForm);
      await loadModules();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save module");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingModule(null);
    setFormData(initialForm);
  };

  const handleMaterialChange = (idx, field, value) => {
    setFormData((prev) => {
      const nextMaterials = prev.materials.map((m, i) =>
        i === idx ? { ...m, [field]: value } : m
      );
      return { ...prev, materials: nextMaterials };
    });
  };

  const handleAddMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [...prev.materials, emptyMaterial()],
    }));
  };

  const handleRemoveMaterial = (idx) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== idx),
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
        <h2>Loading modules...</h2>
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
          <h2 style={{ margin: 0, color: "#1f2937" }}>📚 Modules Management</h2>
          <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
            View and manage all modules in one place
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
            + Create Module
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
            maxWidth: "600px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto"
          }}>
            <h3 style={{ margin: "0 0 16px", color: "#1f2937" }}>
              {editingModule ? "Edit Module" : "Create Module"}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontWeight: "600", color: "#374151" }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
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
                  <label style={{ display: "block", marginBottom: "4px", fontWeight: "600", color: "#374151" }}>
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
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "4px", fontWeight: "600", color: "#374151" }}>
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
                  
                  <div>
                    <label style={{ display: "block", marginBottom: "4px", fontWeight: "600", color: "#374151" }}>
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tagsText}
                      onChange={(e) => setFormData((p) => ({ ...p, tagsText: e.target.value }))}
                      placeholder="phishing, passwords"
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
                
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData((p) => ({ ...p, published: e.target.checked }))}
                  />
                  <label style={{ fontWeight: "600", color: "#374151" }}>
                    Published
                  </label>
                </div>
              </div>

              {/* Materials Section */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h4 style={{ margin: 0, color: "#1f2937" }}>Materials</h4>
                  <button
                    type="button"
                    onClick={handleAddMaterial}
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
                    + Add Material
                  </button>
                </div>
                
                <div style={{ display: "grid", gap: "12px" }}>
                  {formData.materials.map((material, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        padding: "12px",
                        backgroundColor: "#f9fafb"
                      }}
                    >
                      <div style={{ display: "grid", gap: "8px", marginBottom: "8px" }}>
                        <div>
                          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "600", color: "#374151" }}>
                            Title
                          </label>
                          <input
                            type="text"
                            value={material.title}
                            onChange={(e) => handleMaterialChange(idx, "title", e.target.value)}
                            style={{
                              width: "100%",
                              padding: "6px",
                              border: "1px solid #d1d5db",
                              borderRadius: "4px",
                              fontSize: "12px"
                            }}
                          />
                        </div>
                        
                        <div>
                          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "600", color: "#374151" }}>
                            Type
                          </label>
                          <select
                            value={material.type}
                            onChange={(e) => handleMaterialChange(idx, "type", e.target.value)}
                            style={{
                              width: "100%",
                              padding: "6px",
                              border: "1px solid #d1d5db",
                              borderRadius: "4px",
                              fontSize: "12px"
                            }}
                          >
                            <option value="article">Article</option>
                            <option value="video">Video</option>
                            <option value="pdf">PDF</option>
                            <option value="link">Link</option>
                            <option value="text">Text</option>
                          </select>
                        </div>
                      </div>
                      
                      <div style={{ display: "grid", gap: "8px" }}>
                        <div>
                          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "600", color: "#374151" }}>
                            URL (for video/pdf/link)
                          </label>
                          <input
                            type="text"
                            value={material.url}
                            onChange={(e) => handleMaterialChange(idx, "url", e.target.value)}
                            style={{
                              width: "100%",
                              padding: "6px",
                              border: "1px solid #d1d5db",
                              borderRadius: "4px",
                              fontSize: "12px"
                            }}
                          />
                        </div>
                        
                        <div>
                          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "600", color: "#374151" }}>
                            Content (for text/notes)
                          </label>
                          <textarea
                            rows={2}
                            value={material.content}
                            onChange={(e) => handleMaterialChange(idx, "content", e.target.value)}
                            style={{
                              width: "100%",
                              padding: "6px",
                              border: "1px solid #d1d5db",
                              borderRadius: "4px",
                              fontSize: "12px",
                              resize: "vertical"
                            }}
                          />
                        </div>
                      </div>
                      
                      {formData.materials.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(idx)}
                          style={{
                            marginTop: "8px",
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
                      )}
                    </div>
                  ))}
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
                  {saving ? "Saving..." : (editingModule ? "Update Module" : "Create Module")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modules Grid */}
      {modules.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px", 
          backgroundColor: "#f9fafb", 
          borderRadius: "12px",
          border: "2px dashed #d1d5db"
        }}>
          <h3 style={{ color: "#6b7280", marginBottom: "12px" }}>No modules available</h3>
          <p style={{ color: "#9ca3af" }}>Create your first module using the button above.</p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
          gap: "20px" 
        }}>
          {modules.map((module) => (
            <div
              key={module._id}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "20px",
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
                  onClick={() => handleEdit(module)}
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
                  onClick={() => handleDelete(module._id)}
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

              {/* Module Content */}
              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ 
                  margin: "0 0 8px", 
                  color: "#1f2937", 
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  paddingRight: "100px"
                }}>
                  {module.title}
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: "#6b7280", 
                  lineHeight: "1.5",
                  fontSize: "0.95rem"
                }}>
                  {module.description}
                </p>
              </div>

              {/* Module Metadata */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "8px"
                }}>
                  <span style={{ 
                    fontSize: "0.85rem", 
                    color: "#6b7280",
                    fontWeight: "500"
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
                    {module.difficulty || 1}/5
                  </span>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "8px"
                }}>
                  <span style={{ 
                    fontSize: "0.85rem", 
                    color: "#6b7280",
                    fontWeight: "500"
                  }}>
                    Status:
                  </span>
                  <span style={{
                    backgroundColor: module.published ? "#dcfce7" : "#fef2f2",
                    color: module.published ? "#166534" : "#dc2626",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    fontWeight: "600"
                  }}>
                    {module.published ? "Published" : "Draft"}
                  </span>
                </div>

                {module.tags && module.tags.length > 0 && (
                  <div style={{ marginBottom: "8px" }}>
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
                      {module.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: "#e0e7ff",
                            color: "#3730a3",
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

              {/* Materials Count */}
              <div style={{ 
                borderTop: "1px solid #e5e7eb", 
                paddingTop: "12px",
                fontSize: "0.85rem",
                color: "#6b7280"
              }}>
                <strong>Materials:</strong> {module.materials?.length || 0} items
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewModules;