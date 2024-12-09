
import instanceAxios from "../config/axios";
import { User } from "../interface/auth";

export const getUsers = async () => {
  try {
    const response = await instanceAxios.get("/user/user");
    
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserDetail = async (userId: string) => {
  try {
    const response = await instanceAxios.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user detail:", error);
    throw error;
  }
};

export const changeActive = async (id: string) => {
  try {
    const response = await instanceAxios.patch(`/user/activeStatus` , {id});
    return response.data;
  } catch (error) {
    console.error("Error fetching user detail:", error);
    throw error;
  }
};
export const deleteUser = async (id: string) => {
  try {
    const response = await instanceAxios.patch(`/user/delete`, {id});
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  try {
    const response = await instanceAxios.put(`/user/update/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
