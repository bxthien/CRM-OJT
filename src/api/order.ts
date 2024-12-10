import instanceAxios from "../config/axios";
import { Order } from "../interface/order";

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await instanceAxios.get("/orders/all");
    return response.data.map((order: any) => ({
      ...order,
      user: order.user || null,
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderDetail = async (orderId: string): Promise<Order> => {
  try {
    const response = await instanceAxios.get(`/orders/${orderId}`);
    const order = response.data;
    return {
      ...order,
      user: order.user || null, 
    };
  } catch (error) {
    console.error("Error fetching order detail:", error);
    throw error;
  }
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    const response = await instanceAxios.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};
