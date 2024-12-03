import { Button, Drawer, Form, Input } from "antd";
import { useEffect } from "react";
import { User } from "../../interface/auth";

interface Prop {
  user?: User;
  isDrawerOpen: boolean;
  handleOk: (updatedUser: User) => void;
  handleCancel: () => void;
}

const DrawerUserDetail = ({ user, isDrawerOpen, handleOk, handleCancel }: Prop) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user, form]);

  const onFinish = (values: User) => {
    handleOk({ ...user, ...values });
  };

  return (
    <Drawer
      title="User Detail"
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

        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter username" }]}
            style={{ flex: 1 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Full Name" name="fullName" rules={[{ required: true, message: "Please enter full name" }]}
            style={{ flex: 1 }}>
            <Input />
          </Form.Item>
        </div>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone Number" name="phone" rules={[{ required: true, message: "Please enter phone number" }]} >
          <Input type="number" />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default DrawerUserDetail;
