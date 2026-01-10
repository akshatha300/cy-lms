import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRoles, selectRole } from "../../api/roleBasedApi";
import SectionCard from "../../components/SectionCard";
import { Shield, Target, Cloud, Bug, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const roleIcons = {
    "SOC Analyst": Shield,
    "Penetration Tester": Target,
    "Cloud Security": Cloud,
    "Malware Analyst": Bug,
    "Incident Response": AlertTriangle,
  };

  const roleColors = {
    "SOC Analyst": { bg: "bg-blue-50", icon: "text-blue-600", btn: "bg-blue-600 hover:bg-blue-700" },
    "Penetration Tester": { bg: "bg-purple-50", icon: "text-purple-600", btn: "bg-purple-600 hover:bg-purple-700" },
    "Cloud Security": { bg: "bg-cyan-50", icon: "text-cyan-600", btn: "bg-cyan-600 hover:bg-cyan-700" },
    "Malware Analyst": { bg: "bg-red-50", icon: "text-red-600", btn: "bg-red-600 hover:bg-red-700" },
    "Incident Response": { bg: "bg-orange-50", icon: "text-orange-600", btn: "bg-orange-600 hover:bg-orange-700" },
  };

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load roles");
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  const handleSelectRole = async (roleId) => {
    setSelecting(roleId);
    try {
      await selectRole(roleId);
      navigate(`/app/role-dashboard/${roleId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to select role");
    } finally {
      setSelecting(null);
    }
  };

  const getRoleIcon = (roleName) => {
    const matchedKey = Object.keys(roleIcons).find(key => 
      roleName.toLowerCase().includes(key.toLowerCase())
    );
    return roleIcons[matchedKey] || Shield;
  };

  const getRoleColor = (roleName) => {
    const matchedKey = Object.keys(roleColors).find(key => 
      roleName.toLowerCase().includes(key.toLowerCase())
    );
    return roleColors[matchedKey] || roleColors["SOC Analyst"];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Choose Your Security Career Path
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a cybersecurity role to access customized learning paths, hands-on labs, 
            and track your job readiness for your desired career.
          </p>
          {user?.primaryRole && (
            <div className="mt-6 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Current Role: {user.primaryRole?.name || 'Selected'}</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = getRoleIcon(role.name);
            const colors = getRoleColor(role.name);
            const isSelected = user?.primaryRole?._id === role._id;
            const isSelecting = selecting === role._id;

            return (
              <SectionCard 
                key={role._id} 
                className={`p-0 hover:shadow-xl transition-all duration-300 ${isSelected ? 'ring-2 ring-green-500' : ''}`}
              >
                {/* Card Header with Icon */}
                <div className={`${colors.bg} p-8 rounded-t-2xl`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-12 h-12 ${colors.icon}`} />
                    {isSelected && (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {role.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {role.level || 'Professional Level'}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {role.description || 'Master essential cybersecurity skills through structured learning paths and practical experience.'}
                  </p>

                  {/* Skills Preview */}
                  {role.requiredSkills && role.requiredSkills.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-gray-600 mb-3">
                        Key Skills ({role.requiredSkills.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {role.requiredSkills.slice(0, 4).map((skill, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                          >
                            {skill.name || skill}
                          </span>
                        ))}
                        {role.requiredSkills.length > 4 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                            +{role.requiredSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleSelectRole(role._id)}
                    disabled={isSelecting}
                    className={`w-full ${colors.btn} text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                      isSelecting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSelecting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Selecting...
                      </>
                    ) : isSelected ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        View Dashboard
                      </>
                    ) : (
                      'Select This Role'
                    )}
                  </button>
                </div>
              </SectionCard>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <SectionCard className="text-center p-6">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-gray-900 mb-2">Personalized Learning</h3>
            <p className="text-sm text-gray-600">
              Get modules and labs tailored to your chosen career path
            </p>
          </SectionCard>

          <SectionCard className="text-center p-6">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-gray-900 mb-2">Track Your Progress</h3>
            <p className="text-sm text-gray-600">
              Monitor your skill development and job readiness score
            </p>
          </SectionCard>

          <SectionCard className="text-center p-6">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="font-bold text-gray-900 mb-2">Earn Certificates</h3>
            <p className="text-sm text-gray-600">
              Complete your role path and receive verified credentials
            </p>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default Roles;
