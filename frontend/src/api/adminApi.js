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
