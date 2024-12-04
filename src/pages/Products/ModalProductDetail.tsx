import { Button, Drawer, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { ProductType } from "../../interface/product";
import { getCategories } from "../../api/categories";

interface CategoryType {
  id: string;
  name: string;
}

interface Prop {
  product?: ProductType;
  isDrawerOpen: boolean;
  handleOk: (updatedProduct: ProductType) => void;
  handleCancel: () => void;
}

const DrawerProductDetail = ({
  product,
  isDrawerOpen,
  handleOk,
  handleCancel,
}: Prop) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<CategoryType[]>([]);

  // Fetch categories when the drawer opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.log("err", err);
      }
    };
    if (isDrawerOpen) {
      fetchCategories();
    }
  }, [isDrawerOpen]);

  // Populate form when product changes
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        category: product.category?.id, // Set category ID
        info: {
          color: product.info?.color?.join(", "),
          size: product.info?.size,
          description: product.info?.description,
        },
      });
    } else {
      form.resetFields();
    }
  }, [product, form]);

  const onFinish = (values: any) => {
    const updatedProduct = {
      ...product,
      ...values,
      category: {
        id: values.category,
        name: categories.find(cat => cat.id === values.category)?.name || '',
      },
      info: {
        ...product?.info,
        color: values.info.color ? values.info.color.split(", ") : [],
        size: values.info.size,
        description: values.info.description,
      },
    };
    handleOk(updatedProduct);
  };

  return (
    <Drawer
      title="Product Detail"
      placement="right"
      onClose={handleCancel}
      open={isDrawerOpen}
      width={600}
      footer={
        <div className="flex gap-2 justify-end">
          <Button type="primary" onClick={() => form.submit()}>
            Update
          </Button>
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
          category: product?.category,
          info: {
            color: product?.info?.color?.join(", "),
            size: product?.info?.size,
            description: product?.info?.description,
          },
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select 
            placeholder="Select product category"
            allowClear
          >
            {categories.map(category => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
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
            <Select.Option value="Red">Red</Select.Option>
            <Select.Option value="Blue">Blue</Select.Option>
            <Select.Option value="Green">Green</Select.Option>
            <Select.Option value="Yellow">Yellow</Select.Option>
            <Select.Option value="Black">Black</Select.Option>
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