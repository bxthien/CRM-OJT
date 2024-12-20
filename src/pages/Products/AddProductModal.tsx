import { useEffect, useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  Select,
  message,
} from 'antd';
import { ProductType, CategoryType } from '../../interface/product';
import { getCategories } from '../../api/categories';
import { uploadImage } from '../../api/product';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import { PlusOutlined } from '@ant-design/icons';

interface AddProductDrawerProps {
  isDrawerOpen: boolean;
  handleAddProduct: (newProduct: ProductType) => void;
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
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);

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

  const handleSubmit = (values) => {
    // Validate data before submission
    // if (!Array.isArray(newProduct.urls) || newProduct.urls.length === 0) {
    //   console.error('Invalid URLs: must be a non-empty array');
    //   return;
    // }
    // if (typeof newProduct.info !== 'object') {
    //   console.error('Invalid Info: must be an object');
    //   return;
    // }
    // if (!Array.isArray(newProduct.info)) {
    //   console.error('Invalid Variants: must be an array');
    //   return;
    // }
    // // Submit product
    // console.log('Submitting product:', newProduct);
    handleAddProduct({ ...values, urls: photos });
    // console.log('Form Values:', values);
  };

  const handleUpload = async (file: RcFile) => {
    try {
      // Call your upload API
      const response = await uploadImage(file);
      console.log('object', response.files?.[0].url);
      setPhotos([response.files?.[0].url]);
      return response;
    } catch (error) {
      message.error(`${file.name} file upload failed.`);
      throw error;
    }
  };

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

  const handleRemovePhoto = (file: UploadFile) => {
    const newPhotos = photos.filter(
      (photo) => photo !== file.url && photo !== file.response?.url,
    );
    setPhotos(newPhotos);
  };

  return (
    <Drawer
      title="Add New Product"
      placement="right"
      onClose={handleCancel}
      open={isDrawerOpen}
      className="responsive-drawer"
      width={700}
    >
      <Form layout="vertical" onFinish={handleSubmit} form={form}>
        {/* First row - responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Form.Item
            label="Product Name"
            name="name"
            required
            className="w-full"
          >
            <Input
              placeholder="Enter product name"
              // value={newProduct.name}
              // onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full"
            />
          </Form.Item>

          <Form.Item label="Price" name="price" required className="w-full">
            <InputNumber
              placeholder="Enter price"
              value={newProduct.price}
              min={0}
              // onChange={(value) => handleInputChange('price', value)}
              className="w-full"
            />
          </Form.Item>
        </div>

        {/* Second row - responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Form.Item
            label="Quantity"
            name="quantity"
            required
            className="w-full"
          >
            <InputNumber
              placeholder="Enter quantity"
              value={newProduct.quantity}
              min={0}
              // onChange={(value) => handleInputChange('quantity', value)}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Category"
            name="categoryId"
            required
            className="w-full"
          >
            <Select
              placeholder="Select category"
              value={newProduct.categoryId}
              // onChange={(value) => handleInputChange('categoryId', value)}
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
          <Form.Item label="Color" required name="color" className="w-full">
            <Select
              mode="multiple"
              placeholder="Select product color(s)"
              allowClear
              className="w-full"
              // onChange={(value) =>
              //   handleInputChange('info', [{ color: value }])
              // }
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

          <Form.Item label="Size" name="size" required className="w-full">
            <Select
              mode="multiple"
              placeholder="Select product size"
              allowClear
              className="w-full"
              onChange={(value) => handleInputChange('info', [{ size: value }])}
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
          <Form.Item label="Product Images" className="w-full">
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
            {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
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
          </div> */}
          </Form.Item>
        </div>

        {/* Full width description */}
        <Form.Item label="Description" name="description" className="w-full">
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
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            onClick={handleSubmit}
          >
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddProductDrawer;
