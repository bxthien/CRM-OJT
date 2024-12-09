import { Button, Drawer, Form, Input, Select } from "antd";
import { useEffect } from "react";
import { ProductType } from "../../interface/product";
interface Prop {
  product?: ProductType;
  isDrawerOpen: boolean;
  handleOk: (updatedProduct: ProductType) => void;
  handleCancel: () => void;
}
const DrawerProductDetail = ({
  product,
  isDrawerOpen,
  // handleOk,
  handleCancel,
}: Prop) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        info: {
          color: product.info?.color?.join(", "),
          size: product.info?.size,
          description: product.info?.description,
        },
      });
    }
  }, [product, form]);
  // const onFinish = (values: any) => {
  //   const updatedProduct = {
  //     ...product,
  //     ...values,
  //     info: {
  //       ...product?.info,
  //       ...values.info,
  //     },
  //   };
  //   handleOk(updatedProduct); // Pass updated product back
  // };
  return (
    <Drawer
      title="Product Detail"
      placement="right"
      onClose={handleCancel}
      visible={isDrawerOpen}
      width={600}
      footer={
        <div className="flex gap-2 float-right">
          <Button>Cancel</Button>
          <Button type="primary">Update</Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: product?.name,
          price: product?.price,
          quantity: product?.quantity,
          info: {
            color: product?.info?.color?.join(", "),
            size: product?.info?.size,
            description: product?.info?.description,
          },
        }}
        // onFinish={onFinish}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter the price" }]}
        >
          <Input type="number" placeholder="Enter product price" />
        </Form.Item>
        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: "Please enter the quantity" }]}
        >
          <Input type="number" placeholder="Enter quantity" />
        </Form.Item>
        <Form.Item
          label="Color"
          name={["info", "color"]}
          rules={[
            { required: true, message: "Please select at least one color" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select product color(s)"
            allowClear
          >
            {/* Add your available color options here */}
            <Select.Option value="Red">Red</Select.Option>
            <Select.Option value="blue">Blue</Select.Option>
            <Select.Option value="green">Green</Select.Option>
            <Select.Option value="yellow">Yellow</Select.Option>
            <Select.Option value="black">Black</Select.Option>
            {/* Add more colors as needed */}
          </Select>
        </Form.Item>
        <Form.Item
          label="Size"
          name={["info", "size"]}
          rules={[{ required: true, message: "Please enter the size" }]}
        >
          <Input placeholder="Enter product size" />
        </Form.Item>
        <Form.Item
          label="Description"
          name={["info", "description"]}
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea placeholder="Enter product description" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};
export default DrawerProductDetail;