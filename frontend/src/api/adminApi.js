import client from "./axiosClient";

export const getPlatformSummary = async () => {
  const res = await client.get("/admin/summary");
  return res.data;
};

export const getModuleMetrics = async () => {
  const res = await client.get("/admin/modules");
  return res.data;
};

export const getPhishingMetrics = async () => {
  const res = await client.get("/admin/phishing");
  return res.data;
};

export const getLeaderboard = async (limit = 10) => {
  const res = await client.get(`/admin/leaderboard?limit=${limit}`);
  return res.data;
};

export const getAttemptsTimeSeries = async (days = 14) => {
  const res = await client.get(`/admin/attempts-timeseries?days=${days}`);
  return res.data;
};
// Add these to frontend/src/api/adminApi.js:

export const getAdminLabs = async () => {
  const res = await client.get("/labs/admin/labs");
  return res.data;
};

export const createAdminLab = async (labData) => {
  const res = await client.post("/labs", labData);
  return res.data;
};

export const updateAdminLab = async (id, labData) => {
  const res = await client.put(`/labs/${id}`, labData);
  return res.data;
};

export const deleteAdminLab = async (id) => {
  const res = await client.delete(`/labs/${id}`);
  return res.data;
};