import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BookOutlined,
  GlobalOutlined,
  DashboardOutlined,
  TagsOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Avatar, Dropdown, message } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hook/useAuth';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    logout();
    message.success('Đã đăng xuất!');
    navigate('/admin-login');
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: '/admin/learners',
      icon: <UserOutlined />,
      label: 'Người học',
    },
    {
      key: '/admin/topics',
      icon: <TagsOutlined />,
      label: 'Chủ đề',
    },
    {
      key: '/admin/crawler',
      icon: <GlobalOutlined />,
      label: 'Công cụ Crawler',
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" className="shadow-md">
        <div className="flex items-center justify-center h-16 border-b border-gray-100 mb-4">
          <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center mr-2">
            <BookOutlined className="text-white text-lg" />
          </div>
          {!collapsed && <span className="font-bold text-lg text-blue-600">IELTS Admin</span>}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="border-none"
        />
      </Sider>
      <Layout>
        <Header
          style={{ padding: 0, background: colorBgContainer }}
          className="flex justify-between items-center pr-6 shadow-sm z-10"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div className="flex items-center gap-4">
            <span className="text-gray-500 hidden sm:inline">Xin chào, {user?.name || 'Admin'}</span>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} className="bg-blue-500 cursor-pointer" />
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
