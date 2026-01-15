import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import {
  getAdminLabs,
  createAdminLab,
  updateAdminLab,
  deleteAdminLab,
} from "../../api/adminApi";

const initialForm = {
  name: "",
  description: "",
  difficulty: 1,
  scenario: "defense",
  timeLimit: 30,
  requiredTools: [],
  tags: [],
  skillId: "",
  objectiveText: "",
  environment: "simulated",
};

const ManageLabs = () => {
  const { user } = useAuth();
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLab, setEditingLab] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadLabs();
  }, []);

  const loadLabs = async () => {
    try {
      const data = await getAdminLabs();
      setLabs(data.labs || []);
    } catch (err) {
      console.error("Failed to load labs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLab) {
        await updateAdminLab(editingLab._id, formData);
      } else {
        await createAdminLab(formData);
      }
      setIsFormOpen(false);
      setEditingLab(null);
      setFormData(initialForm);
      loadLabs();
    } catch (err) {
      console.error("Failed to save lab:", err);
    }
  };

  const handleEdit = (lab) => {
    setEditingLab(lab);
    setFormData({
      ...lab,
      requiredTools: lab.requiredTools || [],
      tags: lab.tags || [],
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lab?")) {
      try {
        await deleteAdminLab(id);
        loadLabs();
      } catch (err) {
        console.error("Failed to delete lab:", err);
      }
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingLab(null);
    setFormData(initialForm);
  };

  if (loading) return <div>Loading labs...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>🔬 Manage Labs</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          + Create New Lab
        </button>
      </div>

      {/* Labs List */}
      <div style={{ display: "grid", gap: "16px", marginBottom: "20px" }}>
        {labs.map((lab) => (
          <div
            key={lab._id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "#f9fafb",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <h3 style={{ margin: "0 0 8px" }}>{lab.name}</h3>
                <p style={{ margin: "0 0 8px", color: "#6b7280" }}>{lab.description}</p>
                <div style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                  <div>Difficulty: {lab.difficulty}</div>
                  <div>Scenario: {lab.scenario}</div>
                  <div>Time: {lab.timeLimit}min</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => handleEdit(lab)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(lab._id)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lab Form Modal */}
      {isFormOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}>
            <h3>{editingLab ? "Edit Lab" : "Create New Lab"}</h3>
            
            <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label>Lab Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label>Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
                    style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                  >
                    <option value={1}>Beginner</option>
                    <option value={2}>Intermediate</option>
                    <option value={3}>Advanced</option>
                    <option value={4}>Expert</option>
                  </select>
                </div>

                <div>
                  <label>Scenario</label>
                  <select
                    value={formData.scenario}
                    onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                    style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                  >
                    <option value="defense">Defense</option>
                    <option value="attack">Attack</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label>Time Limit (minutes)</label>
                  <input
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                    min="5"
                    max="120"
                    style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                  />
                </div>

                <div>
                  <label>Environment</label>
                  <select
                    value={formData.environment}
                    onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                    style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                  >
                    <option value="simulated">Simulated</option>
                    <option value="vm">Virtual Machine</option>
                    <option value="docker">Docker Container</option>
                    <option value="cloud">Cloud Environment</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label>Objective Text</label>
                <textarea
                  value={formData.objectiveText}
                  onChange={(e) => setFormData({ ...formData, objectiveText: e.target.value })}
                  rows={2}
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#6b7280",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {editingLab ? "Update" : "Create"} Lab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLabs;