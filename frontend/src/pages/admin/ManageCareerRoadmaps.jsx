import { useState, useEffect } from "react";
import { 
  getCareerRoadmaps, 
  createCareerRoadmap, 
  updateCareerRoadmap, 
  deleteCareerRoadmap 
} from "../../api/careerRoadmapApi";
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Users,
  Clock,
  DollarSign,
  TrendingUp
} from "lucide-react";

const ManageCareerRoadmaps = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRoadmap, setEditingRoadmap] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
    estimatedDuration: 12,
    difficulty: "intermediate",
    minQuizScore: 75,
    salaryRange: { min: 0, max: 0 },
    icon: "🤖",
    color: "#3b82f6",
    prerequisites: [],
    careerOutlook: {
      growth: "High",
      demand: "High",
      description: ""
    },
    scoreWeights: {
      moduleCompletion: 0.3,
      labCompletion: 0.3,
      quizAverage: 0.2,
      skillCompetency: 0.2
    }
  });

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    try {
      setLoading(true);
      const data = await getCareerRoadmaps();
      setRoadmaps(data.roadmaps || []);
    } catch (error) {
      console.error("Failed to load roadmaps:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createCareerRoadmap(formData);
      await loadRoadmaps();
      setShowForm(false);
      resetForm();
      alert("Career roadmap created successfully!");
    } catch (error) {
      console.error("Failed to create roadmap:", error);
      alert("Failed to create roadmap. Please try again.");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateCareerRoadmap(editingRoadmap._id, formData);
      await loadRoadmaps();
      setEditingRoadmap(null);
      setShowForm(false);
      resetForm();
      alert("Career roadmap updated successfully!");
    } catch (error) {
      console.error("Failed to update roadmap:", error);
      alert("Failed to update roadmap. Please try again.");
    }
  };

  const handleDelete = async (roadmapId) => {
    if (!window.confirm("Are you sure you want to delete this career roadmap? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteCareerRoadmap(roadmapId);
      await loadRoadmaps();
      alert("Career roadmap deleted successfully!");
    } catch (error) {
      console.error("Failed to delete roadmap:", error);
      alert("Failed to delete roadmap. Please try again.");
    }
  };

  const startEdit = (roadmap) => {
    setEditingRoadmap(roadmap);
    setFormData({
      roleName: roadmap.roleName,
      description: roadmap.description,
      estimatedDuration: roadmap.estimatedDuration,
      difficulty: roadmap.difficulty,
      minQuizScore: roadmap.minQuizScore,
      salaryRange: roadmap.salaryRange,
      icon: roadmap.icon,
      color: roadmap.color,
      prerequisites: roadmap.prerequisites || [],
      careerOutlook: roadmap.careerOutlook,
      scoreWeights: roadmap.scoreWeights
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      roleName: "",
      description: "",
      estimatedDuration: 12,
      difficulty: "intermediate",
      minQuizScore: 75,
      salaryRange: { min: 0, max: 0 },
      icon: "🤖",
      color: "#3b82f6",
      prerequisites: [],
      careerOutlook: {
        growth: "High",
        demand: "High",
        description: ""
      },
      scoreWeights: {
        moduleCompletion: 0.3,
        labCompletion: 0.3,
        quizAverage: 0.2,
        skillCompetency: 0.2
      }
    });
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", color: "#fff", textAlign: "center" }}>
        <div>Loading career roadmaps...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", color: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
          Manage Career Roadmaps
        </h1>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            backgroundColor: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          <Plus size={18} />
          Create Roadmap
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
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
            backgroundColor: "#1f2937",
            borderRadius: "16px",
            padding: "30px",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "80vh",
            overflowY: "auto",
            border: "1px solid #374151"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
                {editingRoadmap ? "Edit Roadmap" : "Create Roadmap"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingRoadmap(null);
                  resetForm();
                }}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#9ca3af",
                  cursor: "pointer",
                  fontSize: "24px"
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: "grid", gap: "20px" }}>
              {/* Basic Info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#9ca3af", fontSize: "14px" }}>
                    Role Name *
                  </label>
                  <input
                    type="text"
                    value={formData.roleName}
                    onChange={(e) => handleInputChange("roleName", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#111827",
                      color: "#fff",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#9ca3af", fontSize: "14px" }}>
                    Duration (weeks) *
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedDuration}
                    onChange={(e) => handleInputChange("estimatedDuration", parseInt(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#111827",
                      color: "#fff",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#9ca3af", fontSize: "14px" }}>
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#111827",
                    color: "#fff",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    fontSize: "14px",
                    resize: "vertical"
                  }}
                />
              </div>

              {/* Advanced Settings */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#9ca3af", fontSize: "14px" }}>
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange("difficulty", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#111827",
                      color: "#fff",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#9ca3af", fontSize: "14px" }}>
                    Min Quiz Score
                  </label>
                  <input
                    type="number"
                    value={formData.minQuizScore}
                    onChange={(e) => handleInputChange("minQuizScore", parseInt(e.target.value))}
                    min="0"
                    max="100"
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#111827",
                      color: "#fff",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: "#9ca3af", fontSize: "14px" }}>
                    Icon
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => handleInputChange("icon", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#111827",
                      color: "#fff",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#9ca3af", fontSize: "14px" }}>
                  Salary Range (USD)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={formData.salaryRange.min}
                    onChange={(e) => handleInputChange("salaryRange.min", parseInt(e.target.value))}
                    style={{
                      padding: "10px",
                      backgroundColor: "#111827",
                      color: "#fff",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={formData.salaryRange.max}
                    onChange={(e) => handleInputChange("salaryRange.max", parseInt(e.target.value))}
                    style={{
                      padding: "10px",
                      backgroundColor: "#111827",
                      color: "#fff",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingRoadmap(null);
                  resetForm();
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6b7280",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Cancel
              </button>
              <button
                onClick={editingRoadmap ? handleUpdate : handleCreate}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                <Save size={16} />
                {editingRoadmap ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Roadmaps List */}
      <div style={{ display: "grid", gap: "20px" }}>
        {roadmaps.map((roadmap) => (
          <div
            key={roadmap._id}
            style={{
              backgroundColor: "#1f2937",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #374151",
              transition: "all 0.3s ease"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{
                  fontSize: "32px",
                  width: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  backgroundColor: roadmap.color + "20",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {roadmap.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#fff", marginBottom: "5px" }}>
                    {roadmap.roleName}
                  </h3>
                  <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <span style={{
                      padding: "4px 8px",
                      backgroundColor: roadmap.difficulty === "beginner" ? "#10b981" : 
                                     roadmap.difficulty === "intermediate" ? "#f59e0b" : "#ef4444",
                      color: "#fff",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "bold"
                    }}>
                      {roadmap.difficulty}
                    </span>
                    <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                      {roadmap.estimatedDuration} weeks
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => startEdit(roadmap)}
                  style={{
                    padding: "6px 10px",
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(roadmap._id)}
                  style={{
                    padding: "6px 10px",
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <p style={{ color: "#d1d5db", fontSize: "14px", lineHeight: "1.5", marginBottom: "15px" }}>
              {roadmap.description}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <DollarSign size={16} color="#10b981" />
                <div>
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>Salary Range</div>
                  <div style={{ fontSize: "13px", color: "#fff", fontWeight: "bold" }}>
                    ${(roadmap.salaryRange?.min || 0).toLocaleString()} - ${(roadmap.salaryRange?.max || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp size={16} color="#f59e0b" />
                <div>
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>Demand</div>
                  <div style={{ fontSize: "13px", color: "#fff", fontWeight: "bold" }}>
                    {roadmap.careerOutlook?.demand || "High"}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Users size={16} color="#8b5cf6" />
                <div>
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>Min Quiz Score</div>
                  <div style={{ fontSize: "13px", color: "#fff", fontWeight: "bold" }}>
                    {roadmap.minQuizScore}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {roadmaps.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
          <Briefcase size={64} style={{ marginBottom: "20px", opacity: 0.5 }} />
          <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>No career roadmaps found</h3>
          <p>Create your first career roadmap to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ManageCareerRoadmaps;
