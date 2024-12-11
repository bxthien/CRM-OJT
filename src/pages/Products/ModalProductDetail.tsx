import { Button, Drawer, Form, Input, Select, Upload, message } from 'antd';
import { SetStateAction, useEffect, useState } from 'react';
import { ProductType } from '../../interface/product';
import { getCategories } from '../../api/categories';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { uploadImage } from '../../api/product';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';

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
  const [photos, setPhotos] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [urlInput, setUrlInput] = useState<string>('');

  // Fetch categories when the drawer opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    if (isDrawerOpen) {
      fetchCategories();
    }
  }, [isDrawerOpen]);

  // Populate form and photos when product changes
  useEffect(() => {
    if (product) {
      setPhotos(product.photos || []);
      setFileList(
        (product.photos || []).map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done',
          url: url,
        })),
      );
      form.setFieldsValue({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        category: product.category?.id,
        color: product?.color,
        size: product?.size,
        description: product?.description,
      });
    } else {
      form.resetFields();
      setPhotos([]);
      setFileList([]);
    }
  }, [product, form]);

  // Custom upload method
  const handleUpload = async (file: RcFile) => {
    try {
      // Call your upload API
      const response = await uploadImage(file);
      return response;
    } catch (error) {
      message.error(`${file.name} file upload failed.`);
      throw error;
    }
  };

  // Handle file list changes
  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    let newFileList = [...info.fileList];

    // Limit to 5 files
    newFileList = newFileList.slice(-5);

    // Process completed uploads
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Assuming your API returns an object with a url property
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(newFileList);

    // Update photos with successfully uploaded image URLs
    const uploadedPhotos = newFileList
      .filter((file) => file.status === 'done')
      .map((file) => file.url || file.response?.url)
      .filter(Boolean);

    setPhotos((prev) => [
      ...prev.filter(
        (photo) => !newFileList.some((file) => file.url === photo),
      ),
      ...uploadedPhotos,
    ]);
  };

  // Handle removing photos
  const handleRemovePhoto = (file: UploadFile) => {
    const newPhotos = photos.filter(
      (photo) => photo !== file.url && photo !== file.response?.url,
    );
    setPhotos(newPhotos);
  };

  const onFinish = (values: any) => {
    const updatedProduct = {
      ...product,
      ...values,
      urls: photos,
      categoryId: values.category,
      // id: product?.id,
      // name: 'Iphone 20',
      // price: 1000,
      // description: 'một chiếc iphone thật củ chuối',
      // urls: [
      //   'https://res.cloudinary.com/dwmebqzw1/image/upload/v1733925008/t8dz7wldesffbtqudtdz.jpg',
      // ],
      // quantity: 10,
      // categoryId: '33237c4d-849b-4aa8-b9a4-fe2264f28c47',
      // brandId: 'ef4a9e65-f804-451c-be82-aef9fc390446',
      // color: ['Red', 'Blue'],
      // size: ['64GB'],
    };
    handleOk(updatedProduct);
  };

  return (
    <Drawer
      title="Product Detail"
      placement="right"
      width={700}
      onClose={handleCancel}
      open={isDrawerOpen}
      className="responsive-drawer"
      footer={
        <div className="flex gap-2 justify-end">
          <Button
            type="primary"
            onClick={() => form.submit()}
            className="w-full md:w-auto"
          >
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
          images: product?.url,
          photos: product?.photos,
          info: {
            color: product?.info?.color,
            size: product?.info?.size,
            description: product?.info?.description,
          },
        }}
        onFinish={onFinish}
      >
        {/* First row - responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter the product name' },
            ]}
            className="w-full"
          >
            <Input placeholder="Enter product name" className="w-full" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please select a category' }]}
            className="w-full h-full"
          >
            <Select
              placeholder="Select product category"
              allowClear
              className="w-full h-full"
            >
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Second row - responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please enter the price' }]}
            className="w-full"
          >
            <Input
              type="number"
              placeholder="Enter product price"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Please enter the quantity' }]}
            className="w-full"
          >
            <Input
              type="number"
              placeholder="Enter quantity"
              className="w-full"
            />
          </Form.Item>
        </div>

        {/* Third row - responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Form.Item
            label="Color"
            name="color"
            rules={[
              { required: true, message: 'Please select at least one color' },
            ]}
            className="w-full"
          >
            <Select
              mode="multiple"
              placeholder="Select product color(s)"
              allowClear
              className="w-full"
            >
              <Select.Option value="Red">Red</Select.Option>
              <Select.Option value="Blue">Blue</Select.Option>
              <Select.Option value="Green">Green</Select.Option>
              <Select.Option value="Yellow">Yellow</Select.Option>
              <Select.Option value="Black">Black</Select.Option>
              <Select.Option value="White">White</Select.Option>
              <Select.Option value="Gray">Gray</Select.Option>
              <Select.Option value="Brown">Brown</Select.Option>
              <Select.Option value="Pink">Pink</Select.Option>
              <Select.Option value="Purple">Purple</Select.Option>
              <Select.Option value="Orange">Orange</Select.Option>
              <Select.Option value="Gold">Gold</Select.Option>
              <Select.Option value="Silver">Silver</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Size"
            name="size"
            rules={[{ required: true, message: 'Please select a size' }]}
            className="w-full"
          >
            <Select
              mode="multiple"
              placeholder="Select product size"
              allowClear
              className="w-full"
            >
              <Select.Option value="64GB">64GB</Select.Option>
              <Select.Option value="128GB">128GB</Select.Option>
              <Select.Option value="256GB">256GB</Select.Option>
              <Select.Option value="512GB">512GB</Select.Option>
              <Select.Option value="1TB">1TB</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <Form.Item label="Description" name="description" className="w-full">
          <Input.TextArea
            placeholder="Enter product description"
            className="w-full"
          />
        </Form.Item>
        <Form.Item label="Images" name="photos" className="w-full">
          <div className="grid grid-cols-3 gap-4">
            {photos.length > 0 ? (
              photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                </div>
              ))
            ) : (
              <p className="col-span-3 text-gray-500">
                No images uploaded yet.
              </p>
            )}
          </div>
        </Form.Item>

        {/* Product Images Section - Responsive */}
        <Form.Item label="Product Images" className="w-full">
          <img
            src={product?.url}
            className="w-full md:w-1/2 lg:w-1/3 h-auto object-cover rounded-md mb-4"
          />

          {/* URL Input - Responsive Flex */}
          <Upload
            listType="picture-card"
            fileList={fileList}
            multiple={true}
            maxCount={5}
            customRequest={({ file, onSuccess, onError }) => {
              handleUpload(file as RcFile)
                .then((response) => {
                  onSuccess?.(response);
                })
                .catch((error) => {
                  onError?.(error);
                });
            }}
            onChange={handleChange}
            onRemove={handleRemovePhoto}
          >
            {fileList.length < 5 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>

          {/* Photos Grid - Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {photos.length > 0 ? (
              photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Product Photo ${index + 1}`}
                    className="w-full h-24 object-cover border rounded"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No photos added yet.
              </div>
            )}
          </div>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default DrawerProductDetail;
