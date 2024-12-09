import instanceAxios from "../config/axios";

export const getOrders = async () => {
  try {
    const response = await instanceAxios.post("/order/orders", {
      params: { orderBy: "ASC", page: 1, take: 10 },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderDetail = async (id: string) => {
  try {
    const response = await instanceAxios.get(`/order/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order detail:", error);
    throw error;
  }
};

export const updateOrder = async (id: string, data: any) => {
  try {
    const response = await instanceAxios.put(`/order/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export const deleteOrder = async (id: string) => {
  try {
    const response = await instanceAxios.delete(`/order/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};
