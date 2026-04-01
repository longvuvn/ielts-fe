import React from 'react';
import { Card, Row, Col, Statistic, Typography, List, Avatar, Tag } from 'antd';
import { 
  UserOutlined, 
  BookOutlined, 
  ThunderboltOutlined, 
  ArrowUpOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const DashboardHome = () => {
  // Dữ liệu giả lập cho Dashboard
  const stats = [
    { title: 'Tổng người học', value: 1250, icon: <UserOutlined />, color: '#1890ff' },
    { title: 'Đề thi đã cào', value: 48, icon: <BookOutlined />, color: '#52c41a' },
    { title: 'Tổng từ vựng', value: 3420, icon: <ThunderboltOutlined />, color: '#faad14' },
    { title: 'Tỉ lệ hoàn thành', value: '85%', icon: <CheckCircleOutlined />, color: '#eb2f96' },
  ];

  const recentActivities = [
    { id: 1, user: 'Nguyễn Văn A', action: 'vừa hoàn thành bài thi Reading Cam 18', time: '5 phút trước' },
    { id: 2, user: 'Crawler Bot', action: 'đã cập nhật 12 từ vựng mới cho chủ đề Education', time: '12 phút trước' },
    { id: 3, user: 'Trần Thị B', action: 'đã đăng ký tài khoản mới', time: '1 giờ trước' },
    { id: 4, user: 'System', action: 'Backup dữ liệu định kỳ thành công', time: '2 giờ trước' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={2}>Hệ thống Quản trị IELTS Master</Title>
        <Text type="secondary">Chào mừng bạn trở lại, đây là cái nhìn tổng quan về hệ thống hôm nay.</Text>
      </div>

      {/* STATS CARDS */}
      <Row gutter={[24, 24]}>
        {stats.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="shadow-sm border-none rounded-2xl overflow-hidden">
              <Statistic
                title={<span className="text-gray-400 font-medium">{item.title}</span>}
                value={item.value}
                valueStyle={{ color: '#1f1f1f', fontWeight: 'bold' }}
                prefix={<span className="p-2 rounded-lg mr-2" style={{ backgroundColor: `${item.color}15`, color: item.color }}>{item.icon}</span>}
              />
              <div className="mt-4 flex items-center text-xs">
                <Tag color="green" icon={<ArrowUpOutlined />}>12%</Tag>
                <span className="text-gray-400 ml-2">so với tháng trước</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* CHART PLACEHOLDER */}
        <Col xs={24} lg={16}>
          <Card title="Lưu lượng truy cập" className="shadow-sm border-none rounded-2xl h-full">
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <div className="text-center">
                <p className="text-gray-400">Biểu đồ thống kê sẽ hiển thị tại đây</p>
                <Text type="secondary" className="text-xs">(Cần tích hợp Recharts hoặc Chart.js)</Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* RECENT ACTIVITIES */}
        <Col xs={24} lg={8}>
          <Card title="Hoạt động gần đây" className="shadow-sm border-none rounded-2xl h-full">
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} className="bg-gray-100 text-blue-500" />}
                    title={<span className="text-sm font-semibold">{item.user}</span>}
                    description={
                      <div>
                        <p className="text-xs text-gray-500 m-0">{item.action}</p>
                        <span className="text-[10px] text-gray-400">{item.time}</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardHome;
