import axiosClient from "./axiosClient";

export const fetchUsers = async () => {
  const response = await axiosClient.get("/users");
  return response.data;
};

export const updateUser = async (userId, payload) => {
  const response = await axiosClient.put(`/users/${userId}`, payload);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axiosClient.delete(`/users/${userId}`);
  return response.data;
};
