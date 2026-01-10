import client from "./axiosClient";

/**
 * Role API calls
 */
export const getRoles = async () => {
  const res = await client.get("/roles");
  return res.data.roles;
};

export const getRoleById = async (roleId) => {
  const res = await client.get(`/roles/${roleId}`);
  return res.data.role;
};

export const selectRole = async (roleId) => {
  const res = await client.post("/roles/select", { roleId });
  return res.data;
};

export const getUserRole = async () => {
  const res = await client.get("/roles/me/role");
  return res.data;
};

export const getRoleSkills = async (roleId) => {
  const res = await client.get(`/roles/${roleId}/skills`);
  return res.data.skills;
};

/**
 * Skill API calls
 */
export const getSkills = async () => {
  const res = await client.get("/skills");
  return res.data.skills;
};

export const getSkillById = async (skillId) => {
  const res = await client.get(`/skills/${skillId}`);
  return res.data.skill;
};

/**
 * Skill Progress API calls
 */
export const getSkillProgress = async (skillId) => {
  const res = await client.get(`/skill-progress/skills/${skillId}/progress`);
  return res.data.progress;
};

export const getRoleProgress = async (roleId) => {
  const res = await client.get(`/skill-progress/roles/${roleId}/progress`);
  return res.data;
};

export const markModuleCompleted = async (skillId, moduleId) => {
  const res = await client.post(
    `/skill-progress/skills/${skillId}/modules/${moduleId}/complete`
  );
  return res.data.progress;
};

export const recordQuizAttempt = async (skillId, score) => {
  const res = await client.post(`/skill-progress/skills/${skillId}/quiz`, {
    score,
  });
  return res.data.progress;
};

/**
 * Job Readiness API calls
 */
export const getJobReadiness = async (roleId) => {
  const res = await client.get(`/job-readiness?roleId=${roleId}`);
  return res.data.readiness;
};

export const getJobReadinessTimeline = async (roleId, days = 90) => {
  const res = await client.get(
    `/job-readiness/timeline?roleId=${roleId}&days=${days}`
  );
  return res.data.timeline;
};

export const recalculateJobReadiness = async (roleId) => {
  const res = await client.post("/job-readiness/recalculate", { roleId });
  return res.data.readiness;
};

/**
 * Lab API calls
 */
export const getLabs = async () => {
  const res = await client.get("/labs");
  return res.data.labs;
};

export const getLab = async (labId) => {
  const res = await client.get(`/labs/${labId}`);
  return res.data.lab;
};

export const startLabAttempt = async (labId, roleId) => {
  const res = await client.post(`/labs/${labId}/attempts`, { roleId });
  return res.data.attempt;
};

export const completeLabAttempt = async (attemptId, payload) => {
  const res = await client.post(`/labs/attempts/${attemptId}/complete`, payload);
  return res.data;
};

export const getMyLabAttempts = async () => {
  const res = await client.get("/labs/attempts/me");
  return res.data.attempts;
};
