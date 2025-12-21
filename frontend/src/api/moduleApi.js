import axiosClient from "./axiosClient";

// Get all published modules for the current user
export const getModules = async () => {
  const response = await axiosClient.get("/modules");
  return response.data;
};

// Get a single module by id
export const getModuleById = async (id) => {
  const response = await axiosClient.get(`/modules/${id}`);
  return response.data;
};

// Get all questions for a specific module
export const getQuestionsForModule = async (moduleId) => {
  const response = await axiosClient.get(`/questions/${moduleId}`);
  return response.data;
};

// Submit an attempt for a question (evaluates correctness + records progress)
// payload: { questionId, userAnswer, timeTakenSeconds? }
export const submitQuestionAttempt = async (payload) => {
  const response = await axiosClient.post("/attempts", payload);
  return response.data;
};


