import axiosClient from "./axiosClient";

export const getLabs = async () => {
  const response = await axiosClient.get("/labs");
  return response.data.labs || response.data || [];
};

export const getLabById = async (labId) => {
  const response = await axiosClient.get(`/labs/${labId}`);
  return response.data.lab || response.data;
};

export const createLab = async (labData) => {
  const response = await axiosClient.post("/labs", labData);
  return response.data;
};

export const updateLab = async (labId, labData) => {
  const response = await axiosClient.put(`/labs/${labId}`, labData);
  return response.data;
};

export const deleteLab = async (labId) => {
  const response = await axiosClient.delete(`/labs/${labId}`);
  return response.data;
};
