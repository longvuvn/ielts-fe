import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Space, Card, Typography, message, Skeleton, Tooltip, 
  Button, Popconfirm, Modal, Form, Input, InputNumber, Select 
} from 'antd';
import { 
  FileTextOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  InfoCircleOutlined,
  FieldTimeOutlined,
  StarOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { getAllExamsAPI, updateExamAPI, deleteExamAPI } from '../../service/api/api.exam';

const { Title } = Typography;
const { Option } = Select;

const ExamManagementPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Edit Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExams(pagination.current - 1, pagination.pageSize);
  }, []);

  const fetchExams = async (page, size) => {
    try {
      setLoading(true);
      const res = await getAllExamsAPI(page, size);
      
      const responseData = res?.data;
      
      let finalData = [];
      let totalItems = 0;

      if (responseData) {
        // Handle different response structures
        if (Array.isArray(responseData.content)) {
          finalData = responseData.content;
          totalItems = responseData.totalElements || responseData.content.length;
        } else if (Array.isArray(responseData.data)) {
          finalData = responseData.data;
          totalItems = responseData.total || responseData.data.length;
        } else if (Array.isArray(responseData)) {
          finalData = responseData;
          totalItems = responseData.length;
        }
      }
      
      setExams(finalData);
      setPagination(prev => ({
        ...prev,
        current: page + 1,
        total: totalItems,
      }));
    } catch (error) {
      console.error('Fetch exams error:', error);
      message.error('Không thể tải danh sách bài thi!');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    fetchExams(newPagination.current - 1, newPagination.pageSize);
  };

  const showEditModal = (record) => {
    setEditingExam(record);
    form.setFieldsValue({
      title: record.title,
      status: record.status,
      max_score: record.max_score,
      duration: record.duration,
    });
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditingExam(null);
    form.resetFields();
  };

  const handleEditSubmit = async (values) => {
    try {
      setSubmitting(true);
      await updateExamAPI(editingExam.id, values);
      message.success('Cập nhật bài thi thành công!');
      setIsEditModalVisible(false);
      setEditingExam(null);
      fetchExams(pagination.current - 1, pagination.pageSize);
    } catch (error) {
      console.error('Update exam error:', error);
      message.error('Cập nhật bài thi thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExamAPI(id);
      message.success('Xóa bài thi thành công!');
      fetchExams(pagination.current - 1, pagination.pageSize);
    } catch (error) {
      console.error('Delete exam error:', error);
      message.error('Xóa bài thi thất bại!');
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <Space>
          <FileTextOutlined className="text-blue-500" />
          <span className="font-medium">{text || 'N/A'}</span>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'blue';
        if (status === 'PUBLISHED') color = 'green';
        if (status === 'DRAFT') color = 'orange';
        if (status === 'DELETED') color = 'red';
        
        return (
          <Tag color={color} icon={status === 'PUBLISHED' ? <CheckCircleOutlined /> : <InfoCircleOutlined />}>
            {status || 'N/A'}
          </Tag>
        );
      },
    },
    {
      title: 'Điểm tối đa',
      dataIndex: 'max_score',
      key: 'max_score',
      align: 'center',
      render: (score) => (
        <Space>
          <StarOutlined className="text-yellow-500" />
          <span>{score || '0'}</span>
        </Space>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => (
        <Space>
          <ClockCircleOutlined className="text-gray-400" />
          <span>{duration ? `${duration} phút` : 'N/A'}</span>
        </Space>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Space>
          <CalendarOutlined className="text-gray-400" />
          <span>{date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'}</span>
        </Space>
      ),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => (
        <Space>
          <FieldTimeOutlined className="text-gray-400" />
          <span>{date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'}</span>
        </Space>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => showEditModal(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa bài thi này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Có"
              cancelText="Không"
              okButtonProps={{ danger: true }}
            >
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={3}>Quản lý Bài thi</Title>
      </div>

      <Card className="shadow-sm border-gray-100 rounded-xl overflow-hidden">
        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <Table 
            columns={columns} 
            dataSource={exams} 
            rowKey="id"
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} bài thi`,
            }}
            onChange={handleTableChange}
          />
        )}
      </Card>

      <Modal
        title="Chỉnh sửa Bài thi"
        open={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
          initialValues={{ status: 'ACTIVE' }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Option value="ACTIVE">ACTIVE</Option>
              <Option value="INACTIVE">INACTIVE</Option>
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="max_score"
              label="Điểm tối đa"
              rules={[{ required: true, message: 'Vui lòng nhập điểm tối đa!' }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item
              name="duration"
              label="Thời gian (phút)"
              rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>
          </div>

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={handleEditCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExamManagementPage;
