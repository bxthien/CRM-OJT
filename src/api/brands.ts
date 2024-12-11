
import instanceAxios from "../config/axios";

export const getBrands = async () => {
  try {
    const response = await instanceAxios.get("/brands");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getBrand = async (id: string) => {
  try {
    const response = await instanceAxios.get(`/brands/${id}`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const deleteBrand= async (id: string) => {
  try {
    const response = instanceAxios.delete(`/brands/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const addBrand = async (Brands: { name: string }) => {
  try {
    const response = await instanceAxios.post("/brands", Brands);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

