import axios from "axios";
import instanceAxios from "../config/axios";

export const getCategories = async () => {
  try {
    const response = await axios.get("/category");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
