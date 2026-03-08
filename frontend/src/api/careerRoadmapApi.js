import axiosClient from "./axiosClient";

// Get all career roadmaps
export const getCareerRoadmaps = async () => {
  const response = await axiosClient.get("/career-roadmap");
  return response.data;
};

// Get specific roadmap details
export const getRoadmapById = async (roleId) => {
  const response = await axiosClient.get(`/career-roadmap/${roleId}`);
  return response.data;
};

// Get user's progress for a roadmap
export const getRoadmapProgress = async (roleId) => {
  const response = await axiosClient.get(`/career-roadmap/${roleId}/progress`);
  return response.data;
};

// Update user progress
export const updateRoadmapProgress = async (roleId, progressData) => {
  const response = await axiosClient.put(`/career-roadmap/${roleId}/progress`, progressData);
  return response.data;
};

// Create new roadmap (Admin)
export const createCareerRoadmap = async (roadmapData) => {
  const response = await axiosClient.post("/career-roadmap", roadmapData);
  return response.data;
};

// Update roadmap (Admin)
export const updateCareerRoadmap = async (roleId, roadmapData) => {
  const response = await axiosClient.put(`/career-roadmap/${roleId}`, roadmapData);
  return response.data;
};

// Delete roadmap (Admin)
export const deleteCareerRoadmap = async (roleId) => {
  const response = await axiosClient.delete(`/career-roadmap/${roleId}`);
  return response.data;
};
