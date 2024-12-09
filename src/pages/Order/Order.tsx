import { useEffect, useState } from "react";
import { Card, Input, Space, Switch, message, Modal } from "antd";
import {
  ProTable,
  ProColumns,
  TableDropdown,
} from "@ant-design/pro-components";
import Icon, { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import {
  getOrders,
  getOrderDetail,
  updateOrder,
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
      dataIndex: "id",
      key: "id",
      width: 150,
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 150,
      render: (price) => ``,
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
        const orderDetail = await getOrderDetail(order.id);
        setSelectedOrder(orderDetail);
        setIsModalOpen(true);
      } catch (error) {
        message.error("Failed to fetch order details!");
      }
    } else if (key === ActionKey.DELETE) {
      Modal.confirm({
        title: "Are you sure you want to delete this order?",
        content: `Order ID: ${order.id}`,
        okText: "Yes, Delete",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          try {
            await deleteOrder(order.id);
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

  const handleOk = async (updatedOrder: Order) => {
    try {
      await updateOrder(updatedOrder.id, updatedOrder);
      message.success("Order updated successfully!");
      setIsModalOpen(false);
      refreshOrderList();
    } catch (error) {
      message.error("Failed to update order!");
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
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
      <Breadcrumb pageName="Orders" />
      <Card bordered={false} className="criclebox tablespace mb-24 dark:bg-boxdark dark:text-white pt-6">
        <div className="table-responsive">
          <div className="flex gap-3 mx-6 mb-4">
            <Input placeholder="Search by customer name" />
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
