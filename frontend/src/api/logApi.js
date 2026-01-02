import axiosClient from "./axiosClient";

export const fetchLogs = async (limit = 100) => {
  const response = await axiosClient.get(`/logs?limit=${limit}`);
  return response.data;
};

export const createLog = async (payload) => {
  const response = await axiosClient.post("/logs", payload);
  return response.data;
};
