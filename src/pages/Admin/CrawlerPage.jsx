import React, { useState } from 'react';
import { Card, Typography, Form, Input, Button, Space, Divider, message, List, Tag } from 'antd';
import { GlobalOutlined, ThunderboltOutlined, KeyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { runCrawlerAPI, runAnswerKeyCrawlerAPI } from '../../service/api/api.admin';

const { Title, Text, Paragraph } = Typography;

const CrawlerPage = () => {
  const [loading, setLoading] = useState(false);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [form] = Form.useForm();
  const [answerForm] = Form.useForm();

  const handleRunCrawler = async (values) => {
    try {
      setLoading(true);
      const res = await runCrawlerAPI(values);
      if (res?.status === 200 || res?.status === 201) {
        message.success('Cào dữ liệu đề thi thành công!');
        form.resetFields();
      }
    } catch (error) {
      console.error('Crawler error:', error);
      message.error(error?.message || 'Lỗi khi chạy crawler!');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnswerCrawler = async (values) => {
    try {
      setAnswerLoading(true);
      const res = await runAnswerKeyCrawlerAPI(values);
      if (res?.status === 200 || res?.status === 201) {
        message.success('Cào dữ liệu đáp án thành công!');
        answerForm.resetFields();
      }
    } catch (error) {
      console.error('Answer crawler error:', error);
      message.error(error?.message || 'Lỗi khi chạy answer-key crawler!');
    } finally {
      setAnswerLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Title level={3}>Công cụ Crawler Dữ liệu</Title>
        <Text type="secondary">Sử dụng công cụ này để tự động lấy dữ liệu từ các nguồn tài liệu IELTS trực tuyến.</Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EXAM CRAWLER */}
        <Card 
          title={<Space><ThunderboltOutlined className="text-amber-500" /><span>Cào Đề thi (Exams)</span></Space>}
          className="shadow-sm border-gray-100 rounded-2xl"
        >
          <Paragraph className="text-xs text-gray-500 mb-4">
            Nhập URL của đề thi IELTS từ trang web nguồn để tự động phân tích và lưu vào hệ thống.
          </Paragraph>
          <Form form={form} layout="vertical" onFinish={handleRunCrawler}>
            <Form.Item 
              name="url" 
              label="URL Đề thi" 
              rules={[{ required: true, message: 'Vui lòng nhập URL!' }, { type: 'url', message: 'URL không hợp lệ!' }]}
            >
              <Input placeholder="https://ieltsonlinetests.com/..." prefix={<GlobalOutlined />} />
            </Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              className="w-full bg-blue-600 h-11 rounded-xl font-bold"
            >
              Bắt đầu Cào
            </Button>
          </Form>
        </Card>

        {/* ANSWER KEY CRAWLER */}
        <Card 
          title={<Space><KeyOutlined className="text-emerald-500" /><span>Cào Đáp án (Answer Keys)</span></Space>}
          className="shadow-sm border-gray-100 rounded-2xl"
        >
          <Paragraph className="text-xs text-gray-500 mb-4">
            Nhập URL chứa đáp án tương ứng của bộ đề để hệ thống tự động cập nhật kết quả chấm bài.
          </Paragraph>
          <Form form={answerForm} layout="vertical" onFinish={handleRunAnswerCrawler}>
            <Form.Item 
              name="url" 
              label="URL Đáp án" 
              rules={[{ required: true, message: 'Vui lòng nhập URL!' }, { type: 'url', message: 'URL không hợp lệ!' }]}
            >
              <Input placeholder="https://..." prefix={<GlobalOutlined />} />
            </Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={answerLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 rounded-xl font-bold border-none"
            >
              Cập nhật Đáp án
            </Button>
          </Form>
        </Card>
      </div>

      {/* INSTRUCTIONS */}
      <Card title="Hướng dẫn sử dụng" className="shadow-sm border-gray-100 rounded-2xl bg-gray-50/50">
        <List
          dataSource={[
            { title: 'Chọn nguồn uy tín', desc: 'Đảm bảo URL từ các trang web hỗ trợ được hệ thống xác thực.', icon: <CheckCircleOutlined className="text-blue-500" /> },
            { title: 'Kiểm tra cấu trúc', desc: 'Hệ thống sẽ bóc tách các Section, Passage và Question tự động.', icon: <CheckCircleOutlined className="text-blue-500" /> },
            { title: 'Dữ liệu đa phương tiện', desc: 'Hình ảnh và âm thanh cũng sẽ được tải về server.', icon: <CheckCircleOutlined className="text-blue-500" /> },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={item.icon}
                title={item.title}
                description={item.desc}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default CrawlerPage;
