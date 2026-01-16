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
  const [roleInfo, setRoleInfo] = useState({ roleFiltered: false, roleName: null, roleId: null, labCount: 0, mandatoryLabs: [], optionalLabs: [] });

  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
  try {
    console.log("Current user:", _user);
    console.log("User role:", _user?.role);
    console.log("Is admin:", _user?.isAdmin);
    
    // First get user's selected role
    const userRole = await getUserRole();
    
    let labsData;
    
    // Check if user is admin
    if (_user?.role === 'admin' || _user?.isAdmin) {
      console.log("User is admin, loading all labs");
      // Admin sees ALL labs
      labsData = await getLabs();
      setRoleInfo({
        roleFiltered: false,
        roleName: "Admin",
        roleId: null,
        labCount: labsData.length,
        mandatoryLabs: [], // Admin has no mandatory labs
        optionalLabs: labsData // All labs are optional for admin
      });
    } else if (userRole && userRole.primaryRole) {
      console.log("User has role:", userRole.primaryRole.name);
      // Get ALL labs first
      const allLabsData = await getLabs();
      const allLabs = allLabsData || [];
      
      // Define mandatory labs for each role
      const mandatoryLabs = getMandatoryLabs(userRole.primaryRole.name);
      
      // Filter mandatory labs from all labs
      const mandatoryLabsData = allLabs.filter(lab => 
        mandatoryLabs.some(mandatoryLab => 
          lab.name.toLowerCase().includes(mandatoryLab.toLowerCase())
        )
      );
      
      // Optional labs are all other labs
      const optionalLabsData = allLabs.filter(lab => 
        !mandatoryLabs.some(mandatoryLab => 
          lab.name.toLowerCase().includes(mandatoryLab.toLowerCase())
        )
      );
      
      labsData = allLabs; // User can access ALL labs
      setRoleInfo({
        roleFiltered: true,
        roleName: userRole.primaryRole.name,
        roleId: userRole.primaryRole._id,
        labCount: allLabs.length,
        mandatoryLabs: mandatoryLabsData,
        optionalLabs: optionalLabsData
      });
    } else {
      console.log("No role, loading all labs");
      // No role selected, show all labs
      labsData = await getLabs();
      setRoleInfo({
        roleFiltered: false,
        roleName: null,
        roleId: null,
        labCount: labsData.length,
        mandatoryLabs: [], // No mandatory labs without role
        optionalLabs: labsData // All labs are optional
      });
    }

    console.log("Labs data loaded:", labsData);
    const attemptsData = await getMyLabAttempts();
    setLabs(labsData);
    setMyAttempts(attemptsData);
  } catch (err) {
    console.error("Failed to load labs:", err);
  } finally {
    setLoading(false);
  }
};

