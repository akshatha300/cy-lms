import { useState, useEffect } from "react";
import PhishingDetectionLab from "./labs/PhishingDetectionLab.jsx";
import PasswordSecurityLab from "./labs/PasswordSecurityLab.jsx";
import NetworkAnalysisLab from "./labs/NetworkAnalysisLab.jsx";
import WebSecurityLab from "./labs/WebSecurityLab.jsx";
import EncryptionLab from "./labs/EncryptionLab.jsx";
import SIEMLab from "./labs/SIEMLab.jsx";
import SystemHardeningLab from "./labs/SystemHardeningLab.jsx";
import IncidentResponseLab from "./labs/IncidentResponseLab.jsx";
import DigitalForensicsLab from "./labs/DigitalForensicsLab.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { getLabs, startLabAttempt, getMyLabAttempts, completeLabAttempt, getRoleLabs, getUserRole } from "../../api/roleBasedApi";
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
  const [roleInfo, setRoleInfo] = useState({ roleFiltered: false, roleName: null, roleId: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // First get user's selected role
      const userRole = await getUserRole();
      
      let labsData;
      if (userRole && userRole.primaryRole) {
        // Get labs for the user's role
        const roleLabsData = await getRoleLabs(userRole.primaryRole._id);
        labsData = roleLabsData.labs || [];
        setRoleInfo({
          roleFiltered: true,
          roleName: userRole.primaryRole.name,
          roleId: userRole.primaryRole._id,
          labCount: roleLabsData.labCount
        });
      } else {
        // No role selected, show all labs
        labsData = await getLabs();
        setRoleInfo({
          roleFiltered: false,
          roleName: null,
          roleId: null
        });
      }

      const attemptsData = await getMyLabAttempts();
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
      // Start lab attempt
      const attempt = await startLabAttempt(lab._id, roleId);
      setSelectedLab(lab);
      setActiveAttempt(attempt);
    } catch (err) {
      console.error("Failed to start lab:", err);
    }
  };

  const handleCompleteLab = async (payload) => {
    try {
      const result = await completeLabAttempt(activeAttempt._id, payload);
      setActiveAttempt(null);
      setSelectedLab(null);
      // Reload attempts
      const attemptsData = await getMyLabAttempts();
      setMyAttempts(attemptsData);
    } catch (err) {
      console.error("Failed to complete lab:", err);
    }
  };
  const getLabComponent = (lab) => {
  console.log("Lab data:", lab);
  console.log("Lab scenario:", lab.scenario);
  console.log("Lab name:", lab.name);
  
  switch (lab.scenario) {
    case "attack":
      // Route to specific attack labs based on lab name
      if (lab.name.toLowerCase().includes('phishing') || lab.name.toLowerCase().includes('email') || lab.name.toLowerCase().includes('identify') || lab.name.toLowerCase().includes('aws') || lab.name.toLowerCase().includes('privilege') || lab.name.toLowerCase().includes('escalation') || lab.name.toLowerCase().includes('indicators')) {
        return <PhishingDetectionLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
      }
      if (lab.name.toLowerCase().includes('password') || lab.name.toLowerCase().includes('brute') || lab.name.toLowerCase().includes('crack') || lab.name.toLowerCase().includes('attack') || lab.name.toLowerCase().includes('security')) {
        return <PasswordSecurityLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
      }
      if (lab.name.toLowerCase().includes('encryption') || lab.name.toLowerCase().includes('crypto') || lab.name.toLowerCase().includes('cipher') || lab.name.toLowerCase().includes('aes') || lab.name.toLowerCase().includes('hash')) {
        return <EncryptionLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
      }
      if (lab.name.toLowerCase().includes('web') || lab.name.toLowerCase().includes('xss') || lab.name.toLowerCase().includes('sql') || lab.name.toLowerCase().includes('injection') || lab.name.toLowerCase().includes('vulnerability') || lab.name.toLowerCase().includes('hack')) {
        return <WebSecurityLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
      }
      break;
      
    case "defense":
      // Route to specific defense labs based on lab name
      if (lab.name.toLowerCase().includes('network') || lab.name.toLowerCase().includes('analysis') || lab.name.toLowerCase().includes('monitoring') || lab.name.toLowerCase().includes('traffic') || lab.name.toLowerCase().includes('packet') || lab.name.toLowerCase().includes('siem') || lab.name.toLowerCase().includes('log') || lab.name.toLowerCase().includes('event') || lab.name.toLowerCase().includes('correlation')) {
        return <NetworkAnalysisLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
      }
      if (lab.name.toLowerCase().includes('hardening') || lab.name.toLowerCase().includes('security') || lab.name.toLowerCase().includes('config') || lab.name.toLowerCase().includes('system') || lab.name.toLowerCase().includes('server') || lab.name.toLowerCase().includes('patch')) {
        return <SystemHardeningLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
      }
      if (lab.name.toLowerCase().includes('incident') || lab.name.toLowerCase().includes('response') || lab.name.toLowerCase().includes('breach') || lab.name.toLowerCase().includes('malware') || lab.name.toLowerCase().includes('outbreak')) {
        return <IncidentResponseLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
      }
      if (lab.name.toLowerCase().includes('forensics') || lab.name.toLowerCase().includes('analysis') || lab.name.toLowerCase().includes('investigation') || lab.name.toLowerCase().includes('evidence') || lab.name.toLowerCase().includes('memory') || lab.name.toLowerCase().includes('file')) {
        return <DigitalForensicsLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
      }
      break;
      
    default:
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Lab Coming Soon</h2>
          <p>This lab environment is under development.</p>
        </div>
      );
  }
};
 

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 2) return "#10b981";
    if (difficulty === 3) return "#f59e0b";
    return "#ef4444";
  };

  const getScenarioIcon = (scenario) => {
    const icons = {
      phishing: "🎣",
      password: "🔐",
      network: "🌐",
      encryption: "🔐",
      web: "🌐",
      siem: "📊",
      hardening: "🛡️",
      incident: "🚨",
      forensics: "🔍"
    };
    return icons[scenario] || "🔬";
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", marginBottom: "10px" }}>🔬</div>
        <p>Loading labs...</p>
      </div>
    );
  }

  if (selectedLab && activeAttempt) {
    return (
      <div>
        {getLabComponent(selectedLab)}
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
              ? `${roleInfo.roleName} Labs` 
              : "All Labs"
            }
          </h2>
          {roleInfo.roleFiltered && (
            <p style={{ 
              margin: "4px 0 0", 
              color: "#6b7280", 
              fontSize: "14px" 
            }}>
              Your personalized lab exercises for {roleInfo.roleName}
            </p>
          )}
        </div>
        <div style={{
          backgroundColor: "#dbeafe",
          color: "#1e40af",
          padding: "8px 16px",
          borderRadius: "20px",
          fontSize: "14px",
          fontWeight: "600"
        }}>
          {roleInfo.labCount || labs.length} Comprehensive Labs
        </div>
      </div>

      {/* Labs Grid */}
      {labs.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "#f8fafc",
          border: "2px dashed #cbd5e1",
          borderRadius: "12px",
          margin: "20px 0"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔬</div>
          <h3 style={{ margin: "0 0 16px", color: "#64748b" }}>
            {roleInfo.roleFiltered 
              ? `No labs assigned to ${roleInfo.roleName} yet` 
              : "No labs available"
            }
          </h3>
          <p style={{ color: "#6b7280", margin: 0 }}>
            {roleInfo.roleFiltered 
              ? "Select a role to see role-specific labs, or contact your administrator."
              : "Check back later for new lab exercises."
            }
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "20px"
        }}>
          {labs.map((lab) => (
            <div
              key={lab._id}
              style={{
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease-in-out",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 12px -2px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
              }}
              onClick={() => handleStartLab(lab)}
            >
              {/* Lab Header */}
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
                    color: "#1f2937",
                    lineHeight: "1.3"
                  }}>
                    {lab.name}
                  </h3>
                  <p style={{ 
                    margin: "0 0 12px", 
                    color: "#6b7280", 
                    fontSize: "14px",
                    lineHeight: "1.4"
                  }}>
                    {lab.description}
                  </p>
                </div>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: getDifficultyColor(lab.difficulty),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold"
                }}>
                  {lab.difficulty}
                </div>
              </div>

              {/* Lab Details */}
              <div style={{ 
                display: "flex", 
                gap: "16px", 
                marginBottom: "16px",
                fontSize: "13px",
                color: "#4b5563"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>{getScenarioIcon(lab.scenario)}</span>
                  <span style={{ fontWeight: "600" }}>{lab.scenario}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>⏱️</span>
                  <span>{lab.timeLimit} min</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🔧</span>
                  <span>{lab.requiredTools?.[0] || "Basic Tools"}</span>
                </div>
              </div>

              {/* Start Lab Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartLab(lab);
                }}
                style={{
                  width: "100%",
                  padding: "12px 20px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#3b82f6";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                🚀 Start Lab
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabsPage;