import { useState, useEffect } from "react";
import { executeLabCode, getSubmissionStatus, getUserLabSubmissions, getLabLeaderboard } from "../api/labExecutionApi";
import { Play, Code, CheckCircle, XCircle, Clock, Trophy, TrendingUp, BarChart3, Activity } from "lucide-react";

const LabExecution = ({ lab, user }) => {
  const [code, setCode] = useState(lab?.content?.code || "");
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState("editor");
  const [executionStatus, setExecutionStatus] = useState("idle");

  // Load previous submissions
  useEffect(() => {
    if (lab?._id) {
      loadSubmissions();
      loadLeaderboard();
    }
  }, [lab?._id]);

  // Poll for submission status
  useEffect(() => {
    if (currentSubmission && currentSubmission.status === "pending") {
      const interval = setInterval(() => {
        checkSubmissionStatus(currentSubmission._id);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [currentSubmission]);

  const loadSubmissions = async () => {
    try {
      const data = await getUserLabSubmissions(lab._id);
      setSubmissions(data);
    } catch (error) {
      console.error("Failed to load submissions:", error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const data = await getLabLeaderboard(lab._id);
      setLeaderboard(data);
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    }
  };

  const executeCode = async () => {
    if (!code.trim()) {
      alert("Please enter some code to execute");
      return;
    }

    setIsExecuting(true);
    setExecutionStatus("pending");

    try {
      const result = await executeLabCode(lab._id, code, "python");
      setCurrentSubmission(result);
      
      // Start polling for results
      setTimeout(() => {
        checkSubmissionStatus(result.submissionId);
      }, 1000);
    } catch (error) {
      console.error("Failed to execute code:", error);
      setExecutionStatus("error");
      setIsExecuting(false);
    }
  };

  const checkSubmissionStatus = async (submissionId) => {
    try {
      const submission = await getSubmissionStatus(submissionId);
      setCurrentSubmission(submission);
      
      if (submission.status === "completed" || submission.status === "failed" || submission.status === "error") {
        setExecutionStatus(submission.status);
        setIsExecuting(false);
        loadSubmissions(); // Reload submissions to include the new one
        loadLeaderboard(); // Reload leaderboard
      } else {
        setExecutionStatus("running");
      }
    } catch (error) {
      console.error("Failed to check submission status:", error);
      setExecutionStatus("error");
      setIsExecuting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={20} color="#10b981" />;
      case "failed":
      case "error":
        return <XCircle size={20} color="#ef4444" />;
      case "running":
      case "pending":
        return <Clock size={20} color="#f59e0b" />;
      default:
        return <Code size={20} color="#6b7280" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "failed":
      case "error":
        return "#ef4444";
      case "running":
      case "pending":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const renderMetrics = (metrics) => {
    if (!metrics) return null;

    return (
      <div style={{ marginTop: "20px" }}>
        <h4 style={{ color: "#fff", marginBottom: "15px" }}>Performance Metrics</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
          {metrics.accuracy !== undefined && (
            <div style={{ backgroundColor: "#1f2937", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>
                {(metrics.accuracy * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "5px" }}>Accuracy</div>
            </div>
          )}
          {metrics.precision !== undefined && (
            <div style={{ backgroundColor: "#1f2937", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}>
                {(metrics.precision * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "5px" }}>Precision</div>
            </div>
          )}
          {metrics.recall !== undefined && (
            <div style={{ backgroundColor: "#1f2937", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#8b5cf6" }}>
                {(metrics.recall * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "5px" }}>Recall</div>
            </div>
          )}
          {metrics.f1Score !== undefined && (
            <div style={{ backgroundColor: "#1f2937", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>
                {(metrics.f1Score * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "5px" }}>F1 Score</div>
            </div>
          )}
        </div>

        {/* Custom metrics */}
        {metrics.customMetrics && metrics.customMetrics.size > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h5 style={{ color: "#fff", marginBottom: "10px" }}>Additional Metrics</h5>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
              {Array.from(metrics.customMetrics.entries()).map(([key, value]) => (
                <div key={key} style={{ backgroundColor: "#374151", padding: "10px", borderRadius: "6px" }}>
                  <div style={{ fontSize: "14px", color: "#9ca3af" }}>{key}</div>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: "#fff" }}>
                    {typeof value === "number" ? value.toFixed(4) : value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderComparison = (comparison) => {
    if (!comparison || !comparison.previousAttempts.length) return null;

    return (
      <div style={{ marginTop: "20px" }}>
        <h4 style={{ color: "#fff", marginBottom: "15px" }}>Performance Comparison</h4>
        
        {/* Best score */}
        {comparison.bestScore.accuracy > 0 && (
          <div style={{ backgroundColor: "#1f2937", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <Trophy size={20} color="#f59e0b" style={{ marginRight: "10px" }} />
              <span style={{ color: "#fff", fontWeight: "bold" }}>Your Best Score</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" }}>
              <div>
                <div style={{ fontSize: "12px", color: "#9ca3af" }}>Accuracy</div>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#10b981" }}>
                  {(comparison.bestScore.accuracy * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#9ca3af" }}>F1 Score</div>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#f59e0b" }}>
                  {(comparison.bestScore.f1Score * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Previous attempts */}
        <div style={{ backgroundColor: "#1f2937", padding: "15px", borderRadius: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <TrendingUp size={20} color="#3b82f6" style={{ marginRight: "10px" }} />
            <span style={{ color: "#fff", fontWeight: "bold" }}>Recent Attempts</span>
          </div>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {comparison.previousAttempts.slice(0, 5).map((attempt, index) => (
              <div key={attempt.attemptId} style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                padding: "8px 0",
                borderBottom: index < 4 ? "1px solid #374151" : "none"
              }}>
                <div>
                  <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                    {new Date(attempt.timestamp).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: "12px", color: attempt.improvement === "better" ? "#10b981" : 
                                  attempt.improvement === "worse" ? "#ef4444" : "#6b7280" }}>
                    {attempt.improvement === "better" ? "↑ Improved" : 
                     attempt.improvement === "worse" ? "↓ Lower" : "→ Same"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}>
                    {(attempt.accuracy * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>Accuracy</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFeedback = (feedback) => {
    if (!feedback) return null;

    return (
      <div style={{ marginTop: "20px" }}>
        <h4 style={{ color: "#fff", marginBottom: "15px" }}>Feedback</h4>
        
        {/* Score */}
        <div style={{ backgroundColor: "#1f2937", padding: "15px", borderRadius: "8px", marginBottom: "15px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", fontWeight: "bold", color: feedback.score >= 80 ? "#10b981" : feedback.score >= 60 ? "#f59e0b" : "#ef4444" }}>
            {feedback.score}/100
          </div>
          <div style={{ fontSize: "14px", color: "#9ca3af", marginTop: "5px" }}>Overall Score</div>
        </div>

        {/* Automated comments */}
        {feedback.automatedComments && (
          <div style={{ backgroundColor: "#1f2937", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
            <div style={{ fontSize: "14px", color: "#fff", fontStyle: "italic" }}>
              {feedback.automatedComments}
            </div>
          </div>
        )}

        {/* Strengths */}
        {feedback.strengths.length > 0 && (
          <div style={{ backgroundColor: "#065f46", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#10b981", marginBottom: "10px" }}>
              ✓ Strengths
            </div>
            {feedback.strengths.map((strength, index) => (
              <div key={index} style={{ fontSize: "14px", color: "#d1fae5", marginBottom: "5px" }}>
                • {strength}
              </div>
            ))}
          </div>
        )}

        {/* Improvements */}
        {feedback.improvements.length > 0 && (
          <div style={{ backgroundColor: "#7c2d12", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#f59e0b", marginBottom: "10px" }}>
              ! Areas for Improvement
            </div>
            {feedback.improvements.map((improvement, index) => (
              <div key={index} style={{ fontSize: "14px", color: "#fef3c7", marginBottom: "5px" }}>
                • {improvement}
              </div>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {feedback.suggestions.length > 0 && (
          <div style={{ backgroundColor: "#1e3a8a", padding: "15px", borderRadius: "8px" }}>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#3b82f6", marginBottom: "10px" }}>
              💡 Suggestions
            </div>
            {feedback.suggestions.map((suggestion, index) => (
              <div key={index} style={{ fontSize: "14px", color: "#dbeafe", marginBottom: "5px" }}>
                • {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", color: "#fff", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>{lab?.title || "Lab Execution"}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {getStatusIcon(executionStatus)}
          <span style={{ color: getStatusColor(executionStatus), fontSize: "14px" }}>
            {executionStatus.charAt(0).toUpperCase() + executionStatus.slice(1)}
          </span>
        </div>
      </div>

      {/* Lab description */}
      {lab?.description && (
        <div style={{ backgroundColor: "#1f2937", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
          <p style={{ color: "#d1d5db", lineHeight: "1.5" }}>{lab.description}</p>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #374151" }}>
        {["editor", "results", "history", "leaderboard"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 20px",
              backgroundColor: activeTab === tab ? "#3b82f6" : "transparent",
              color: activeTab === tab ? "#fff" : "#9ca3af",
              border: "none",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              borderBottom: activeTab === tab ? "2px solid #3b82f6" : "none",
              textTransform: "capitalize",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "editor" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Code editor */}
          <div>
            <h3 style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
              <Code size={20} style={{ marginRight: "10px" }} />
              Code Editor
            </h3>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your Python code here..."
              style={{
                width: "100%",
                height: "400px",
                backgroundColor: "#1f2937",
                color: "#fff",
                border: "1px solid #374151",
                borderRadius: "8px",
                padding: "15px",
                fontFamily: "monospace",
                fontSize: "14px",
                resize: "vertical",
              }}
            />
            <button
              onClick={executeCode}
              disabled={isExecuting}
              style={{
                marginTop: "10px",
                padding: "12px 24px",
                backgroundColor: isExecuting ? "#4b5563" : "#10b981",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: isExecuting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Play size={16} />
              {isExecuting ? "Executing..." : "Run Code"}
            </button>
          </div>

          {/* Lab instructions */}
          <div>
            <h3 style={{ marginBottom: "10px" }}>Lab Instructions</h3>
            <div style={{ backgroundColor: "#1f2937", padding: "15px", borderRadius: "8px", height: "400px", overflowY: "auto" }}>
              {lab?.content?.steps && lab.content.steps.length > 0 ? (
                <ol style={{ color: "#d1d5db", paddingLeft: "20px" }}>
                  {lab.content.steps.map((step, index) => (
                    <li key={index} style={{ marginBottom: "10px" }}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p style={{ color: "#9ca3af" }}>No specific instructions provided for this lab.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "results" && currentSubmission && (
        <div>
          <h3 style={{ marginBottom: "20px" }}>Execution Results</h3>
          
          {/* Output */}
          {currentSubmission.executionResults && (
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ color: "#fff", marginBottom: "10px" }}>Output</h4>
              <div style={{ backgroundColor: "#1f2937", padding: "15px", borderRadius: "8px" }}>
                <pre style={{ color: "#d1d5db", whiteSpace: "pre-wrap", margin: 0 }}>
                  {currentSubmission.executionResults.stdout || currentSubmission.executionResults.output || "No output"}
                </pre>
              </div>
              
              {currentSubmission.executionResults.stderr && (
                <div style={{ marginTop: "10px" }}>
                  <h4 style={{ color: "#ef4444", marginBottom: "10px" }}>Error Output</h4>
                  <div style={{ backgroundColor: "#7f1d1d", padding: "15px", borderRadius: "8px" }}>
                    <pre style={{ color: "#fca5a5", whiteSpace: "pre-wrap", margin: 0 }}>
                      {currentSubmission.executionResults.stderr}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metrics */}
          {renderMetrics(currentSubmission.metrics)}
          
          {/* Comparison */}
          {renderComparison(currentSubmission.comparison)}
          
          {/* Feedback */}
          {renderFeedback(currentSubmission.feedback)}
        </div>
      )}

      {activeTab === "history" && (
        <div>
          <h3 style={{ marginBottom: "20px" }}>Submission History</h3>
          {submissions.length > 0 ? (
            <div style={{ display: "grid", gap: "15px" }}>
              {submissions.map((submission) => (
                <div key={submission._id} style={{ backgroundColor: "#1f2937", padding: "15px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {getStatusIcon(submission.status)}
                      <span style={{ color: "#fff", fontWeight: "bold" }}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                      {new Date(submission.createdAt).toLocaleString()}
                    </div>
                  </div>
                  
                  {submission.metrics && submission.metrics.accuracy !== undefined && (
                    <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                      <div>
                        <span style={{ color: "#9ca3af", fontSize: "12px" }}>Accuracy: </span>
                        <span style={{ color: "#10b981", fontWeight: "bold" }}>
                          {(submission.metrics.accuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                      {submission.feedback && (
                        <div>
                          <span style={{ color: "#9ca3af", fontSize: "12px" }}>Score: </span>
                          <span style={{ color: "#f59e0b", fontWeight: "bold" }}>
                            {submission.feedback.score}/100
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {submission.executionResults && submission.executionResults.executionTime && (
                    <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                      Execution time: {submission.executionResults.executionTime}ms
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
              <Activity size={48} style={{ marginBottom: "15px", opacity: 0.5 }} />
              <p>No submissions yet. Start by executing your code!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "leaderboard" && (
        <div>
          <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
            <Trophy size={24} style={{ marginRight: "10px", color: "#f59e0b" }} />
            Lab Leaderboard
          </h3>
          {leaderboard.length > 0 ? (
            <div style={{ backgroundColor: "#1f2937", borderRadius: "8px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#374151" }}>
                    <th style={{ padding: "15px", textAlign: "left", color: "#fff" }}>Rank</th>
                    <th style={{ padding: "15px", textAlign: "left", color: "#fff" }}>Name</th>
                    <th style={{ padding: "15px", textAlign: "center", color: "#fff" }}>Score</th>
                    <th style={{ padding: "15px", textAlign: "center", color: "#fff" }}>Accuracy</th>
                    <th style={{ padding: "15px", textAlign: "center", color: "#fff" }}>F1 Score</th>
                    <th style={{ padding: "15px", textAlign: "center", color: "#fff" }}>Attempts</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry._id} style={{ borderBottom: "1px solid #374151" }}>
                      <td style={{ padding: "15px", color: "#fff" }}>
                        {index === 0 && <Trophy size={16} color="#f59e0b" />}
                        {index === 1 && <Trophy size={16} color="#9ca3af" />}
                        {index === 2 && <Trophy size={16} color="#cd7f32" />}
                        {index > 2 && <span style={{ color: "#9ca3af" }}>#{index + 1}</span>}
                      </td>
                      <td style={{ padding: "15px", color: "#fff" }}>{entry.user.name}</td>
                      <td style={{ padding: "15px", textAlign: "center", color: "#fff" }}>
                        <span style={{ 
                          fontWeight: "bold", 
                          color: entry.feedback.score >= 80 ? "#10b981" : 
                                 entry.feedback.score >= 60 ? "#f59e0b" : "#ef4444"
                        }}>
                          {entry.feedback.score}
                        </span>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center", color: "#fff" }}>
                        {(entry.metrics.accuracy * 100).toFixed(1)}%
                      </td>
                      <td style={{ padding: "15px", textAlign: "center", color: "#fff" }}>
                        {(entry.metrics.f1Score * 100).toFixed(1)}%
                      </td>
                      <td style={{ padding: "15px", textAlign: "center", color: "#fff" }}>
                        {entry.attempts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
              <BarChart3 size={48} style={{ marginBottom: "15px", opacity: 0.5 }} />
              <p>No submissions yet. Be the first to complete this lab!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LabExecution;
