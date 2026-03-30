import React, { useState } from 'react';
import { Card, Typography, Form, Input, Button, Space, message, List } from 'antd';
import { GlobalOutlined, ThunderboltOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { runCrawlerAPI } from '../../service/api/api.admin';

const { Title, Text, Paragraph } = Typography;

const CrawlerPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleRunCrawler = async (values) => {
    try {
      setLoading(true);
      // Pass the limit value from form to the API
      const res = await runCrawlerAPI(values.limit);
      if (res?.status === 200 || res?.status === 201) {
        message.success(`Bắt đầu quá trình cào dữ liệu với giới hạn ${values.limit} đề thi thành công!`);
      }
    } catch (error) {
      console.error('Crawler error:', error);
      message.error(error?.message || 'Lỗi khi chạy crawler!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-slide-in">
      <div className="text-center">
        <Title level={2} className="font-black text-slate-900">Crawler Dữ liệu IELTS</Title>
        <Text type="secondary" className="text-lg">Tự động lấy dữ liệu đề thi từ các nguồn tài liệu IELTS trực tuyến.</Text>
      </div>

      <Card 
        className="shadow-xl border-slate-100 rounded-[32px] overflow-hidden"
        cover={
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <Space align="center" size="middle">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <ThunderboltOutlined style={{ fontSize: 24 }} />
              </div>
              <div>
                <Title level={4} style={{ color: 'white', margin: 0 }}>Cào Đề thi (Exams)</Title>
                <Text style={{ color: 'rgba(255,255,255,0.7)' }}>Đang cấu hình nguồn: study4.com</Text>
              </div>
            </Space>
          </div>
        }
      >
        <Paragraph className="text-slate-500 mb-8 font-medium">
          Hệ thống sẽ tự động truy cập vào trang web nguồn, phân tích cấu trúc các bài thi IELTS và lưu trữ vào cơ sở dữ liệu. Thiết lập giới hạn giúp quá trình cào nhanh hơn.
        </Paragraph>

        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleRunCrawler}
          initialValues={{ 
            url: 'https://study4.com/tests/ielts/',
            limit: 1 
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Form.Item 
                name="url" 
                label={<span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Đề thi</span>}
              >
                <Input 
                  readOnly 
                  disabled
                  prefix={<GlobalOutlined className="text-slate-400" />} 
                  className="h-14 rounded-2xl bg-slate-50 border-2 border-slate-50 text-slate-900 font-bold"
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item 
                name="limit" 
                label={<span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Giới hạn (Limit)</span>}
                rules={[{ required: true, message: 'Nhập số lượng!' }]}
              >
                <Input 
                  type="number"
                  min={1}
                  max={50}
                  className="h-14 rounded-2xl bg-slate-50 border-2 border-slate-50 text-slate-900 font-bold"
                />
              </Form.Item>
            </div>
          </div>
          
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/30 text-lg font-black mt-4 transition-all active:scale-[0.98]"
          >
            {loading ? 'Đang thực thi...' : 'KÍCH HOẠT CRAWLER NGAY'}
          </Button>
        </Form>
      </Card>

      {/* INSTRUCTIONS */}
      <Card title={<span className="font-bold text-slate-800">Thông tin kỹ thuật</span>} className="shadow-sm border-slate-100 rounded-[24px] bg-slate-50/50">
        <List
          dataSource={[
            { title: 'Nguồn dữ liệu', desc: 'Hiện tại hệ thống đang được tối ưu để cào dữ liệu từ study4.com.', icon: <CheckCircleOutlined className="text-blue-500" /> },
            { title: 'Tự động hóa', desc: 'Quá trình cào dữ liệu diễn ra ngầm, bạn có thể kiểm tra danh sách đề thi sau ít phút.', icon: <CheckCircleOutlined className="text-blue-500" /> },
            { title: 'Đảm bảo dữ liệu', desc: 'Hệ thống tự động xử lý các trường hợp trùng lặp và lỗi cấu trúc HTML.', icon: <CheckCircleOutlined className="text-blue-500" /> },
          ]}
          renderItem={(item) => (
            <List.Item className="border-none py-3">
              <List.Item.Meta
                avatar={item.icon}
                title={<span className="font-bold text-slate-700">{item.title}</span>}
                description={<span className="text-slate-500 font-medium">{item.desc}</span>}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default CrawlerPage;
