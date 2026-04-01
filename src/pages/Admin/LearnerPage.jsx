import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Card, Typography, message, Skeleton, Avatar } from 'antd';
import { UserOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';
import { getAllLearnersAPI } from '../../service/api/api.admin';
import { getFullImageUrl } from '../../utils';

const { Title } = Typography;

const LearnerPage = () => {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLearners();
  }, []);

  const fetchLearners = async () => {
    try {
      setLoading(true);
      const res = await getAllLearnersAPI();
      
      // Axios trả về response object, ta cần lấy res.data
      const responseData = res?.data;
      
      // Kiểm tra các trường hợp: data là array, hoặc data.content là array
      let finalData = [];
      if (Array.isArray(responseData)) {
        finalData = responseData;
      } else if (responseData && Array.isArray(responseData.content)) {
        finalData = responseData.content;
      } else if (responseData && Array.isArray(responseData.data)) {
        finalData = responseData.data;
      }
      
      setLearners(finalData);
    } catch (error) {
      console.error('Fetch learners error:', error);
      message.error('Không thể tải danh sách người học!');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      render: (url, record) => (
        <Avatar 
          src={getFullImageUrl(url)} 
          icon={<UserOutlined />} 
          className="bg-blue-100 text-blue-500"
          alt={record.fullName}
        />
      ),
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <Space>
          <UserOutlined className="text-blue-500" />
          <span className="font-medium">{text || record.name || 'N/A'}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <Space>
          <MailOutlined className="text-gray-400" />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'ADMIN' ? 'volcano' : 'blue'}>
          {role || 'LEARNER'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Space>
          <CalendarOutlined className="text-gray-400" />
          <span>{date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'}</span>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={3}>Quản lý Người học</Title>
      </div>

      <Card className="shadow-sm border-gray-100 rounded-xl overflow-hidden">
        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <Table 
            columns={columns} 
            dataSource={learners} 
            rowKey={(record) => record.id || record.email}
            pagination={{ pageSize: 10, showTotal: (total) => `Tổng cộng ${total} người học` }}
          />
        )}
      </Card>
    </div>
  );
};

export default LearnerPage;
