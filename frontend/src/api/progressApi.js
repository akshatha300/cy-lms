import axiosClient from "./axiosClient";

export const fetchProgress = async () => {
  const response = await axiosClient.get("/progress");
  return response.data;
};
