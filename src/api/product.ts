import instanceAxios from "../config/axios";

export const getProduct = async () => {
  try {
    const response = await instanceAxios.get("/product", {
      params: { orderBy: "ASC", page: 1, take: 10 },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getProductDetail = async (param: string) => {
  try {
    const response = await instanceAxios.get(`/product/${param}`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
