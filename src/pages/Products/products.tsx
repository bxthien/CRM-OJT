import { Button, Card, Input, message, Space, Upload, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { ProductType } from '../../interface/product';
import {
  ProTable,
  ProColumns,
  TableDropdown,
} from '@ant-design/pro-components';
import './products.css';
import Icon, { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { CiCircleMore } from 'react-icons/ci';
import DrawerProductDetail from './ModalProductDetail';
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProductDetail,
  updateProduct,
  uploadImage,
} from '../../api/product';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import StyledButton from '../../components/Common/Button';
import AddProductDrawer from './AddProductModal';

const Products = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [productDetail, setProductDetail] = useState<ProductType | undefined>(
    undefined,
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [originalProducts, setOriginalProducts] = useState<ProductType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<ProductType>({
    id: '',
    name: '',
    price: 0,
    urls: [],
    quantity: 0,
    categoryId: '',
    url: '',
    category: { id: '', name: '' },
    color: [],
    size: [],
  });

  // Handle adding a product
  const handleAddProduct = async (newProduct: ProductType) => {
    try {
      const addedProduct = await addProduct(newProduct);
      setProducts([...products, addedProduct]);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  // Handle updating a product
  const handleUpdateProduct = async (updatedProduct: ProductType) => {
    try {
      if (updatedProduct.id) {
        const updatedData = await updateProduct(
          updatedProduct.id,
          updatedProduct,
        );
        message.success('Product updated successfully!');
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === updatedProduct.id ? updatedData : product,
          ),
        );
      }
    } catch (error) {
      message.error('Failed to update product. Please try again.');
      console.error('Error updating product:', error);
    }
  };

  // Handle viewing product details
  const handleActionClick = async (id: string) => {
    try {
      const productDetail = await getProductDetail(id);
      setProductDetail(productDetail);
      showModal();
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id),
      );
      console.log(`Product with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Confirm delete action
  const confirmDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this product?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => handleDeleteProduct(id),
    });
  };

  // Enum for action keys
  enum ActionKey {
    DELETE = 'delete',
    VIEW = 'view',
  }

  // Handle selecting an action (view or delete)
  const handleActionOnSelect = async (key: string, product: ProductType) => {
    if (key === ActionKey.VIEW) {
      await handleActionClick(product.id);
    } else if (key === ActionKey.DELETE) {
      confirmDelete(product.id);
    }
  };

  // Open the product detail modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filteredProducts = originalProducts.filter((product) =>
        product.name.toLowerCase().includes(query),
      );
      setProducts(filteredProducts);
    } else {
      setProducts(originalProducts);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProduct();
        setProducts(data);
        setOriginalProducts(data);
      } catch (err) {
        console.log('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  // Handle image upload
  const handleImageUpload = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file.originFileObj);

    try {
      const response = await uploadImage(formData); // Assuming `uploadImage` handles the API call
      if (response && response.url) {
        setNewProduct((prev) => ({
          ...prev,
          urls: [...(prev.urls || []), response.url], // Append the URL if successful
        }));
      } else {
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    return false; // Prevent default upload behavior
  };

  // Define table columns
  const columns: ProColumns[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (_, row: ProductType) => (
        <img
          src={row.urls?.[0]}
          alt={row.name}
          style={{
            width: '50px',
            height: '50px',
            objectFit: 'cover',
            borderRadius: '4px',
          }}
        />
      ),
      width: 100,
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (_, row: ProductType) => <>{row.category.name}</>, // You can change this if needed to show category name
      width: 200,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 200,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 200,
    },
    {
      title: 'Action',
      key: 'option',
      fixed: 'right',
      width: 50,
      render: (_, row: ProductType) => (
        <TableDropdown
          className="flex items-center justify-center"
          onSelect={(key: string) => handleActionOnSelect(key, row)}
          menus={[
            {
              key: ActionKey.VIEW,
              name: (
                <Space>
                  <EyeOutlined />
                  View
                </Space>
              ),
            },
            {
              key: ActionKey.DELETE,
              name: (
                <Space>
                  <DeleteOutlined />
                  Delete
                </Space>
              ),
            },
          ]}
        >
          <Icon component={CiCircleMore} className="text-primary text-xl" />
        </TableDropdown>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <DrawerProductDetail
        product={productDetail}
        isDrawerOpen={isModalOpen}
        handleOk={handleUpdateProduct}
        handleCancel={handleCancel}
      />
      <Breadcrumb pageName="Products" />
      <Card
        bordered={false}
        className="criclebox tablespace mb-24 dark:bg-boxdark dark:text-white pt-6"
      >
        <div className="table-responsive dark:bg-boxdark">
          <div className="flex gap-3 mx-6">
            <Input
              className="max-w-[300px] dark:bg-form-input dark:text-white dark:border-form-strokedark dark:placeholder:text-[#8c8c8c]"
              placeholder="Search by product name"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {/* <StyledButton onClick={handleSearch}>Search</StyledButton> */}
            <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
              Add Product
            </Button>
          </div>
          <ProTable
            columns={columns}
            dataSource={products}
            className="ant-border-space"
            search={false}
            pagination={{
              showQuickJumper: true,
              pageSize: 10,
            }}
          />
        </div>
      </Card>
      <AddProductDrawer
        isDrawerOpen={isAddModalOpen}
        handleAddProduct={() => handleAddProduct(newProduct)}
        handleCancel={() => setIsAddModalOpen(false)}
        setNewProduct={setNewProduct}
        newProduct={newProduct}
      />
    </div>
  );
};

export default Products;
