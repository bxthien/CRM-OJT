import { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { getme } from "../../api/auth";

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
  });
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await getme();
        setProfile({ username: response.username, email: response.email });
      } catch (err) {
        console.error(err);
      }
    };
    getMe();
  }, []);

  return (
    <Layout className="h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={50}
        width={170}
      >
        <div className="flex items-center justify-center h-20 bg-gray-900 text-white font-bold text-xl">
          VMS
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={({ key }) => navigate(key)}
          items={[
            {
              key: "/",
              icon: <UserOutlined />,
              label: "Home Page",
            },
            {
              key: "/categories",
              icon: <UserOutlined />,
              label: "Categories",
            },
            {
              key: "/products",
              icon: <VideoCameraOutlined />,
              label: "Products",
            },
            {
              key: "/orders",
              icon: <UploadOutlined />,
              label: "Orders",
            },
            {
              key: "/users",
              icon: <UploadOutlined />,
              label: "Users",
            },
            {
              key: "/settings",
              icon: <UploadOutlined />,
              label: "Settings",
            },
          ]}
        />
        <div className="absolute bottom-0 w-full p-3">
          <Button type="link" className="w-full text-center">
            <LogoutOutlined />
          </Button>
        </div>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="flex justify-between">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    label: "Profile",
                  },
                  {
                    key: "2",
                    label: "Setting",
                  },
                ],
              }}
              placement="bottomRight"
              arrow
            >
              <div className="flex items-center justify-center mr-4 z-10 gap-2">
                <div className=" text-black gap-3 leading-4 text-right">
                  <div className="font-semibold">{profile.username}</div>
                  <div className="text-xs italic">{profile.email}</div>
                </div>
                <Avatar size={`large`} icon={<UserOutlined />} />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
