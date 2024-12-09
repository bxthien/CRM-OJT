import { Button, Drawer, Form, Input } from "antd";
import { useEffect } from "react";

interface BrandType {
  id?: string;
  name: string;
  description: string;
}

interface Prop {
  brand?: BrandType; // The selected brand's details
  isDrawerOpen: boolean;
  handleOk: (updatedBrand: BrandType) => void; // Function to handle brand update
  handleCancel: () => void; // Function to handle drawer close
}

const DrawerBrandDetail = ({
  brand,
  isDrawerOpen,
  handleOk,
  handleCancel,
}: Prop) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (brand) {
      form.setFieldsValue({
        name: brand.name,
        description: brand.description,
      });
    } else {
      form.resetFields(); // Reset form if no brand is selected
    }
  }, [brand, form]);

  const onFinish = (values: any) => {
    const updatedBrand: BrandType = {
      ...brand!,
      ...values,
    };
    handleOk(updatedBrand); // Pass updated brand back to the parent component
    form.resetFields(); // Reset form after submitting
  };

  return (
    <Drawer
      title="Brand Details"
      placement="right"
      onClose={handleCancel}
      open={isDrawerOpen}
      width={600}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            Update
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: brand?.name,
          description: brand?.description,
        }}
      >
        <Form.Item
          label="Brand Name"
          name="name"
          rules={[{ required: true, message: "Please enter the brand name" }]}
        >
          <Input placeholder="Enter brand name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please enter a brand description" },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Enter brand description" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default DrawerBrandDetail;
