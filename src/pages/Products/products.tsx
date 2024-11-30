import { Button, Card, Image, Input, Space, Table } from 'antd';
import type { TableProps } from 'antd';
import { useEffect, useState } from 'react';
import { getProduct, getProductDetail } from '../../api/product';
// import EditIC from '../../assets/svgs/write.svg';
import { ProductType } from '../../interface/product';
// import DrawerProductDetail from "../../components/Modal/ModalProductDetail";
import {
  ActionType,
  ProTable,
  ProColumns,
  RequestData,
  TableDropdown,
  ProDescriptions,
} from '@ant-design/pro-components';
import './products.css';
import Icon, { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { CiCircleMore } from 'react-icons/ci';

const Products = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [productDetail, setProductDetail] = useState<ProductType>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleActionClick = async (id: string) => {
    try {
      const productDetail = await getProductDetail(id);
      setProductDetail(productDetail);
      showModal();
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  enum ActionKey {
    DELETE = 'delete',
    VIEW = 'view',
  }

  const columns: ProColumns[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: 'Category',
      key: 'category',
      render: (_, row: ProductType) => <>{row.category.name}</>,
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
          onSelect={(key) => handleActionOnSelect(key, row)}
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
          <Icon component={CiCircleMore} className="text-rfprimary text-xl" />
        </TableDropdown>
      ),
    },
  ];

  const handleActionOnSelect = (key: string, product: ProductType) => {
    if (key === ActionKey.DELETE) {
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProduct();
        setProducts(data);
      } catch (err) {
        console.log('err', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* <DrawerProductDetail
        product={productDetail}
        isDrawerOpen={isModalOpen}
        handleO={handleOk}
        handleCancel={handleCancel}
      /> */}
      <Card
        bordered={false}
        className="criclebox tablespace mb-24 dark:bg-boxdark dark:text-white"
        title="Products"
      >
        <div className="table-responsive dark:bg-boxdark">
          <div className="flex gap-3 mx-6">
            <Input
              className="max-w-[300px] dark:bg-form-input dark:text-white dark:border-form-strokedark dark:placeholder:text-[#8c8c8c]"
              placeholder="Search by product name"
            />
            <Input
              className="max-w-[300px] dark:bg-form-input dark:text-white dark:border-form-strokedark dark:placeholder:text-[#8c8c8c]"
              placeholder="Search by product name"
            />
            <Input
              className="max-w-[300px] dark:bg-form-input dark:text-white dark:border-form-strokedark dark:placeholder:text-[#8c8c8c]"
              placeholder="Search by product name"
            />
            <Button className="rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 border-none ">
              Search
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
    </div>
  );
};

export default Products;
