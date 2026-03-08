import axiosClient from "./axiosClient";

export const executeLabCode = async (labId, code, language = "python") => {
  const response = await axiosClient.post("/lab-execution/execute", {
    labId,
    code,
    language,
  });
  return response.data;
};

export const getSubmissionStatus = async (submissionId) => {
  const response = await axiosClient.get(`/lab-execution/submission/${submissionId}`);
  return response.data;
};

export const getUserLabSubmissions = async (labId) => {
  const response = await axiosClient.get(`/lab-execution/submissions/${labId}`);
  return response.data;
};

export const getLabLeaderboard = async (labId, limit = 10) => {
  const response = await axiosClient.get(`/lab-execution/leaderboard/${labId}?limit=${limit}`);
  return response.data;
};
