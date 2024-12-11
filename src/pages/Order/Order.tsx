import React, { useEffect, useState } from "react";
import { Card, Input, Space, message, Modal } from "antd";
import {
  ProTable,
  ProColumns,
  TableDropdown,
} from "@ant-design/pro-components";
import Icon, { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import {
  getOrders,
  getOrderDetail,
  deleteOrder,
} from "../../api/order";
import { Order } from "../../interface/order";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import StyledButton from "../../components/Common/Button";
import DrawerOrderDetail from "../../components/Modal/ModalOrderDetail";
import "./order.css";
import { CiCircleMore } from "react-icons/ci";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  enum ActionKey {
    VIEW = "view",
    DELETE = "delete",
  }

  const columns: ProColumns<Order>[] = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      width: 50,
    },
    {
      title: "Username",
      dataIndex: "user",
      key: "username",
      render: (_, entity: Order) => entity.user.username,
    },
    {
      title: "Phone",
      dataIndex: "user",
      key: "phone",
      render: (_, entity: Order) => entity.user.phone,
    },
    {
      title: "Method",
      dataIndex: "methodShipping",
      key: "methodShipping",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (_, entity: Order) =>
        `${entity.address.province}, ${entity.address.district}, ${entity.address.detailedAddress}`,
    },
    {
      title: "Product Name",
      dataIndex: "transactions",
      key: "productName",
      render: (_, entity: Order) =>
        entity.transactions.map((t: { product: { name: any; }; }) => t.product.name).join(", "),
    },
    {
      title: "Quantity",
      dataIndex: "transactions",
      key: "quantity",
      render: (_, entity: Order) =>
        entity.transactions.reduce((sum: any, t: { quantity: any; }) => sum + t.quantity, 0),
    },
    {
      title: "Action",
      key: "option",
      fixed: "right",
      width: 50,
      render: (_, row: Order) => (
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
          <Icon component={CiCircleMore} className="text-primary text-xl" />
        </TableDropdown>
      ),
    },
  ];

  const handleActionOnSelect = async (key: string, order: Order) => {
    if (key === ActionKey.VIEW) {
      try {
        const orderDetail = await getOrderDetail(order.orderId);
        setSelectedOrder(orderDetail);
        setIsModalOpen(true);
      } catch (error) {
        message.error("Failed to fetch order details!");
        console.error("Error fetching order detail:", error);
      }
    } else if (key === ActionKey.DELETE) {
      Modal.confirm({
        title: "Are you sure you want to delete this order?",
        content: `Order ID: ${order.orderId}`,
        okText: "Yes, Delete",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          try {
            await deleteOrder(order.orderId);
            message.success("Order deleted successfully!");
            refreshOrderList();
          } catch (error) {
            message.error("Failed to delete order!");
          }
        },
      });
    }
  };

  const refreshOrderList = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error refreshing order list:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col">
      <DrawerOrderDetail
        order={selectedOrder}
        isDrawerOpen={isModalOpen}
        handleCancel={handleCancel}
      />
      <Breadcrumb pageName="Orders" />
      <Card
        bordered={false}
        className="criclebox tablespace mb-24 dark:bg-boxdark dark:text-white pt-6"
      >
        <div className="table-responsive">
          <div className="flex gap-3 mx-6 mb-4">
            <Input
              className="max-w-[300px] dark:bg-form-input dark:text-white dark:border-form-strokedark dark:placeholder:text-[#8c8c8c]"
              placeholder="Search by customer name" />
            <StyledButton>Search</StyledButton>
          </div>
          <ProTable
            columns={columns}
            dataSource={orders}
            rowKey="id"
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

export default Orders;
