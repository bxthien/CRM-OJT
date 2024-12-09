import { useEffect, useState } from 'react';
import { Drawer, Form, Input, InputNumber, Upload, Button, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ProductType, CategoryType } from '../../interface/product';
import { getCategories } from '../../api/categories';
import { uploadImage } from '../../api/product';

interface AddProductDrawerProps {
  isDrawerOpen: boolean;
  handleAddProduct: () => void;
  handleCancel: () => void;
  setNewProduct: React.Dispatch<React.SetStateAction<ProductType>>;
  newProduct: ProductType;
}

const AddProductDrawer: React.FC<AddProductDrawerProps> = ({
  isDrawerOpen,
  handleAddProduct,
  handleCancel,
  setNewProduct,
  newProduct,
}) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (field: keyof ProductType, value: any) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file.originFileObj);

    try {
      const response = await uploadImage(file);

      if (response && response.url) {
        setNewProduct((prev) => ({
          ...prev,
          urls: [...(prev.urls || []), response.url], // Ensure `urls` is an array
        }));
      } else {
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }

    return false; // Prevent default upload behavior
  };

  const handleSubmit = () => {
    // Validate data before submission
    if (!Array.isArray(newProduct.urls) || newProduct.urls.length === 0) {
      console.error('Invalid URLs: must be a non-empty array');
      return;
    }
    if (typeof newProduct.info !== 'object') {
      console.error('Invalid Info: must be an object');
      return;
    }
    if (!Array.isArray(newProduct.info)) {
      console.error('Invalid Variants: must be an array');
      return;
    }

    // Submit product
    console.log('Submitting product:', newProduct);
    handleAddProduct();
  };

  return (
    <Drawer
      title="Add New Product"
      placement="right"
      onClose={handleCancel}
      open={isDrawerOpen}
      className="responsive-drawer"
    >
      <Form layout="vertical" onFinish={handleAddProduct}>
        {/* First row - responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Form.Item label="Product Name" required className="w-full">
            <Input
              placeholder="Enter product name"
              value={newProduct.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full"
            />
          </Form.Item>

          <Form.Item label="Price" required className="w-full">
            <InputNumber
              placeholder="Enter price"
              value={newProduct.price}
              min={0}
              onChange={(value) => handleInputChange('price', value)}
              className="w-full"
            />
          </Form.Item>
        </div>

        {/* Second row - responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Form.Item label="Quantity" required className="w-full">
            <InputNumber
              placeholder="Enter quantity"
              value={newProduct.quantity}
              min={0}
              onChange={(value) => handleInputChange('quantity', value)}
              className="w-full"
            />
          </Form.Item>

          <Form.Item label="Category" required className="w-full">
            <Select
              placeholder="Select category"
              value={newProduct.categoryId}
              onChange={(value) => handleInputChange('categoryId', value)}
              className="w-full"
            >
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Third row - responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Form.Item label="Color" required className="w-full">
            <Select
              mode="multiple"
              placeholder="Select product color(s)"
              allowClear
              className="w-full"
              onChange={(value) =>
                handleInputChange('info', [{ colors: value }])
              }
            >
              <Select.Option value="Red">Red</Select.Option>
              <Select.Option value="Blue">Blue</Select.Option>
              <Select.Option value="Green">Green</Select.Option>
              <Select.Option value="Yellow">Yellow</Select.Option>
              <Select.Option value="Black">Black</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Size" required className="w-full">
            <Select
              mode="multiple"
              placeholder="Select product size"
              allowClear
              className="w-full"
              onChange={(value) =>
                handleInputChange('info', [{ sizes: value }])
              }
            >
              <Select.Option value="64GB">64GB</Select.Option>
              <Select.Option value="128GB">128GB</Select.Option>
              <Select.Option value="256GB">256GB</Select.Option>
              <Select.Option value="512GB">512GB</Select.Option>
              <Select.Option value="1TB">1TB</Select.Option>
            </Select>
          </Form.Item>
        </div>

        {/* Fourth row - responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Form.Item label="Upload Image" className="w-full">
          <Upload
            beforeUpload={() => false}
            onChange={(info) => {
              if (info.file.originFileObj) {
                const file = info.file.originFileObj;
                const reader = new FileReader();
                reader.onloadend = () => {
                  setNewProduct((prev) => ({
                    ...prev,
                    url: reader.result as string,
                  }));
                };
                reader.readAsDataURL(file);
              }
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
            {newProduct.urls?.length > 0 && (
              <img
                src={newProduct.urls[0]}
                alt="Preview"
                className="mt-2 max-h-24 w-auto object-cover"
              />
            )}
          </Form.Item>
        </div>

        {/* Full width description */}
        <Form.Item label="Description" className="w-full">
          <Input.TextArea
            placeholder="Enter product description"
            value={newProduct.info?.description || ''}
            onChange={(e) =>
              handleInputChange('info', {
                ...newProduct.info,
                description: e.target.value,
              })
            }
            className="w-full"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddProductDrawer;
