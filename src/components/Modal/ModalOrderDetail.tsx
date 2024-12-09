import { Button, Drawer, Form, Input, InputNumber, Select } from "antd";
import { useEffect } from "react";
import { Order } from "../../interface/order";

interface Prop {
  order?: Order;
  isDrawerOpen: boolean;
  handleOk: (updatedOrder: Order) => void;
  handleCancel: () => void;
}

const DrawerOrderDetail = ({ order, isDrawerOpen, handleOk, handleCancel }: Prop) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (order) {
      form.setFieldsValue(order);
    }
  }, [order, form]);

  const onFinish = (values: Order) => {
    handleOk({ ...order, ...values });
  };

  return (
    <Drawer
      title="Order Detail"
      placement="right"
      onClose={handleCancel}
      open={isDrawerOpen}
      width={600}
      footer={
        <div className="flex gap-2 float-right">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>
            Update
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Order ID"
          name="id"
          rules={[{ required: true, message: "Please enter Order ID" }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Customer Name"
          name="customerName"
          rules={[{ required: true, message: "Please enter customer name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Order Status"
          name="status"
          rules={[{ required: true, message: "Please select order status" }]}
        >
          <Select options={[{ value: "Pending", label: "Pending" }, { value: "Completed", label: "Completed" }]} />
        </Form.Item>

        <Form.Item
          label="Total Amount"
          name="totalAmount"
          rules={[{ required: true, message: "Please enter total amount" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Shipping Address"
          name="shippingAddress"
          rules={[{ required: true, message: "Please enter shipping address" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default DrawerOrderDetail;
