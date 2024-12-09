
import instanceAxios from "../config/axios";

export const getCategories = async () => {
  try {
    const response = await instanceAxios.get("/category");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCategory = async (id: string) => {
  try {
    const response = await instanceAxios.get(`/category/${id}`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