// Define mandatory labs for each role
const getMandatoryLabs = (roleName) => {
  const mandatoryMap = {
    "Security Analyst": [
      "Phishing Detection Lab",
      "Network Analysis Lab", 
      "SIEM Lab"
    ],
    "Network Administrator": [
      "System Hardening Lab",
      "Network Analysis Lab",
      "Incident Response Lab"
    ],
    "Penetration Tester": [
      "Web Security Lab",
      "Password Security Lab",
      "Encryption Lab"
    ],
    "Cyber Forensics Analyst": [
      "Digital Forensics Lab",
      "Incident Response Lab",
      "Network Analysis Lab"
    ],
    "Security Manager": [
      "System Hardening Lab",
      "Incident Response Lab", 
      "SIEM Lab"
    ]
  };
  
  return mandatoryMap[roleName] || [];
};

  const handleStartLab = async (lab) => {
  try {
    console.log("Starting lab with name:", lab.name);
    console.log("Lab object:", lab);
    
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
    console.log("Completing lab with payload:", payload);
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
    
    const labNameLower = lab.name.toLowerCase();
    
    // Enhanced routing with fallback - exact matches first, then partial matches
    switch (labNameLower) {
      // Phishing Detection Labs
      case 'identify phishing indicators':
      case 'phishing indicators':
      case 'identify phishing':
      case 'phishing identify':
      case 'phishing email':
      case 'email phishing':
        return <PhishingDetectionLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        
      // Password Security Labs  
      case 'brute force detection':
      case 'brute force':
      case 'password brute force':
      case 'brute force attack':
      case 'authentication brute force':
      case 'brute force detection lab':
        return <PasswordSecurityLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        
      // Network Analysis Labs
      case 'port scan detection':
      case 'port scan':
      case 'network analysis':
      case 'network traffic analysis':
      case 'network monitoring':
      case 'network security monitoring':
      case 'siem analysis':
      case 'log analysis':
      case 'packet analysis':
        return <NetworkAnalysisLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        
      // Encryption Labs
      case 'encryption lab':
      case 'cryptography lab':
      case 'aes encryption':
      case 'hash analysis':
      case 'cipher analysis':
      case 'decryption lab':
        return <EncryptionLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        
      // Web Security Labs
      case 'web security':
      case 'xss lab':
      case 'sql injection lab':
      case 'web vulnerability':
      case 'web application security':
        return <WebSecurityLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        
      // SIEM Labs
      case 'siem lab':
      case 'security monitoring':
      case 'event correlation':
      case 'log management':
        return <SIEMLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        
      // System Hardening Labs
      case 'system hardening':
      case 'server security':
      case 'security configuration':
      case 'system configuration':
      case 'patch management':
        return <SystemHardeningLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        
      // Incident Response Labs
      case 'incident response':
      case 'malware analysis':
      case 'security incident':
      case 'data breach response':
      case 'incident handling':
        return <IncidentResponseLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        
      // Digital Forensics Labs
      case 'digital forensics':
      case 'forensics analysis':
      case 'memory forensics':
      case 'file system analysis':
      case 'evidence analysis':
      case 'cyber investigation':
        return <DigitalForensicsLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        
      // Fallback for any lab that doesn't match exact patterns
      default:
        // Try to match by keywords for any lab that doesn't match exact patterns
        if (labNameLower.includes('phishing') || labNameLower.includes('email') || labNameLower.includes('identify') || labNameLower.includes('indicators')) {
          return <PhishingDetectionLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        }
        if (labNameLower.includes('password') || labNameLower.includes('brute') || labNameLower.includes('force') || labNameLower.includes('detection') || labNameLower.includes('authentication') || labNameLower.includes('crack') || labNameLower.includes('security')) {
          return <PasswordSecurityLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        }
        if (labNameLower.includes('network') || labNameLower.includes('analysis') || labNameLower.includes('monitoring') || labNameLower.includes('traffic') || labNameLower.includes('packet') || labNameLower.includes('siem') || labNameLower.includes('log') || labNameLower.includes('correlation') || labNameLower.includes('port') || labNameLower.includes('scan')) {
          return <NetworkAnalysisLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        }
        if (labNameLower.includes('encryption') || labNameLower.includes('crypto') || labNameLower.includes('cipher') || labNameLower.includes('aes') || labNameLower.includes('hash') || labNameLower.includes('decrypt')) {
          return <EncryptionLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        }
        if (labNameLower.includes('web') || labNameLower.includes('xss') || labNameLower.includes('sql') || labNameLower.includes('injection') || labNameLower.includes('vulnerability') || labNameLower.includes('hack')) {
          return <WebSecurityLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        }
        if (labNameLower.includes('siem') || labNameLower.includes('monitor') || labNameLower.includes('event') || labNameLower.includes('correlation') || labNameLower.includes('log')) {
          return <SIEMLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        }
        if (labNameLower.includes('hardening') || labNameLower.includes('security') || labNameLower.includes('config') || labNameLower.includes('system') || labNameLower.includes('server') || labNameLower.includes('patch')) {
          return <SystemHardeningLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        }
        if (labNameLower.includes('incident') || labNameLower.includes('response') || labNameLower.includes('breach') || labNameLower.includes('malware') || labNameLower.includes('outbreak')) {
          return <IncidentResponseLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        }
        if (labNameLower.includes('forensics') || labNameLower.includes('investigation') || labNameLower.includes('evidence') || labNameLower.includes('memory') || labNameLower.includes('file')) {
          return <DigitalForensicsLab lab={lab} attempt={activeAttempt} onComplete={handleCompleteLab} onCancel={() => { setActiveAttempt(null); setSelectedLab(null); }} />;
        }
        
        // Final fallback for any remaining labs
        return (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Lab Coming Soon</h2>
            <p>This lab environment is under development.</p>
            <p><strong>Debug Info:</strong></p>
            <p>Lab Name: {lab.name}</p>
            <p>Lab Scenario: {lab.scenario}</p>
            <p>Lab Name Lower: {lab.name.toLowerCase()}</p>
            <p><strong>Available Cases:</strong></p>
            <p>identify phishing indicators, phishing indicators, identify phishing, phishing identify, phishing email, email phishing</p>
            <p>brute force detection, brute force, password brute force, brute force attack, authentication brute force, brute force detection lab</p>
            <p>port scan detection, port scan, network analysis, network traffic analysis, network monitoring, network security monitoring, siem analysis, log analysis, packet analysis</p>
            <p>encryption lab, cryptography lab, aes encryption, hash analysis, cipher analysis, decryption lab</p>
            <p>web security, xss lab, sql injection lab, web vulnerability, web application security</p>
            <p>siem lab, security monitoring, event correlation, log management</p>
            <p>system hardening, server security, security configuration, system configuration, patch management</p>
            <p>incident response, malware analysis, security incident, data breach response, incident handling</p>
            <p>digital forensics, forensics analysis, memory forensics, file system analysis, evidence analysis, cyber investigation</p>
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
              All labs available for {roleInfo.roleName} (🔒 = Mandatory)
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
          {roleInfo.labCount || labs.length} Total Labs
        </div>
      </div>

      {/* All Labs Grid */}
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
          {labs.map((lab) => {
            // Check if this lab is mandatory
            const isMandatory = roleInfo.mandatoryLabs && 
              roleInfo.mandatoryLabs.some(mandatoryLab => mandatoryLab._id === lab._id);
            
            return (
              <div
                key={lab._id}
                style={{
                  border: isMandatory ? "2px solid #fbbf24" : "2px solid #3b82f6",
                  borderRadius: "12px",
                  padding: "20px",
                  backgroundColor: isMandatory ? "#fffbeb" : "#ffffff",
                  boxShadow: isMandatory 
                    ? "0 4px 6px -1px rgba(251, 191, 36, 0.1)"
                    : "0 4px 6px -1px rgba(59, 130, 246, 0.1)",
                  transition: "all 0.2s ease-in-out",
                  cursor: "pointer",
                  position: "relative"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = isMandatory
                    ? "0 8px 12px -2px rgba(251, 191, 36, 0.15)"
                    : "0 8px 12px -2px rgba(59, 130, 246, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = isMandatory
                    ? "0 4px 6px -1px rgba(251, 191, 36, 0.1)"
                    : "0 4px 6px -1px rgba(59, 130, 246, 0.1)";
                }}
                onClick={() => handleStartLab(lab)}
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
                      {isMandatory && "🔒 "}{lab.name}
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartLab(lab);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    backgroundColor: isMandatory ? "#dc2626" : "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  {isMandatory ? "🔒 Start Mandatory Lab" : "🚀 Start Lab"}
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