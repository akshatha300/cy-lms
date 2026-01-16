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

const labComponentMap = {
  "phishingdetectionlab": {
    component: PhishingDetectionLab,
    displayName: "PhishingDetectionLab"
  },
  "passwordsecuritylab": {
    component: PasswordSecurityLab,
    displayName: "PasswordSecurityLab"
  },
  "networkanalysislab": {
    component: NetworkAnalysisLab,
    displayName: "NetworkAnalysisLab"
  },
  "encryptionlab": {
    component: EncryptionLab,
    displayName: "EncryptionLab"
  },
  "siemlab": {
    component: SIEMLab,
    displayName: "SIEMLab"
  },
  "websecuritylab": {
    component: WebSecurityLab,
    displayName: "WebSecurityLab"
  },
  "systemhardeninglab": {
    component: SystemHardeningLab,
    displayName: "SystemHardeningLab"
  },
  "incidentresponselab": {
    component: IncidentResponseLab,
    displayName: "IncidentResponseLab"
  },
  "digitalforensicslab": {
    component: DigitalForensicsLab,
    displayName: "DigitalForensicsLab"
  }
};

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
        const allLabs = (await getLabs())?.map((lab) => {
          const mapping = labComponentMap[lab.name?.toLowerCase()?.trim()];
          return {
            ...lab,
            uiName: mapping?.displayName || lab.name
          };
        }) || [];

        labsData = allLabs;
        setRoleInfo({
          roleFiltered: false,
          roleName: "Admin",
          roleId: null,
          labCount: allLabs.length,
          mandatoryLabs: [], // Admin has no mandatory labs
          optionalLabs: allLabs // All labs are optional for admin
        });
      } else if (userRole && userRole.primaryRole) {
        console.log("User has role:", userRole.primaryRole.name);
        // Get ALL labs first
        const allLabsData = await getLabs();
        const allLabs = (allLabsData || []).map((lab) => {
          const mapping = labComponentMap[lab.name?.toLowerCase()?.trim()];
          return {
            ...lab,
            uiName: mapping?.displayName || lab.name
          };
        });

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
        const allLabs = (await getLabs())?.map((lab) => {
          const mapping = labComponentMap[lab.name?.toLowerCase()?.trim()];
          return {
            ...lab,
            uiName: mapping?.displayName || lab.name
          };
        }) || [];

        labsData = allLabs;
        setRoleInfo({
          roleFiltered: false,
          roleName: null,
          roleId: null,
          labCount: allLabs.length,
          mandatoryLabs: [], // No mandatory labs without role
          optionalLabs: allLabs // All labs are optional
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
      "SOC Analyst L1": [
        "PhishingDetectionLab",
        "PasswordSecurityLab",
        "IncidentResponseLab"
      ],
      "Penetration Tester": [
        "WebSecurityLab",
        "SystemHardeningLab"
      ],
      "Cloud Security Engineer": [
        "PasswordSecurityLab",
        "DigitalForensicsLab"
      ],
      "Malware Analyst": [
        "DigitalForensicsLab",
        "IncidentResponseLab",
        "PhishingDetectionLab"
      ],
      "Incident Response Lead": [
        "IncidentResponseLab",
        "PasswordSecurityLab",
        "DigitalForensicsLab"
      ],
      "Security Auditor": [
        "WebSecurityLab",
        "PasswordSecurityLab"
      ],
      "Security Architect": [
        "WebSecurityLab",
        "IncidentResponseLab"
      ],
      "Digital Forensics Analyst": [
        "DigitalForensicsLab",
        "IncidentResponseLab",
        "PasswordSecurityLab"
      ],
      "Application Security Engineer": [
        "WebSecurityLab",
        "SystemHardeningLab"
      ],
      "Threat Intelligence Analyst": [
        "DigitalForensicsLab",
        "PasswordSecurityLab",
        "PhishingDetectionLab"
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

    const labNameLower = lab.name?.toLowerCase()?.trim() || "";

    const renderLab = (Component) => {
      try {
        return (
          <Component
            lab={lab}
            attempt={activeAttempt}
            onComplete={handleCompleteLab}
            onCancel={() => {
              setActiveAttempt(null);
              setSelectedLab(null);
            }}
          />
        );
      } catch (error) {
        console.error("Error rendering lab component:", error);
        return (
          <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#fee2e2", border: "1px solid #ef4444", borderRadius: "8px" }}>
            <h3 style={{ color: "#dc2626" }}>Error Loading Lab</h3>
            <p style={{ color: "#7f1d1d" }}>There was an error loading this lab component.</p>
            <p style={{ fontSize: "12px", color: "#991b1b" }}>Error: {error.message}</p>
            <button
              onClick={() => {
                setActiveAttempt(null);
                setSelectedLab(null);
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Back to Labs
            </button>
          </div>
        );
      }
    };

    const mapping = labComponentMap[labNameLower];
    if (mapping?.component) {
      return renderLab(mapping.component);
    }

    const keywordRoutes = [
      { keywords: ["phishing", "email"], component: PhishingDetectionLab },
      {
        keywords: ["password", "brute", "force", "authentication"],
        component: PasswordSecurityLab,
      },
      {
        keywords: ["network", "traffic", "packet", "siem", "log", "port", "scan"],
        component: NetworkAnalysisLab,
      },
      {
        keywords: ["encryption", "crypto", "cipher", "aes", "hash", "decrypt"],
        component: EncryptionLab,
      },
      {
        keywords: ["web", "sql", "owasp", "vulnerability", "app"],
        component: WebSecurityLab,
      },
      {
        keywords: ["siem", "monitor", "event", "correlation"],
        component: SIEMLab,
      },
      {
        keywords: ["hardening", "security", "config", "system", "server", "patch", "privilege", "escalation", "iam", "aws"],
        component: SystemHardeningLab,
      },
      {
        keywords: ["incident", "response", "breach", "outbreak"],
        component: IncidentResponseLab,
      },
      {
        keywords: ["forensics", "investigation", "evidence", "memory", "file", "malware"],
        component: DigitalForensicsLab,
      },
    ];

    for (const route of keywordRoutes) {
      if (route.keywords.some((keyword) => labNameLower.includes(keyword))) {
        return renderLab(route.component);
      }
    }

    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Lab Coming Soon</h2>
        <p>This lab environment is under development.</p>
        <p><strong>Debug Info:</strong></p>
        <p>Lab Name: {lab.name}</p>
        <p>Lab Scenario: {lab.scenario}</p>
        <p>Lab Name Lower: {labNameLower}</p>
      </div>
    );
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 2) return "#10b981";
    if (difficulty === 3) return "#f59e0b";
    return "#ef4444";
  };

  const getScenarioIcon = (scenario) => {
    const icons = {
      phishing: "",
      password: "",
      network: "",
      encryption: "",
      web: "",
      siem: "",
      hardening: "",
      incident: "",
      forensics: "",
    };
    return icons[scenario] || "";
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", marginBottom: "10px" }}></div>
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
              All labs available for {roleInfo.roleName} ()
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
          <div style={{ fontSize: "48px", marginBottom: "16px" }}></div>
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
                    Mandatory
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
                      {isMandatory && ""}{lab.uiName || lab.name}
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