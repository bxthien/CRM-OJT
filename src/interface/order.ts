export interface Order {
    id: string; // ID của đơn hàng
    customerName: string; // Tên khách hàng
    email: string; // Email của khách hàng
    phoneNumber: string; // Số điện thoại khách hàng
    shippingAddress: string; // Địa chỉ giao hàng
    totalAmount: number; // Tổng tiền của đơn hàng
    status: "Pending" | "Completed"; // Trạng thái đơn hàng
    items: OrderItem[]; // Danh sách các sản phẩm trong đơn hàng
    createdAt: string; // Thời gian tạo đơn hàng
    updatedAt: string; // Thời gian cập nhật đơn hàng
  }
  
  export interface OrderItem {
    productId: string; // ID sản phẩm
    productName: string; // Tên sản phẩm
    quantity: number; // Số lượng sản phẩm
    price: number; // Giá mỗi sản phẩm
    totalPrice: number; // Tổng giá trị của sản phẩm (quantity * price)
  }
  