import { Drawer, Form, Row, Col, Input, Space } from "antd";
import { useEffect } from "react";
import { Order } from "../../interface/order";

interface Prop {
  order?: Order;
  isDrawerOpen: boolean;
  handleCancel: () => void;
}

const DrawerOrderDetail = ({ order, isDrawerOpen, handleCancel }: Prop) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (order) {
      const transactions = order.transactions || []; 
      form.setFieldsValue({
        orderId: order.orderId,
        customerName: `${order.user?.username || ""} (${order.user?.fullName || ""})`,
        email: order.user?.email || "",
        phone: order.user?.phone || "",
        methodShipping: order.methodShipping || "",
        status: order.status || "",
        address: `${order.address?.province || ""}, ${order.address?.district || ""}, ${order.address?.detailedAddress || ""}`,
        quantity: transactions.length,
        productInfo: transactions
          .map((transaction: { product: { name: string; price: number; }; }) => {
            const productName = transaction.product?.name || "Unknown Product";
            const productPrice = transaction.product?.price || 0;
            return `${productName} - $${productPrice}`;
          })
          .join(", "),
        totalPrice: transactions
          .reduce(
            (total: number, transaction: { quantity: any; product: { price: any; }; }) =>
              total + (transaction.quantity || 0) * (transaction.product?.price || 0),
            0
          )
          .toFixed(2),
      });
    }
  }, [order, form]);
  

  return (
    <Drawer
      title="Order Detail"
      placement="right"
      onClose={handleCancel}
      open={isDrawerOpen}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Order ID" name="orderId">
          <Input readOnly />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Username & Full Name" name="customerName">
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Email" name="email">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="Phone" name="phone">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="Method Shipping" name="methodShipping">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="Quantity" name="quantity">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="Total Price" name="totalPrice">
          <Input readOnly />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default DrawerOrderDetail;
