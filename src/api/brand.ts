import instanceAxios from "../config/axios";

export const getBrand = async (page = 1, take = 10, orderBy = 'ASC') => {
  try {
    const response = await instanceAxios.get("/brands", {
      params: { page, take, orderBy },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const getBrandDetail = async (id: string) => {
  try {
    const response = await instanceAxios.get(`/brands/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching brand details:", error);
    throw error;
  }
};

export const deleteBrand = async (id: string) => {
  try {
    await instanceAxios.delete(`/brands/${id}`);
  } catch (error) {
    console.error("Error deleting brand:", error);
    throw error;
  }
};
