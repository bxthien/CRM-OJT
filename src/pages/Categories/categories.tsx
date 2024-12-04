import { Space, Table } from "antd";
import type { TableProps } from "antd";
import { getCategories } from "../../api/categories";
import { useEffect, useState } from "react";

export interface CategoryType {
  id: string;
  name: string;
}

const columns: TableProps<CategoryType>["columns"] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Action",
    key: "action",
    render: () => (
      <Space size="middle">
        <a>Delete</a>
      </Space>
    ),
  },
];

const Categories = () => {
  const [category, setCategory] = useState<CategoryType[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategory(data);
      } catch (err) {
        console.log("err", err);
      }
    };

    fetchCategories();
  }, []);

  return <Table columns={columns} dataSource={category} />;
};

export default Categories;
