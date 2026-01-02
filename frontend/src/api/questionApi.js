import axiosClient from "./axiosClient";

export const getQuestionsByModule = async (moduleId) => {
  const response = await axiosClient.get(`/questions/${moduleId}`);
  return response.data;
};

export const createQuestion = async (payload) => {
  const response = await axiosClient.post("/questions", payload);
  return response.data;
};

export const updateQuestion = async (id, payload) => {
  const response = await axiosClient.put(`/questions/${id}`, payload);
  return response.data;
};

export const deleteQuestion = async (id) => {
  const response = await axiosClient.delete(`/questions/${id}`);
  return response.data;
};
