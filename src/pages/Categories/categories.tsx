import {
  Space,
  Table,
  message,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
} from 'antd';
import type { TableProps } from 'antd';
import {
  getCategories,
  addCategory,
  deleteCategory,
} from '../../api/categories'; // Giả định bạn có API addCategory
import { useEffect, useState } from 'react';
export interface CategoryType {
  id: string;
  name: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Hàm xử lý xóa danh mục
  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      message.success('Category deleted successfully!');
      setCategories((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      message.error('Failed to delete category!');
    }
  };

  // Hàm xử lý thêm danh mục
  const handleAddCategory = async (values: { name: string }) => {
    try {
      const newCategory = await addCategory(values); // Gọi API thêm danh mục
      setCategories((prev) => [...prev, newCategory]); // Cập nhật danh sách
      message.success('Category added successfully!');
      form.resetFields(); // Reset form
      setIsModalOpen(false); // Đóng modal
    } catch (err) {
      console.error('Error adding category:', err);
      message.error('Failed to add category!');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Cột của bảng, thêm sự kiện xóa với xác nhận
  const columns: TableProps<CategoryType>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this category?"
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
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Add Category
      </Button>

      {/* Modal để thêm danh mục */}
      <Modal
        title="Add New Category"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()} // Submit form khi nhấn "OK"
      >
        <Form form={form} onFinish={handleAddCategory} layout="vertical">
          <Form.Item
            label="Category Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter the category name!' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Table columns={columns} dataSource={categories} rowKey="id" />
    </div>
  );
};

export default Categories;
