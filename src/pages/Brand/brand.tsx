import { Button, Card, Space, Modal, message } from 'antd';
import { useEffect, useState } from 'react';
import { ProTable, ProColumns, TableDropdown } from '@ant-design/pro-components';
import Icon, { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { CiCircleMore } from 'react-icons/ci';
import { BrandType } from '../../interface/brand';
import { deleteBrand, getBrand, getBrandDetail } from '../../api/brand';

const Brands = () => {
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [brandDetail, setBrandDetail] = useState<BrandType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data = await getBrand();
      setBrands(data);
    } catch (error) {
      message.error("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleBrandAction = async (key: string, brand: BrandType) => {
    if (key === 'view') {
      try {
        const detail = await getBrandDetail(brand.id);
        setBrandDetail(detail);
        setIsModalOpen(true);
      } catch (error) {
        message.error("Failed to fetch brand details");
      }
    } else if (key === 'delete') {
      confirmDeleteBrand(brand.id);
    }
  };

  const confirmDeleteBrand = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this brand?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteBrand(id);
          setBrands((prevBrands) => prevBrands.filter((brand) => brand.id !== id));
          message.success("Brand deleted successfully");
        } catch (error) {
          message.error("Failed to delete brand");
        }
      },
    });
  };

  const brandColumns: ProColumns<BrandType>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: 'Brand Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, row: BrandType) => (
        <TableDropdown
          onSelect={(key) => handleBrandAction(key, row)}
          menus={[
            {
              key: 'view',
              name: (
                <Space>
                  <EyeOutlined /> View
                </Space>
              ),
            },
            {
              key: 'delete',
              name: (
                <Space>
                  <DeleteOutlined /> Delete
                </Space>
              ),
            },
          ]}
        >
          <Icon component={CiCircleMore} />
        </TableDropdown>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card bordered={false} title="Brands">
        <ProTable<BrandType>
          columns={brandColumns}
          dataSource={brands}
          search={false}
          loading={loading}
          pagination={{ showQuickJumper: true, pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default Brands;
