import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLabs, startLabAttempt, getMyLabAttempts, completeLabAttempt } from "../../api/roleBasedApi";
import { useAuthContext } from "../../context/AuthContext";

const LabsPage = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const { user: _user } = useAuthContext();
  const [labs, setLabs] = useState([]);
  const [myAttempts, setMyAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState(null);
  const [activeAttempt, setActiveAttempt] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [labsData, attemptsData] = await Promise.all([
        getLabs(),
        getMyLabAttempts(),
      ]);
      setLabs(labsData);
      setMyAttempts(attemptsData);
    } catch (err) {
      console.error("Failed to load labs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLab = async (lab) => {
    try {
      const attempt = await startLabAttempt(lab._id, roleId);
      setActiveAttempt(attempt);
      setSelectedLab(lab);
    } catch (err) {
      alert("Failed to start lab: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCompleteLab = async (status, score) => {
    if (!activeAttempt) return;

    try {
      await completeLabAttempt(activeAttempt._id, {
        status,
        score: score || (status === "success" ? 100 : status === "partial" ? 50 : 0),
        timeTakenSeconds: Math.floor((Date.now() - new Date(activeAttempt.createdAt)) / 1000),
      });

      alert(`Lab ${status === "success" ? "passed" : status === "partial" ? "partially completed" : "failed"}!`);
      setActiveAttempt(null);
      setSelectedLab(null);
      loadData();

      // Navigate back to role dashboard to see updated readiness
      if (roleId) {
        navigate(`/app/role-dashboard/${roleId}`);
      }
    } catch (err) {
      alert("Failed to complete lab: " + (err.response?.data?.message || err.message));
    }
  };

  const getAttemptCount = (labId) => {
    return myAttempts.filter((a) => a.labId?._id === labId).length;
  };

  const getLastAttemptStatus = (labId) => {
    const attempts = myAttempts
      .filter((a) => a.labId?._id === labId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return attempts[0]?.status;
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 2) return "bg-green-100 text-green-800";
    if (difficulty === 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getScenarioIcon = (scenario) => {
    if (scenario === "attack") return "⚔️";
    if (scenario === "defense") return "🛡️";
    return "🔄";
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Loading labs...</p>
      </div>
    );
  }

  if (activeAttempt && selectedLab) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{selectedLab.name}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(selectedLab.difficulty)}`}>
              Level {selectedLab.difficulty}
            </span>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <span>{getScenarioIcon(selectedLab.scenario)} {selectedLab.scenario}</span>
              <span>⏱️ Time Limit: {selectedLab.timeLimit} min</span>
              <span>🔧 Tools: {selectedLab.requiredTools?.join(", ")}</span>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Objective:</h3>
              <p className="text-blue-800">{selectedLab.objectiveText}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description:</h3>
              <p className="text-gray-700">{selectedLab.description}</p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <p className="text-yellow-800 text-sm">
                📋 In a real environment, you would access a VM, Docker container, or simulation here.
                For this demo, complete the lab in your own environment and record your result below.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleCompleteLab("success", 100)}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              ✅ Mark as Passed (100%)
            </button>
            <button
              onClick={() => handleCompleteLab("partial", 50)}
              className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition font-semibold"
            >
              ⚠️ Partial Completion (50%)
            </button>
            <button
              onClick={() => handleCompleteLab("failed", 0)}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              ❌ Mark as Failed
            </button>
          </div>

          <button
            onClick={() => {
              setActiveAttempt(null);
              setSelectedLab(null);
            }}
            className="mt-4 w-full text-gray-600 hover:text-gray-900 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔬 Practical Labs</h1>
        <p className="text-gray-600">
          Complete hands-on labs to build practical skills and improve your job readiness score.
        </p>
      </div>

      {labs.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">No labs available yet. Contact your administrator.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {labs.map((lab) => {
            const attemptCount = getAttemptCount(lab._id);
            const lastStatus = getLastAttemptStatus(lab._id);

            return (
              <div
                key={lab._id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg">{lab.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(lab.difficulty)}`}>
                    L{lab.difficulty}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{lab.description}</p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span>{getScenarioIcon(lab.scenario)}</span>
                  <span>⏱️ {lab.timeLimit}min</span>
                  <span>🏷️ {lab.tags?.[0]}</span>
                </div>

                {attemptCount > 0 && (
                  <div className="mb-3 text-xs">
                    <span className="text-gray-600">Attempts: {attemptCount}</span>
                    {lastStatus && (
                      <span
                        className={`ml-2 px-2 py-0.5 rounded ${
                          lastStatus === "success"
                            ? "bg-green-100 text-green-800"
                            : lastStatus === "partial"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        Last: {lastStatus}
                      </span>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleStartLab(lab)}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold text-sm"
                >
                  {attemptCount > 0 ? "Try Again" : "Start Lab"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LabsPage;
