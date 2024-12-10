import instanceAxios from "../config/axios";
import { ProductType } from "../interface/product";

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

export const addProduct = async (product: ProductType) => {
  try {
    const response = await instanceAxios.post("/product/create", product);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};


export const deleteProduct = async (id: string) => {
  try {
    const response = instanceAxios.delete(`/product/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const updateProduct = async (id: string, product: ProductType) => {
    try {
      const response = await instanceAxios.patch(`/product/${id}`, product);
      return response.data; 
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
  };
}


export const uploadImage = async (formData: FormData)  => {
  try {
    // Directly use the formData passed in, without redefining it
    const response = await instanceAxios.post("/upload/mutipleImage", formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });

    return response.data; 
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
