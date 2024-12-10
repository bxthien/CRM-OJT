import { Space, Table, message, Button, Modal, Form, Input, Popconfirm } from "antd";
import type { TableProps } from "antd";
import { useEffect, useState } from "react";
import { addBrand, deleteBrand, getBrands } from "../../api/brands";

export interface BrandType {
  id: string;
  name: string;
}

const Brands = () => {
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Quản lý trạng thái hiển thị modal
  const [form] = Form.useForm();

  // Hàm tải danh sách thương hiệu
  const fetchBrands = async () => {
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  // Hàm xử lý xóa thương hiệu
  const handleDelete = async (id: string) => {
    try {
      await deleteBrand(id); // Gọi API xóa
      message.success("Brand deleted successfully!");
      setBrands((prev) => prev.filter((item) => item.id !== id)); // Cập nhật danh sách
    } catch (err) {
      console.error("Error deleting brand:", err);
      message.error("Failed to delete brand!");
    }
  };

  // Hàm xử lý thêm thương hiệu
  const handleAddBrand = async (values: { name: string }) => {
    try {
      const newBrand = await addBrand(values); // Gọi API thêm thương hiệu
      setBrands((prev) => [...prev, newBrand]); // Cập nhật danh sách
      message.success("Brand added successfully!");
      form.resetFields(); // Reset form
      setIsModalOpen(false); // Đóng modal
    } catch (err) {
      console.error("Error adding brand:", err);
      message.error("Failed to add brand!");
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Cột của bảng, thêm sự kiện xóa với xác nhận
  const columns: TableProps<BrandType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this brand?"
            onConfirm={() => handleDelete(record.id)} // Xác nhận xóa
            okText="Yes"
            cancelText="No"
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
        Add Brand
      </Button>

      {/* Modal để thêm thương hiệu */}
      <Modal
        title="Add New Brand"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()} // Submit form khi nhấn "OK"
      >
        <Form form={form} onFinish={handleAddBrand} layout="vertical">
          <Form.Item
            label="Brand Name"
            name="name"
            rules={[{ required: true, message: "Please enter the brand name!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Bảng thương hiệu */}
      <Table columns={columns} dataSource={brands} rowKey="id" />
    </div>
  );
};

export default Brands;
