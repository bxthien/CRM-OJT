import { useEffect, useState } from 'react';
import { Card, Input, Space, Switch, message, Modal } from 'antd';
import {
  ProTable,
  ProColumns,
  TableDropdown,
} from '@ant-design/pro-components';
import Icon, { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import {
  getUsers,
  getUserDetail,
  updateUser,
  changeActive,
  deleteUser,
} from '../../api/user';
import { User } from '../../interface/auth';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import StyledButton from '../../components/Common/Button';
import DrawerUserDetail from '../../components/Modal/ModalUserDetail';
import './user.css';
import { CiCircleMore } from 'react-icons/ci';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  enum ActionKey {
    VIEW = 'view',
    EDIT = 'edit',
    DELETE = 'delete',
  }

  const columns: ProColumns<User>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phoneNumber',
      width: 200,
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 200,
      render: (_, record: User) => (
        <div className="flex items-center justify-center">
          <Switch
            checked={record.isActive}
            onChange={() => handleActive(record.id)}
          />
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'option',
      fixed: 'right',
      width: 50,
      render: (_, row: User) => (
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

  const handleActionOnSelect = async (key: string, user: User) => {
    if (key === ActionKey.VIEW) {
      try {
        const userDetail = await getUserDetail(user.id);
        setSelectedUser(userDetail);
        setIsModalOpen(true);
      } catch (error) {
        message.error('Failed to fetch user details!');
        console.error('Error fetching user detail:', error);
      }
    } else if (key === ActionKey.DELETE) {
      Modal.confirm({
        title: 'Are you sure you want to delete this user?',
        content: `Username: ${user.username}`,
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'No',
        onOk: async () => {
          try {
            await deleteUser(user.id);
            message.success('User deleted successfully!');
            refreshUserList();
          } catch (error) {
            message.error('Failed to delete user!');
          }
        },
      });
    }
  };

  const handleActive = async (id: string) => {
    const result = await changeActive(id);
    if (result) fetchUsers();
  };

  const refreshUserList = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error refreshing user list:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      console.log(data, 'data');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleOk = async (updatedUser: User) => {
    try {
      await updateUser(updatedUser.id, updatedUser);
      message.success('User updated successfully!');
      setIsModalOpen(false);
      refreshUserList();
    } catch (error) {
      message.error('Failed to update user!');
      console.error('Error updating user:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col">
      <DrawerUserDetail
        user={selectedUser}
        isDrawerOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
      <Breadcrumb pageName="Users" />
      <Card
        bordered={false}
        className="criclebox tablespace mb-24 dark:bg-boxdark dark:text-white pt-6"
      >
        <div className="table-responsive">
          <div className="flex gap-3 mx-6 mb-4">
            <Input
              className="max-w-[300px] dark:bg-form-input dark:text-white dark:border-form-strokedark dark:placeholder:text-[#8c8c8c]"
             placeholder="Search by username" />
            <StyledButton>Search</StyledButton>
          </div>
          <ProTable
            columns={columns}
            dataSource={users}
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

export default Users;
